'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@skyline/shared';
import { ExternalLink, ArrowRight, CheckCircle2, Globe, Laptop, Terminal } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  summary: string;
  coverImage: string;
  liveUrl?: string | null;
  completedAt: Date;
  service?: {
    title: string;
  };
}

interface Props {
  projects: PortfolioItem[];
}

export function PortfolioShowcase({ projects }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {projects.map((proj, idx) => (
        <article
          key={proj.id}
          className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/90 bg-card shadow-sm transition-all duration-300 hover:border-accent/60 hover:shadow-xl"
        >
          <div>
            {/* Browser Chrome Header Frame */}
            <div className="flex items-center justify-between border-b border-border/80 bg-secondary/60 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-background px-3 py-1 text-[10px] font-mono text-muted-foreground border border-border/60 max-w-[200px] truncate">
                <Globe className="h-3 w-3 text-accent shrink-0" />
                <span className="truncate">{proj.liveUrl?.replace('https://', '') || 'skyline-build.internal'}</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground font-mono">
                CASE #{idx + 1}
              </span>
            </div>

            {/* Project Image Viewport */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/70 shadow-sm">
                  {proj.clientName}
                </span>
              </div>
            </div>

            {/* Case Study Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-accent">
                  {(proj as any).service?.title || 'Custom Engineering'}
                </span>
                <span className="font-mono text-[11px]">{formatDate(proj.completedAt)}</span>
              </div>

              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                {proj.title}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {proj.summary}
              </p>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-6 pb-6 pt-3 border-t border-border/60 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" /> Delivered
            </span>

            {proj.liveUrl ? (
              <a
                href={proj.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
              >
                Inspect Live <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                View Case Study <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
