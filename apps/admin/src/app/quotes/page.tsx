import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { formatPaiseToINR, formatDate, QUOTE_STATUS_MAP } from '@skyline/shared';
import { FileText, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function AdminQuotesPage() {
  const quotes = await db.quote.findMany({
    include: { projectRequest: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Quotes & Contract Freezes</h1>
        <p className="text-xs text-muted-foreground">Audit immutable quotes, expiration dates, and acceptance logs.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quotes.map((quote) => {
          const statusInfo = QUOTE_STATUS_MAP[quote.status];
          return (
            <div key={quote.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-accent">{quote.quoteNumber} (v{quote.version})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-secondary">
                      {statusInfo?.label || quote.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mt-1">{quote.projectName}</h3>
                  <p className="text-xs text-muted-foreground">Client: {quote.projectRequest?.name} ({quote.projectRequest?.email})</p>
                </div>

                <div className="text-right text-xs">
                  <span className="font-extrabold text-foreground text-sm">{formatPaiseToINR(quote.totalPricePaise)}</span>
                  <p className="text-muted-foreground text-[10px]">Due 50%: {formatPaiseToINR(quote.upfrontAmountPaise)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                <span>Expires: {formatDate(quote.quoteExpiresAt)}</span>
                <span>Delivery: ~{quote.estimatedDeliveryDays} days</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
