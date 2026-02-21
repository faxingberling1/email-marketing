"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { ArrowRight, TrendingUp, Users, Mail, Star, ChevronRight } from "lucide-react"

const caseStudies = [
    {
        company: "Nexus Retail Co.",
        industry: "E-Commerce",
        logo: "NR",
        color: "from-indigo-500 to-purple-600",
        result: "+340%",
        metric: "Email Revenue",
        description: "How Nexus Retail transformed their abandoned cart sequences with AI-personalized subject lines, recovering $2.4M in lost revenue in a single quarter.",
        tags: ["Automation", "Personalization", "Recovery"],
        openRate: "68.2%",
        clickRate: "24.1%",
        revenue: "$2.4M",
        quote: "MailMind's AI rewrote our recovery strategy. We went from 12% open rates to nearly 70% — it's like having a world-class copywriter working 24/7.",
        author: "Sarah Chen",
        role: "VP of Digital Marketing",
    },
    {
        company: "Apex SaaS",
        industry: "Software",
        logo: "AP",
        color: "from-sky-500 to-indigo-600",
        result: "+210%",
        metric: "Trial Conversions",
        description: "Apex SaaS used MailMind's predictive send-time optimization to reach leads at peak engagement windows, doubling their trial-to-paid conversion rate.",
        tags: ["Send-Time AI", "Segmentation", "Nurture"],
        openRate: "54.7%",
        clickRate: "18.9%",
        revenue: "$890K",
        quote: "We cut our sales cycle by 3 weeks just by ensuring our nurture emails arrived when prospects were most receptive. The data doesn't lie.",
        author: "Marcus Webb",
        role: "Head of Growth",
    },
    {
        company: "HealthFirst Clinics",
        industry: "Healthcare",
        logo: "HF",
        color: "from-emerald-500 to-teal-600",
        result: "+180%",
        metric: "Patient Re-engagement",
        description: "HealthFirst brought dormant patients back with HIPAA-compliant, deeply personalized re-engagement campaigns, achieving remarkable retention rates.",
        tags: ["Compliance", "Re-engagement", "Retention"],
        openRate: "61.3%",
        clickRate: "22.4%",
        revenue: "$1.1M",
        quote: "The compliance guardrails gave us confidence to finally run aggressive re-engagement campaigns. Results exceeded every KPI we set.",
        author: "Dr. Priya Sharma",
        role: "CMO",
    },
    {
        company: "Stellar Events",
        industry: "Events & Media",
        logo: "SE",
        color: "from-amber-500 to-orange-600",
        result: "+415%",
        metric: "Ticket Sales via Email",
        description: "Stellar Events generated 4x ticket sales through hyper-targeted countdown sequences and AI-generated urgency copy that felt personal, not pushy.",
        tags: ["Urgency Sequences", "A/B Testing", "Copywriting AI"],
        openRate: "72.8%",
        clickRate: "31.2%",
        revenue: "$3.2M",
        quote: "Every event we've run since adopting MailMind has sold out. The AI knows exactly what message drives action at exactly the right time.",
        author: "Tyler Brooks",
        role: "Director of Partnerships",
    },
    {
        company: "Luminary Finance",
        industry: "FinTech",
        logo: "LF",
        color: "from-rose-500 to-pink-600",
        result: "+290%",
        metric: "Lead Qualification Rate",
        description: "Luminary Finance used MailMind's behavioral scoring and dynamic segmentation to prioritize high-intent leads, dramatically improving sales efficiency.",
        tags: ["Lead Scoring", "Dynamic Segments", "Compliance"],
        openRate: "49.1%",
        clickRate: "19.7%",
        revenue: "$4.8M",
        quote: "Our sales team now focuses only on warm, pre-qualified leads. MailMind does the heavy lifting of identifying who's actually ready to convert.",
        author: "Amanda Torres",
        role: "Growth Lead",
    },
    {
        company: "EduPath Online",
        industry: "EdTech",
        logo: "EP",
        color: "from-violet-500 to-purple-600",
        result: "+520%",
        metric: "Course Enrollment",
        description: "EduPath Online leveraged AI-generated course recommendation emails to match learners with the right content, skyrocketing enrollment across all categories.",
        tags: ["Recommendations", "Personalization", "Lifecycle"],
        openRate: "66.4%",
        clickRate: "28.3%",
        revenue: "$1.9M",
        quote: "When emails feel like they were written for exactly you, conversions are inevitable. MailMind makes that kind of personalization scalable.",
        author: "Leo Nakamura",
        role: "Product & Growth Manager",
    },
]

const stats = [
    { value: "2.3B+", label: "Emails Optimized" },
    { value: "94%", label: "Avg. Deliverability" },
    { value: "$18M+", label: "Revenue Attributed" },
    { value: "340+", label: "Companies Scaled" },
]

export default function CaseStudiesPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10 rounded-full blur-3xl" />
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
                        <TrendingUp className="h-4 w-4" /> Real Results
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black outfit tracking-tighter text-white mb-6">
                        Companies That <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Scaled With Us</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        See how forward-thinking companies use MailMind's AI engine to turn email into their highest-ROI growth channel.
                    </motion.p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-12 border-y border-white/5 bg-slate-900/30">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="text-center">
                            <div className="text-3xl font-black outfit text-white mb-1">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Case Studies Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {caseStudies.map((cs, i) => (
                        <motion.div key={cs.company}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: (i % 2) * 0.1 }}
                            className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5"
                        >
                            {/* Top accent bar */}
                            <div className={`h-1 w-full bg-gradient-to-r ${cs.color}`} />
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cs.color} flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                                            {cs.logo}
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-lg outfit">{cs.company}</div>
                                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{cs.industry}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-white outfit">{cs.result}</div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cs.metric}</div>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">{cs.description}</p>

                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {[
                                        { label: "Open Rate", value: cs.openRate },
                                        { label: "Click Rate", value: cs.clickRate },
                                        { label: "Revenue", value: cs.revenue },
                                    ].map(m => (
                                        <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                                            <div className="font-black text-white text-sm">{m.value}</div>
                                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{m.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {cs.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-widest rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="border-l-2 border-indigo-500/50 pl-4 mb-4">
                                    <p className="text-slate-300 text-sm italic font-medium leading-relaxed">"{cs.quote}"</p>
                                    <footer className="mt-2 text-xs text-slate-500 font-bold">— {cs.author}, {cs.role}</footer>
                                </blockquote>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 border-t border-white/5">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl font-black outfit tracking-tighter text-white mb-4">Write Your Own Success Story</h2>
                    <p className="text-slate-400 font-medium mb-8">Join hundreds of companies growing faster with MailMind's AI engine.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20">
                            Start Free Trial <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact-sales" className="flex items-center gap-2 text-slate-400 hover:text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-colors bg-white/5 hover:bg-white/10 border border-white/5">
                            Talk to Sales
                        </Link>
                    </div>
                </motion.div>
            </section>

            <LandingFooter />
        </div>
    )
}
