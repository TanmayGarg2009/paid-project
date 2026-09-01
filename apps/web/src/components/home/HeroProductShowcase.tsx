'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Smartphone, 
  Bot, 
  Sparkles, 
  Gamepad2, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Zap,
  Play
} from 'lucide-react';

interface ProductSurface {
  id: string;
  title: string;
  category: string;
  tagline: string;
  icon: any;
  highlightPill: string;
  previewType: 'web' | 'mobile' | 'ai' | 'minecraft' | 'ecommerce';
  stats: { label: string; value: string }[];
  steps: string[];
}

const SURFACES: ProductSurface[] = [
  {
    id: 'web',
    title: 'Custom Website & Web App',
    category: 'Web Platform',
    tagline: 'Modern, ultra-fast website with customer logins, clean dashboards, and instant lead capture.',
    icon: Globe,
    highlightPill: 'Most Popular',
    previewType: 'web',
    stats: [
      { label: 'Turnaround', value: '~5–7 Days' },
      { label: 'Starting at', value: '₹20,000' },
      { label: 'Includes', value: 'Mobile + Desktop' },
    ],
    steps: ['1. Your vision & pages', '2. Clean design draft', '3. We build & test', '4. Live on your domain'],
  },
  {
    id: 'mobile',
    title: 'iOS & Android Mobile App',
    category: 'Mobile Application',
    tagline: 'Smooth, intuitive mobile app ready for phones and tablets with push alerts and offline speed.',
    icon: Smartphone,
    highlightPill: 'iOS + Android',
    previewType: 'mobile',
    stats: [
      { label: 'Turnaround', value: '~2–3 Weeks' },
      { label: 'Starting at', value: '₹60,000' },
      { label: 'Platforms', value: 'Apple & Google' },
    ],
    steps: ['1. App concept & screens', '2. User flow review', '3. Native development', '4. App Store release'],
  },
  {
    id: 'ai',
    title: 'Smart AI Assistant & Bots',
    category: 'AI & Automation',
    tagline: 'AI tools that read your custom documents, answer customer questions 24/7, and automate tasks.',
    icon: Sparkles,
    highlightPill: '24/7 Automated',
    previewType: 'ai',
    stats: [
      { label: 'Turnaround', value: '~7–10 Days' },
      { label: 'Starting at', value: '₹50,000' },
      { label: 'Data', value: 'Your Documents' },
    ],
    steps: ['1. Your knowledge files', '2. Smart AI training', '3. Safe test sandbox', '4. Embed anywhere'],
  },
  {
    id: 'gaming',
    title: 'Minecraft Mods & Plugins',
    category: 'Gaming & Minecraft',
    tagline: 'Custom Fabric/Forge mods, custom blocks/items, Paper plugins, and 400+ player server networks.',
    icon: Gamepad2,
    highlightPill: 'Fabric & Paper',
    previewType: 'minecraft',
    stats: [
      { label: 'Turnaround', value: '~4–6 Days' },
      { label: 'Starting at', value: '₹12,000' },
      { label: 'Performance', value: '20.0 TPS Guarantee' },
    ],
    steps: ['1. Feature & item ideas', '2. Mod / Plugin build', '3. Multiplayer testing', '4. Ready-to-run JAR'],
  },
  {
    id: 'ecommerce',
    title: 'Online Store & Payments',
    category: 'E-commerce & Billing',
    tagline: 'Complete online shop with credit card, UPI, milestone payments, and order tracking.',
    icon: ShoppingBag,
    highlightPill: 'Instant Checkout',
    previewType: 'ecommerce',
    stats: [
      { label: 'Turnaround', value: '~1–2 Weeks' },
      { label: 'Starting at', value: '₹35,000' },
      { label: 'Payments', value: 'Cards, UPI, Bank' },
    ],
    steps: ['1. Catalog & checkout brief', '2. Payment gateway setup', '3. Test orders verified', '4. Start selling'],
  },
];

export function HeroProductShowcase() {
  const [activeId, setActiveId] = useState<string>('web');
  const active = SURFACES.find((s) => s.id === activeId) || SURFACES[0];

  return (
    <div className="w-full rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* Top Selector Tabs */}
      <div className="flex items-center justify-between border-b border-border/70 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            What NorthStack Digitals Builds:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {SURFACES.map((item) => {
            const Icon = item.icon;
            const isSelected = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.category}</span>
                <span className="sm:hidden">{item.category.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Product Preview Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Interactive Mockup Screen */}
        <div className="md:col-span-7 flex flex-col justify-between rounded-2xl border border-border bg-secondary/30 p-5 space-y-4 shadow-inner">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                preview.northstack.dev/{active.id}
              </span>
            </div>
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
              {active.highlightPill}
            </span>
          </div>

          {/* Visual Mockup Card Body */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <active.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground">{active.title}</h4>
                  <span className="text-[11px] text-muted-foreground">{active.category}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                100% Ready
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {active.tagline}
            </p>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
              {active.stats.map((st, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-secondary/40 text-center">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block">{st.label}</span>
                  <span className="text-xs font-extrabold text-foreground mt-0.5 block">{st.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Timeline Indicator */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              How we build this for you:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
              {active.steps.map((st, i) => (
                <div key={i} className="flex items-center gap-1 text-muted-foreground font-medium truncate">
                  <CheckCircle2 className="h-3 w-3 text-accent shrink-0" />
                  <span className="truncate">{st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action & Value Explanation */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent font-mono">
              IDEA → BUILD → LAUNCH
            </span>
            <h3 className="text-xl font-black text-foreground leading-tight">
              Turn your concept into a real {active.category.toLowerCase()}.
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No technical expertise needed on your end. Just explain your idea in plain English, and NorthStack Digitals engineers the complete, ready-to-use product.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-border">
            <Link
              href={`/start-project?type=${encodeURIComponent(active.title)}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              Start This Project <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span>✓ 50% to start</span>
              <span>✓ Fixed quote</span>
              <span>✓ Direct updates</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
