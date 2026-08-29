'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';

const SUGGESTIONS = [
  {
    label: 'I need a fast, modern website to get more client leads',
    type: 'Website',
    hint: 'We build high-converting business sites and portfolios in ~5–7 days.',
  },
  {
    label: 'I have an idea for an iOS & Android mobile application',
    type: 'Mobile App',
    hint: 'We design the user screens and build native apps for phone stores.',
  },
  {
    label: 'I want an AI tool that searches my company documents & answers questions',
    type: 'AI System',
    hint: 'We set up private AI assistants that know your specific documents and data.',
  },
  {
    label: 'I need a custom Discord bot to automate community tasks and tickets',
    type: 'Discord Bot',
    hint: 'We build 24/7 automated bots with custom commands and buttons.',
  },
  {
    label: 'I want a custom Minecraft Fabric/Forge mod or server plugin',
    type: 'Minecraft Mod / Plugin',
    hint: 'We engineer custom items, blocks, mobs, and 20 TPS server systems.',
  },
  {
    label: 'I need an online store with credit card and UPI payment checkout',
    type: 'E-commerce',
    hint: 'We set up complete stores with automated invoice receipts and order tracking.',
  },
];

export function NotSureWhatYouNeed() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const current = SUGGESTIONS[selectedIdx];

  return (
    <div className="rounded-3xl border border-border/90 bg-gradient-to-br from-card via-card to-secondary/30 p-8 sm:p-12 shadow-lg space-y-8">
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
          <HelpCircle className="h-4 w-4" /> ZERO TECHNICAL KNOWLEDGE REQUIRED
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Not sure what you need? That's completely okay.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          You don't need to know whether you need an API, a database, a backend, or a microservice. Tell us the goal you want to achieve, and we'll translate it into a clean, practical digital product.
        </p>
      </div>

      {/* Interactive Goal Chips */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Select what sounds closest to what you want to do:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUGGESTIONS.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent/40'
                    : 'border-border/70 bg-card hover:border-border hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {item.type}
                  </span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-accent" />}
                </div>
                <p className="text-xs font-bold text-foreground leading-snug">
                  "{item.label}"
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Action Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl border border-border bg-card shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-accent">Selected Direction:</span>
            <span className="text-xs font-bold text-foreground">{current.type}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {current.hint}
          </p>
        </div>

        <Link
          href={`/start-project?goal=${encodeURIComponent(current.label)}`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 shrink-0"
        >
          Tell Us What You Need <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
