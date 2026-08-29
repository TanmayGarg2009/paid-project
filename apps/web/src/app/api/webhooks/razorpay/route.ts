import { NextRequest, NextResponse } from 'next/server';
import { db } from '@skyline/database';
import { verifyWebhookSignature } from '@skyline/payments';
import { PaymentStatus, ProjectStatus, MilestoneStatus, DeliverableAccessLevel } from '@skyline/types';
import { notifyUpfrontPaymentReceived, notifyFinalPaymentReceived } from '@skyline/notifications';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // 1. Signature Verification
    const isValid = verifyWebhookSignature({
      rawBody,
      signature,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    });

    // In local dev/test without live secret, allow if testing
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    if (!paymentEntity) {
      return NextResponse.json({ success: true, note: 'ignored non-payment event' });
    }

    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = paymentEntity.order_id;
    const notes = paymentEntity.notes || {};
    const projectId = notes.projectId;
    const milestoneId = notes.milestoneId;

    // 2. Idempotency Check (Prevent duplicate webhook processing)
    const existingPayment = await db.payment.findUnique({
      where: { razorpayPaymentId },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.PAID) {
      return NextResponse.json({ success: true, note: 'already processed' }, { status: 200 });
    }

    // 3. Process Captured Payment Event
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      if (projectId && milestoneId) {
        const milestone = await db.milestone.findUnique({
          where: { id: milestoneId },
          include: { project: { include: { customer: true } } },
        });

        if (milestone) {
          await db.$transaction(async (tx) => {
            // Update or create payment record
            await tx.payment.upsert({
              where: { idempotencyKey: `pay_${razorpayPaymentId}` },
              create: {
                receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
                projectId: milestone.projectId,
                milestoneId: milestone.id,
                amountPaise: milestone.amountPaise,
                status: PaymentStatus.PAID,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature: signature,
                idempotencyKey: `pay_${razorpayPaymentId}`,
              },
              update: {
                status: PaymentStatus.PAID,
                razorpaySignature: signature,
              },
            });

            // Update milestone
            await tx.milestone.update({
              where: { id: milestone.id },
              data: { status: MilestoneStatus.PAID },
            });

            // Update project status
            if (milestone.type === 'UPFRONT_50') {
              await tx.project.update({
                where: { id: milestone.projectId },
                data: {
                  status: ProjectStatus.IN_PROGRESS,
                  upfrontPaidPaise: milestone.amountPaise,
                },
              });
            } else if (milestone.type === 'FINAL_BALANCE') {
              await tx.project.update({
                where: { id: milestone.projectId },
                data: {
                  status: ProjectStatus.FINAL_PAYMENT_RECEIVED,
                  finalPaidPaise: milestone.amountPaise,
                },
              });

              // Unlock deliverables
              await tx.deliverable.updateMany({
                where: { projectId: milestone.projectId, accessLevel: DeliverableAccessLevel.FINAL_LOCKED },
                data: { accessLevel: DeliverableAccessLevel.FINAL_AVAILABLE },
              });
              await tx.deliverable.updateMany({
                where: { projectId: milestone.projectId, accessLevel: DeliverableAccessLevel.SOURCE_LOCKED },
                data: { accessLevel: DeliverableAccessLevel.SOURCE_AVAILABLE },
              });
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
