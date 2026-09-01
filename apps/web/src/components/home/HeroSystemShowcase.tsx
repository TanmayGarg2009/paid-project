'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  ShieldCheck, 
  Terminal, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Cpu,
  Zap,
  Activity
} from 'lucide-react';

const FEATURED_NODES = [
  {
    id: 'vortextiers',
    title: 'Vortex Tiers PvP Platform',
    domain: 'vortextiers.xyz',
    url: 'https://vortextiers.xyz/',
    badge: 'Competitive PvP Platform',
    status: 'ACTIVE • 8 GAMEMODES',
    metrics: 'Sub-30ms API • HT1–LT5',
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'hover:border-cyan-500/50',
    accentDot: 'bg-cyan-400',
  },
  {
    id: 'nexflow',
    title: 'NexFlow Pay Workspace',
    domain: 'nexflowpay.vercel.app',
    url: 'https://nexflowpay.vercel.app/',
    badge: 'Merchant Payment Automation',
    status: 'ACTIVE • FASTAPI BACKEND',
    metrics: 'Zero Leaks • RBAC Auth',
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'hover:border-emerald-500/50',
    accentDot: 'bg-emerald-400',
  },
  {
    id: 'canvasos',
    title: 'CanvasOS Architecture Studio',
    domain: 'canvaos.vercel.app',
    url: 'https://canvaos.vercel.app/',
    badge: 'Infinite Developer Canvas',
    status: 'ACTIVE • LOCAL-FIRST',
    metrics: 'IndexedDB • Zero Telemetry',
    color: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'hover:border-purple-500/50',
    accentDot: 'bg-purple-400',
  },
];

export function HeroSystemShowcase() {
  const [activeNode, setActiveNode] = useState(0);
  const active = FEATURED_NODES[activeNode];

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      
      {/* Background Ambient Glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent/20 via-blue-500/20 to-purple-500/20 opacity-70 blur-2xl transition duration-1000 -z-10" />

      {/* Main Container Window */}
      <div className="rounded-3xl border border-border/90 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Window Top Chrome Header */}
        <div className="flex items-center justify-between border-b border-border/80 bg-secondary/60 px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground ml-2 hidden sm:inline-block">
              northstack-node-v2.5
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-[11px] font-mono text-foreground border border-border/60 shadow-sm">
            <Globe className="h-3 w-3 text-accent shrink-0" />
            <span className="font-bold text-accent">{active.domain}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Node Switcher Tabs */}
        <div className="grid grid-cols-3 border-b border-border/60 bg-secondary/30 p-1.5 gap-1 text-xs">
          {FEATURED_NODES.map((node, idx) => (
            <button
              key={node.id}
              onClick={() => setActiveNode(idx)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all text-[11px] sm:text-xs truncate ${
                activeNode === idx
                  ? 'bg-card text-foreground shadow-sm border border-border/80'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${node.accentDot} shrink-0`} />
              <span className="truncate">{node.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Node Showcase Viewport */}
        <div className="p-6 sm:p-7 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block">
                {active.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {active.title}
              </h3>
            </div>
            
            <a
              href={active.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 hover:bg-accent/20 px-3.5 py-1.5 rounded-xl border border-accent/20 transition-all self-start sm:self-auto"
            >
              Inspect Live <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Interactive Live Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                <Activity className="h-3 w-3 text-accent" /> Runtime Status
              </span>
              <p className="text-xs font-mono font-bold text-foreground truncate">
                {active.status}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500" /> Performance
              </span>
              <p className="text-xs font-mono font-bold text-foreground truncate">
                {active.metrics}
              </p>
            </div>
          </div>

          {/* Live Architecture Terminal Feed */}
          <div className="rounded-2xl border border-border/80 bg-[#060913] p-4 font-mono text-xs text-slate-300 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-accent" /> LIVE PIPELINE
              </span>
              <span className="text-emerald-400">99.99% SLA</span>
            </div>
            <div className="space-y-1 text-[11px] leading-relaxed pt-1">
              <p className="text-slate-400">
                <span className="text-accent">&gt;</span> target: <span className="text-slate-200">{active.domain}</span>
              </p>
              <p className="text-slate-400">
                <span className="text-emerald-400">✓</span> milestone: <span className="text-slate-200">100% code delivery verified</span>
              </p>
              <p className="text-slate-400">
                <span className="text-purple-400">⚡</span> stack: <span className="text-slate-200">Next.js 15 • TypeScript • MySQL / Node.js</span>
              </p>
            </div>
          </div>

          {/* Bottom Trust Action */}
          <div className="flex items-center justify-between pt-2 border-t border-border/70 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground font-semibold text-[11px]">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Full Source Code Included</span>
            </div>
            <Link
              href="/portfolio"
              className="font-bold text-accent hover:underline inline-flex items-center gap-1"
            >
              All 10 Deliverables <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
