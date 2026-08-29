import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { getCurrentCustomer } from '@/actions/auth';
import { formatPaiseToINR, formatDate, QUOTE_STATUS_MAP } from '@skyline/shared';
import { FileText, ArrowRight } from 'lucide-react';

export default async function CustomerQuotesListPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  const requests = await db.projectRequest.findMany({
    where: { email: customer.email.toLowerCase() },
    include: { quotes: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  const allQuotes = requests.flatMap((r) => r.quotes);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold text-foreground">Milestone Quotes</h1>
        <p className="text-xs text-muted-foreground">Review your itemized quotes and 50% deposit agreements.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {allQuotes.map((quote) => {
          const statusInfo = QUOTE_STATUS_MAP[quote.status];
          return (
            <div key={quote.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent">{quote.quoteNumber}</span>
                  <span className="text-sm font-bold text-foreground">{quote.projectName}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-secondary">
                  {statusInfo?.label || quote.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{quote.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                <span>Total: <strong>{formatPaiseToINR(quote.totalPricePaise)}</strong> (Due: {formatPaiseToINR(quote.upfrontAmountPaise)})</span>
                <Link
                  href={`/dashboard/quotes/${quote.id}`}
                  className="font-bold text-accent hover:underline flex items-center gap-1"
                >
                  View Quote <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
