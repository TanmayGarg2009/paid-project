import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { formatPaiseToINR } from '@skyline/shared';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Digital Development Services',
  description: 'Explore Skyline services across web applications, bots, AI systems, mobile apps, Minecraft, and backend architectures.',
};

export default async function ServicesPage() {
  const categories = await db.serviceCategory.findMany({
    include: {
      services: {
        where: { isPublished: true },
        orderBy: { startingPricePaise: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Service Catalog</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Bespoke Digital Services
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          From custom full-stack web applications to automated Discord bots and enterprise AI agents, explore our development solutions below.
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold text-foreground">{cat.name}</h2>
              {cat.description && (
                <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {Array.isArray(service.features) && (
                      <ul className="space-y-1.5 pt-2">
                        {(service.features as string[]).slice(0, 4).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Starting from</span>
                      <p className="text-base font-extrabold text-foreground">
                        {formatPaiseToINR(service.startingPricePaise)}
                      </p>
                    </div>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                    >
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
