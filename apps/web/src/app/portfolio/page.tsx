import React from 'react';
import { db } from '@skyline/database';
import { formatDate } from '@skyline/shared';
import { DEFAULT_PORTFOLIO } from '@skyline/config';
import { ExternalLink, CheckCircle2, Globe, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Portfolio & Verified Case Studies | NorthStack Digitals',
  description: 'Explore live client platforms, Minecraft PvP networks, payment automation workspaces, and Discord bots engineered by NorthStack Digitals.',
};

export default async function PortfolioPage() {
  const dbProjects = await db.portfolioProject.findMany({
    where: { isPublished: true },
    include: { service: true },
    orderBy: { completedAt: 'desc' },
  }).catch(() => []);
  const projects = dbProjects.length > 0 ? dbProjects : DEFAULT_PORTFOLIO;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono font-bold uppercase tracking-wider text-accent">VERIFIED CASE STUDIES</span>
          <span className="text-border">•</span>
          <span className="text-muted-foreground font-medium">10 Live Products</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          What We Build & Deliver
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          From full-scale competitive gaming platforms and merchant payment layers to Discord bots and developer canvas tools, explore our real, verified engineering deliverables.
        </p>
      </div>

      {/* Verified Client Proof Banner */}
      <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-accent uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> VERIFIED CLIENT SATISFACTION
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Direct feedback from real server communities
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Custom Discord bots and Minecraft verification systems deployed across active partner communities including{' '}
              <a href="https://discord.gg/hzhvkzVVwM" target="_blank" rel="noreferrer" className="text-accent font-bold hover:underline">
                discord.gg/hzhvkzVVwM
              </a>{' '}
              and{' '}
              <a href="https://discord.gg/dhvY2fbBSa" target="_blank" rel="noreferrer" className="text-accent font-bold hover:underline">
                discord.gg/dhvY2fbBSa
              </a>.
            </p>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="rounded-2xl border border-border bg-card p-3 shadow-lg max-w-sm w-full">
              <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground block mb-2">
                Client Testimonial Confirmation:
              </span>
              <img
                src="/proofs/discord-bot-review-proof.png"
                alt="Client review proof from Discord"
                className="w-full rounded-xl border border-border/80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* All 10 Projects Grid (In Priority Order) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, idx) => (
          <article
            key={proj.id}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-accent/60 hover:shadow-xl hover-lift"
          >
            <div>
              {/* Top Chrome Frame */}
              <div className="flex items-center justify-between border-b border-border/80 bg-secondary/50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1 text-[10px] font-mono text-muted-foreground border border-border/60 max-w-[190px] truncate">
                  <Globe className="h-3 w-3 text-accent shrink-0" />
                  <span className="truncate">{proj.liveUrl ? proj.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'northstack.dev'}</span>
                </div>
                <span className="text-[10px] font-bold text-accent font-mono">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Cover Viewport */}
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

              {/* Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                  <span className="text-accent font-bold">{(proj as any).service?.title || 'Custom Solution'}</span>
                  <span className="font-mono">{formatDate(proj.completedAt)}</span>
                </div>

                <h2 className="text-lg font-black text-foreground group-hover:text-accent transition-colors leading-snug">
                  {proj.title}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {proj.summary}
                </p>

                {/* Tech Tags */}
                {(proj as any).tags && (proj as any).tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(proj as any).tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 pb-6 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" /> Live & Verified
              </span>
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                >
                  Visit Live Site <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
