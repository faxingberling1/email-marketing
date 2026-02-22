# 🚀 Mission Control: Advanced Email Marketing & Automation

Mission Control is a high-performance, AI-integrated email marketing platform engineered for modern marketing operations. It combines a premium "Command Center" aesthetic with cutting-edge technologies to deliver strategic outreach with tactical precision.

![Aesthetic](https://img.shields.io/badge/Aesthetic-Glassmorphism%203.0-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-15%2B-black)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2d3748)
![AI](https://img.shields.io/badge/AI-Gemini%20Flash-green)

---

## 🏛️ Architecture & Directory Structure

The project follows a modern Next.js 15+ App Router architecture, optimized for scalability and visual performance.

```text
email-marketing/
├── prisma/               # Database schema and migrations
├── public/               # Static assets & brand resources
├── src/
│   ├── app/              # Next.js App Router (Pages & API Routes)
│   │   ├── (dashboard)/  # Main dashboard interface
│   │   ├── admin/        # System administration console
│   │   ├── api/          # Backend service endpoints
│   │   └── auth/         # Authentication flows
│   ├── components/       # Visual HUD & tactical components
│   ├── lib/              # Core utilities, AI logic, & database clients
│   └── scripts/          # Automation and maintenance scripts
├── .env.example          # Environment blueprint
└── package.json          # Dependency manifest
```

---

## 💎 Core Features & Capabilities

### 📡 Mission Dashboard
Real-time command center providing a high-level overview of workspace health, campaign performance, and AI resource consumption.
- **HUD Metrics**: Tactical display of engagement scores and conversion rates.
- **Activity Feed**: Live audit logs of all mission-critical actions.

### 🛰️ Campaign Command
Comprehensive suite for building and deploying high-impact email campaigns.
- **Neural Editor**: Advanced subject line and content generation powered by Gemini Flash AI.
- **Tactical Scheduling**: Precision timing for mission deployment.
- **A/B Synthesis**: Intelligence-driven testing for optimal performance.

### ⛓️ Automation Workflows
Strategic automation builder for complex customer journeys.
- **Step Intelligence**: AI-assisted path optimization.
- **Trigger Matrix**: Multi-event triggers for precise engagement.

### 👥 Contact Matrix
High-fidelity contact management with deep segmentation.
- **Engagement Clusters**: Automated grouping based on interaction history.
- **Business Intelligence**: Deep-dive profile metrics for every contact.

---

## 🗄️ Data Model (Schema)

The platform utilizes a robust PostgreSQL schema managed via Prisma ORM.

- **`User`**: Core identity management, role-based access control, and personal AI preferences.
- **`Workspace`**: Multi-tenant container for all marketing assets, usage limits, and health status.
- **`Contact`**: Centralized intelligence on outreach targets, including engagement scores.
- **`Campaign`**: The primary operational unit for outgoing communications.
- **`Email`**: Individual execution logs for every outreach attempt, including tracking metrics (Open/Click).
- **`Sequence`**: Automation building blocks for multi-step missions.
- **`AiUsageLog`**: Detailed tracking of AI credit consumption and token efficiency.

---

## 🛠️ Technical Stack & Integrations

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Experimental features enabled)
- **Visuals**: Framer Motion, Lucide React, Recharts (Tactical visualization)
- **Database**: [Supabase](https://supabase.com/) & [Prisma](https://www.prisma.io/)
- **AI Core**: [Google Gemini Flash AI](https://deepmind.google/technologies/gemini/)
- **Infrastructure**: [Stripe](https://stripe.com/) (Billing), [SendGrid](https://sendgrid.com/) (SMTP Relay)

---

## 🚀 Deployment & Operations

### Deployment Requirements
1. **Database**: PostgreSQL (Supabase recommended).
2. **AI**: Google Cloud project with Generative AI API enabled.
3. **Email**: Verified SendGrid sender identity.
4. **Billing**: Stripe account with active webhook endpoint.

### Installation

1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment Synchronization**:
   Copy `.env.example` to `.env` and populate mission-critical variables.
3. **Database Injection**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. **Initiate Dev Mode**:
   ```bash
   npm run dev
   ```

## 🔐 Environment Reference

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Security hash for session management |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Access key for Gemini AI operations |
| `STRIPE_SECRET_KEY` | Backend billing integration |
| `SENDGRID_API_KEY` | Secure relay for outgoing missions |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend database connectivity |

---

## 🎨 Design Philosophy: Glassmorphism 3.0

Mission Control is built on **Glassmorphism 3.0** principles:
- **Translucency**: Multi-layered backdrop filters for depth perception.
- **Vibrant Mesh Gradients**: Dynamic atmospheric backgrounds.
- **Interactive HUD**: Micro-animations and glow effects for tactile feedback.

---

Built with <3 by the Arsalan Abbas.
