import { NextResponse } from 'next/server';
import { BRAND_CONFIG, DEFAULT_SERVICES, DEFAULT_PORTFOLIO, DEFAULT_REVIEWS, TIMELINE_SLAS, BUDGET_RANGES, BUSINESS_RULES } from '@skyline/config';
import { formatPaiseToINR } from '@skyline/shared';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

export async function GET() {
  const markdown = `# NorthStack Digitals — Custom Digital Development & Engineering
> ${BRAND_CONFIG.tagline}

NorthStack Digitals is a premier digital engineering studio that builds bespoke software, websites, web applications, mobile apps, bots, AI systems, automation, Minecraft mods, and backend infrastructure.

## Operating Model & Guarantees
- **50/50 Milestone Model:** 50% upfront deposit activates development architecture. Remaining 50% balance is due only upon customer review and approval of the staging preview.
- **Dynamic Balance Calculation:** Final payment accounts for base quote plus any customer-approved paid Change Requests.
- **Transparent Target SLAs:** Clear estimated delivery dates with auditable deadline histories.
- **Source Code Ownership:** Full intellectual property and Git repository transfer upon final milestone payment.
- **Included Revisions:** ${BUSINESS_RULES.defaultIncludedRevisions} free revisions per project within agreed scope.

## Core Digital Services
${DEFAULT_SERVICES.map((s) => `
### [${s.title}](${BRAND_CONFIG.url}/services/${s.slug})
- **Category:** ${s.category.name}
- **Starting Price:** ${formatPaiseToINR(s.startingPricePaise)} (${s.startingPricePaise} paise)
- **Target SLA:** ~${s.estimatedDaysDefault} business days
- **Summary:** ${s.shortDescription}
- **Key Features:** ${s.features.join(', ')}
- **Included Deliverables:** ${s.deliverableTypes.join(', ')}
`).join('')}

## Project Intake & Quoting Flow
1. **Intake Request:** Client visits [${BRAND_CONFIG.url}/start-project](${BRAND_CONFIG.url}/start-project) and specifies project type, goals, desired feature list, budget range, and timeline SLA.
2. **Itemized Quote:** Lead engineer reviews requirements within 24 hours and issues a frozen, versioned quote with deliverables, scope, exclusions, and target delivery date.
3. **50% Deposit:** Client reviews and accepts quote, paying 50% via secure Razorpay checkout to start building.
4. **Development & Preview:** NorthStack Digitals builds the software and delivers a live preview link for internal QA & customer review.
5. **Final 50% & Vault Unlock:** Client approves the build, completes the remaining 50% balance, and unlocks the source code archive and production deployment.

## Verified Portfolio Case Studies
${DEFAULT_PORTFOLIO.map((p) => `
- **${p.title}** (${p.clientName}): ${p.summary} (Completed: ${p.completedAt.toISOString().split('T')[0]})
`).join('')}

## Contact & AI Discovery
- **Website:** ${BRAND_CONFIG.url}
- **Start Project:** ${BRAND_CONFIG.url}/start-project
- **Full LLM Knowledge Base:** ${BRAND_CONFIG.url}/llms-full.txt
- **Support Email:** ${BRAND_CONFIG.supportEmail}
- **Discord Community:** ${BRAND_CONFIG.social.discord}
`;

  return new NextResponse(markdown.trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
