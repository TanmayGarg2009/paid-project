'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Globe, 
  Smartphone, 
  Bot, 
  Gamepad2, 
  ShoppingBag,
  Cpu
} from 'lucide-react';

interface ProjectEstimateOption {
  id: string;
  name: string;
  category: string;
  icon: any;
  basePriceINR: number;
  standardDays: number;
  expressAvailable: boolean;
  deliverables: string[];
  description: string;
}

const ESTIMATE_OPTIONS: ProjectEstimateOption[] = [
  {
    id: 'saas',
    name: 'Custom Web Platform / SaaS',
    category: 'Web App',
    icon: Globe,
    basePriceINR: 45000,
    standardDays: 14,
    expressAvailable: true,
    description: 'Full-stack responsive web application with user logins, database storage, and payment checkout.',
    deliverables: ['Responsive Web App (Desktop + Mobile)', 'PostgreSQL Database & Auth', 'Payment Gateway Integration', 'Source Code & Live Deployment'],
  },
  {
    id: 'website',
    name: 'High-Converting Business Website',
    category: 'Website',
    icon: Sparkles,
    basePriceINR: 20000,
    standardDays: 5,
    expressAvailable: true,
    description: 'Ultra-fast marketing website engineered for high conversion, search engine SEO, and inquiry intake.',
    deliverables: ['Custom Typography & Brand Design', 'Sub-second Core Web Vitals', 'Interactive Intake / Quote Form', 'Domain Setup & Asset Files'],
  },
  {
    id: 'mobile',
    name: 'iOS & Android Mobile App',
    category: 'Mobile App',
    icon: Smartphone,
    basePriceINR: 60000,
    standardDays: 18,
    expressAvailable: false,
    description: 'Cross-platform mobile application with push notifications, smooth gestures, and store submission readiness.',
    deliverables: ['iOS & Android App Builds', 'Push Notification Service', 'Offline Data Synchronization', 'Clean UI / UX Flows'],
  },
  {
    id: 'ai',
    name: 'Smart AI Agent & Knowledge Base',
    category: 'AI System',
    icon: Cpu,
    basePriceINR: 50000,
    standardDays: 10,
    expressAvailable: true,
    description: 'Custom AI tool trained on your specific documents, manuals, and customer support databases.',
    deliverables: ['Private Document Embeddings', 'Hallucination-Resistant Chat UI', 'Automated Tool Calling', 'API Endpoint & Documentation'],
  },
  {
    id: 'discord_bot',
    name: 'Custom Discord / Telegram Bot',
    category: 'Bot & Automation',
    icon: Bot,
    basePriceINR: 15000,
    standardDays: 4,
    expressAvailable: true,
    description: 'Automated 24/7 bot with interactive buttons, modal forms, ticket management, and API connections.',
    deliverables: ['Discord.js v14+ Architecture', 'Custom Slash Commands & Buttons', '24/7 Hosting Setup Guide', 'Full Source Code Repository'],
  },
  {
    id: 'minecraft',
    name: 'Minecraft Mods & Server Plugins',
    category: 'Gaming',
    icon: Gamepad2,
    basePriceINR: 12000,
    standardDays: 5,
    expressAvailable: true,
    description: 'Fabric/Forge mods, custom blocks/items, Paper/Purpur plugins, and 400-player server systems.',
    deliverables: ['Custom JAR Mod / Plugin File', 'Java/Kotlin Source Code', '20.0 TPS Performance Optimization', 'Configuration YAML & Assets'],
  },
  {
    id: 'store',
    name: 'E-commerce Store & Checkout',
    category: 'E-commerce',
    icon: ShoppingBag,
    basePriceINR: 35000,
    standardDays: 7,
    expressAvailable: true,
    description: 'Complete online shop with UPI, Credit Cards, order tracking dashboard, and inventory management.',
    deliverables: ['Payment Gateway (UPI / Cards)', 'Customer Order Portal', 'Admin Product Catalog', 'Automated Invoice Generation'],
  },
];

export function InteractiveProjectEstimator() {
  const [selectedId, setSelectedId] = useState<string>('website');
  const [speedPriority, setSpeedPriority] = useState<'STANDARD' | 'EXPRESS' | 'NEXT_DAY'>('STANDARD');

  const selected = ESTIMATE_OPTIONS.find((o) => o.id === selectedId) || ESTIMATE_OPTIONS[0];

  // Price calculations
  let speedMultiplier = 1.0;
  let estimatedDays = selected.standardDays;

  if (speedPriority === 'EXPRESS' && selected.expressAvailable) {
    speedMultiplier = 1.35;
    estimatedDays = Math.max(2, Math.round(selected.standardDays * 0.45));
  } else if (speedPriority === 'NEXT_DAY' && selected.expressAvailable) {
    speedMultiplier = 1.75;
    estimatedDays = 1;
  }

  const estimatedTotal = Math.round(selected.basePriceINR * speedMultiplier);
  const upfront50 = Math.round(estimatedTotal / 2);
  const delivery50 = estimatedTotal - upfront50;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-xl space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
            <Calculator className="h-4 w-4" /> TRANSPARENT PROJECT ESTIMATOR
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
            Estimate your project in seconds.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pick what you want to build and see realistic starting prices, timelines, and 50/50 payment milestones.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent shrink-0">
          <ShieldCheck className="h-4 w-4" /> Fixed Scope Guarantee
        </div>
      </div>

      {/* Grid: Selector Left & Live Quote Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Category Pickers */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. What would you like to build?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ESTIMATE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = opt.id === selectedId;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedId(opt.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent/40 scale-[1.01]'
                        : 'border-border bg-secondary/20 hover:border-border/80 hover:bg-secondary/40'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-foreground block truncate">{opt.name}</span>
                      <span className="text-[11px] text-muted-foreground block">From ₹{opt.basePriceINR.toLocaleString('en-IN')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed Selector */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Delivery Priority & Speed
            </label>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <button
                onClick={() => setSpeedPriority('STANDARD')}
                className={`p-3 rounded-2xl border transition-all text-xs font-bold ${
                  speedPriority === 'STANDARD'
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                Standard (~{selected.standardDays}d)
              </button>
              <button
                onClick={() => setSpeedPriority('EXPRESS')}
                disabled={!selected.expressAvailable}
                className={`p-3 rounded-2xl border transition-all text-xs font-bold ${
                  speedPriority === 'EXPRESS'
                    ? 'border-accent bg-accent text-accent-foreground shadow-sm'
                    : selected.expressAvailable
                    ? 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                    : 'opacity-40 cursor-not-allowed border-border/40'
                }`}
              >
                Express (~{Math.max(2, Math.round(selected.standardDays * 0.45))}d)
              </button>
              <button
                onClick={() => setSpeedPriority('NEXT_DAY')}
                disabled={!selected.expressAvailable}
                className={`p-3 rounded-2xl border transition-all text-xs font-bold ${
                  speedPriority === 'NEXT_DAY'
                    ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-sm'
                    : selected.expressAvailable
                    ? 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                    : 'opacity-40 cursor-not-allowed border-border/40'
                }`}
              >
                Next Day (~24h)
              </button>
            </div>
          </div>

        </div>

        {/* Right: Live Calculated Pricing Card */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-secondary/30 p-6 sm:p-7 space-y-6 shadow-inner">
          
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estimated Total</span>
              <h3 className="text-3xl font-black text-foreground font-mono">
                ₹{estimatedTotal.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Delivery</span>
              <div className="flex items-center gap-1 text-sm font-black text-foreground">
                <Clock className="h-3.5 w-3.5 text-accent" /> ~{estimatedDays} Days
              </div>
            </div>
          </div>

          {/* 50/50 Breakdown Pill */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              50/50 Milestone Payment Structure:
            </span>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/20">
                <span className="text-[10px] font-extrabold text-accent block">50% TO START</span>
                <span className="text-sm font-black text-foreground font-mono">₹{upfront50.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[10px] font-extrabold text-emerald-600 block">50% ON DELIVERY</span>
                <span className="text-sm font-black text-foreground font-mono">₹{delivery50.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Deliverables List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              What is included in this build:
            </span>
            <ul className="space-y-1.5 text-xs text-muted-foreground font-medium">
              {selected.deliverables.map((del, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTA */}
          <Link
            href={`/start-project?type=${encodeURIComponent(selected.name)}&budget=₹${estimatedTotal.toLocaleString('en-IN')}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
          >
            Start This Project Brief <ArrowRight className="h-3.5 w-3.5" />
          </Link>

        </div>

      </div>

    </div>
  );
}
