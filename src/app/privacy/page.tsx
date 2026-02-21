"use client"

import { motion } from "framer-motion"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { Shield } from "lucide-react"

const sections = [
    {
        title: "1. Information We Collect",
        content: `We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:

**Account Information:** Name, email address, company name, billing information, and preferences.

**Campaign & Contact Data:** Email lists, campaign content, subscriber data, and engagement metrics you upload or generate while using MailMind.

**Usage Data:** Log files, IP addresses, browser type, device identifiers, pages accessed, and features used within our platform.

**Communications:** Records of support requests, chat transcripts, and feedback you submit.

We also collect certain data automatically through cookies and similar tracking technologies to improve your experience and analyze platform performance.`
    },
    {
        title: "2. How We Use Your Information",
        content: `MailMind uses your information to:

- Provide, maintain, and improve our email marketing platform and AI features
- Process transactions and send billing-related communications
- Deliver transactional notifications, product updates, and security alerts
- Generate aggregated, anonymized analytics to improve AI model performance
- Respond to support requests and ensure service quality
- Comply with applicable legal obligations and enforce our Terms of Service
- Send promotional communications (you may opt out at any time)

We do not sell, rent, or share your personal data or your subscribers' data with third parties for their marketing purposes.`
    },
    {
        title: "3. Legal Basis for Processing (GDPR)",
        content: `For users in the European Economic Area (EEA) and United Kingdom, our legal basis for processing personal data includes:

**Contractual Necessity:** Processing required to fulfill our contract with you (e.g., account management, service delivery).

**Legitimate Interest:** Analytics, fraud prevention, and product improvement where our interests don't override your rights.

**Legal Obligation:** Compliance with applicable laws including tax, financial reporting, and data protection regulations.

**Consent:** For non-essential cookies and marketing communications, where you have provided explicit consent that can be withdrawn at any time.`
    },
    {
        title: "4. Data Retention",
        content: `We retain your personal data for as long as your account is active or as needed to provide our services. Specifically:

- **Account data** is retained for the duration of your subscription plus 3 years for legal compliance
- **Campaign and contact data** is retained until you delete it or close your account
- **Usage logs** are retained for 12 months for security and debugging purposes
- **Billing records** are retained for 7 years as required by financial regulations

Upon account deletion, we purge your personal data within 30 days, except where retention is legally required. You may submit a Data Deletion Request at any time.`
    },
    {
        title: "5. Data Sharing & Sub-processors",
        content: `We share data only with trusted sub-processors required to operate our platform, all of whom are contractually bound to protect your data:

**Infrastructure:** Amazon Web Services (AWS) — hosting and data processing in the US-East and EU-West regions
**Email Delivery:** SendGrid — used to send transactional platform emails (not your campaigns)
**Payments:** Stripe — payment processing. MailMind never stores raw card data.
**Analytics:** Posthog — anonymized product analytics
**Customer Support:** Intercom — support communications

A complete and current list of sub-processors is available at mailmind.ai/sub-processors.`
    },
    {
        title: "6. Your Rights",
        content: `Depending on your jurisdiction, you have the following rights regarding your personal data:

- **Access:** Request a copy of the personal data we hold about you
- **Rectification:** Request correction of inaccurate or incomplete data
- **Erasure:** Request deletion of your data ("right to be forgotten")
- **Portability:** Receive your data in a machine-readable format
- **Restriction:** Request we limit how we process your data
- **Objection:** Object to processing based on legitimate interests
- **Withdrawal of Consent:** Withdraw consent for cookie or marketing data processing at any time

To exercise these rights, email privacy@mailmind.ai. We will respond to all verifiable requests within 30 days.`
    },
    {
        title: "7. Security",
        content: `We implement industry-standard technical and organisational measures to protect your data:

- AES-256 encryption for all data at rest
- TLS 1.3 encryption for all data in transit
- SOC 2 Type II certified infrastructure
- Role-based access controls and least-privilege principles
- Annual penetration testing by independent third parties
- 99.9% uptime SLA with multi-region redundancy

Despite these measures, no system is 100% secure. If you believe your account has been compromised, contact security@mailmind.ai immediately.`
    },
    {
        title: "8. Cookies",
        content: `We use cookies and similar technologies to enhance your experience. Categories include:

**Strictly Necessary:** Authentication session cookies required for the platform to function. Cannot be disabled.

**Analytics:** We use anonymized analytics to understand how users interact with our platform and improve features.

**Preferences:** Save your UI preferences such as theme and notification settings.

**Marketing:** Used to measure campaign effectiveness. Only deployed where you have provided consent.

You can manage cookie preferences through our Cookie Preference Centre, accessible from any page footer. Blocking certain cookies may affect platform functionality.`
    },
    {
        title: "9. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of material changes via:

- Email to the primary address on your account
- In-app notification on your next login
- Prominent notice on our website

Your continued use of MailMind after the effective date of any update constitutes acceptance of the revised policy. We will always maintain previous versions of this policy for your reference.`
    },
    {
        title: "10. Contact Us",
        content: `For privacy-related inquiries, data subject requests, or to reach our Data Protection Officer:

**Email:** privacy@mailmind.ai
**Data Protection Officer:** dpo@mailmind.ai
**EU Representative:** MailMind EU Ltd., Dublin, Ireland
**Postal:** MailMind Inc., 100 Mission Street, San Francisco, CA 94105, USA

For data removal requests, please use our dedicated Data Deletion Request form to ensure the fastest processing.`
    },
]

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-500/8 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
                        <Shield className="h-4 w-4" /> Privacy Policy
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl font-black outfit tracking-tighter text-white mb-6">
                        Your Privacy Matters
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium text-lg mb-4">
                        Effective date: February 1, 2026 · Last updated: February 18, 2026
                    </motion.p>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-slate-500 font-medium leading-relaxed">
                        This Privacy Policy describes how MailMind Inc. ("MailMind", "we", "our", "us") collects, uses, stores, and protects your personal information when you use our platform and services.
                    </motion.p>
                </div>
            </section>

            {/* Content */}
            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto space-y-8">
                    {sections.map((section, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
                            className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:border-indigo-500/10 transition-all duration-300"
                        >
                            <h2 className="text-xl font-black outfit text-white mb-4">{section.title}</h2>
                            <div className="text-slate-400 font-medium leading-relaxed text-sm space-y-3">
                                {section.content.split('\n\n').map((para, j) => (
                                    <p key={j} dangerouslySetInnerHTML={{
                                        __html: para
                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-300">$1</strong>')
                                            .replace(/^- /gm, '• ')
                                    }} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <LandingFooter />
        </div>
    )
}
