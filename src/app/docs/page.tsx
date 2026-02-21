"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { Search, BookOpen, Zap, Code2, Shield, Key, Webhook, BarChart3, ChevronRight, ExternalLink, Terminal } from "lucide-react"
import { useState } from "react"

const sections = [
    {
        icon: Zap,
        title: "Getting Started",
        color: "text-indigo-400",
        bg: "bg-indigo-500/10 border-indigo-500/20",
        articles: ["Quick Start Guide", "Authentication & API Keys", "Your First Campaign", "Dashboard Overview"],
    },
    {
        icon: Code2,
        title: "API Reference",
        color: "text-sky-400",
        bg: "bg-sky-500/10 border-sky-500/20",
        articles: ["REST API Overview", "Contacts API", "Campaigns API", "Analytics API", "Webhooks"],
    },
    {
        icon: BarChart3,
        title: "Analytics & Reporting",
        color: "text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/20",
        articles: ["Understanding Metrics", "Custom Reports", "Export & Integrations", "Real-Time Dashboard"],
    },
    {
        icon: Shield,
        title: "Security & Compliance",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
        articles: ["GDPR Guide", "HIPAA Compliance", "Data Retention Policy", "SOC 2 Overview"],
    },
    {
        icon: Webhook,
        title: "Webhooks & Events",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
        articles: ["Event Types", "Payload Reference", "Retry Logic", "Testing Webhooks"],
    },
    {
        icon: Key,
        title: "Integrations",
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/20",
        articles: ["Shopify", "Salesforce", "HubSpot", "Zapier / Make", "Custom Integrations"],
    },
]

const quickStart = `// Install the MailMind SDK
npm install @mailmind/sdk

// Initialize
import { MailMind } from '@mailmind/sdk'

const mm = new MailMind({
  apiKey: process.env.MAILMIND_API_KEY,
  region: 'us-east-1'
})

// Send your first campaign
const campaign = await mm.campaigns.create({
  name: 'Welcome Series',
  subject: 'Welcome to {{company}}',
  template: 'welcome-v2',
  segment: 'new-subscribers',
  sendAt: 'optimal' // AI-optimized send time
})

console.log(\`Campaign \${campaign.id} scheduled!\`)`

export default function DocsPage() {
    const [search, setSearch] = useState("")

    const filteredSections = sections.map(s => ({
        ...s,
        articles: s.articles.filter(a => a.toLowerCase().includes(search.toLowerCase())),
    })).filter(s => s.articles.length > 0 || s.title.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
                        <BookOpen className="h-4 w-4" /> Documentation
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black outfit tracking-tighter text-white mb-6">
                        Everything You Need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Build & Scale</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-xl mx-auto font-medium mb-10">
                        Full API reference, guides, and examples to integrate MailMind into any stack.
                    </motion.p>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="relative max-w-lg mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search documentation…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-slate-600 font-medium focus:border-indigo-500 focus:outline-none transition-all text-lg"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Quick Start */}
            <section className="px-6 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <div className="flex items-center gap-3 mb-6">
                                <Terminal className="h-5 w-5 text-indigo-400" />
                                <h2 className="text-xl font-black text-white outfit">Quick Start</h2>
                            </div>
                            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                                    <div className="h-3 w-3 rounded-full bg-rose-500/60" />
                                    <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                                    <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                                    <span className="ml-2 text-xs font-bold text-slate-600">quick-start.ts</span>
                                </div>
                                <pre className="p-6 text-sm text-slate-300 font-mono leading-relaxed overflow-x-auto">
                                    <code>{quickStart}</code>
                                </pre>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                            className="flex flex-col gap-4">
                            <h2 className="text-xl font-black text-white outfit mb-2">Popular Articles</h2>
                            {[
                                { title: "Authentication & API Keys", icon: Key, color: "text-indigo-400" },
                                { title: "Campaigns API Reference", icon: Code2, color: "text-sky-400" },
                                { title: "Webhook Event Types", icon: Webhook, color: "text-amber-400" },
                                { title: "GDPR Compliance Guide", icon: Shield, color: "text-emerald-400" },
                                { title: "Shopify Integration", icon: Zap, color: "text-purple-400" },
                            ].map((item, i) => {
                                const Icon = item.icon
                                return (
                                    <Link key={item.title} href="#"
                                        className="group flex items-center gap-4 bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-4 hover:border-indigo-500/20 transition-all duration-300">
                                        <Icon className={`h-5 w-5 ${item.color} shrink-0`} />
                                        <span className="font-bold text-slate-300 group-hover:text-white transition-colors flex-1">{item.title}</span>
                                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                )
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Sections Grid */}
            <section className="px-6 pb-24 border-t border-white/5 pt-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-white outfit mb-8">All Topics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSections.map((section, i) => {
                            const Icon = section.icon
                            return (
                                <motion.div key={section.title}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ delay: (i % 3) * 0.08 }}
                                    className="bg-slate-900/40 border border-white/5 rounded-3xl p-7 hover:border-indigo-500/20 transition-all duration-300"
                                >
                                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${section.bg} mb-5`}>
                                        <Icon className={`h-6 w-6 ${section.color}`} />
                                    </div>
                                    <h3 className="text-lg font-black text-white outfit mb-4">{section.title}</h3>
                                    <ul className="space-y-2">
                                        {section.articles.map(article => (
                                            <li key={article}>
                                                <Link href="#" className="group flex items-center justify-between text-sm font-bold text-slate-500 hover:text-slate-200 transition-colors py-1">
                                                    {article}
                                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="#" className={`mt-5 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${section.color} opacity-70 hover:opacity-100 transition-opacity`}>
                                        View all <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Help CTA */}
            <section className="py-20 border-t border-white/5 px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-black outfit text-white mb-3">Can't Find What You Need?</h2>
                    <p className="text-slate-400 font-medium mb-8">Our support team and community are always ready to help.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/support" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105">
                            Contact Support <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#" className="flex items-center gap-2 text-slate-400 hover:text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all bg-white/5 hover:bg-white/10 border border-white/5">
                            Community Forum
                        </Link>
                    </div>
                </motion.div>
            </section>

            <LandingFooter />
        </div>
    )
}
