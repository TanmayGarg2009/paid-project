import React from 'react';
import { db } from '@skyline/database';
import { formatPaiseToINR } from '@skyline/shared';
import { Wrench, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminServicesCMSPage() {
  const services = await db.service.findMany({
    include: { category: true, faqs: true },
    orderBy: { category: { sortOrder: 'asc' } },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Services Catalog CMS</h1>
        <p className="text-xs text-muted-foreground">Manage active services, starting rates, default delivery SLAs, and FAQs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{service.category?.name}</span>
                <h3 className="text-base font-bold text-foreground mt-0.5">{service.title}</h3>
              </div>
              <span className="text-sm font-extrabold text-foreground">{formatPaiseToINR(service.startingPricePaise)}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{service.shortDescription}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <span>Target SLA: ~{service.estimatedDaysDefault} days</span>
              <span>FAQs: {service.faqs.length} entries</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
