'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  FileCheck, 
  CreditCard, 
  Hammer, 
  Eye, 
  CheckCircle2, 
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface Step {
  stepNumber: string;
  title: string;
  subtitle: string;
  summary: string;
  icon: any;
  whatYouDo: string;
  whatSkylineDoes: string;
  highlightBadge: string;
}

const STEPS: Step[] = [
  {
    stepNumber: '01',
    title: 'Tell us what you need',
    subtitle: 'No technical knowledge needed',
    summary: 'Explain your idea or the problem you are trying to solve in plain English. No technical specification or upfront fee required.',
    icon: MessageSquare,
    whatYouDo: 'Describe your vision, desired pages/features, and timeline goal.',
    whatSkylineDoes: 'Reviews your requirements and prepares an architecture plan.',
    highlightBadge: 'Free Project Brief',
  },
  {
    stepNumber: '02',
    title: 'Get a clear quote',
    subtitle: 'Fixed price & timeline',
    summary: 'We provide an itemized quote detailing exact deliverables, delivery dates, and price before any work begins.',
    icon: FileCheck,
    whatYouDo: 'Review the fixed quote and scope checklist.',
    whatSkylineDoes: 'Freezes the scope and reserves your development sprint.',
    highlightBadge: '24h Turnaround',
  },
  {
    stepNumber: '03',
    title: 'Pay 50% to begin',
    subtitle: 'Start with half',
    summary: 'No huge 100% upfront commitment. Pay 50% to activate development. The rest is due only upon final delivery.',
    icon: CreditCard,
    whatYouDo: 'Pay 50% upfront via secure checkout.',
    whatSkylineDoes: 'Immediately initializes your codebase and starts building.',
    highlightBadge: '50% Milestone',
  },
  {
    stepNumber: '04',
    title: 'We build it',
    subtitle: 'Direct communication',
    summary: 'Skyline Digital designs, codes and tests your product. You can follow progress and communicate directly with the builder.',
    icon: Hammer,
    whatYouDo: 'Answer quick design preference questions if needed.',
    whatSkylineDoes: 'Builds full-stack software and runs automated test suites.',
    highlightBadge: 'Active Sprint',
  },
  {
    stepNumber: '05',
    title: 'Review and refine',
    subtitle: 'Live staging preview',
    summary: 'You test a real, working preview link on your own devices. Your included revisions happen before final delivery.',
    icon: Eye,
    whatYouDo: 'Test the live preview link and request any tweaks.',
    whatSkylineDoes: 'Applies your revisions until agreed scope is satisfied.',
    highlightBadge: '2 Free Revisions',
  },
  {
    stepNumber: '06',
    title: 'Pay remaining 50%',
    subtitle: 'After your approval',
    summary: 'Once you are satisfied with the preview and approve the build, settle the remaining 50% balance.',
    icon: CheckCircle2,
    whatYouDo: 'Approve the finished build and settle remaining balance.',
    whatSkylineDoes: 'Prepares final build artifacts and repository archives.',
    highlightBadge: 'Approval Gate',
  },
  {
    stepNumber: '07',
    title: 'Get your final product',
    subtitle: 'Full handover',
    summary: 'Everything included in the agreement—live deployment on your domain, source code, and assets—is handed over to you.',
    icon: PackageCheck,
    whatYouDo: 'Take full ownership of your live product and files.',
    whatSkylineDoes: 'Deploys to your domain and delivers full documentation.',
    highlightBadge: '100% Live',
  },
];

export function CustomerProcessTimeline() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const current = STEPS[activeStepIdx];

  return (
    <div className="space-y-10">
      
      {/* 7-Step Navigation Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = idx === activeStepIdx;
          const isDone = idx < activeStepIdx;

          return (
            <button
              key={s.stepNumber}
              onClick={() => setActiveStepIdx(idx)}
              className={`group flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-md ring-1 ring-accent/40 scale-[1.02]'
                  : isDone
                  ? 'border-border/80 bg-secondary/40 hover:border-accent/40'
                  : 'border-border/60 bg-card hover:border-border hover:bg-secondary/20'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-xs font-mono font-black ${isSelected ? 'text-accent' : 'text-muted-foreground'}`}>
                  {s.stepNumber}
                </span>
                <div className={`p-1 rounded-md ${isSelected ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="h-3 w-3" />
                </div>
              </div>

              <h4 className="text-xs font-extrabold text-foreground tracking-tight line-clamp-1">
                {s.title}
              </h4>
              <span className={`mt-2 inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                isSelected ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
              }`}>
                {s.highlightBadge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Showcase Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Step Overview */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-mono font-black text-accent">
                {current.stepNumber}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Step {current.stepNumber} of 07
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {current.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {current.summary}
            </p>

            {/* Clear Roles Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  What you do:
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {current.whatYouDo}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-accent/20 bg-accent/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  What Skyline Digital does:
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {current.whatSkylineDoes}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action & Trust Badge */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl border border-border bg-secondary/40 space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                The 50/50 Advantage
              </span>
              <h4 className="text-base font-black text-foreground">
                No financial lock-in. Full visibility.
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You never pay the full price until you have reviewed and approved your working product preview.
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Ready to take Step 01?
              </span>
              <Link
                href="/start-project"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Start Free Brief <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
