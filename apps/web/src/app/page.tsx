import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { BRAND_CONFIG, DEFAULT_SERVICES, DEFAULT_PORTFOLIO, DEFAULT_REVIEWS } from '@skyline/config';
import { NorthStackLogo } from '@/components/ui/NorthStackLogo';
import { HeroProductShowcase } from '@/components/home/HeroProductShowcase';
import { MetricsTicker } from '@/components/home/MetricsTicker';
import { InteractiveProjectEstimator } from '@/components/home/InteractiveProjectEstimator';
import { ServicesBentoGrid } from '@/components/home/ServicesBentoGrid';
import { CustomerProcessTimeline } from '@/components/home/CustomerProcessTimeline';
import { NotSureWhatYouNeed } from '@/components/home/NotSureWhatYouNeed';
import { PortfolioShowcase } from '@/components/home/PortfolioShowcase';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Star, 
  MessageSquare,
  FileCheck,
  Zap,
  Layers,
  Sparkles,
  Award,
  Users,
  Code2,
  PackageCheck,
  Calculator
} from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch published services from DB with safe fallback
  const dbServices = await db.service.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { category: { sortOrder: 'asc' } },
  }).catch(() => []);
  const services = (dbServices.length > 0 ? dbServices : DEFAULT_SERVICES) as any[];

  // Fetch featured portfolio projects with safe fallback
  const dbPortfolio = await db.portfolioProject.findMany({
    where: { isPublished: true, isFeatured: true },
    take: 3,
  }).catch(() => []);
  const portfolioProjects = (dbPortfolio.length > 0 ? dbPortfolio : DEFAULT_PORTFOLIO) as any[];

  // Fetch verified customer reviews with safe fallback
  const dbReviews = await db.review.findMany({
    where: { isPublished: true },
    include: { user: true, project: true },
    take: 4,
  }).catch(() => []);
  const reviews = (dbReviews.length > 0 ? dbReviews : DEFAULT_REVIEWS) as any[];

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-24 overflow-hidden bg-grid-pattern">
      
      {/* 1. HERO SECTION — DENSE, CONFIDENT, VISUALLY BALANCED */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Clear Customer Copy & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="font-black uppercase tracking-wider">NORTHSTACK DIGITALS</span>
                <span className="text-border">•</span>
                <span className="text-muted-foreground font-medium">Digital Product Studio</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
                You have the idea. <br />
                <span className="text-accent">We build the technology.</span>
              </h1>

              {/* Subtitle (Plain English for normal customers) */}
              <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-xl">
                Websites, mobile apps, Discord bots, AI tools, Minecraft mods and custom software — designed, built and delivered around what you actually need.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#estimator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-secondary"
                >
                  <Calculator className="h-4 w-4 text-accent" />
                  Estimate Price
                </a>
              </div>

              {/* Quick Trust Checks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-border/80 text-[11px] text-muted-foreground font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>50% to start</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>Clear fixed quote</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>Direct updates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>Zero jargon</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Digital Product Showcase */}
            <div className="lg:col-span-6">
              <HeroProductShowcase />
            </div>

          </div>

          {/* Metrics & Trust Ticker */}
          <div className="pt-6">
            <MetricsTicker />
          </div>

        </div>
      </section>

      {/* 2. TRANSPARENT PROJECT ESTIMATOR SECTION */}
      <section id="estimator" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InteractiveProjectEstimator />
      </section>

      {/* 3. IMMEDIATELY VISIBLE SERVICE SECTION ("What can we build for you?") */}
      <section id="what-we-build" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
            <Zap className="h-3.5 w-3.5" /> OUR CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            What can we build for you?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            From modern business websites to smart AI bots and custom Minecraft mods, explore our core digital services.
          </p>
        </div>

        <ServicesBentoGrid services={services} />
      </section>

      {/* 4. THE 50/50 MODEL SECTION (TRUST & CONFIDENCE) */}
      <section id="pricing-model" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-14 shadow-lg space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
              <ShieldCheck className="h-4 w-4" /> ZERO-WORRY BILLING
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Start with half. Finish with confidence.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Pay 50% to begin development. The remaining 50% is due only after you test, review and approve your working product preview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 50% Start */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono font-black text-accent">50%</span>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                  Milestone 1
                </span>
              </div>
              <h3 className="text-xl font-black text-foreground">Sprint Activation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Covers project architecture, design screens, and initial codebase setup. No 100% upfront lock-in.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" /> Fixed scope contract
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" /> Dedicated lead engineer
                </li>
              </ul>
            </div>

            {/* 50% Delivery */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono font-black text-emerald-600">50%</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Milestone 2
                </span>
              </div>
              <h3 className="text-xl font-black text-foreground">Approved Final Delivery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pay only after you test the live preview link on your own devices and your included revisions are completed.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Full source code handover
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Live deployment on your domain
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SPEED & TIMELINES */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
            <Clock className="h-4 w-4" /> DELIVERY SPEED
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Clear delivery timelines.
          </h2>
          <p className="text-sm text-muted-foreground">
            Every project has a clear estimated delivery date agreed upon before development starts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Standard Delivery</span>
            <p className="text-2xl font-black text-foreground">~1–2 Weeks</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ideal for full web platforms, mobile apps, complex Minecraft systems, and AI document tools.
            </p>
          </div>

          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6 space-y-3 shadow-sm text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Express Priority</span>
            <p className="text-2xl font-black text-accent">~2–3 Days</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Priority sprint for custom Discord bots, single-page marketing websites, and workflow automations.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next Day Sprint</span>
            <p className="text-2xl font-black text-foreground">~24 Hours</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ultra-fast delivery for small scripts, urgent bug fixes, API webhook setups, and small plugins.
            </p>
          </div>
        </div>
      </section>

      {/* 6. "HOW IT WORKS" (7-STEP STORY) */}
      <section id="how-it-works" className="border-y border-border/80 bg-secondary/20 py-24 relative">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
              <Layers className="h-4 w-4" /> SIMPLE 7-STEP PROCESS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              How NorthStack Digitals Works
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              From your initial idea to live product delivery, our workflow is simple, transparent, and hassle-free.
            </p>
          </div>

          <CustomerProcessTimeline />
        </div>
      </section>

      {/* 7. "NOT SURE WHAT YOU NEED?" INTERACTIVE SECTION */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NotSureWhatYouNeed />
      </section>

      {/* 8. PORTFOLIO SHOWCASE ("From idea to something real") */}
      {portfolioProjects.length > 0 && (
        <section id="portfolio" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
                <Sparkles className="h-4 w-4" /> VERIFIED CASE STUDIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                From idea to something real.
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              View All Case Studies <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <PortfolioShowcase projects={portfolioProjects} />
        </section>
      )}

      {/* 9. WHY NORTHSTACK DIGITALS (6 GROUNDED VALUE PILLARS) */}
      <section id="why-northstack" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-primary text-primary-foreground p-8 sm:p-14 space-y-10 shadow-xl">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
              THE NORTHSTACK STANDARD
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Why work with NorthStack Digitals?
            </h2>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              We focus on building reliable software with predictable milestone payments and direct communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-primary-foreground/10">
            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-accent" /> Clear Scope & Fixed Price
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                Know exactly what is included and the exact price before paying a single rupee. No surprises.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent" /> Direct Communication
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                No middleman managers. You communicate directly with NorthStack throughout development.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> 50/50 Transparent Payments
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                50% to start, 50% only when you review and approve your working product preview.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-accent" /> Custom-Built For You
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                Every project is crafted around your unique goals, not a rigid cookie-cutter template.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" /> Zero Technical Jargon
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                You explain the goal in plain English. We handle the entire engineering side.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-accent" /> Complete Handoff
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                You receive full source code, live deployment, and documentation agreed in your project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. VERIFIED MILESTONE REVIEWS */}
      {reviews.length > 0 && (
        <section id="reviews" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> VERIFIED CLIENT FEEDBACK
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              What clients say about NorthStack Digitals
            </h2>
            <p className="text-sm text-muted-foreground">
              Genuine feedback tied directly to completed, verified NorthStack milestone deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between rounded-3xl border border-border bg-card p-7 shadow-sm space-y-4 hover:border-accent/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <h4 className="text-base font-bold text-foreground">"{rev.headline}"</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{rev.user?.name || 'Verified Client'}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Project: {rev.project?.title || 'Milestone Deliverable'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Verified Project
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. FINAL CONVERSION BANNER */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-14 shadow-lg space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Have an idea? <br />
            <span className="text-accent">Tell us what you're trying to build.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            You don't need a technical specification. Just tell NorthStack Digitals what you need, and we will review your goals and provide an itemized quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/start-project"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105"
            >
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-secondary"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
