import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@skyline/database';
import { formatPaiseToINR } from '@skyline/shared';
import { BRAND_CONFIG } from '@skyline/config';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, FileCheck, HelpCircle } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.service.findUnique({
    where: { slug },
  }).catch(() => null);

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: `${service.title} — Skyline Services`,
    description: service.shortDescription,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} | Skyline`,
      description: service.shortDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await db.service.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      faqs: { orderBy: { displayOrder: 'asc' } },
    },
  }).catch(() => null);

  if (!service) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDescription,
    provider: {
      '@type': 'Organization',
      name: BRAND_CONFIG.name,
      url: BRAND_CONFIG.url,
    },
    offers: {
      '@type': 'Offer',
      price: Math.round(service.startingPricePaise / 100),
      priceCurrency: 'INR',
    },
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-foreground">Services</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{service.title}</span>
      </nav>

      {/* Header & Pricing Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {service.category?.name}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {service.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Starting from</span>
            <p className="text-3xl font-extrabold text-foreground mt-1">
              {formatPaiseToINR(service.startingPricePaise)}
            </p>
            <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              Target timeline: ~{service.estimatedDaysDefault} days
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
              <span>50% Upfront, 50% on Approved Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-accent shrink-0" />
              <span>Includes 2 free revisions & source files</span>
            </div>
          </div>

          <Link
            href={`/start-project?service=${service.id}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90"
          >
            Start Project with This Service
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Full Description & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-border pt-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-foreground">Overview & Capabilities</h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
            <p>{service.fullDescription}</p>
          </div>

          {/* Included Deliverable Types */}
          {Array.isArray(service.deliverableTypes) && (
            <div className="space-y-3 pt-6 border-t border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Included Deliverables</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(service.deliverableTypes as string[]).map((deliv, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Feature List Column */}
        <div className="space-y-4 rounded-2xl border border-border bg-secondary/30 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Core Features</h3>
          {Array.isArray(service.features) && (
            <ul className="space-y-3">
              {(service.features as string[]).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* FAQs */}
      {service.faqs.length > 0 && (
        <div className="space-y-6 border-t border-border pt-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-accent" /> Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.faqs.map((faq) => (
              <div key={faq.id} className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm">
                <h4 className="text-sm font-bold text-foreground">{faq.question}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
