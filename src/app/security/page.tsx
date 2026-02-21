"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { ShieldCheck, Lock, Server, Eye, Zap, Globe, AlertTriangle, Mail } from "lucide-react"

const pillars = [
    {
        icon: Lock,
        title: "End-to-End Encryption",
        description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your contact lists and campaign content are never stored in plaintext.",
        color: "from-indigo-500 to-purple-600",
        stats: [{ label: "Encryption", value: "AES-256" }, { label: "Transit", value: "TLS 1.3" }],
    },
    {
        icon: Server,
        title: "Infrastructure Security",
        description: "Our infrastructure runs on AWS with multi-region redundancy, automatic failover, and isolated customer environments. We maintain a 99.9% uptime SLA.",
        color: "from-emerald-500 to-teal-600",
        stats: [{ label: "Uptime SLA", value: "99.9%" }, { label: "Regions", value: "US + EU" }],
    },
    {
        icon: Eye,
        title: "Access Controls",
        description: "Role-based access control (RBAC) ensures team members only see what they need. All internal access to customer data is logged and audited.",
        color: "from-sky-500 to-blue-600",
        stats: [{ label: "Model", value: "RBAC" }, { label: "Audit Log", value: "Full" }],
    },
    {
        icon: ShieldCheck,
        title: "SOC 2 Type II Certified",
        description: "MailMind is independently audited and certified against SOC 2 Type II standards, validating our controls for security, availability, and confidentiality.",
        color: "from-violet-500 to-indigo-600",
        stats: [{ label: "Standard", value: "SOC 2" }, { label: "Type", value: "Type II" }],
    },
    {
        icon: Globe,
        title: "GDPR & Compliance",
        description: "We are fully GDPR, CCPA, and CAN-SPAM compliant. Data Processing Agreements are available for all customers on request.",
        color: "from-amber-500 to-orange-600",
        stats: [{ label: "GDPR", value: "✓ Compliant" }, { label: "DPA", value: "Available" }],
    },
    {
        icon: Zap,
        title: "Penetration Testing",
        description: "We conduct annual penetration tests with independent third-party security researchers. Findings are remediated within SLA timelines.",
        color: "from-rose-500 to-pink-600",
        stats: [{ label: "Frequency", value: "Annual" }, { label: "Vendor", value: "3rd Party" }],
    },
]

const policies = [
    {
        q: "How is my subscriber data stored?",
        a: "All subscriber data is stored encrypted at rest in AES-256. Data is isolated per customer tenant and never mixed across accounts. We maintain strict access controls internally."
    },
    {
        q: "Where is data physically stored?",
        a: "By default, US-based accounts are stored in AWS US-East-1 (North Virginia). EU-based accounts are stored in AWS EU-West-1 (Dublin, Ireland) to comply with GDPR data residency requirements."
    },
    {
        q: "Does MailMind train AI models on my data?",
        a: "No. Your contact lists, campaign content, and subscriber data are never used to train our AI models. AI training uses only anonymized, aggregate behavioral data from opted-in sources."
    },
    {
        q: "What happens to my data if I cancel?",
        a: "You retain access to export your data for 30 days after cancellation. After that, all customer data is securely deleted from our primary systems within 30 days and from backups within 90 days."
    },
    {
        q: "How do you handle security incidents?",
        a: "We maintain an incident response plan with defined RTO/RPO targets. In the event of a breach affecting customer data, we notify affected customers within 72 hours as required by GDPR."
    },
]

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/8 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Security Schema
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black outfit tracking-tighter text-white mb-6">
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Enterprise Security</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Your data — and your subscribers' data — is treated with the highest levels of protection across every layer of our stack.
                    </motion.p>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-12 border-y border-white/5 bg-slate-900/20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {["SOC 2 Type II", "GDPR Compliant", "CCPA Ready", "CAN-SPAM Compliant", "AES-256 Encrypted", "99.9% Uptime SLA"].map((badge) => (
                            <div key={badge} className="flex items-center gap-2 text-sm font-black text-slate-400 bg-white/[0.03] border border-white/5 px-5 py-2.5 rounded-full">
                                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Pillars */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-4xl font-black outfit text-white mb-3">Security from the Ground Up</h2>
                        <p className="text-slate-400 font-medium max-w-xl mx-auto">Every layer of MailMind is designed, audited, and continuously monitored to protect your data.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pillars.map((pillar, i) => {
                            const Icon = pillar.icon
                            return (
                                <motion.div key={pillar.title}
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}
                                    className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5"
                                >
                                    <div className={`h-1 w-full bg-gradient-to-r ${pillar.color}`} />
                                    <div className="p-8">
                                        <div className={`inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br ${pillar.color} items-center justify-center mb-5 shadow-lg opacity-80`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-black outfit text-white mb-3">{pillar.title}</h3>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">{pillar.description}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {pillar.stats.map(stat => (
                                                <div key={stat.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                                                    <div className="text-sm font-black text-white">{stat.value}</div>
                                                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Data Policies Q&A */}
            <section className="py-20 border-t border-white/5 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl font-black outfit text-white mb-3">Data Policies</h2>
                        <p className="text-slate-500 font-medium">Common questions about how we protect and handle your data.</p>
                    </motion.div>
                    <div className="space-y-4">
                        {policies.map((item, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                className="bg-slate-900/40 border border-white/5 rounded-2xl p-7 hover:border-emerald-500/10 transition-all"
                            >
                                <h3 className="font-black text-white mb-3">{item.q}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vulnerability Disclosure */}
            <section className="py-20 border-t border-white/5 px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
                        <AlertTriangle className="h-8 w-8 text-amber-400" />
                    </div>
                    <h2 className="text-3xl font-black outfit text-white mb-3">Vulnerability Disclosure</h2>
                    <p className="text-slate-400 font-medium mb-8">
                        Found a security vulnerability? We take all reports seriously. Please email us responsibly and we'll acknowledge your report within 24 hours.
                    </p>
                    <Link href="mailto:security@mailmind.ai"
                        className="group inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105">
                        <Mail className="h-4 w-4" /> security@mailmind.ai
                    </Link>
                </motion.div>
            </section>

            <LandingFooter />
        </div>
    )
}
