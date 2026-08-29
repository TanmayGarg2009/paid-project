export const BRAND_CONFIG = {
  name: 'Skyline Digital',
  tagline: 'You have the idea. We build the technology.',
  description: 'Skyline Digital builds websites, mobile apps, bots, AI tools and custom software — designed, built and delivered around what you actually need.',
  domain: 'skyline.dev',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
  supportEmail: 'contact@skyline.dev',
  social: {
    discord: 'https://discord.gg/skyline',
    github: 'https://github.com/skyline-dev',
    x: 'https://x.com/skyline_tech',
  },
} as const;

export const BUSINESS_RULES = {
  defaultUpfrontPercentage: 50,
  defaultIncludedRevisions: 2,
  quoteExpirationDays: 14,
  maxAttachmentSizeBytes: 50 * 1024 * 1024, // 50 MB
  maxDeliverableSizeBytes: 250 * 1024 * 1024, // 250 MB
  currency: 'INR',
  paisePerRupee: 100,
} as const;

export const TIMELINE_SLAS = {
  STANDARD: {
    label: 'Standard',
    estimatedDays: 7,
    description: 'Target delivery in approximately 7 days.',
  },
  EXPRESS: {
    label: 'Express',
    estimatedDays: 3,
    description: 'Priority sprint: Target delivery in 2–3 days.',
  },
  NEXT_DAY: {
    label: 'Next Day',
    estimatedDays: 1,
    description: 'Ultra-fast delivery: Target delivery in approximately 24 hours.',
  },
  FLEXIBLE: {
    label: 'Flexible',
    estimatedDays: 14,
    description: 'Relaxed timeline for open-ended or complex milestones.',
  },
} as const;

export const BUDGET_RANGES = [
  { value: 'under-25k', label: 'Under ₹25,000' },
  { value: '25k-50k', label: '₹25,000 – ₹50,000' },
  { value: '50k-100k', label: '₹50,000 – ₹1,00,000' },
  { value: '100k-250k', label: '₹1,00,000 – ₹2,50,000' },
  { value: 'above-250k', label: '₹2,50,000+' },
  { value: 'custom', label: 'Custom / To be discussed' },
] as const;

export const PROJECT_TYPES = [
  'Website',
  'Web App',
  'Mobile App',
  'Desktop App',
  'Discord Bot',
  'Telegram Bot',
  'AI / LLM System',
  'Automation / Workflow',
  'Backend / API',
  'Database Architecture',
  'Minecraft Mod (Fabric / Forge / NeoForge)',
  'Minecraft Plugin / Server Network',
  'Gaming / Custom Mechanics',
  'Infrastructure / DevOps',
  'Custom Software',
  'Other',
] as const;

export const DEFAULT_SERVICES = [
  {
    id: 'srv_saas',
    title: 'Custom SaaS & Web Application',
    slug: 'custom-saas-web-application',
    shortDescription: 'Full-stack Next.js web application with authenticated dashboards, database architecture, and payment checkouts.',
    fullDescription: 'We design and develop bespoke, production-ready web platforms using Next.js App Router, TypeScript, Tailwind CSS, and PostgreSQL. Includes end-to-end authentication, RBAC authorization, transactional billing, real-time sync, and responsive interfaces.',
    startingPricePaise: 4500000,
    estimatedDaysDefault: 14,
    features: ['Next.js App Router & TypeScript', 'PostgreSQL & Prisma ORM', 'Authentication & Role-Based Access', 'Payment Gateway Integration', 'Fully Responsive UI (Desktop/Mobile)', 'SEO & Core Web Vitals Optimized'],
    deliverableTypes: ['Full Source Code Repository', 'Live Production Deployment', 'Admin Control Panel', 'Technical Documentation'],
    isFeatured: true,
    isPublished: true,
    category: { name: 'Websites & Web Apps', slug: 'websites-web-apps' },
    faqs: [
      { question: 'What tech stack do you use?', answer: 'We build with Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, and Redis for maximum performance and maintainability.' },
      { question: 'Do I get the source code?', answer: 'Yes, full source code ownership and Git repository access are transferred upon final payment completion.' }
    ]
  },
  {
    id: 'srv_biz_web',
    title: 'High-Converting Business & Portfolio Website',
    slug: 'business-portfolio-website',
    shortDescription: 'Ultra-fast, typography-driven marketing website designed to convert visitors into qualified leads.',
    fullDescription: 'Custom bespoke marketing website designed with modern typography, subtle motion animations, dynamic Open Graph cards, structured Schema.org SEO, and frictionless contact/quote request workflows.',
    startingPricePaise: 2000000,
    estimatedDaysDefault: 5,
    features: ['Modern Minimalist Design Tokens', 'Dynamic Open Graph Social Cards', 'Sub-second Core Web Vitals Performance', 'Interactive Quote & Contact Intake', 'Dynamic Sitemap & Schema.org JSON-LD'],
    deliverableTypes: ['Vercel/Node Production Deployment', 'Source Code Repository', 'Asset Package'],
    isFeatured: true,
    isPublished: true,
    category: { name: 'Websites & Web Apps', slug: 'websites-web-apps' },
    faqs: [
      { question: 'How long does a business website take?', answer: 'Standard delivery target is 5 to 7 days depending on the number of bespoke pages and custom copy.' }
    ]
  },
  {
    id: 'srv_bot',
    title: 'Custom Discord Bot System',
    slug: 'custom-discord-bot',
    shortDescription: 'Bespoke Discord.js v14 bot with slash commands, interactive buttons, modal forms, and database persistence.',
    fullDescription: 'Production-ready Discord bot architecture engineered with Discord.js, REST slash command deployment, interactive modal workflows, database moderation logging, ticket management, and third-party API sync.',
    startingPricePaise: 1500000,
    estimatedDaysDefault: 4,
    features: ['Discord.js v14+ Architecture', 'Slash Commands & Autocomplete', 'Interactive Modals & Action Rows', 'PostgreSQL / Redis Persistence', 'Dockerized 24/7 Hosting Setup'],
    deliverableTypes: ['Clean TypeScript Bot Codebase', 'Deployment Dockerfile / VPS Setup Guide', 'Command Documentation'],
    isFeatured: true,
    isPublished: true,
    category: { name: 'Bots & Automation', slug: 'bots-automation' },
    faqs: [
      { question: 'Can the bot be hosted 24/7?', answer: 'Yes, we provide ready-to-run Docker Compose setups or assist with deployment to your VPS or cloud host.' }
    ]
  },
  {
    id: 'srv_rag',
    title: 'Enterprise RAG Knowledge Base & AI Agent',
    slug: 'enterprise-rag-ai-agent',
    shortDescription: 'Domain-specific AI agent equipped with private document embeddings, semantic vector search, and structured tool execution.',
    fullDescription: 'Advanced LLM integration leveraging hybrid vector search (Dense + BM25), semantic chunking, prompt engineering, and structured Zod output validation for accurate, hallucination-resistant domain responses.',
    startingPricePaise: 5000000,
    estimatedDaysDefault: 10,
    features: ['Hybrid Vector Search (pgvector)', 'Document Parsing & Chunking Pipeline', 'Structured Tool Calling (Function Calling)', 'Context Window Token Optimization', 'Privacy-Preserving Architecture'],
    deliverableTypes: ['Full AI Engine Source Code', 'Ingestion CLI Script', 'Interactive Chat Interface'],
    isFeatured: true,
    isPublished: true,
    category: { name: 'AI & Intelligent Systems', slug: 'ai-systems' },
    faqs: [
      { question: 'Which AI models are supported?', answer: 'We support Gemini 1.5/2.0, OpenAI GPT-4o, Claude 3.5 Sonnet, and open-source models via Ollama/vLLM.' }
    ]
  },
  {
    id: 'srv_mc',
    title: 'Minecraft Plugins, Mods & Server Systems',
    slug: 'minecraft-paper-plugin',
    shortDescription: 'Custom Fabric & Forge mods, Paper/Purpur plugins, custom entities, blocks, and high-performance server network mechanics.',
    fullDescription: 'Bespoke Minecraft engineering across client and server environments. We develop modern Fabric, NeoForge, and Forge mods (Mixins, custom items/blocks, screen handlers, networking packets) as well as optimized Paper/Purpur plugins with asynchronous chunk loading, PDC NBT structures, and 50ms tick-budget guarantees.',
    startingPricePaise: 1200000,
    estimatedDaysDefault: 5,
    features: ['Fabric, Forge & NeoForge Mod Development', 'Paper, Spigot & Purpur Server Plugins', 'Custom Entities, Blocks, Items & Screen Handlers', 'Mixins & Packet Synchronization', 'Folia Multi-Threaded Support', 'High-Performance 20 TPS Optimization'],
    deliverableTypes: ['Compiled Mod / Plugin JAR files', 'Full Java/Kotlin Source Code', 'Loom/Gradle Build Files', 'Configuration & Asset Package'],
    isFeatured: true,
    isPublished: true,
    category: { name: 'Gaming & Minecraft', slug: 'gaming-minecraft' },
    faqs: [
      { question: 'Do you develop client-side and server-side Minecraft mods?', answer: 'Yes, we develop client mods, server-side Fabric/Forge mods, custom GUI screen handlers, and hybrid client-server packet synchronization systems.' },
      { question: 'Which Minecraft versions and mod loaders are supported?', answer: 'We support Fabric, NeoForge, Forge, Quilt, Paper, Purpur, Spigot, and Velocity across modern (1.20.x, 1.21+) and legacy versions (1.8.9, 1.12.2, 1.16.5).' }
    ]
  },
  {
    id: 'srv_backend',
    title: 'Production REST/tRPC Backend & Database',
    slug: 'backend-database-api',
    shortDescription: 'Hardened backend service with schema migrations, Redis caching, JWT session security, and OpenAPI 3.1 contracts.',
    fullDescription: 'Layered backend architecture with strict operational error handling, connection pooling, sliding-window rate limiting, and automated database indexes.',
    startingPricePaise: 3000000,
    estimatedDaysDefault: 7,
    features: ['Layered 3-Tier Architecture', 'Prisma / PostgreSQL Migrations', 'Redis Caching & Sliding Window Rate Limiting', 'OpenAPI 3.1 Contract Specs'],
    deliverableTypes: ['Backend Codebase', 'Database Migration Scripts', 'OpenAPI Documentation'],
    isFeatured: false,
    isPublished: true,
    category: { name: 'Backend & Infrastructure', slug: 'backend-infrastructure' },
    faqs: []
  },
  {
    id: 'srv_mobile',
    title: 'Cross-Platform React Native Mobile App',
    slug: 'cross-platform-mobile-app',
    shortDescription: 'Native-feel iOS and Android application with Expo Router, offline state caching, and push notifications.',
    fullDescription: 'Modern mobile app built with Expo Managed Workflow, TypeScript, dynamic deep linking, secure device storage, and EAS build pipelines.',
    startingPricePaise: 6000000,
    estimatedDaysDefault: 18,
    features: ['Expo Router File Navigation', 'iOS & Android Native Builds', 'Push Notifications Integration', 'Offline Data Synchronization'],
    deliverableTypes: ['Expo/React Native Source Code', 'EAS Build Config', 'App Store / Play Store Build Files'],
    isFeatured: false,
    isPublished: true,
    category: { name: 'Mobile Apps', slug: 'mobile-apps' },
    faqs: []
  },
  {
    id: 'srv_custom',
    title: 'Bespoke Custom Software Solution',
    slug: 'bespoke-custom-software',
    shortDescription: 'Tailored technology development for specialized operational workflows and complex domain requirements.',
    fullDescription: 'Full lifecycle software engineering for requirements that extend beyond standard categories. Includes custom architectural design, milestone delivery, and comprehensive documentation.',
    startingPricePaise: 5000000,
    estimatedDaysDefault: 14,
    features: ['Custom Architecture Design', 'Milestone-Driven Execution', 'Comprehensive Unit & E2E Testing', 'Complete Intellectual Property Transfer'],
    deliverableTypes: ['Complete Software Package', 'Technical Documentation', 'Deployment Playbook'],
    isFeatured: false,
    isPublished: true,
    category: { name: 'Custom Software', slug: 'custom-software' },
    faqs: []
  }
];

export const DEFAULT_PORTFOLIO = [
  {
    id: 'port_1',
    title: 'AuraPay — Real-Time Milestone Invoicing Engine',
    slug: 'aurapay-milestone-invoicing',
    clientName: 'Aura Fintech Labs',
    summary: 'Engineered a real-time milestone payment tracking platform with webhook verification and automated receipt generation.',
    contentMdx: 'A complete case study on building a high-trust milestone payment platform using Next.js App Router, Prisma, PostgreSQL, and Razorpay.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'],
    liveUrl: 'https://aurapay.example.com',
    completedAt: new Date('2026-02-15'),
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'port_2',
    title: 'Vanguard — Minecraft Economy & Guilds System',
    slug: 'vanguard-minecraft-guilds',
    clientName: 'Vanguard Network',
    summary: 'Bespoke Paper 1.21 plugin supporting 400+ concurrent players with zero tick degradation.',
    contentMdx: 'Architected async SQLite/Redis caching layer for high-throughput Minecraft player transactions.',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [],
    liveUrl: 'https://vanguardmc.example.com',
    completedAt: new Date('2026-01-20'),
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'port_3',
    title: 'Krypton Bot — Community Moderation & Tickets',
    slug: 'krypton-discord-bot',
    clientName: 'Krypton Gaming',
    summary: 'Automated ticket routing and moderation bot serving a 45,000-member gaming community.',
    contentMdx: 'Built with Discord.js v14 with modal support, transcript archives, and Redis rate limiting.',
    coverImage: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [],
    liveUrl: null,
    completedAt: new Date('2025-11-10'),
    isFeatured: true,
    isPublished: true,
  }
];

export const DEFAULT_REVIEWS = [
  {
    id: 'rev_1',
    rating: 5,
    headline: 'Flawless engineering and crystal-clear milestone billing.',
    comment: 'Skyline delivered our custom reporting portal 2 days ahead of the target delivery date. The code was exceptionally clean, TypeScript types were rigorous, and the 50/50 payment model gave us complete confidence.',
    isPublished: true,
    isFeatured: true,
    user: { name: 'Alex Rivera' },
    project: { title: 'Client Analytics Portal' }
  },
  {
    id: 'rev_2',
    rating: 5,
    headline: 'Zero-tick lag on 400 player load test.',
    comment: 'The custom Paper plugin developed by Skyline outperformed everything else we tested. Async chunk handling was flawless.',
    isPublished: true,
    isFeatured: true,
    user: { name: 'Marcus Sterling' },
    project: { title: 'Guild Economy Engine' }
  }
];
