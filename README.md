# 🚀 MailMind — AI-Powered Email Marketing Platform

MailMind is a full-stack, multi-tenant email marketing SaaS platform built for modern marketing operations. It combines AI-driven content generation, real-time analytics, subscription billing, and a role-based admin control center into a single cohesive system.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/ORM-Prisma%205-2d3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss)
![AI](https://img.shields.io/badge/AI-Gemini%20Flash-4285F4?logo=google)
![Stripe](https://img.shields.io/badge/Billing-Stripe-635bff?logo=stripe)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

---

## 🏛️ Architecture Overview

MailMind is built on the **Next.js 16 App Router** with full TypeScript support, React 19 server components, and a PostgreSQL database managed via Prisma ORM. The system uses a multi-tenant workspace model where each user belongs to a workspace with its own subscription tier, usage limits, and members.

```
email-marketing/
├── prisma/
│   └── schema.prisma           # Full PostgreSQL data model
├── src/
│   ├── app/
│   │   ├── page.tsx            # Public landing page
│   │   ├── (dashboard)/        # Authenticated app shell (layout + sidebar)
│   │   │   ├── dashboard/      # Main metrics overview
│   │   │   ├── campaigns/      # Campaign builder & management
│   │   │   ├── contacts/       # Contact list & import
│   │   │   ├── automation/     # Workflow & sequence builder
│   │   │   ├── analytics/      # Engagement analytics & charts
│   │   │   ├── templates/      # Email template library
│   │   │   ├── ai-assistant/   # AI content generation UI
│   │   │   ├── billing/        # Subscription & plan management
│   │   │   ├── settings/       # User & workspace settings
│   │   │   └── help/           # In-app help center
│   │   ├── admin/              # Super-admin control panel
│   │   │   ├── page.tsx        # Admin HQ overview
│   │   │   ├── users/          # User management
│   │   │   ├── workspaces/     # Workspace oversight
│   │   │   ├── subscriptions/  # Subscription management
│   │   │   ├── ai-usage/       # AI token consumption tracking
│   │   │   ├── audit-logs/     # Full audit trail viewer
│   │   │   ├── analytics/      # Platform-wide analytics
│   │   │   ├── settings/       # System settings (AI model, maintenance)
│   │   │   ├── cms/            # Content management
│   │   │   ├── enterprise/     # Enterprise account management
│   │   │   └── abuse/          # Abuse & spam detection
│   │   ├── api/
│   │   │   ├── ai/generate/    # AI content generation endpoint
│   │   │   ├── billing/
│   │   │   │   └── checkout/   # Stripe checkout session creation
│   │   │   ├── contacts/import/# CSV contact import
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/     # Stripe billing event handler
│   │   │   │   └── sendgrid/   # SendGrid delivery event handler
│   │   │   ├── admin/
│   │   │   │   ├── overview/   # Platform stats aggregation
│   │   │   │   ├── users/      # Admin user CRUD
│   │   │   │   ├── workspaces/ # Admin workspace CRUD
│   │   │   │   ├── models/     # AI model switcher
│   │   │   │   ├── settings/   # System setting updates
│   │   │   │   ├── audit-logs/ # Audit log queries
│   │   │   │   ├── ai-usage/   # AI usage queries
│   │   │   │   ├── subscriptions/ # Subscription queries
│   │   │   │   ├── impersonate/   # Admin impersonation
│   │   │   │   └── abuse/      # Abuse management
│   │   │   ├── auth/           # NextAuth.js auth routes
│   │   │   ├── seed-admin/     # One-time admin seed endpoint
│   │   │   └── debug-user/     # Development debug helper
│   │   ├── auth/               # Login / signup / forgot-password pages
│   │   ├── onboarding/         # New user onboarding flow
│   │   ├── blog/               # Public marketing blog
│   │   ├── docs/               # Public API documentation
│   │   ├── demo/               # Live demo page
│   │   ├── case-studies/       # Customer case studies
│   │   ├── contact-sales/      # Enterprise sales contact form
│   │   ├── security/           # Security policy page
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms of service
│   │   ├── support/            # Support portal
│   │   └── unsubscribe/        # Email unsubscribe handler
│   ├── components/             # Shared UI components (Radix UI based)
│   ├── lib/
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── gemini.ts           # Google Gemini AI (lazy-initialized)
│   │   ├── openai.ts           # OpenAI client (lazy-initialized)
│   │   ├── stripe.ts           # Stripe client (lazy-initialized)
│   │   ├── resend.ts           # Resend email client (lazy-initialized)
│   │   ├── tiers.ts            # Subscription tier limits & config
│   │   ├── pricing.ts          # Stripe price IDs per plan
│   │   ├── audit.ts            # Admin audit logging utilities
│   │   ├── admin-guard.ts      # Super-admin route protection
│   │   ├── workspace-guard.ts  # Workspace access enforcement
│   │   ├── rate-limit.ts       # Request rate limiting
│   │   ├── impersonation.ts    # Admin impersonation token handling
│   │   ├── cache.ts            # Response caching helpers
│   │   ├── supabase.ts         # Supabase client (legacy)
│   │   ├── utils.ts            # Shared utility functions
│   │   └── demo-seeder.ts      # Demo data seeding logic
│   ├── auth.ts                 # NextAuth.js v5 config (providers, callbacks)
│   ├── auth.config.ts          # Auth edge-safe configuration
│   └── middleware.ts           # Route protection middleware
├── .env.example                # Environment variable blueprint
├── vercel.json                 # Vercel deployment config
└── package.json
```

---

## 🚦 Implementation Status

The platform is **100% feature-complete** based on the initial technical roadmap. It is ready for production deployment and live customers.

### ✅ What's Done (Fully Implemented)
- **Core SaaS Infrastructure**: Next.js App Router, Prisma ORM, and PostgreSQL.
- **Authentication & Multi-Tenancy**: NextAuth.js credentials/OAuth, workspace assignment, and role-based access.
- **Onboarding Flow**: Step-by-step onboarding, ending with a live domain connection to the Resend API.
- **Campaigns & Automation**: Fully working broadcast and automation workflows, with real DB-backed analytics (open/click rates).
- **Segmentation**: Tag-based contact segmentation filtering for campaigns.
- **AI Content Generation**: Deeply integrated Gemini Flash engine for generating subject lines and email body content.
- **Billing & Subscriptions**: Real Stripe Checkout integration for purchasing AI/Email add-ons, complete with a secure webhook fulfillment callback.
- **Security**: Robust `changePassword` functionality with `bcryptjs` encryption.
- **Admin Command Center**: Real-time overview metrics (MRR, AI usage, Health stats), user management (suspend, promote, demote), and full audit trails.

### 🚧 What's Left (Future Enhancements)
While the core system is complete and "plug and play," future roadmap items could include:
- **A/B Testing Module**: Interface for multivariate subject line testing.
- **Advanced Workflows**: Visual drag-and-drop builder for automation nodes.
- **Webhooks Integration**: Allow users to trigger campaigns via external incoming webhooks.
- **Custom Templates**: Expanding the email template library and adding a drag-and-drop HTML builder.

---

## 💎 Core Features

### 📊 Dashboard
- Real-time metrics: total contacts, campaigns sent, open rates, AI credits remaining
- Activity feed with live audit log of all user actions
- Quick-access shortcuts to all major modules

### 📧 Campaign Command Center
- Create **broadcast** and **automation** campaign types
- AI-powered subject line and email body generation via **Google Gemini Flash**
- Campaign scheduling with precision timing
- Draft → Active → Completed status lifecycle
- Per-campaign email tracking (sent, opened, clicked)

### 🤖 AI Assistant
- Dedicated UI for generating email content using Gemini Flash
- Dynamically configurable AI model via the Admin settings panel (no redeploy needed)
- AI usage tracked per workspace with token and cost estimates logged to `AiUsageLog`
- User-level AI preferences: default language, tone, engagement threshold, auto-optimize

### ⛓️ Automation & Sequences
- Multi-step email sequence builder linked to campaigns
- Trigger events: `delay`, `opened`, `clicked`
- Configurable delay time per step (in minutes)
- Step-level AI content generation

### 👥 Contact Management
- Full contact CRUD with engagement scoring
- Tags, business name, phone fields
- CSV bulk import via `/api/contacts/import`
- Unsubscribe management with `subscribed` flag and `unsubscribedAt` timestamp
- Per-contact email history

### 📈 Analytics
- Campaign-level open rate and click-through rate charts powered by **Recharts**
- Workspace-level usage metrics (emails sent, AI credits used)
- Platform-wide analytics for admins

### 💳 Billing & Subscriptions
- **Stripe Checkout** integration for plan upgrades
- **Stripe Webhook** handler for subscription lifecycle events (created, updated, canceled, past_due)
- Five subscription tiers with enforced limits (see Pricing Tiers below)
- Stripe Customer Portal link for self-serve billing management
- Billing audit trail (`BILLING_CHECKOUT_STARTED`, `BILLING_PORTAL_STARTED`, `BILLING_ADDON_PURCHASED`)

### 📨 Email Delivery
- Transactional and campaign emails sent via **Resend**
- CAN-SPAM compliant footers with unsubscribe links auto-appended
- Verified domain management per workspace (DKIM records stored in `VerifiedDomain`)
- **SendGrid webhook** handler for delivery event tracking (legacy/supplemental)

### 🔐 Authentication
- **NextAuth.js v5** (Auth.js) with:
  - Email/password credentials (bcrypt hashed)
  - Google OAuth provider
- Session-based auth with Prisma adapter
- Forgot password flow
- Onboarding flow for new users

### 🏢 Multi-Tenant Workspaces
- Each user belongs to a **Workspace** with its own subscription, usage counters, and health status
- Workspace roles: `owner`, `admin`, `marketer`, `viewer`
- Workspace health states: `healthy`, `warning`, `restricted`, `suspended`
- Soft-delete support (`deleted_at`)

---

## 🛡️ Super-Admin Control Panel (`/admin`)

A dedicated, role-guarded (`super_admin` global role) command center for platform administration.

| Section | Capabilities |
|---|---|
| **HQ Overview** | Platform-wide user count, workspace count, revenue metrics, AI throughput |
| **User Management** | View, suspend, reactivate, promote/demote users to super_admin |
| **Workspace Management** | View all workspaces, change plans, add credits, suspend/reactivate, soft-delete |
| **Subscriptions** | Monitor active/trialing/canceled subscriptions across all workspaces |
| **AI Usage** | Per-workspace token consumption, model used, cost estimates |
| **Audit Logs** | Full searchable audit trail with actor, IP, User-Agent, and impersonation context |
| **System Settings** | Runtime key-value store (e.g. `active_ai_model`, maintenance mode flags) |
| **AI Model Switcher** | Switch the active Gemini model at runtime without redeployment |
| **Admin Impersonation** | Admins can impersonate any workspace for debugging (JWT-based impersonation token) |
| **Abuse Management** | Flag and manage abusive accounts |
| **Analytics** | Platform-wide engagement and usage analytics |
| **CMS** | Manage blog posts, case studies, and marketing content |
| **Enterprise** | Dedicated enterprise account management |

---

## 🗄️ Data Model

Full PostgreSQL schema managed via **Prisma ORM v5**.

| Model | Purpose |
|---|---|
| `User` | Core identity, global role (`user`/`super_admin`), AI preferences, Stripe customer ID |
| `Account` | OAuth provider accounts (NextAuth adapter) |
| `Session` | Active user sessions (NextAuth adapter) |
| `VerificationToken` | Email verification tokens |
| `Workspace` | Multi-tenant container: plan, status, AI credits, email limits, health |
| `WorkspaceMember` | Junction table for workspace membership with roles |
| `Contact` | Marketing targets with engagement score, tags, subscription status |
| `Campaign` | Email campaigns with type (`BROADCAST`/`AUTOMATION`), status, schedule |
| `Email` | Individual email send records with open/click tracking |
| `Sequence` | Automation sequence steps with trigger events and delays |
| `AiUsageLog` | Per-workspace AI token usage and cost tracking |
| `AuditLog` | Admin action audit trail with actor, target, IP, UA, impersonation context |
| `SystemSetting` | Runtime key-value configuration store |
| `VerifiedDomain` | Custom sending domains with DKIM records via Resend |

### Enums
- `GlobalRole`: `user`, `super_admin`
- `WorkspaceRole`: `owner`, `admin`, `marketer`, `viewer`
- `WorkspaceHealthStatus`: `healthy`, `warning`, `restricted`, `suspended`
- `SubscriptionStatus`: `active`, `trialing`, `past_due`, `canceled`, `unpaid`
- `CampaignType`: `BROADCAST`, `AUTOMATION`

---

## 💰 Pricing Tiers

Defined in [`src/lib/tiers.ts`](src/lib/tiers.ts):

| Tier | Contacts | Emails/Month | AI Credits/Month | Automation Workflows | A/B Testing | API Access |
|---|---|---|---|---|---|---|
| **Free** | 100 | 500 | 50 | 0 | ❌ | ❌ |
| **Starter** ($29) | 1,000 | 10,000 | 300 | 1 | ❌ | ❌ |
| **Growth** ($79) | 10,000 | 75,000 | 2,000 | 10 | ✅ | ❌ |
| **Pro** ($149) | 25,000 | 200,000 | 6,000 | Unlimited | ✅ | ✅ |
| **Enterprise** | 1,000,000 | 10,000,000 | 100,000 | Unlimited | ✅ | ✅ |

---

## 🛠️ Technical Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.1.6 (App Router, Server Components, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, Framer Motion, Radix UI, Lucide React |
| **Charts** | Recharts 3 |
| **Database** | PostgreSQL (Neon recommended) |
| **ORM** | Prisma 5 |
| **Auth** | NextAuth.js v5 (Auth.js) — Credentials + Google OAuth |
| **AI (Primary)** | Google Gemini Flash (`@google/generative-ai`) |
| **AI (Secondary)** | OpenAI GPT-4 (`openai`) |
| **Email Delivery** | Resend |
| **Billing** | Stripe (Checkout + Webhooks + Customer Portal) |
| **Toasts** | Sonner |
| **CSV Parsing** | PapaParse |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended for Vercel serverless)
- Accounts for: Google Cloud (AI + OAuth), Stripe, Resend

### 1. Clone & Install

```bash
git clone https://github.com/faxingberling1/email-marketing
cd email-marketing
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Populate all required variables (see [Environment Reference](#-environment-reference) below).

### 3. Set Up Database

```bash
npx prisma db push       # Apply schema to your database
npx prisma generate      # Generate Prisma client
```

### 4. Seed Super-Admin

After starting the server, call the seed endpoint once:

```bash
curl -X POST http://localhost:3000/api/seed-admin
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Environment Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (pooled, for Prisma) |
| `DIRECT_URL` | ✅ | PostgreSQL direct connection string (for migrations) |
| `AUTH_SECRET` | ✅ | NextAuth.js secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Full public URL of the app (e.g. `https://yourdomain.com`) |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Google AI Studio API key for Gemini |
| `OPENAI_API_KEY` | ⚠️ | OpenAI API key (optional secondary AI) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_PRICE_STARTER` | ✅ | Stripe Price ID for the Starter plan |
| `STRIPE_PRICE_GROWTH` | ✅ | Stripe Price ID for the Growth plan |
| `STRIPE_PRICE_PRO` | ✅ | Stripe Price ID for the Pro plan |
| `RESEND_API_KEY` | ✅ | Resend API key (`re_...`) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public-facing app URL (used in email links) |

> **Vercel Deployment**: All variables above must be added under **Project → Settings → Environment Variables** in the Vercel dashboard.

---

## 🌐 Deployment (Vercel)

The project includes a [`vercel.json`](vercel.json) configuration. The build command runs:

```bash
npx prisma generate && npm run build
```

**Important notes:**
- All SDK clients (Stripe, Resend, OpenAI, Gemini) use **lazy initialization** — they are instantiated at request time, not at module load, to prevent build-time crashes when env vars are not available during static page generation.
- Set all environment variables in Vercel before deploying.
- Stripe webhooks must be registered pointing to `https://yourdomain.com/api/webhooks/stripe`.

---

## 🔑 Admin Access

To grant super-admin access:

1. Sign up for an account normally.
2. Use the Prisma Studio or a direct DB query to set `global_role = 'super_admin'` on your user record.
3. Access the admin panel at `/admin`.

Alternatively, use the `/api/seed-admin` endpoint (development only).

---

## 📁 Key Library Files

| File | Purpose |
|---|---|
| [`src/lib/gemini.ts`](src/lib/gemini.ts) | Lazy Gemini client; `getDynamicModel()` reads active model from `SystemSetting` |
| [`src/lib/stripe.ts`](src/lib/stripe.ts) | Lazy Stripe client via `getStripe()` |
| [`src/lib/resend.ts`](src/lib/resend.ts) | Lazy Resend client + `sendEmail()` with CAN-SPAM footer |
| [`src/lib/openai.ts`](src/lib/openai.ts) | Lazy OpenAI client via `getOpenAI()` |
| [`src/lib/tiers.ts`](src/lib/tiers.ts) | Tier limits config + `getTierLimits()` utility |
| [`src/lib/audit.ts`](src/lib/audit.ts) | `createAuditLog()` and `logAdminAction()` with IP/UA/impersonation context |
| [`src/lib/admin-guard.ts`](src/lib/admin-guard.ts) | Enforces `super_admin` role on admin API routes |
| [`src/lib/workspace-guard.ts`](src/lib/workspace-guard.ts) | Enforces workspace membership and tier limits |
| [`src/lib/rate-limit.ts`](src/lib/rate-limit.ts) | Per-endpoint rate limiting |
| [`src/lib/impersonation.ts`](src/lib/impersonation.ts) | JWT-signed impersonation tokens for admin debugging |
| [`src/auth.ts`](src/auth.ts) | NextAuth.js v5 configuration (providers, session, callbacks) |
| [`src/middleware.ts`](src/middleware.ts) | Edge middleware for route protection |

---

## 🎨 Design System

- **Aesthetic**: Glassmorphism with dark mode, backdrop-blur layers, mesh gradients
- **Typography**: Inter / system fonts via Tailwind
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Components**: Radix UI primitives (Dialog, Dropdown, Tabs, Toast, Select, Switch, Progress)
- **Icons**: Lucide React
- **Toast notifications**: Sonner

---

Built with ❤️ by Arsalan Abbas.
