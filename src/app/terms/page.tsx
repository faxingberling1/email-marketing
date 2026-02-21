"use client"

import { motion } from "framer-motion"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { FileText } from "lucide-react"

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: `By accessing or using the MailMind platform, website, APIs, or any related services (collectively, "Services"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

If you do not agree to these Terms, you may not access or use the Services. We reserve the right to update these Terms at any time, and will provide notice of material changes via email or in-app notification.`
    },
    {
        title: "2. Account Registration & Security",
        content: `To access the Services, you must register for an account and provide accurate, complete information. You are responsible for:

- Maintaining the confidentiality of your account credentials
- All activity that occurs under your account
- Notifying us immediately of any unauthorized access at security@mailmind.ai
- Ensuring all team members comply with these Terms

We reserve the right to suspend or terminate accounts that we believe are being used fraudulently or in violation of these Terms.`
    },
    {
        title: "3. Permitted Use & Restrictions",
        content: `You may use our Services only for lawful purposes and in accordance with these Terms. You agree not to:

- Use the Services to send unsolicited bulk email (spam), malware, or phishing content
- Send emails to purchased, rented, or harvested email lists not obtained through compliant opt-in methods
- Violate CAN-SPAM, GDPR, CASL, or any other applicable email and data protection laws
- Attempt to probe, scan, or test the vulnerability of our systems
- Interfere with or disrupt the integrity or performance of the Services
- Reverse engineer, decompile, or disassemble any portion of the Services
- Resell or sublicense the Services without written permission from MailMind

Violation of these restrictions may result in immediate account termination without refund.`
    },
    {
        title: "4. Subscription Plans & Billing",
        content: `MailMind offers subscription plans billed monthly or annually. By providing payment information, you authorize us to charge the applicable fees.

**Free Trial:** New accounts receive a 14-day Pro trial. No credit card is required. At trial end, accounts revert to the free tier unless upgraded.

**Upgrades & Downgrades:** Plan changes take effect immediately. Upgrades are prorated for the remaining billing period.

**Cancellation:** You may cancel at any time. Your access continues until the end of the current billing period. No refunds are issued for unused portions of a billing cycle.

**Non-Payment:** Accounts with failed payments receive a 7-day grace period. After that, services are suspended until the balance is resolved.

We reserve the right to modify pricing with 30 days' advance notice.`
    },
    {
        title: "5. Intellectual Property",
        content: `**MailMind's IP:** The Services, including all software, algorithms, designs, and AI models, are owned by MailMind Inc. and protected by copyright, trademark, and other laws. These Terms do not grant you any ownership rights in the Services.

**Your Content:** You retain ownership of all content, contact lists, and campaign materials you upload to the platform ("Customer Data"). By uploading Customer Data, you grant MailMind a limited, non-exclusive license to process that data solely to deliver the Services.

**Feedback:** If you submit suggestions or feedback about the Services, you grant MailMind an unrestricted, royalty-free license to use that feedback for any purpose.`
    },
    {
        title: "6. Data Processing & GDPR",
        content: `For customers processing personal data of EU/UK data subjects through our platform:

MailMind acts as a **Data Processor** with respect to your subscriber data. You, as the platform user, act as the **Data Controller** and are responsible for ensuring you have appropriate consents and legal bases to process subscriber data.

We enter into a Data Processing Agreement (DPA) with all customers upon request. Enterprise customers have a DPA included by default. To request a DPA, contact privacy@mailmind.ai.

Our full privacy practices are described in our Privacy Policy.`
    },
    {
        title: "7. Warranties & Disclaimers",
        content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

MailMind does not warrant that:
- The Services will be uninterrupted, error-free, or completely secure
- Any defects will be corrected
- The Services meet your specific requirements

Some jurisdictions do not allow the disclaimer of implied warranties, so the above may not apply to you in full.`
    },
    {
        title: "8. Limitation of Liability",
        content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAILMIND SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION.

MAILMIND'S TOTAL LIABILITY FOR ALL CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID TO MAILMIND IN THE THREE MONTHS PRECEDING THE CLAIM, OR (B) $100 USD.

These limitations apply regardless of the form of action and even if MailMind has been advised of the possibility of such damages.`
    },
    {
        title: "9. Indemnification",
        content: `You agree to defend, indemnify, and hold harmless MailMind, its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:

- Your violation of these Terms
- Your use of the Services
- Your Customer Data or email content
- Your violation of any third-party rights or applicable laws
- Any claim that your use of the Services caused damage to a third party`
    },
    {
        title: "10. Governing Law & Disputes",
        content: `These Terms are governed by the laws of the State of California, United States, without regard to conflict of law provisions.

**Arbitration:** You agree that any dispute arising from these Terms or your use of the Services will be resolved by binding arbitration under the AAA Commercial Arbitration Rules, except where either party seeks injunctive relief.

**Class Action Waiver:** You waive any right to participate in a class action lawsuit or class-wide arbitration against MailMind.

**EU Customers:** Nothing in this section limits your rights under mandatory EU consumer protection laws or prevents you from bringing a claim before your local supervisory authority.`
    },
    {
        title: "11. Contact",
        content: `For questions about these Terms:

**Legal Team:** legal@mailmind.ai
**Mailing Address:** MailMind Inc., 100 Mission Street, San Francisco, CA 94105, USA

For service-related support, visit our Support page.`
    },
]

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-500/8 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
                        <FileText className="h-4 w-4" /> Terms of Service
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl font-black outfit tracking-tighter text-white mb-6">
                        Terms of Service
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium text-lg mb-4">
                        Effective date: February 1, 2026 · Last updated: February 18, 2026
                    </motion.p>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-slate-500 font-medium leading-relaxed">
                        Please read these Terms carefully before using MailMind. They form a binding legal agreement between you and MailMind Inc.
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
