'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  Sparkles, 
  Bot, 
  Database, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Workflow, 
  Cpu, 
  Cloud, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface NodeSpec {
  id: string;
  label: string;
  category: string;
  icon: any;
  status: string;
  metric: string;
  techStack: string[];
  snippet: {
    title: string;
    lang: string;
    code: string;
  };
  metrics: { label: string; value: string }[];
}

const NODES: NodeSpec[] = [
  {
    id: 'frontend',
    label: 'Next.js App & UI Surface',
    category: 'Client Viewport',
    icon: Globe,
    status: 'Edge Optimized',
    metric: '99/100 Lighthouse',
    techStack: ['Next.js 15', 'React 19', 'Tailwind CSS', 'TypeScript'],
    snippet: {
      title: 'AppRouter.tsx',
      lang: 'tsx',
      code: `export default async function SkylineApp() {
  const data = await getEdgeData({ cache: 'force-cache' });
  return <ResponsiveViewport data={data} theme="skyline-clean" />;
}`,
    },
    metrics: [
      { label: 'Time to First Byte', value: '< 45ms' },
      { label: 'LCP Score', value: '0.8s (Good)' },
      { label: 'Accessibility', value: '100% WCAG AA' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Enterprise RAG Core',
    category: 'Intelligence Engine',
    icon: Sparkles,
    status: 'pgvector Active',
    metric: '0.94 Cosine Sim',
    techStack: ['pgvector', 'OpenAI / Claude', 'LangChain', 'Tool Calling'],
    snippet: {
      title: 'ragPipeline.ts',
      lang: 'ts',
      code: `const embeddings = await createEmbeddings(query);
const context = await db.vectorSearch({ embeddings, limit: 5 });
const response = await generateStructuredPlan({ context, tools });`,
    },
    metrics: [
      { label: 'Vector Index', value: 'HNSW Cosine' },
      { label: 'Latency / Stream', value: '120ms first token' },
      { label: 'Hallucination Guard', value: 'Strict Context' },
    ],
  },
  {
    id: 'bots',
    label: 'Bots & Real-Time Gateway',
    category: 'Automation Engine',
    icon: Bot,
    status: 'Gateway 99.99%',
    metric: '14ms Ping',
    techStack: ['Discord.js v14', 'BullMQ', 'Redis', 'Webhooks'],
    snippet: {
      title: 'botGateway.ts',
      lang: 'ts',
      code: `client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await handleVerifiedCommand(interaction, { rateLimit: 'sliding-log' });
});`,
    },
    metrics: [
      { label: 'WebSocket Latency', value: '14ms' },
      { label: 'Job Throughput', value: '5,000 req/min' },
      { label: 'Auto Reconnect', value: 'Zero-downtime' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Database Vault',
    category: 'Infrastructure',
    icon: Database,
    status: 'ACID Compliant',
    metric: '100% Type-Safe',
    techStack: ['PostgreSQL', 'Prisma ORM', 'tRPC', 'Zod'],
    snippet: {
      title: 'schema.prisma',
      lang: 'prisma',
      code: `model Project {
  id              String   @id @default(cuid())
  totalPricePaise Int      // Integer precision
  status          Status   @default(IN_PROGRESS)
}`,
    },
    metrics: [
      { label: 'Data Integrity', value: 'Paise Integer Std' },
      { label: 'Connection Pool', value: 'PGBouncer Active' },
      { label: 'Audit Trail', value: 'Full Immutable Logs' },
    ],
  },
  {
    id: 'cicd',
    label: 'CI/CD & Live Staging',
    category: 'Delivery Pipeline',
    icon: Cloud,
    status: 'Verified Staging',
    metric: '13/13 Tests Pass',
    techStack: ['GitHub Actions', 'Playwright', 'Vercel Edge', 'Docker'],
    snippet: {
      title: 'deploy.yml',
      lang: 'yaml',
      code: `- name: Automated Test Verification
  run: npm run typecheck && npm test
- name: Deploy Staging Preview URL
  run: vercel deploy --prebuilt --token=\${{ secrets.VERCEL_TOKEN }}`,
    },
    metrics: [
      { label: 'Typecheck Linter', value: '0 Errors' },
      { label: 'Automated Tests', value: '13/13 Passed' },
      { label: 'Preview Delivery', value: 'Isolated Staging' },
    ],
  },
];

export function HeroVisualCenterpiece() {
  const [activeNodeId, setActiveNodeId] = useState<string>('frontend');
  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      {/* Outer Glow Container */}
      <div className="relative rounded-3xl border border-border/80 bg-card/60 p-4 sm:p-6 backdrop-blur-xl shadow-2xl transition-all">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-destructive/60" />
              <span className="h-3 w-3 rounded-full bg-amber-500/60" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-accent" />
              <span className="font-semibold text-foreground">skyline-ecosystem.config.ts</span>
              <span className="hidden sm:inline-block rounded bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                LIVE ARCHITECTURE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-foreground text-[11px]">System Ready</span>
            </div>
            <span className="text-border">|</span>
            <span className="text-[11px] font-mono">50/50 Milestone Model</span>
          </div>
        </div>

        {/* Interactive Pipeline Step Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-4 pb-4">
          {NODES.map((node) => {
            const Icon = node.icon;
            const isActive = node.id === activeNodeId;

            return (
              <button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className={`group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                  isActive
                    ? 'border-accent bg-accent/10 shadow-sm'
                    : 'border-border/60 bg-secondary/30 hover:border-border hover:bg-secondary/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground group-hover:text-foreground'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-accent/20 text-accent font-bold' : 'text-muted-foreground'}`}>
                    {node.metric}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {node.category}
                </span>
                <span className="text-xs font-bold text-foreground truncate w-full mt-0.5">
                  {node.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Node Deep-Dive Showcase Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl border border-border/80 bg-background/80 p-5 sm:p-6 shadow-inner">
          
          {/* Left Column: Code / Blueprint Inspection */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-accent" />
                  {activeNode.snippet.title}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {activeNode.status}
                </span>
              </div>

              {/* Code Surface */}
              <div className="rounded-xl border border-border bg-slate-950 p-4 font-mono text-[11px] sm:text-xs text-slate-100 shadow-md overflow-x-auto">
                <pre className="leading-relaxed">
                  <code>{activeNode.snippet.code}</code>
                </pre>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Engineered with:
              </span>
              {activeNode.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-border bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Metrics & Deliverable Guarantees */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/80 pt-4 lg:pt-0 lg:pl-6">
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Production Invariant
                </span>
                <h4 className="text-base font-extrabold text-foreground">
                  {activeNode.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Engineered with strict zero-throwaway standards, explicit type contracts, and continuous verification.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="space-y-2 pt-2">
                {activeNode.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-card/60 text-xs"
                  >
                    <span className="text-muted-foreground font-medium">{m.label}</span>
                    <span className="font-mono font-bold text-foreground">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Callout */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span>Audited Architecture</span>
              </div>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                Inspect Workflow <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Flow Breadcrumb */}
        <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-foreground">Pipeline:</span>
            <span>Idea</span>
            <span className="text-accent">→</span>
            <span>Fixed Quote</span>
            <span className="text-accent">→</span>
            <span className="text-foreground font-semibold">50% Deposit</span>
            <span className="text-accent">→</span>
            <span>Build & QA</span>
            <span className="text-accent">→</span>
            <span>Preview Review</span>
            <span className="text-accent">→</span>
            <span className="text-emerald-600 font-bold">100% Handover</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Activity className="h-3.5 w-3.5 text-accent" />
            <span>Direct Lead Engineer Execution</span>
          </div>
        </div>

      </div>
    </div>
  );
}
