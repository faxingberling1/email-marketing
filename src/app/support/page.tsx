"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { MessageSquare, Mail, Phone, BookOpen, ChevronDown, ChevronRight, Clock, CheckCircle, Zap, Shield } from "lucide-react"
import { useState } from "react"

const channels = [
    {
        icon: MessageSquare,
        title: "Live Chat",
        description: "Talk directly with a support specialist. Average response time under 3 minutes.",
        badge: "Fastest",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        cta: "Start Chat",
        available: "Available 24/7",
        color: "from-emerald-500 to-teal-600",
    },
    {
        icon: Mail,
        title: "Email Support",
        description: "Send a detailed request and get a comprehensive response from our technical team.",
        badge: "Recommended",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        cta: "Send Email",
        available: "Response within 1 hour",
        color: "from-indigo-500 to-purple-600",
    },
    {
        icon: Phone,
        title: "Priority Phone",
        description: "Enterprise & Pro plan customers get direct phone access to our senior engineers.",
        badge: "Pro & Enterprise",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        cta: "Request Callback",
        available: "Mon–Fri, 9am–6pm EST",
        color: "from-amber-500 to-orange-600",
    },
    {
        icon: BookOpen,
        title: "Documentation",
        description: "Browse our full API reference, guides, and integration tutorials anytime.",
        badge: "Self-Serve",
        badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        cta: "View Docs",
        available: "Always available",
        color: "from-sky-500 to-blue-600",
        href: "/docs",
    },
]

const faqs = [
    {
        q: "How do I reset my API key?",
        a: "Navigate to Settings → API Keys in your dashboard. Click 'Rotate Key' next to the key you want to reset. Your old key will be invalidated immediately — make sure to update it in all your integrations before rotating."
    },
    {
        q: "Why are my emails landing in the spam folder?",
        a: "This is almost always a deliverability configuration issue. First, verify your SPF, DKIM, and DMARC records are correctly set up for your sending domain. You can run a free check from your MailMind dashboard under Deliverability → Domain Health. Also ensure you haven't sent to purchased lists or have a high bounce rate."
    },
    {
        q: "Can I migrate my contact list from another platform?",
        a: "Yes! MailMind supports CSV imports with automatic field mapping, and we have one-click migrations from Mailchimp, Klaviyo, SendGrid, and HubSpot. Go to Contacts → Import to get started. We also offer white-glove migration support for Enterprise customers."
    },
    {
        q: "How is my plan usage calculated?",
        a: "Usage is calculated based on the number of unique contacts in your account (not sends). You can upgrade, downgrade, or pause your plan any time from the Billing section of your Settings. Mid-cycle upgrades are prorated."
    },
    {
        q: "Does MailMind support multi-user accounts and team roles?",
        a: "Yes. Pro and Enterprise plans include team management with role-based access control (Admin, Manager, Analyst, Viewer). You can invite team members from Settings → Team Members."
    },
    {
        q: "What's the difference between a campaign and an automation?",
        a: "A Campaign is a one-time broadcast to a segment (e.g. a newsletter). An Automation is a triggered sequence that runs based on subscriber behavior (e.g. a welcome series when someone signs up). Both are managed from the Campaigns section in your dashboard."
    },
    {
        q: "How does AI send-time optimization work?",
        a: "MailMind analyzes each subscriber's historical open and click behavior to determine the time window when they're most likely to engage. Instead of sending a blast at 9am, each individual receives your email during their personal peak window. This typically lifts open rates by 15–40%."
    },
    {
        q: "Is there a free trial?",
        a: "Yes — every new account includes a 14-day free trial of the Pro plan with full feature access and up to 500 contacts. No credit card required to start. After the trial, you can choose a paid plan or downgrade to the free tier (up to 250 contacts)."
    },
]

const systemStatus = [
    { service: "Email Delivery", status: "Operational" },
    { service: "API", status: "Operational" },
    { service: "Dashboard", status: "Operational" },
    { service: "Webhook Processing", status: "Operational" },
    { service: "AI Engine", status: "Operational" },
]

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        All Systems Operational
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black outfit tracking-tighter text-white mb-6">
                        How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Help You?</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-xl mx-auto font-medium">
                        World-class support for every plan. We're here to ensure your campaigns never miss a beat.
                    </motion.p>
                </div>
            </section>

            {/* Contact Channels */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {channels.map((ch, i) => {
                        const Icon = ch.icon
                        return (
                            <motion.div key={ch.title}
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
                            >
                                <div className={`h-1 w-full bg-gradient-to-r ${ch.color}`} />
                                <div className="p-7 flex flex-col flex-1">
                                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br ${ch.color} mb-5 shadow-lg opacity-80`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className={`inline-flex items-center self-start px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-3 ${ch.badgeColor}`}>
                                        {ch.badge}
                                    </div>
                                    <h3 className="text-lg font-black outfit text-white mb-2">{ch.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1 mb-5">{ch.description}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mb-5">
                                        <Clock className="h-3.5 w-3.5" /> {ch.available}
                                    </div>
                                    <Link href={ch.href ?? "#"}
                                        className="group/btn flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-widest transition-all">
                                        {ch.cta} <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* System Status */}
            <section className="px-6 pb-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black outfit text-white mb-6 flex items-center gap-3">
                        <Shield className="h-5 w-5 text-emerald-400" /> System Status
                    </h2>
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl divide-y divide-white/5 overflow-hidden">
                        {systemStatus.map((item, i) => (
                            <motion.div key={item.service}
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                className="flex items-center justify-between px-7 py-4">
                                <span className="font-bold text-slate-300 text-sm">{item.service}</span>
                                <div className="flex items-center gap-2 text-emerald-400 text-sm font-black">
                                    <CheckCircle className="h-4 w-4" /> {item.status}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm font-bold transition-colors flex items-center gap-1 justify-center">
                            View Full Status Page <Zap className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 pb-24 border-t border-white/5 pt-20">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-4xl font-black outfit text-white mb-3">Frequently Asked Questions</h2>
                        <p className="text-slate-400 font-medium">Quick answers to the most common questions.</p>
                    </motion.div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                                className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-all duration-300"
                            >
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-7 py-5 text-left">
                                    <span className="font-black text-white pr-8">{faq.q}</span>
                                    <ChevronDown className={`h-5 w-5 text-slate-500 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-indigo-400" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                        className="px-7 pb-6">
                                        <p className="text-slate-400 font-medium leading-relaxed text-sm border-t border-white/5 pt-4">{faq.a}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    )
}
