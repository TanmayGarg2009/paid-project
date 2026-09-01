'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Zap, Award, Clock } from 'lucide-react';

const METRICS = [
  {
    icon: Award,
    prefix: '₹',
    targetNumber: 1.2,
    suffix: 'Cr+',
    isDecimal: true,
    displayFallback: '₹1.2Cr+',
    label: 'Client Project Value Delivered',
    subtext: 'Across web, AI, bots & software',
  },
  {
    icon: ShieldCheck,
    targetNumber: 50,
    prefix: '',
    suffix: '/50',
    displayFallback: '50/50 Model',
    isSpecial: true,
    label: 'Zero-Worry Milestone Split',
    subtext: 'Pay 50% start, 50% on approval',
  },
  {
    icon: Clock,
    displayFallback: '24h – 7d',
    label: 'Target Delivery Turnaround',
    subtext: 'Guaranteed agreed sprint scope',
  },
  {
    icon: Zap,
    targetNumber: 99.9,
    prefix: '',
    suffix: '%',
    isDecimal: true,
    displayFallback: '99.9%',
    label: 'System Uptime & Quality SLA',
    subtext: 'Type-safe & production audited',
  },
];

export function MetricsTicker() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-md"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-border/60">
        {METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div 
              key={idx} 
              className={`flex flex-col items-center text-center space-y-1.5 group transition-transform duration-200 hover:-translate-y-1 ${
                idx !== 0 ? 'pt-4 md:pt-0 md:pl-6' : ''
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-accent/10 text-accent mb-1 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-200">
                <Icon className="h-4 w-4" />
              </div>
              
              <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono transition-colors duration-200 group-hover:text-accent">
                {metric.displayFallback}
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
