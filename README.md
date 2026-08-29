# Skyline — Digital Services Platform

> **"You have the idea. We build the technology."**

Skyline is a digital services platform engineered for custom software development, websites, web applications, bots, AI systems, and cloud infrastructure. It operates on a transparent **50% upfront deposit / 50% final delivery milestone model**.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: `v20+` (Tested on Node.js `v24`)
- **Docker & Docker Compose** (Optional for local PostgreSQL and Redis)

### 2. Environment Setup
Copy the `.env.example` template:
```bash
cp .env.example .env
```

### 3. Start Database & Redis (Docker)
```bash
npm run docker:up
```

### 4. Database Setup & Seeding
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start Development Servers
```bash
# Start Client Website & Portal (Port 3000)
npm run dev:web

# Start Admin Operations Panel (Port 3001)
npm run dev:admin

# Start Discord Operations Bot
npm run dev:bot
```

---

## 🧪 Testing & Verification

Run the comprehensive unit test suite:
```bash
npm test
```

Run monorepo-wide type checking:
```bash
npm run typecheck
```

---

## 📁 Repository Layout

| Directory | Package / App | Purpose |
| :--- | :--- | :--- |
| `apps/web` | `@skyline/web` | Public marketing site, project intake flow, client portal |
| `apps/admin` | `@skyline/admin` | Agency operations console, quote builder, project control |
| `apps/discord-bot` | `@skyline/discord-bot` | Discord slash commands (`/status`, `/requests`, `/active`) |
| `apps/worker` | `@skyline/worker` | BullMQ background jobs for SLA monitoring & quote expiration |
| `packages/database` | `@skyline/database` | Prisma schema, PostgreSQL client singleton, seed dataset |
| `packages/types` | `@skyline/types` | Domain TypeScript models & state machine enums |
| `packages/validation` | `@skyline/validation` | Zod runtime input validation schemas |
| `packages/config` | `@skyline/config` | Business rules, SLA defaults, brand tokens |
| `packages/auth` | `@skyline/auth` | Cryptographic PBKDF2 hashing, session store, RBAC guards |
| `packages/payments` | `@skyline/payments` | Razorpay Orders API, HMAC SHA-256 verification, 50/50 balance calculators |
| `packages/notifications`| `@skyline/notifications` | Ops Bot Discord webhook alerts & email dispatcher |
| `packages/storage` | `@skyline/storage` | File storage provider with deliverable access gating |
| `packages/shared` | `@skyline/shared` | Currency formatters (Paise → ₹), date formatters, status maps |
| `packages/logging` | `@skyline/logging` | Structured audit logging |

---

## 🔒 Security & Quality Standards
- **Paise Monetary Precision:** All money fields use integer `*Paise` (`startingPricePaise`, `totalPricePaise`, etc.) to prevent floating-point rounding errors.
- **Quote Freezing:** Quotes are immutable once sent or accepted. Subsequent adjustments use versioning or formal Change Requests.
- **Timing-Safe Payments:** Razorpay signature verification uses `crypto.timingSafeEqual` to prevent timing attacks.
- **Deliverable Gating:** Source archives remain locked until 100% final balance is verified.

---

## 📜 License
Proprietary © Skyline Digital Services. All rights reserved.
