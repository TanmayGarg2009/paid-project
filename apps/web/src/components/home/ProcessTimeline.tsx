'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Calculator, 
  CreditCard, 
  Code2, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface Step {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  highlight: string;
  paymentState: string;
  deliverables: string[];
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'TELL US THE IDEA',
    subtitle: 'Free Project Intake & Brief',
    description: 'Submit your requirements, preferred feature list, budget range, and timeline. Zero fees or credit card required.',
    icon: FileText,
    highlight: '₹0 Upfront Brief',
    paymentState: 'No Payment Needed',
    deliverables: ['Requirements specification', 'Architecture assessment', 'Feasibility check'],
  },
  {
    num: '02',
    title: 'FIXED-SCOPE QUOTE',
    subtitle: 'Itemized Technical Contract',
    description: 'Skyline lead engineer analyzes your project and issues an immutable, frozen quote with exact deliverables, timeline, and exclusions.',
    icon: Calculator,
    highlight: '24h Turnaround',
    paymentState: 'Quote Review',
    deliverables: ['Frozen scope contract', 'Estimated delivery date', 'Included revisions count'],
  },
  {
    num: '03',
    title: '50% UPFRONT DEPOSIT',
    subtitle: 'Sprint Activation',
    description: 'Review and accept your quote. Pay the exact 50% deposit via secure Razorpay checkout to immediately start architecture and coding.',
    icon: CreditCard,
    highlight: '50% Milestone',
    paymentState: 'Deposit Verified',
    deliverables: ['Dedicated lead engineer', 'Private project dashboard', 'Repository initialization'],
  },
  {
    num: '04',
    title: 'WE BUILD & INTERNAL QA',
    subtitle: 'Rigorous Engineering Sprint',
    description: 'The lead engineer builds the software according to agreed specifications, running comprehensive automated test suites and security checks.',
    icon: Code2,
    highlight: 'Direct Collaboration',
    paymentState: 'In Active Sprint',
    deliverables: ['Clean TypeScript codebase', 'Automated test verification', 'Zero-throwaway architecture'],
  },
  {
    num: '05',
    title: 'PREVIEW & REVISIONS',
    subtitle: 'Interactive Staging Review',
    description: 'You test a live, fully functional staging preview URL. Submit feedback and utilize your included free revisions until scope is met.',
    icon: Eye,
    highlight: '2 Free Revisions',
    paymentState: 'Customer Review',
    deliverables: ['Live preview staging link', 'Formal revision tracking', 'Bug fix guarantees'],
  },
  {
    num: '06',
    title: 'FINAL DELIVERY & UNLOCK',
    subtitle: 'Production Handover & Source Code',
    description: 'Upon approving the build, settle the final 50% balance (plus any approved Change Requests) to unlock the complete source code archive and live deploy.',
    icon: CheckCircle2,
    highlight: 'Source Code Handover',
    paymentState: '100% Settled',
    deliverables: ['Git repository & Zip export', 'Deployment playbook', 'Audit & receipt records'],
  },
];

export function ProcessTimeline() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = STEPS[activeStepIndex];

  return (
    <div className="space-y-12">
      {/* 6-Step Connected Visual Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;

          return (
            <button
              key={step.num}
              onClick={() => setActiveStepIndex(idx)}
              className={`group relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                isActive
                  ? 'border-accent bg-accent/10 shadow-md ring-1 ring-accent/30'
                  : isPassed
                  ? 'border-border/80 bg-secondary/40 hover:border-accent/40'
                  : 'border-border/60 bg-card hover:border-border hover:bg-secondary/20'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`text-xs font-mono font-extrabold ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
                  {step.num}
                </span>
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <h4 className="text-xs font-extrabold text-foreground tracking-tight line-clamp-1">
                {step.title}
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
                {step.subtitle}
              </p>

              <span className={`mt-3 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isActive ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
              }`}>
                {step.highlight}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Summary */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-black text-accent">
                {activeStep.num}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Step {activeStep.num} of 06
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {activeStep.title} — {activeStep.subtitle}
                </h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeStep.description}
            </p>

            {/* Deliverables Checklist */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Phase Deliverables & Protections:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeStep.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Status Badge & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl border border-border bg-secondary/30 space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Milestone Status
              </span>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                <span className="text-base font-extrabold text-foreground font-mono">
                  {activeStep.paymentState}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Protected by Skyline's 50/50 transparent milestone billing architecture.
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Ready to begin?
              </span>
              <a
                href="/start-project"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Submit Brief <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
