'use client';

import React from 'react';
import { ShieldCheck, Zap, Award, Users, CheckCircle2, Clock } from 'lucide-react';

const METRICS = [
  {
    icon: Award,
    value: '₹1.2Cr+',
    label: 'Client Project Value Delivered',
    subtext: 'Across web, AI, bots & software',
  },
  {
    icon: ShieldCheck,
    value: '50/50 Model',
    label: 'Zero-Worry Milestone Split',
    subtext: 'Pay 50% start, 50% on approval',
  },
  {
    icon: Clock,
    value: '24h – 7d',
    label: 'Target Delivery Turnaround',
    subtext: 'Guaranteed agreed sprint scope',
  },
  {
    icon: Zap,
    value: '99.9%',
    label: 'System Uptime & Quality SLA',
    subtext: 'Type-safe & production audited',
  },
];

export function MetricsTicker() {
  return (
    <div className="w-full rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-border/60">
        {METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div 
              key={idx} 
              className={`flex flex-col items-center text-center space-y-1.5 ${idx !== 0 ? 'pt-4 md:pt-0 md:pl-6' : ''}`}
            >
              <div className="p-2 rounded-xl bg-accent/10 text-accent mb-1">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono">
                {metric.value}
              </span>
              <span className="text-xs font-bold text-foreground">
                {metric.label}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {metric.subtext}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
