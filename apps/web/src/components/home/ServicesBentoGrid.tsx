'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatPaiseToINR } from '@skyline/shared';
import { 
  Code2, 
  Bot, 
  Sparkles, 
  Gamepad2, 
  Database, 
  Smartphone, 
  Monitor, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Layers,
  Terminal,
  Zap,
  Cpu
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  deliverableTypes: string[];
  startingPricePaise: number;
  estimatedDaysDefault: number;
  category?: {
    name: string;
    slug: string;
  };
}

interface Props {
  services: ServiceItem[];
}

export function ServicesBentoGrid({ services }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { label: 'All Capabilities', value: 'all' },
    { label: 'Web & SaaS', value: 'websites-web-apps' },
    { label: 'AI & Automation', value: 'ai-systems' },
    { label: 'Gaming & Minecraft', value: 'gaming-minecraft' },
    { label: 'Backend & Infrastructure', value: 'backend-infrastructure' },
  ];

  const filteredServices = services.filter((s) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'websites-web-apps') {
      return s.category?.slug === 'websites-web-apps' || s.category?.slug === 'mobile-apps' || s.category?.slug === 'desktop-apps';
    }
    if (activeFilter === 'ai-systems') {
      return s.category?.slug === 'ai-systems' || s.category?.slug === 'bots-automation';
    }
    if (activeFilter === 'gaming-minecraft') {
      return s.category?.slug === 'gaming-minecraft';
    }
    if (activeFilter === 'backend-infrastructure') {
      return s.category?.slug === 'backend-infrastructure' || s.category?.slug === 'custom-software';
    }
    return true;
  });

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case 'custom-saas-web-application':
      case 'websites-web-apps':
        return <Code2 className="h-5 w-5 text-accent" />;
      case 'custom-discord-bot':
      case 'bots-automation':
        return <Bot className="h-5 w-5 text-accent" />;
      case 'enterprise-rag-ai-agent':
      case 'ai-systems':
        return <Sparkles className="h-5 w-5 text-accent" />;
      case 'minecraft-paper-plugin':
      case 'gaming-minecraft':
        return <Gamepad2 className="h-5 w-5 text-accent" />;
      case 'backend-database-api':
      case 'backend-infrastructure':
        return <Database className="h-5 w-5 text-accent" />;
      case 'cross-platform-mobile-app':
      case 'mobile-apps':
        return <Smartphone className="h-5 w-5 text-accent" />;
      case 'desktop-application-cli':
      case 'desktop-apps':
        return <Monitor className="h-5 w-5 text-accent" />;
      default:
        return <Wrench className="h-5 w-5 text-accent" />;
    }
  };

  // Distinct Featured vs Secondary split when showing 'all'
  const isAllView = activeFilter === 'all';
  const featuredSlugs = [
    'custom-saas-web-application',
    'enterprise-rag-ai-agent',
    'custom-discord-bot',
  ];

  const featuredServices = services.filter((s) => featuredSlugs.includes(s.slug));
  const secondaryServices = services.filter((s) => !featuredSlugs.includes(s.slug));

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              activeFilter === cat.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isAllView ? (
        <div className="space-y-6">
          {/* Top Featured 3 Large Bento Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/90 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-xl overflow-hidden"
              >
                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-200">
                      {getServiceIcon(service.slug)}
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {service.category?.name || 'Featured'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Highlighted Feature Badges */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-1.5">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-foreground font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer with Price & SLA */}
                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Starting from</span>
                    <p className="text-lg font-black text-foreground">
                      {formatPaiseToINR(service.startingPricePaise)}
                    </p>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3 text-accent" /> ~{service.estimatedDaysDefault} business days
                    </span>
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 group-hover:translate-x-0.5"
                  >
                    Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Compact Bento Grid (5 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {secondaryServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary border border-border group-hover:scale-105 transition-transform">
                      {getServiceIcon(service.slug)}
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {service.category?.name}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">From</span>
                    <p className="text-sm font-extrabold text-foreground">
                      {formatPaiseToINR(service.startingPricePaise)}
                    </p>
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    View Spec <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Filtered Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                    {getServiceIcon(service.slug)}
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {service.category?.name}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <ul className="space-y-1.5 pt-2 border-t border-border/60">
                  {service.features.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-foreground font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Starting from</span>
                  <p className="text-base font-extrabold text-foreground">
                    {formatPaiseToINR(service.startingPricePaise)}
                  </p>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
