import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { formatPaiseToINR } from '@skyline/shared';
import { BRAND_CONFIG, DEFAULT_SERVICES, DEFAULT_PORTFOLIO, DEFAULT_REVIEWS } from '@skyline/config';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Code2, 
  Bot, 
  Sparkles, 
  Gamepad2, 
  Database, 
  Smartphone, 
  Monitor, 
  Wrench,
  Star,
  Layers,
  FileCheck
} from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch published services from DB with safe fallback
  const dbServices = await db.service.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { category: { sortOrder: 'asc' } },
  }).catch(() => []);
  const services = dbServices.length > 0 ? dbServices : DEFAULT_SERVICES;

  // Fetch featured portfolio projects with safe fallback
  const dbPortfolio = await db.portfolioProject.findMany({
    where: { isPublished: true, isFeatured: true },
    take: 3,
  }).catch(() => []);
  const portfolioProjects = dbPortfolio.length > 0 ? dbPortfolio : DEFAULT_PORTFOLIO;

  // Fetch verified customer reviews with safe fallback
  const dbReviews = await db.review.findMany({
    where: { isPublished: true },
    include: { user: true, project: true },
    take: 4,
  }).catch(() => []);
  const reviews = dbReviews.length > 0 ? dbReviews : DEFAULT_REVIEWS;

  // Category Icon Mapping
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'websites-web-apps': return <Code2 className="h-5 w-5 text-accent" />;
      case 'bots-automation': return <Bot className="h-5 w-5 text-accent" />;
      case 'ai-systems': return <Sparkles className="h-5 w-5 text-accent" />;
      case 'gaming-minecraft': return <Gamepad2 className="h-5 w-5 text-accent" />;
      case 'backend-infrastructure': return <Database className="h-5 w-5 text-accent" />;
      case 'mobile-apps': return <Smartphone className="h-5 w-5 text-accent" />;
      case 'desktop-apps': return <Monitor className="h-5 w-5 text-accent" />;
      default: return <Wrench className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>Digital Development Agency • 50/50 Milestone Guarantee</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
              You have the idea. <br className="hidden sm:block" />
              <span className="text-accent">We build the technology.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-muted-foreground font-normal leading-relaxed">
              Skyline builds websites, web applications, bots, AI systems, automation, and custom software for people and businesses that need technology built around their needs.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/start-project"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
            >
              View Our Work
            </Link>
          </div>

          {/* Value Props Bar */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left border-t border-border/80">
            <div className="flex items-start gap-3.5 p-3 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">50% Upfront Model</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Pay 50% to start. Remaining 50% only upon approved preview delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Targeted SLA Deadlines</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Clear target delivery dates with auditable deadline management.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 p-3 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Full Source Ownership</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Clean TypeScript codebases and deployment playbooks handed over to you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES CATALOG SECTION */}
      <section id="services" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What We Build
          </h3>
          <p className="text-sm text-muted-foreground">
            Every project is engineered bespoke to your exact operational requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                    {getCategoryIcon(service.category?.slug || '')}
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {service.category?.name}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-foreground">{service.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Feature Tags */}
                {Array.isArray(service.features) && (
                  <ul className="space-y-1.5 pt-2">
                    {(service.features as string[]).slice(0, 3).map((feat, idx) => (
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
      </section>

      {/* 3. HOW SKYLINE WORKS (THE 50/50 MILESTONE JOURNEY) */}
      <section id="how-it-works" className="bg-secondary/40 border-y border-border py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Process</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How Skyline Works
            </h3>
            <p className="text-sm text-muted-foreground">
              A transparent, four-phase milestone workflow designed to protect your investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col space-y-3 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <span className="text-3xl font-extrabold text-accent/30 font-mono">01</span>
              <h4 className="text-base font-bold text-foreground">Submit Request</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Describe your project, desired features, budget range, and timeline. No upfront payment required to request.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col space-y-3 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <span className="text-3xl font-extrabold text-accent/30 font-mono">02</span>
              <h4 className="text-base font-bold text-foreground">Review Quote & 50% Deposit</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive an itemized quote with fixed scope, deliverables, and timeline. Accept quote and pay 50% upfront to activate development.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col space-y-3 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <span className="text-3xl font-extrabold text-accent/30 font-mono">03</span>
              <h4 className="text-base font-bold text-foreground">Development & Preview</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Skyline builds the software, passes internal QA, and delivers a live preview/test link for your review and feedback.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col space-y-3 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <span className="text-3xl font-extrabold text-accent/30 font-mono">04</span>
              <h4 className="text-base font-bold text-foreground">Final 50% & Handover</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upon approving the preview, complete the remaining 50% balance to unlock source code, final builds, and deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS / PORTFOLIO */}
      {portfolioProjects.length > 0 && (
        <section id="portfolio" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Portfolio</h2>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">Featured Work</h3>
            </div>
            <Link href="/portfolio" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
              View All Projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioProjects.map((proj) => (
              <div key={proj.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Client: {proj.clientName}
                  </span>
                  <h4 className="text-base font-bold text-foreground">{proj.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. VERIFIED CLIENT REVIEWS */}
      {reviews.length > 0 && (
        <section id="reviews" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Reviews</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Verified Client Feedback
            </h3>
            <p className="text-sm text-muted-foreground">
              Real feedback tied directly to completed, verified Skyline milestone projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-foreground">"{rev.headline}"</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{rev.user?.name || 'Verified Client'}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> Verified Project
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. WHY SKYLINE */}
      <section id="why-skyline" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-primary text-primary-foreground p-8 sm:p-14 space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent">The Skyline Standard</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineering Over Empty Promises
            </h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              We operate with rigorous software engineering discipline, predictable milestone payments, and crystal-clear communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-accent" /> Fixed-Scope Quoting
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                Itemized deliverables and exclusions so you know exactly what is being built before paying a single rupee.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-accent" /> Direct Lead Engineer
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                No middleman managers. You communicate directly with the engineer writing your code.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Change Request Protection
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                Fair, formal change request system so new scope expansions are tracked transparently without hidden surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Ready to turn your idea into reality?
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Submit your project requirements. We will review your goals and provide an itemized quote within 24 hours.
        </p>
        <div>
          <Link
            href="/start-project"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          >
            Start a Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
