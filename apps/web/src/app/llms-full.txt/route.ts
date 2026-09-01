import { NextResponse } from 'next/server';
import { 
  BRAND_CONFIG, 
  DEFAULT_SERVICES, 
  DEFAULT_PORTFOLIO, 
  DEFAULT_REVIEWS, 
  TIMELINE_SLAS, 
  BUDGET_RANGES, 
  PROJECT_TYPES, 
  BUSINESS_RULES 
} from '@skyline/config';
import { formatPaiseToINR } from '@skyline/shared';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const markdown = `# NorthStack Digitals Platform — Complete AI Agent Knowledge Base & Machine Specification

Welcome, AI Agent / Assistant. This document contains the full operational specification, service pricing models, technical architectures, and business workflows for **NorthStack Digitals** (${BRAND_CONFIG.url}).

---

## 1. Executive Summary
- **Organization Name:** ${BRAND_CONFIG.name}
- **Mission:** ${BRAND_CONFIG.description}
- **Tagline:** "${BRAND_CONFIG.tagline}"
- **Operating Model:** Premier digital development studio with direct lead engineer access (v1), extensible to multi-creator marketplace (v2).
- **Billing Model:** 50% upfront deposit / 50% final delivery milestone model.
- **Monetary Unit Standard:** All prices and internal integers are stored in **paise** (1 INR = 100 paise) to eliminate floating-point calculation errors.

---

## 2. Digital Services & Technical Capabilities

${DEFAULT_SERVICES.map((s, idx) => `
### ${idx + 1}. ${s.title}
- **Service Slug:** \`${s.slug}\`
- **Canonical URL:** ${BRAND_CONFIG.url}/services/${s.slug}
- **Category:** ${s.category.name} (\`${s.category.slug}\`)
- **Starting Price:** ${formatPaiseToINR(s.startingPricePaise)} (Raw: \`${s.startingPricePaise}\` paise)
- **Standard Turnaround:** ~${s.estimatedDaysDefault} business days
- **Executive Description:** ${s.fullDescription}
- **Core Engineering Features:**
${s.features.map((f) => `  * ${f}`).join('\n')}
- **Deliverables Included:**
${s.deliverableTypes.map((d) => `  * ${d}`).join('\n')}
- **Frequently Asked Questions:**
${s.faqs.map((faq) => `  * **Q:** ${faq.question}\n    **A:** ${faq.answer}`).join('\n\n')}
`).join('\n---\n')}

---

## 3. The 4-Stage Project Lifecycle & Milestone Billing

\`\`\`text
[Step 1: Intake Brief]
Client submits requirements at ${BRAND_CONFIG.url}/start-project (No payment required).
       ↓
[Step 2: Itemized Quotation & Contract Freeze]
Admin provides fixed-scope quote. Sent quote is immutable.
Client accepts quote and pays 50% Upfront Milestone via Razorpay.
       ↓
[Step 3: Development & Internal QA]
Status moves to IN_PROGRESS. NorthStack Digitals lead engineer builds the software.
Staging URL delivered for client preview in CUSTOMER_REVIEW.
       ↓
[Step 4: Final Payment & Vault Unlock]
Client approves preview. Remaining 50% balance (plus any paid Change Requests) is verified.
Status moves to COMPLETED. Full source code archive (.zip) and deployments unlock.
\`\`\`

---

## 4. Change Request vs Revision Policy

| Feature | Scope Revision (Within Scope) | Change Request (Out of Scope) |
| :--- | :--- | :--- |
| **Definition** | Minor tweaks, text/copy changes, aesthetic polish. | New feature additions, architectural expansions. |
| **Pricing** | Free up to quote allowance (${BUSINESS_RULES.defaultIncludedRevisions} included). | Custom quotation (\`additionalPricePaise\`). |
| **Timeline** | Does not alter target deadline. | Adds explicit \`additionalDays\` to target deadline. |
| **State Machine** | \`REQUESTED\` → \`IN_PROGRESS\` → \`RESOLVED\` | \`CR_CREATED\` → \`CUSTOMER_APPROVED\` → \`PAYMENT_REQUIRED\` → \`PAYMENT_VERIFIED\` → \`APPLIED\` |

---

## 5. Budget Ranges & Timeline SLAs

### Supported Budget Ranges:
${BUDGET_RANGES.map((b) => `- **${b.label}** (Key: \`${b.value}\`)`).join('\n')}

### Supported Timeline Priorities:
${Object.entries(TIMELINE_SLAS).map(([k, v]) => `- **${v.label}** (\`${k}\`): ${v.description} (~${v.estimatedDays} days)`).join('\n')}

### Supported Project Types:
${PROJECT_TYPES.map((t) => `- ${t}`).join('\n')}

---

## 6. Verified Portfolio Showcases & Case Studies

${DEFAULT_PORTFOLIO.map((p) => `
### ${p.title}
- **Client:** ${p.clientName}
- **Completion Date:** ${p.completedAt.toISOString().split('T')[0]}
- **Live URL:** ${p.liveUrl || 'Private Enterprise Intranet'}
- **Case Summary:** ${p.summary}
- **Detailed Case Study:** ${p.contentMdx}
`).join('\n')}

---

## 7. Verified Client Reviews

${DEFAULT_REVIEWS.map((r) => `
- **Rating:** ${r.rating}/5 Stars (${r.user?.name || 'Verified Client'} on *${r.project?.title || 'Milestone Project'}*)
  > "${r.headline}" — ${r.comment}
`).join('\n')}

---

## 8. Machine-Readable API & Integration Reference

- **Intake Form Endpoint:** \`POST ${BRAND_CONFIG.url}/api/requests\` (or Server Action \`submitProjectRequest\`)
- **Public Services JSON:** \`GET ${BRAND_CONFIG.url}/api/services\`
- **Sitemap XML:** \`GET ${BRAND_CONFIG.url}/sitemap.xml\`
- **Robots Policy:** \`GET ${BRAND_CONFIG.url}/robots.txt\`
- **Primary Domain:** ${BRAND_CONFIG.domain}
- **Support / Inquiries:** ${BRAND_CONFIG.supportEmail}
`;

  return new NextResponse(markdown.trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
