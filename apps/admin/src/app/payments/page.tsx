import React from 'react';
import { db } from '@skyline/database';
import { formatPaiseToINR, formatDateTime } from '@skyline/shared';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminPaymentsLedgerPage() {
  const payments = await db.payment.findMany({
    include: {
      project: { include: { customer: true } },
      milestone: true,
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Revenue & Payment Ledger</h1>
        <p className="text-xs text-muted-foreground">All cryptographically verified Razorpay milestone transactions and receipts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-accent">{payment.receiptNumber}</span>
                <h3 className="text-sm font-bold text-foreground mt-0.5">{payment.project?.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Client: {payment.project?.customer?.name} ({payment.project?.customer?.email})
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-foreground">{formatPaiseToINR(payment.amountPaise)}</span>
                <p className="text-[10px] text-emerald-600 font-bold uppercase">PAID & VERIFIED</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <span>Timestamp: {formatDateTime(payment.createdAt)}</span>
              <span>Razorpay Payment ID: {payment.razorpayPaymentId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
