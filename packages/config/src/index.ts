export const BRAND_CONFIG = {
  name: 'Skyline',
  tagline: 'You have the idea. We build the technology.',
  description: 'Skyline builds websites, applications, bots, AI systems, automation, and custom software for people and businesses that need technology built around their needs.',
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
  'Gaming / Minecraft',
  'Infrastructure / DevOps',
  'Custom Software',
  'Other',
] as const;
