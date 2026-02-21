"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { Sparkles, Clock, ArrowRight, BookOpen, Zap, Brain, BarChart3, Shield } from "lucide-react"
import { useState } from "react"

const categories = ["All", "AI & Automation", "Deliverability", "Strategy", "Analytics", "Compliance"]

const posts = [
    {
        category: "AI & Automation",
        icon: Brain,
        readTime: "8 min read",
        date: "Feb 18, 2026",
        featured: true,
        title: "The End of Generic Email: How Predictive AI Is Rewriting Personalization",
        excerpt: "Mass-blast email is dead. Learn how next-gen AI models are crafting individually resonant messages at scale — and why open rates are never going back.",
        author: "Dr. Aisha Patel",
        authorRole: "Head of AI Research",
        tag: "Featured",
        color: "from-indigo-500 to-purple-600",
    },
    {
        category: "Deliverability",
        icon: Shield,
        readTime: "5 min read",
        date: "Feb 15, 2026",
        title: "SPF, DKIM, DMARC: A No-BS Guide for 2026",
        excerpt: "Authentication protocols are your first line of defense against spam folders. Here's what actually matters and a step-by-step setup walkthrough.",
        author: "Carlos Ruiz",
        authorRole: "Deliverability Engineer",
        color: "from-emerald-500 to-teal-600",
    },
    {
        category: "Strategy",
        icon: Zap,
        readTime: "6 min read",
        date: "Feb 12, 2026",
        title: "Behavioral Triggers: The Campaign Type That Outperforms Everything",
        excerpt: "Campaigns driven by real-time user behavior consistently beat scheduled blasts by 3–5x. Here's the blueprint for building a behavioral email engine.",
        author: "Sophie Laurent",
        authorRole: "Growth Strategist",
        color: "from-amber-500 to-orange-600",
    },
    {
        category: "Analytics",
        icon: BarChart3,
        readTime: "7 min read",
        date: "Feb 9, 2026",
        title: "Beyond Open Rate: The 7 Metrics That Actually Predict Email Revenue",
        excerpt: "Open rates are vanity. Revenue-per-subscriber, engagement decay curves, and send-time elasticity are what elite email teams track instead.",
        author: "Marcus Webb",
        authorRole: "Data Science Lead",
        color: "from-sky-500 to-blue-600",
    },
    {
        category: "AI & Automation",
        icon: Brain,
        readTime: "9 min read",
        date: "Feb 6, 2026",
        title: "LLM-Generated Copy at Scale: Quality Controls That Work",
        excerpt: "Generating thousands of personalized email variants with AI is powerful — but only if you have guardrails. We share our internal review framework.",
        author: "Dr. Aisha Patel",
        authorRole: "Head of AI Research",
        color: "from-violet-500 to-indigo-600",
    },
    {
        category: "Compliance",
        icon: Shield,
        readTime: "4 min read",
        date: "Feb 3, 2026",
        title: "GDPR in 2026: What's Changed and What Email Marketers Must Do Now",
        excerpt: "Three new enforcement actions in Q1 alone. Here's what the latest GDPR rulings mean for your list management and consent flows.",
        author: "Legal Team",
        authorRole: "Compliance & Trust",
        color: "from-rose-500 to-pink-600",
    },
    {
        category: "Strategy",
        icon: Zap,
        readTime: "5 min read",
        date: "Jan 30, 2026",
        title: "Re-Engagement Campaigns: How to Win Back Dormant Subscribers",
        excerpt: "Most marketers give up on inactive subscribers too early. Our data shows 38% can be re-activated with the right 3-email sequence.",
        author: "Tyler Brooks",
        authorRole: "Campaign Strategist",
        color: "from-teal-500 to-emerald-600",
    },
    {
        category: "Analytics",
        icon: BarChart3,
        readTime: "6 min read",
        date: "Jan 27, 2026",
        title: "Send-Time Optimization: The Science Behind Knowing When to Send",
        excerpt: "We analyzed 2.3 billion sends to identify the patterns. Peak engagement windows vary wildly by industry, segment, and geography — here's the data.",
        author: "Leo Nakamura",
        authorRole: "Product Analytics",
        color: "from-purple-500 to-violet-600",
    },
]

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("All")

    const filtered = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory)
    const featured = posts.find(p => p.featured)!
    const rest = filtered.filter(p => !p.featured || activeCategory !== "All")

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
                        <BookOpen className="h-4 w-4" /> Neural Blog
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black outfit tracking-tighter text-white mb-6">
                        Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Decoded</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Deep dives on AI-driven email strategy, deliverability, analytics, and the science behind high-performing campaigns.
                    </motion.p>
                </div>
            </section>

            {/* Featured Post */}
            {activeCategory === "All" && (
                <section className="px-6 pb-16">
                    <div className="max-w-7xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="group relative bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all duration-500 cursor-pointer">
                            <div className={`h-1 w-full bg-gradient-to-r ${featured.color}`} />
                            <div className="p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest rounded-full">Featured</span>
                                        <span className="text-slate-500 text-xs font-bold">{featured.readTime}</span>
                                        <span className="text-slate-600 text-xs font-bold">{featured.date}</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black outfit tracking-tight text-white mb-4 leading-tight">{featured.title}</h2>
                                    <p className="text-slate-400 font-medium leading-relaxed mb-8">{featured.excerpt}</p>
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${featured.color} flex items-center justify-center text-white font-black text-sm`}>
                                            {featured.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-sm">{featured.author}</div>
                                            <div className="text-xs text-slate-500 font-bold">{featured.authorRole}</div>
                                        </div>
                                        <Link href="#" className="ml-auto group/btn flex items-center gap-2 text-indigo-400 hover:text-white text-sm font-black transition-colors">
                                            Read Article <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                                <div className={`h-64 md:h-80 rounded-2xl bg-gradient-to-br ${featured.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 flex items-center justify-center`}>
                                    <Sparkles className="h-24 w-24 text-white opacity-30" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Category Filter */}
            <section className="px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all border ${activeCategory === cat
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                    : "border-white/5 text-slate-500 hover:text-white hover:border-white/10 bg-white/[0.02]"
                                    }`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post, i) => {
                        const Icon = post.icon
                        return (
                            <motion.article key={post.title}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: (i % 3) * 0.08 }}
                                className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all duration-500 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
                            >
                                <div className={`h-1 w-full bg-gradient-to-r ${post.color}`} />
                                <div className="p-7 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${post.color} flex items-center justify-center opacity-80`}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{post.category}</span>
                                    </div>
                                    <h3 className="text-lg font-black outfit text-white mb-3 leading-snug group-hover:text-indigo-300 transition-colors">{post.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1 mb-6">{post.excerpt}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div>
                                            <div className="text-xs font-black text-slate-400">{post.author}</div>
                                            <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} · {post.date}</div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </motion.article>
                        )
                    })}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 border-t border-white/5 px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-black outfit text-white mb-3">Weekly Intelligence Drop</h2>
                    <p className="text-slate-400 font-medium mb-8">Get the sharpest email marketing insights delivered every Tuesday.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input type="email" placeholder="your@email.com"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-600 font-medium text-sm focus:border-indigo-500 focus:outline-none transition-all" />
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </motion.div>
            </section>

            <LandingFooter />
        </div>
    )
}
