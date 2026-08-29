import { PrismaClient, UserRole, RequestStatus, QuoteStatus, ProjectStatus, MilestoneType, MilestoneStatus, DeliverableType, DeliverableAccessLevel } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

// Helper to hash password using SHA-256 with salt for seed
function hashPassword(password: string): string {
  const salt = 'skyline_static_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

async function main() {
  console.log('🌱 Starting Skyline Database Seeding...');

  // 1. Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.paymentEvent.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.changeRequest.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.projectAttachment.deleteMany();
  await prisma.projectMessage.deleteMany();
  await prisma.projectDeadlineHistory.deleteMany();
  await prisma.projectStatusHistory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.project.deleteMany();
  await prisma.quoteStatusHistory.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.projectRequest.deleteMany();
  await prisma.portfolioProject.deleteMany();
  await prisma.serviceFaq.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.session.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemSetting.deleteMany();

  // 2. Create Platform Owner & Admin Users
  const adminPasswordHash = hashPassword('SkylineAdminPassword2026!');

  const owner = await prisma.user.create({
    data: {
      email: 'admin@skyline.dev',
      name: 'Tanmay Garg (Skyline Owner)',
      passwordHash: adminPasswordHash,
      role: UserRole.OWNER,
      phone: '+91 9876543210',
      discordUsername: 'skyline_lead#0001',
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      email: 'client@example.com',
      name: 'Alex Rivera',
      passwordHash: hashPassword('CustomerPassword123!'),
      role: UserRole.CUSTOMER,
      phone: '+91 9123456780',
      discordUsername: 'alex_r#1234',
    },
  });

  console.log('✅ Created Admin & Demo Customer users');

  // 3. Create System Settings
  const settings = [
    { key: 'platform_name', value: 'Skyline' },
    { key: 'tagline', value: 'You have the idea. We build the technology.' },
    { key: 'default_upfront_percentage', value: '50' },
    { key: 'sla_standard_days', value: '7' },
    { key: 'sla_express_days', value: '3' },
    { key: 'sla_next_day_days', value: '1' },
    { key: 'default_included_revisions', value: '2' },
    { key: 'quote_expiration_days', value: '14' },
    { key: 'contact_email', value: 'contact@skyline.dev' },
    { key: 'support_discord', value: 'https://discord.gg/skyline' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.create({ data: s });
  }

  // 4. Create Service Categories & Services
  const categoriesData = [
    {
      name: 'Websites & Web Apps',
      slug: 'websites-web-apps',
      description: 'High-performance modern web platforms, bespoke business websites, and scalable SaaS applications.',
      sortOrder: 1,
      services: [
        {
          title: 'Custom SaaS & Web Application',
          slug: 'custom-saas-web-application',
          shortDescription: 'Full-stack Next.js web application with authenticated dashboards, database architecture, and payment checkouts.',
          fullDescription: 'We design and develop bespoke, production-ready web platforms using Next.js App Router, TypeScript, Tailwind CSS, and PostgreSQL. Includes end-to-end authentication, RBAC authorization, transactional billing, real-time sync, and responsive interfaces.',
          startingPricePaise: 4500000, // ₹45,000
          estimatedDaysDefault: 14,
          features: ['Next.js App Router & TypeScript', 'PostgreSQL & Prisma ORM', 'Authentication & Role-Based Access', 'Payment Gateway Integration', 'Fully Responsive UI (Desktop/Mobile)', 'SEO & Core Web Vitals Optimized'],
          deliverableTypes: ['Full Source Code Repository', 'Live Production Deployment', 'Admin Control Panel', 'Technical Documentation'],
          isFeatured: true,
          faqs: [
            { question: 'What tech stack do you use?', answer: 'We build with Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, and Redis for maximum performance and maintainability.' },
            { question: 'Do I get the source code?', answer: 'Yes, full source code ownership and Git repository access are transferred upon final payment completion.' }
          ]
        },
        {
          title: 'High-Converting Business & Portfolio Website',
          slug: 'business-portfolio-website',
          shortDescription: 'Ultra-fast, typography-driven marketing website designed to convert visitors into qualified leads.',
          fullDescription: 'Custom bespoke marketing website designed with modern typography, subtle motion animations, dynamic Open Graph cards, structured Schema.org SEO, and frictionless contact/quote request workflows.',
          startingPricePaise: 2000000, // ₹20,000
          estimatedDaysDefault: 5,
          features: ['Modern Minimalist Design Tokens', 'Dynamic Open Graph Social Cards', 'Sub-second Core Web Vitals Performance', 'Interactive Quote & Contact Intake', 'Dynamic Sitemap & Schema.org JSON-LD'],
          deliverableTypes: ['Vercel/Node Production Deployment', 'Source Code Repository', 'Asset Package'],
          isFeatured: true,
          faqs: [
            { question: 'How long does a business website take?', answer: 'Standard delivery target is 5 to 7 days depending on the number of bespoke pages and custom copy.' }
          ]
        }
      ]
    },
    {
      name: 'Bots & Automation',
      slug: 'bots-automation',
      description: 'Custom Discord bots, Telegram bots, workflow automations, and third-party API integrations.',
      sortOrder: 2,
      services: [
        {
          title: 'Custom Discord Bot System',
          slug: 'custom-discord-bot',
          shortDescription: 'Bespoke Discord.js v14 bot with slash commands, interactive buttons, modal forms, and database persistence.',
          fullDescription: 'Production-ready Discord bot architecture engineered with Discord.js, REST slash command deployment, interactive modal workflows, database moderation logging, ticket management, and third-party API sync.',
          startingPricePaise: 1500000, // ₹15,000
          estimatedDaysDefault: 4,
          features: ['Discord.js v14+ Architecture', 'Slash Commands & Autocomplete', 'Interactive Modals & Action Rows', 'PostgreSQL / Redis Persistence', 'Dockerized 24/7 Hosting Setup'],
          deliverableTypes: ['Clean TypeScript Bot Codebase', 'Deployment Dockerfile / VPS Setup Guide', 'Command Documentation'],
          isFeatured: true,
          faqs: [
            { question: 'Can the bot be hosted 24/7?', answer: 'Yes, we provide ready-to-run Docker Compose setups or assist with deployment to your VPS or cloud host.' }
          ]
        },
        {
          title: 'Workflow & API Automation Pipeline',
          slug: 'workflow-api-automation',
          shortDescription: 'Automate repetitive operations, database synchronization, webhook relays, and multi-service event pipelines.',
          fullDescription: 'Custom asynchronous background automation workers built with BullMQ, Redis, and secure webhook adapters to eliminate manual operational friction.',
          startingPricePaise: 1800000, // ₹18,000
          estimatedDaysDefault: 5,
          features: ['Idempotent Webhook Relays', 'Exponential Backoff Retry Worker', 'Multi-Provider Integration', 'Audit Trail Logging'],
          deliverableTypes: ['Worker Scripts', 'API Adapter Library', 'Configuration Guide'],
          isFeatured: false,
          faqs: []
        }
      ]
    },
    {
      name: 'AI & Intelligent Systems',
      slug: 'ai-systems',
      description: 'Custom AI chatbots, Retrieval-Augmented Generation (RAG) knowledge bases, and autonomous tool-calling agents.',
      sortOrder: 3,
      services: [
        {
          title: 'Enterprise RAG Knowledge Base & AI Agent',
          slug: 'enterprise-rag-ai-agent',
          shortDescription: 'Domain-specific AI agent equipped with private document embeddings, semantic vector search, and structured tool execution.',
          fullDescription: 'Advanced LLM integration leveraging hybrid vector search (Dense + BM25), semantic chunking, prompt engineering, and structured Zod output validation for accurate, hallucination-resistant domain responses.',
          startingPricePaise: 5000000, // ₹50,000
          estimatedDaysDefault: 10,
          features: ['Hybrid Vector Search (pgvector)', 'Document Parsing & Chunking Pipeline', 'Structured Tool Calling (Function Calling)', 'Context Window Token Optimization', 'Privacy-Preserving Architecture'],
          deliverableTypes: ['Full AI Engine Source Code', 'Ingestion CLI Script', 'Interactive Chat Interface'],
          isFeatured: true,
          faqs: [
            { question: 'Which AI models are supported?', answer: 'We support Gemini 1.5/2.0, OpenAI GPT-4o, Claude 3.5 Sonnet, and open-source models via Ollama/vLLM.' }
          ]
        }
      ]
    },
    {
      name: 'Gaming & Minecraft Development',
      slug: 'gaming-minecraft',
      description: 'Custom Paper/Purpur plugins, Fabric mods, network server architectures, and Tebex store integrations.',
      sortOrder: 4,
      services: [
        {
          title: 'Minecraft Plugins, Mods & Server Systems',
          slug: 'minecraft-paper-plugin',
          shortDescription: 'Custom Fabric & Forge mods, Paper/Purpur plugins, custom entities, blocks, and high-performance server network mechanics.',
          fullDescription: 'Bespoke Minecraft engineering across client and server environments. We develop modern Fabric, NeoForge, and Forge mods (Mixins, custom items/blocks, screen handlers, networking packets) as well as optimized Paper/Purpur plugins with asynchronous chunk loading, PDC NBT structures, and 50ms tick-budget guarantees.',
          startingPricePaise: 1200000, // ₹12,000
          estimatedDaysDefault: 5,
          features: ['Fabric, Forge & NeoForge Mod Development', 'Paper, Spigot & Purpur Server Plugins', 'Custom Entities, Blocks, Items & Screen Handlers', 'Mixins & Packet Synchronization', 'Folia Multi-Threaded Support', 'High-Performance 20 TPS Optimization'],
          deliverableTypes: ['Compiled Mod / Plugin JAR files', 'Full Java/Kotlin Source Code', 'Loom/Gradle Build Files', 'Configuration & Asset Package'],
          isFeatured: true,
          faqs: [
            { question: 'Do you develop client-side and server-side Minecraft mods?', answer: 'Yes, we develop client mods, server-side Fabric/Forge mods, custom GUI screen handlers, and hybrid client-server packet synchronization systems.' },
            { question: 'Which Minecraft versions and mod loaders are supported?', answer: 'We support Fabric, NeoForge, Forge, Quilt, Paper, Purpur, Spigot, and Velocity across modern (1.20.x, 1.21+) and legacy versions (1.8.9, 1.12.2, 1.16.5).' }
          ]
        }
      ]
    },
    {
      name: 'Backend & Infrastructure',
      slug: 'backend-infrastructure',
      description: 'Production APIs, PostgreSQL architectures, Docker containerization, and secure CI/CD pipelines.',
      sortOrder: 5,
      services: [
        {
          title: 'Production REST/tRPC Backend & Database',
          slug: 'backend-database-api',
          shortDescription: 'Hardened backend service with schema migrations, Redis caching, JWT session security, and OpenAPI 3.1 contracts.',
          fullDescription: 'Layered backend architecture with strict operational error handling, connection pooling, sliding-window rate limiting, and automated database indexes.',
          startingPricePaise: 3000000, // ₹30,000
          estimatedDaysDefault: 7,
          features: ['Layered 3-Tier Architecture', 'Prisma / PostgreSQL Migrations', 'Redis Caching & Sliding Window Rate Limiting', 'OpenAPI 3.1 Contract Specs'],
          deliverableTypes: ['Backend Codebase', 'Database Migration Scripts', 'OpenAPI Documentation'],
          isFeatured: false,
          faqs: []
        }
      ]
    },
    {
      name: 'Mobile Apps',
      slug: 'mobile-apps',
      description: 'Cross-platform mobile applications for iOS and Android built with React Native and Expo.',
      sortOrder: 6,
      services: [
        {
          title: 'Cross-Platform React Native Mobile App',
          slug: 'cross-platform-mobile-app',
          shortDescription: 'Native-feel iOS and Android application with Expo Router, offline state caching, and push notifications.',
          fullDescription: 'Modern mobile app built with Expo Managed Workflow, TypeScript, dynamic deep linking, secure device storage, and EAS build pipelines.',
          startingPricePaise: 6000000, // ₹60,000
          estimatedDaysDefault: 18,
          features: ['Expo Router File Navigation', 'iOS & Android Native Builds', 'Push Notifications Integration', 'Offline Data Synchronization'],
          deliverableTypes: ['Expo/React Native Source Code', 'EAS Build Config', 'App Store / Play Store Build Files'],
          isFeatured: false,
          faqs: []
        }
      ]
    },
    {
      name: 'Desktop Apps',
      slug: 'desktop-apps',
      description: 'Cross-platform desktop tools and internal utilities for Windows and macOS.',
      sortOrder: 7,
      services: [
        {
          title: 'Cross-Platform Desktop Application',
          slug: 'desktop-application',
          shortDescription: 'Lightweight desktop application with local filesystem access, background tray support, and native performance.',
          fullDescription: 'Custom desktop software designed for internal operational tools, asset converters, or data management with cross-platform support.',
          startingPricePaise: 3500000, // ₹35,000
          estimatedDaysDefault: 10,
          features: ['Windows & macOS Executables', 'Local System Integration', 'Auto-Update Pipeline', 'Zero-Crash Architecture'],
          deliverableTypes: ['Executable Installers (.exe, .dmg)', 'Source Code'],
          isFeatured: false,
          faqs: []
        }
      ]
    },
    {
      name: 'Custom Software',
      slug: 'custom-software',
      description: 'Bespoke digital software solutions tailored specifically to unique business requirements.',
      sortOrder: 8,
      services: [
        {
          title: 'Bespoke Custom Software Solution',
          slug: 'bespoke-custom-software',
          shortDescription: 'Tailored technology development for specialized operational workflows and complex domain requirements.',
          fullDescription: 'Full lifecycle software engineering for requirements that extend beyond standard categories. Includes custom architectural design, milestone delivery, and comprehensive documentation.',
          startingPricePaise: 5000000, // ₹50,000
          estimatedDaysDefault: 14,
          features: ['Custom Architecture Design', 'Milestone-Driven Execution', 'Comprehensive Unit & E2E Testing', 'Complete Intellectual Property Transfer'],
          deliverableTypes: ['Complete Software Package', 'Technical Documentation', 'Deployment Playbook'],
          isFeatured: false,
          faqs: []
        }
      ]
    }
  ];

  for (const cat of categoriesData) {
    const createdCategory = await prisma.serviceCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });

    for (const s of cat.services) {
      const createdService = await prisma.service.create({
        data: {
          categoryId: createdCategory.id,
          title: s.title,
          slug: s.slug,
          shortDescription: s.shortDescription,
          fullDescription: s.fullDescription,
          startingPricePaise: s.startingPricePaise,
          estimatedDaysDefault: s.estimatedDaysDefault,
          features: s.features,
          deliverableTypes: s.deliverableTypes,
          isFeatured: s.isFeatured,
          isPublished: true,
        },
      });

      for (const faq of s.faqs) {
        await prisma.serviceFaq.create({
          data: {
            serviceId: createdService.id,
            question: faq.question,
            answer: faq.answer,
          },
        });
      }
    }
  }

  console.log('✅ Created 8 Service Categories and all core Services');

  // 5. Create Realistic Portfolio Showcases
  const portfolioData = [
    {
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
    },
    {
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
    },
    {
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
    }
  ];

  for (const p of portfolioData) {
    await prisma.portfolioProject.create({ data: p });
  }

  console.log('✅ Created Portfolio Showcases');

  // 6. Create Completed Project with Verified Review (Sample)
  const webAppService = await prisma.service.findFirst({ where: { slug: 'custom-saas-web-application' } });

  const sampleRequest = await prisma.projectRequest.create({
    data: {
      trackingCode: 'SKY-2026-0001',
      userId: demoCustomer.id,
      serviceId: webAppService?.id,
      name: 'Alex Rivera',
      email: 'client@example.com',
      discordUsername: 'alex_r#1234',
      phoneWhatsApp: '+91 9123456780',
      projectType: 'Web Application',
      description: 'Build a custom analytics client portal with real-time chart synchronization.',
      goals: 'Allow our clients to view weekly marketing campaign reports securely.',
      desiredFeatures: ['Client login portal', 'Interactive chart visualizers', 'Export to PDF report', 'Weekly automated email summaries'],
      budgetRange: '₹40,000 - ₹60,000',
      timelinePriority: 'STANDARD',
      status: RequestStatus.QUOTED,
    },
  });

  const sampleQuote = await prisma.quote.create({
    data: {
      quoteNumber: 'Q-2026-0001',
      version: 1,
      projectRequestId: sampleRequest.id,
      projectName: 'Client Analytics Portal',
      description: 'Bespoke analytics reporting portal with role-based client accounts and automated PDF export.',
      scope: 'Development of frontend dashboard, PostgreSQL database modeling, auth system, chart visualizers, and weekly automated reports.',
      deliverables: ['Full Source Code in GitHub Repository', 'Production Deployment on Vercel', 'Admin Reporting Controls', 'PDF Export Engine'],
      exclusions: ['Third-party ad spend fees', 'Custom mobile app (native iOS/Android)'],
      includedRevisions: 2,
      totalPricePaise: 5000000, // ₹50,000
      upfrontPercentage: 50,
      upfrontAmountPaise: 2500000, // ₹25,000 (50%)
      remainingAmountPaise: 2500000, // ₹25,000 (50%)
      estimatedDeliveryDays: 7,
      targetDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      quoteExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      termsAndConditions: 'Standard Skyline 50% upfront milestone agreement. Final source code and deliverables unlocked upon verified final 50% payment.',
      status: QuoteStatus.ACCEPTED,
    },
  });

  const sampleProject = await prisma.project.create({
    data: {
      projectCode: 'SKY-PRJ-0001',
      customerId: demoCustomer.id,
      serviceId: webAppService?.id,
      projectRequestId: sampleRequest.id,
      quoteId: sampleQuote.id,
      title: 'Client Analytics Portal',
      description: 'Bespoke analytics reporting portal with role-based client accounts and automated PDF export.',
      status: ProjectStatus.COMPLETED,
      totalPricePaise: 5000000,
      upfrontPaidPaise: 2500000,
      finalPaidPaise: 2500000,
      targetDeliveryDate: new Date('2026-02-20'),
      revisionsIncluded: 2,
      revisionsUsed: 1,
    },
  });

  // Upfront Milestone (Paid)
  const upfrontMilestone = await prisma.milestone.create({
    data: {
      projectId: sampleProject.id,
      type: MilestoneType.UPFRONT_50,
      title: 'Upfront Deposit (50%) — Project Kickoff',
      description: '50% initial milestone payment to begin development architecture.',
      amountPaise: 2500000,
      percentage: 50,
      status: MilestoneStatus.PAID,
    },
  });

  // Final Milestone (Paid)
  const finalMilestone = await prisma.milestone.create({
    data: {
      projectId: sampleProject.id,
      type: MilestoneType.FINAL_BALANCE,
      title: 'Final Delivery Payment (50%)',
      description: 'Remaining 50% balance upon completed internal QA and client review approval.',
      amountPaise: 2500000,
      percentage: 50,
      status: MilestoneStatus.PAID,
    },
  });

  // Payments
  await prisma.payment.create({
    data: {
      receiptNumber: 'REC-2026-0001',
      projectId: sampleProject.id,
      milestoneId: upfrontMilestone.id,
      amountPaise: 2500000,
      currency: 'INR',
      status: 'PAID',
      razorpayOrderId: 'order_test_upfront_001',
      razorpayPaymentId: 'pay_test_upfront_001',
      razorpaySignature: 'sig_test_verified_001',
      idempotencyKey: 'idem_upfront_001',
    },
  });

  await prisma.payment.create({
    data: {
      receiptNumber: 'REC-2026-0002',
      projectId: sampleProject.id,
      milestoneId: finalMilestone.id,
      amountPaise: 2500000,
      currency: 'INR',
      status: 'PAID',
      razorpayOrderId: 'order_test_final_002',
      razorpayPaymentId: 'pay_test_final_002',
      razorpaySignature: 'sig_test_verified_002',
      idempotencyKey: 'idem_final_002',
    },
  });

  // Deliverables (Unlocked)
  await prisma.deliverable.create({
    data: {
      projectId: sampleProject.id,
      title: 'Complete Source Code Repository Archive (.zip)',
      description: 'Full Next.js, PostgreSQL schema migrations, and documentation.',
      type: DeliverableType.SOURCE_CODE_ARCHIVE,
      accessLevel: DeliverableAccessLevel.SOURCE_AVAILABLE,
      fileName: 'skyline-analytics-portal-v1.0.0.zip',
      fileSizeBytes: 14200500,
      mimeType: 'application/zip',
    },
  });

  // Verified Review
  await prisma.review.create({
    data: {
      projectId: sampleProject.id,
      userId: demoCustomer.id,
      rating: 5,
      headline: 'Flawless engineering and crystal-clear milestone billing.',
      comment: 'Skyline delivered our custom reporting portal 2 days ahead of the target delivery date. The code was exceptionally clean, TypeScript types were rigorous, and the 50/50 payment model gave us complete confidence.',
      isPublished: true,
      isFeatured: true,
      adminReply: 'Thank you Alex! It was a pleasure building the analytics engine with you.',
    },
  });

  console.log('✅ Created Demo Completed Project, Milestones, Payments, Deliverables, and Review');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
