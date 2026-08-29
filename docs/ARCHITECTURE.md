# Skyline Platform Architecture

## Overview
Skyline is a production-grade digital services agency platform operating on an upfront 50% / final 50% milestone billing model. It is designed to scale from a single-operator agency into a full-scale multi-creator marketplace.

## Monorepo Structure

```
skyline/
├── apps/
│   ├── web/           # Next.js 15 (Port 3000): Marketing site, Intake flow, Client Portal
│   ├── admin/         # Next.js 15 (Port 3001): Operations Command, Triage, Quote Builder, Control Center
│   ├── discord-bot/   # Node.js + Discord.js v14: Operational alerts & project slash commands
│   └── worker/        # Node.js + BullMQ: Scheduled SLA deadline checks & quote expiration crons
├── packages/
│   ├── types/         # Domain TypeScript models, enums (ProjectStatus, ChangeRequestStatus, etc.)
│   ├── config/        # Centralized business rules, SLA defaults, brand tokens
│   ├── validation/    # Zod schemas for forms, quotes, and payment verification
│   ├── database/      # Prisma ORM schema (PostgreSQL), migrations, client singleton, and seeds
│   ├── auth/          # PBKDF2 cryptography, session management, RBAC guards
│   ├── payments/      # Razorpay Orders API, HMAC SHA-256 verification, 50/50 balance calculators
│   ├── notifications/ # Discord rich embeds & multi-channel notification dispatcher
│   ├── storage/       # S3 / R2 / Local filesystem storage provider with IDOR access gating
│   ├── shared/        # Currency formatters (Paise -> INR), date helpers, status maps
│   └── logging/       # Structured logger & audit trail recorder
└── infrastructure/
    └── docker-compose.yml # PostgreSQL 16 (Port 5432) & Redis 7 (Port 6379)
```

## Monetary Precision & Paise Unit Standard
All currency fields throughout the entire database, API, and TypeScript interfaces are represented as integers in **paise** (`startingPricePaise`, `totalPricePaise`, `upfrontAmountPaise`, `remainingAmountPaise`, `additionalPricePaise`):
- `100 paise = 1 INR (₹1)`
- `1,000,000 paise = ₹10,000`
- Calculations use `Math.round()` to eliminate floating-point rounding errors.

## The 4-Stage Project Lifecycle
1. **Intake (`REQUESTED`):** Client submits project brief. No payment required.
2. **Quotation & Freeze (`QUOTED` -> `SENT` -> `ACCEPTED`):** Admin creates itemized quote. Sent quote is immutable. Accepting freezes the quote and creates the project in `AWAITING_UPFRONT_PAYMENT`.
3. **50% Deposit & Development (`UPFRONT_PAID` -> `IN_PROGRESS` -> `INTERNAL_QA` -> `CUSTOMER_REVIEW`):** Client pays 50% via Razorpay. Admin develops the system and delivers staging preview.
4. **Final 50% & Deliverables Delivery (`FINAL_PAYMENT_RECEIVED` -> `DELIVERED` -> `COMPLETED`):** Client approves preview, pays remaining balance (calculated dynamically including paid Change Requests), unlocking source code archives and production deliverables.

## Change Request vs Revision Policy
- **Revision:** Free adjustments within agreed scope (default 2 included).
- **Change Request:** Out-of-scope functional expansion with 7-state lifecycle:
  `CR_CREATED` → `CUSTOMER_APPROVED` → `PAYMENT_REQUIRED` → `PAYMENT_VERIFIED` → `APPLIED` (updates total price & deadline).
