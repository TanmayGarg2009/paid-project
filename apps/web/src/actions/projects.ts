'use server';

import { db } from '@skyline/database';
import { getCurrentCustomer } from '@/actions/auth';
import { 
  ProjectStatus, 
  QuoteStatus, 
  MilestoneStatus, 
  MilestoneType, 
  PaymentStatus, 
  ChangeRequestStatus, 
  RevisionStatus,
  DeliverableAccessLevel
} from '@skyline/types';
import { verifyPaymentSignature, calculateRemainingProjectBalance } from '@skyline/payments';
import { 
  notifyUpfrontPaymentReceived, 
  notifyFinalPaymentReceived, 
  notifyRevisionRequested, 
  notifyChangeRequestApproved,
  notifyNewCustomerMessage,
  notifyNewReviewSubmitted
} from '@skyline/notifications';
import { createRevisionSchema, createMessageSchema, createReviewSchema, verifyPaymentSchema } from '@skyline/validation';
import { logAuditEvent } from '@skyline/logging';

// 1. Accept Quote & Initialize Project for Upfront Payment
export async function acceptQuote(quoteId: string) {
  const customer = await getCurrentCustomer();
  if (!customer) return { success: false, error: 'Unauthorized' };

  try {
    const quote = await db.quote.findUnique({
      where: { id: quoteId },
      include: { projectRequest: true },
    });

    if (!quote || quote.status !== QuoteStatus.SENT) {
      return { success: false, error: 'Quote is not available for acceptance or already accepted.' };
    }

    // Freeze Quote as ACCEPTED and Create Project in AWAITING_UPFRONT_PAYMENT
    const projectCode = `SKY-PRJ-${quote.quoteNumber.replace('Q-', '')}`;

    const result = await db.$transaction(async (tx) => {
      // 1. Update Quote to ACCEPTED (Frozen)
      const updatedQuote = await tx.quote.update({
        where: { id: quoteId },
        data: { status: QuoteStatus.ACCEPTED },
      });

      // 2. Create Project
      const project = await tx.project.create({
        data: {
          projectCode,
          customerId: customer.id,
          serviceId: quote.projectRequest.serviceId || null,
          projectRequestId: quote.projectRequestId,
          quoteId: quote.id,
          title: quote.projectName,
          description: quote.description,
          status: ProjectStatus.AWAITING_UPFRONT_PAYMENT,
          totalPricePaise: quote.totalPricePaise,
          upfrontPaidPaise: 0,
          finalPaidPaise: 0,
          targetDeliveryDate: quote.targetDeliveryDate,
          revisionsIncluded: quote.includedRevisions,
          revisionsUsed: 0,
        },
      });

      // 3. Create Upfront 50% Milestone
      await tx.milestone.create({
        data: {
          projectId: project.id,
          type: MilestoneType.UPFRONT_50,
          title: '50% Upfront Deposit (Project Kickoff)',
          description: 'Initial 50% milestone payment to initiate development architecture.',
          amountPaise: quote.upfrontAmountPaise,
          percentage: quote.upfrontPercentage,
          status: MilestoneStatus.READY_TO_PAY,
        },
      });

      // 4. Create Final 50% Milestone (Pending)
      await tx.milestone.create({
        data: {
          projectId: project.id,
          type: MilestoneType.FINAL_BALANCE,
          title: '50% Final Delivery Payment',
          description: 'Remaining 50% balance upon completed internal QA and approved preview.',
          amountPaise: quote.remainingAmountPaise,
          percentage: 100 - quote.upfrontPercentage,
          status: MilestoneStatus.PENDING,
        },
      });

      // 5. Update Project Request Status
      await tx.projectRequest.update({
        where: { id: quote.projectRequestId },
        data: { status: 'QUOTED' },
      });

      return project;
    });

    await logAuditEvent({
      userId: customer.id,
      action: 'QUOTE_ACCEPTED',
      entityType: 'Quote',
      entityId: quoteId,
      newValues: { status: 'ACCEPTED', projectId: result.id },
    });

    return { success: true, projectId: result.id };
  } catch (error: any) {
    console.error('Error accepting quote:', error);
    return { success: false, error: error?.message || 'Failed to accept quote.' };
  }
}

// 2. Process & Verify Milestone Payment (Upfront 50% or Final 50% or Change Request)
export async function verifyAndProcessMilestonePayment(input: {
  projectId: string;
  milestoneId?: string;
  changeRequestId?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) return { success: false, error: 'Unauthorized' };

  try {
    const validated = verifyPaymentSchema.parse(input);

    // 1. Verify Payment Signature (HMAC SHA-256)
    const isValidSignature = verifyPaymentSignature({
      razorpayOrderId: validated.razorpayOrderId,
      razorpayPaymentId: validated.razorpayPaymentId,
      razorpaySignature: validated.razorpaySignature,
    });

    if (!isValidSignature) {
      return { success: false, error: 'Payment signature verification failed. Tampered payload rejected.' };
    }

    const project = await db.project.findUnique({
      where: { id: validated.projectId },
      include: { milestones: true, customer: true },
    });

    if (!project || project.customerId !== customer.id) {
      return { success: false, error: 'Project not found or unauthorized.' };
    }

    // 2. Handle Upfront 50% Payment
    if (validated.milestoneId) {
      const milestone = project.milestones.find((m) => m.id === validated.milestoneId);
      if (!milestone) return { success: false, error: 'Milestone not found.' };

      if (milestone.type === MilestoneType.UPFRONT_50) {
        await db.$transaction(async (tx) => {
          // Record Payment
          await tx.payment.create({
            data: {
              receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
              projectId: project.id,
              milestoneId: milestone.id,
              amountPaise: milestone.amountPaise,
              status: PaymentStatus.PAID,
              razorpayOrderId: validated.razorpayOrderId,
              razorpayPaymentId: validated.razorpayPaymentId,
              razorpaySignature: validated.razorpaySignature,
              idempotencyKey: `pay_${validated.razorpayPaymentId}`,
            },
          });

          // Update Milestone to PAID
          await tx.milestone.update({
            where: { id: milestone.id },
            data: { status: MilestoneStatus.PAID },
          });

          // Transition Project to UPFRONT_PAID & IN_PROGRESS
          await tx.project.update({
            where: { id: project.id },
            data: {
              status: ProjectStatus.IN_PROGRESS,
              upfrontPaidPaise: milestone.amountPaise,
            },
          });

          // Log Status History
          await tx.projectStatusHistory.create({
            data: {
              projectId: project.id,
              fromStatus: ProjectStatus.AWAITING_UPFRONT_PAYMENT,
              toStatus: ProjectStatus.IN_PROGRESS,
              changedBy: customer.id,
              reason: '50% Upfront payment verified via Razorpay.',
            },
          });
        });

        // Notify Ops Bot
        await notifyUpfrontPaymentReceived({
          projectCode: project.projectCode,
          customerName: customer.name || 'Customer',
          amountPaise: milestone.amountPaise,
          projectId: project.id,
        }).catch(() => {});

        return { success: true, message: 'Upfront deposit verified. Development is now active.' };
      }

      // Handle Final Balance Payment
      if (milestone.type === MilestoneType.FINAL_BALANCE) {
        await db.$transaction(async (tx) => {
          await tx.payment.create({
            data: {
              receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
              projectId: project.id,
              milestoneId: milestone.id,
              amountPaise: milestone.amountPaise,
              status: PaymentStatus.PAID,
              razorpayOrderId: validated.razorpayOrderId,
              razorpayPaymentId: validated.razorpayPaymentId,
              razorpaySignature: validated.razorpaySignature,
              idempotencyKey: `pay_${validated.razorpayPaymentId}`,
            },
          });

          await tx.milestone.update({
            where: { id: milestone.id },
            data: { status: MilestoneStatus.PAID },
          });

          // Transition Project to FINAL_PAYMENT_RECEIVED & DELIVERED
          await tx.project.update({
            where: { id: project.id },
            data: {
              status: ProjectStatus.FINAL_PAYMENT_RECEIVED,
              finalPaidPaise: milestone.amountPaise,
            },
          });

          // Unlock Final Deliverables & Source Files
          await tx.deliverable.updateMany({
            where: { projectId: project.id, accessLevel: DeliverableAccessLevel.FINAL_LOCKED },
            data: { accessLevel: DeliverableAccessLevel.FINAL_AVAILABLE },
          });

          await tx.deliverable.updateMany({
            where: { projectId: project.id, accessLevel: DeliverableAccessLevel.SOURCE_LOCKED },
            data: { accessLevel: DeliverableAccessLevel.SOURCE_AVAILABLE },
          });
        });

        await notifyFinalPaymentReceived({
          projectCode: project.projectCode,
          customerName: customer.name || 'Customer',
          amountPaise: milestone.amountPaise,
          projectId: project.id,
        }).catch(() => {});

        return { success: true, message: 'Final payment verified. Deliverables unlocked for download.' };
      }
    }

    return { success: false, error: 'Invalid payment target.' };
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return { success: false, error: error?.message || 'Payment verification failed.' };
  }
}

// 3. Request an In-Scope Revision
export async function requestProjectRevision(input: { projectId: string; description: string; feedbackDetails: string }) {
  const customer = await getCurrentCustomer();
  if (!customer) return { success: false, error: 'Unauthorized' };

  try {
    const validated = createRevisionSchema.parse(input);
    const project = await db.project.findUnique({
      where: { id: validated.projectId },
    });

    if (!project || project.customerId !== customer.id) {
      return { success: false, error: 'Project not found.' };
    }

    if (project.revisionsUsed >= project.revisionsIncluded) {
      return {
        success: false,
        error: `You have used all ${project.revisionsIncluded} included revisions. Please request a formal Change Request for further modifications.`,
      };
    }

    const revisionNumber = project.revisionsUsed + 1;

    await db.$transaction(async (tx) => {
      await tx.revision.create({
        data: {
          projectId: project.id,
          revisionNumber,
          description: validated.description,
          feedbackDetails: validated.feedbackDetails,
          status: RevisionStatus.REQUESTED,
        },
      });

      await tx.project.update({
        where: { id: project.id },
        data: {
          status: ProjectStatus.REVISION,
          revisionsUsed: revisionNumber,
        },
      });
    });

    await notifyRevisionRequested({
      projectCode: project.projectCode,
      revisionNumber,
      summary: validated.description,
      projectId: project.id,
    }).catch(() => {});

    return { success: true, revisionNumber };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to submit revision.' };
  }
}

// 4. Approve Change Request (Separate State from Payment)
export async function approveChangeRequest(changeRequestId: string) {
  const customer = await getCurrentCustomer();
  if (!customer) return { success: false, error: 'Unauthorized' };

  try {
    const cr = await db.changeRequest.findUnique({
      where: { id: changeRequestId },
      include: { project: true },
    });

    if (!cr || cr.project.customerId !== customer.id) {
      return { success: false, error: 'Change Request not found.' };
    }

    if (cr.status !== ChangeRequestStatus.CR_CREATED) {
      return { success: false, error: 'Change request is not awaiting approval.' };
    }

    // Step 1: Customer Approves CR -> Moves to PAYMENT_REQUIRED (or APPLIED if ₹0)
    if (cr.additionalPricePaise === 0) {
      await db.$transaction(async (tx) => {
        await tx.changeRequest.update({
          where: { id: cr.id },
          data: {
            status: ChangeRequestStatus.APPLIED,
            approvedAt: new Date(),
            appliedAt: new Date(),
          },
        });

        // Add additional days to project target deadline if any
        if (cr.additionalDays > 0) {
          const currentDeadline = cr.project.targetDeliveryDate;
          const newDeadline = new Date(currentDeadline.getTime() + cr.additionalDays * 24 * 60 * 60 * 1000);
          await tx.project.update({
            where: { id: cr.projectId },
            data: { targetDeliveryDate: newDeadline },
          });
        }
      });

      return { success: true, message: 'Change Request approved and applied (₹0 fee).' };
    }

    // Move to PAYMENT_REQUIRED
    await db.changeRequest.update({
      where: { id: cr.id },
      data: {
        status: ChangeRequestStatus.PAYMENT_REQUIRED,
        approvedAt: new Date(),
      },
    });

    return { success: true, message: 'Change Request approved. Payment is required to activate scope.' };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to approve change request.' };
  }
}

// 5. Send Project Message
export async function sendCustomerMessage(input: { projectId: string; content: string }) {
  const customer = await getCurrentCustomer();
  if (!customer) return { success: false, error: 'Unauthorized' };

  try {
    const validated = createMessageSchema.parse(input);
    const project = await db.project.findUnique({
      where: { id: validated.projectId },
    });

    if (!project || project.customerId !== customer.id) {
      return { success: false, error: 'Project not found.' };
    }

    const message = await db.projectMessage.create({
      data: {
        projectId: project.id,
        senderId: customer.id,
        content: validated.content,
        isFromAdmin: false,
      },
    });

    await notifyNewCustomerMessage({
      projectCode: project.projectCode,
      senderName: customer.name || 'Customer',
      messagePreview: validated.content,
      projectId: project.id,
    }).catch(() => {});

    return { success: true, messageId: message.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to send message.' };
  }
}

// 6. Submit Verified Project Review
export async function submitProjectReview(input: { projectId: string; rating: number; headline: string; comment: string }) {
  const customer = await getCurrentCustomer();
  if (!customer) return { success: false, error: 'Unauthorized' };

  try {
    const validated = createReviewSchema.parse(input);
    const project = await db.project.findUnique({
      where: { id: validated.projectId },
    });

    if (!project || project.customerId !== customer.id) {
      return { success: false, error: 'Project not found.' };
    }

    if (project.status !== ProjectStatus.COMPLETED && project.status !== ProjectStatus.DELIVERED) {
      return { success: false, error: 'Reviews can only be submitted for completed or delivered projects.' };
    }

    const review = await db.review.create({
      data: {
        projectId: project.id,
        userId: customer.id,
        rating: validated.rating,
        headline: validated.headline,
        comment: validated.comment,
        isPublished: true, // Auto publish verified review
      },
    });

    await notifyNewReviewSubmitted({
      projectCode: project.projectCode,
      rating: validated.rating,
      headline: validated.headline,
    }).catch(() => {});

    return { success: true, reviewId: review.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to submit review.' };
  }
}
