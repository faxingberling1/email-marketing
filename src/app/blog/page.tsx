"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { posts, authors } from "./data"
import {
    BookOpen, Clock, ArrowRight, Search, Brain, Shield,
    Zap, BarChart3, Filter, Star, Quote,
    TrendingUp, Rss, Hash, Sparkles, ArrowUpRight, ChevronRight
} from "lucide-react"
import { useState } from "react"

const categories = [
    { label: "All", icon: Hash },
    { label: "AI & Automation", icon: Brain },
    { label: "Deliverability", icon: Shield },
    { label: "Strategy", icon: Zap },
    { label: "Analytics", icon: BarChart3 },
    { label: "Compliance", icon: Shield },
    { label: "Integrations", icon: TrendingUp },
]

const trendingTopics = [
    "AI Personalization", "Send-Time AI", "GDPR 2026", "Cart Abandonment", "Re-engagement",
    "Deliverability", "A/B Testing", "List Health", "Behavioral Triggers", "LLM Copy"
]

function FeaturedPost({ post }: { post: typeof posts[0] }) {
    const author = authors[post.authorKey]
    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/20 transition-all duration-500"
        >
            <div className={`h-1.5 w-full bg-gradient-to-r ${post.color}`} />
            <Link href={`/blog/${post.id}`} className="block p-8 md:p-12 grid md:grid-cols-2 gap-10 items-start">
                {/* Left */}
                <div>
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">Featured</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">{post.category}</span>
                        <span className="flex items-center gap-1 text-slate-600 text-xs font-bold"><Clock className="h-3 w-3" />{post.readTime} read</span>
                        <span className="text-slate-700 text-xs font-bold ml-auto">{post.date}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black outfit tracking-tight text-white mb-3 leading-tight group-hover:text-indigo-100 transition-colors">
                        {post.title}
                    </h2>
                    <p className="text-slate-400 font-medium text-lg mb-6 leading-relaxed">{post.subtitle}</p>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map(t => (
                            <span key={t} className="px-2.5 py-1 bg-white/[0.04] border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">{t}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${author.color} flex items-center justify-center text-white font-black text-xs shrink-0`}>{author.initials}</div>
                        <div>
                            <div className="font-black text-white text-sm">{author.name}</div>
                            <div className="text-[11px] font-bold text-slate-600">{author.role}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-2 text-indigo-400 text-sm font-black group-hover:gap-3 transition-all">
                            Read Article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
                {/* Right — excerpt body */}
                <div className="space-y-4">
                    <div className={`h-1 w-16 bg-gradient-to-r ${post.color} rounded-full mb-6`} />
                    {post.body.slice(0, 2).map((para, i) => (
                        <p key={i} className="text-slate-400 text-sm font-medium leading-relaxed">{para}</p>
                    ))}
                    <div className="relative pt-2">
                        <div className="absolute inset-x-0 -top-6 h-24 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                        <span className="relative text-slate-600 text-xs font-bold italic">Continue reading →</span>
                    </div>
                </div>
            </Link>
        </motion.article>
    )
}

function PostCard({ post, index }: { post: typeof posts[0]; index: number }) {
    const author = authors[post.authorKey]
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: (index % 3) * 0.08 }}
            className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
        >
            <div className={`h-1 w-full bg-gradient-to-r ${post.color}`} />
            <Link href={`/blog/${post.id}`} className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-white/[0.04] border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">{post.category}</span>
                    <span className="flex items-center gap-1 text-slate-700 text-[10px] font-bold"><Clock className="h-3 w-3" />{post.readTime}</span>
                    <span className="text-slate-700 text-[10px] font-bold ml-auto">{post.date}</span>
                </div>
                <h3 className="text-lg font-black outfit text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors">{post.title}</h3>
                <p className="text-slate-600 text-xs font-bold mb-3 italic">{post.subtitle}</p>
                <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1 mb-5">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {post.tags.slice(0, 3).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-white/[0.03] border border-white/5 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">{t}</span>
                    ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${author.color} flex items-center justify-center text-white font-black text-[10px] shrink-0`}>{author.initials}</div>
                        <div>
                            <div className="text-xs font-black text-slate-400">{author.name}</div>
                            <div className="text-[10px] font-bold text-slate-700 flex items-center gap-2">
                                <span>{post.views} views</span><span>♥ {post.likes}</span>
                            </div>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>
        </motion.article>
    )
}

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("All")
    const [search, setSearch] = useState("")

    const featured = posts.find(p => p.featured)!
    const rest = posts
        .filter(p => !p.featured)
        .filter(p => activeCategory === "All" || p.category === activeCategory)
        .filter(p =>
            search === "" ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
        )

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-purple-600/5 blur-[150px] -z-10" />
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
                        <BookOpen className="h-4 w-4" /> Neural Blog
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black outfit tracking-tighter text-white mb-6 leading-[1.05]">
                        Intelligence,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Decoded</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
                        Deep dives on AI-driven email strategy, deliverability, analytics, compliance, and the science behind campaigns that consistently outperform.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="relative max-w-lg mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                        <input type="text" placeholder="Search articles, topics, tags…" value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-slate-700 font-medium focus:border-indigo-500 focus:outline-none transition-all text-base" />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Clear</button>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Stats bar */}
            <section className="py-10 border-y border-white/5 bg-slate-900/20">
                <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-10">
                    {[
                        { label: "Articles Published", value: `${posts.length}` },
                        { label: "Total Reads", value: "78K+" },
                        { label: "Contributors", value: `${Object.keys(authors).length}` },
                        { label: "Topics Covered", value: "6" },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="text-center">
                            <div className="text-2xl font-black outfit text-white">{s.value}</div>
                            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Editor's Pick
                        </span>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <FeaturedPost post={featured} />
                </div>
            </section>

            {/* Trending Topics */}
            <section className="px-6 pb-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                        <TrendingUp className="h-4 w-4 text-slate-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Trending Topics</span>
                        <div className="flex flex-wrap gap-2">
                            {trendingTopics.map(topic => (
                                <button key={topic} onClick={() => setSearch(topic)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[11px] font-black text-slate-500 hover:text-indigo-400 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all uppercase tracking-widest">
                                    <Hash className="h-2.5 w-2.5" />{topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter + Grid */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-10 flex-wrap">
                        <Filter className="h-4 w-4 text-slate-600 shrink-0" />
                        {categories.map(cat => {
                            const Icon = cat.icon
                            const isActive = activeCategory === cat.label
                            return (
                                <button key={cat.label} onClick={() => setActiveCategory(cat.label)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${isActive
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/15"
                                        : "border-white/5 text-slate-500 hover:text-white hover:border-white/10 bg-white/[0.02]"}`}>
                                    <Icon className="h-3 w-3" />{cat.label}
                                </button>
                            )
                        })}
                        <span className="ml-auto text-[11px] font-bold text-slate-600">{rest.length} {rest.length === 1 ? "article" : "articles"}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {rest.length > 0 ? (
                            <motion.div key={activeCategory + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rest.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 space-y-3">
                                <Sparkles className="h-10 w-10 text-slate-700 mx-auto" />
                                <p className="text-slate-600 font-bold">No articles match your search.</p>
                                <button onClick={() => { setSearch(""); setActiveCategory("All") }}
                                    className="text-indigo-400 hover:text-white text-sm font-black transition-colors">Clear filters</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Authors Section */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl font-black outfit text-white mb-3">Meet the Contributors</h2>
                        <p className="text-slate-500 font-medium">Practitioners, researchers, and engineers writing from direct experience.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Object.values(authors).map((author, i) => (
                            <motion.div key={author.name}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                className="flex items-start gap-4 bg-white/[0.025] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/15 transition-all">
                                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${author.color} flex items-center justify-center text-white font-black text-sm shrink-0`}>{author.initials}</div>
                                <div>
                                    <div className="font-black text-white text-sm">{author.name}</div>
                                    <div className="text-[11px] font-bold text-slate-600 mb-2">{author.role}</div>
                                    <p className="text-slate-600 text-xs font-medium leading-relaxed">{author.bio}</p>
                                    <div className="text-[10px] font-black text-indigo-500 mt-2 uppercase tracking-widest">{author.articles} articles →</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 px-6 border-t border-white/5">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
                    <div className="bg-slate-900/60 border border-white/5 rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-500/5 blur-3xl -z-10" />
                        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                            <Rss className="h-7 w-7 text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-black outfit text-white mb-3">Weekly Intelligence Drop</h2>
                        <p className="text-slate-400 font-medium mb-8 leading-relaxed">Get the sharpest email marketing insights delivered every Tuesday morning.</p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                            <input type="email" placeholder="your@company.com"
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-700 font-medium text-sm focus:border-indigo-500 focus:outline-none transition-all" />
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 whitespace-nowrap shadow-lg shadow-indigo-500/20">Subscribe</button>
                        </div>
                        <p className="text-[11px] text-slate-700 font-bold">Joining {">"}4,800 email marketers · Unsubscribe any time</p>
                    </div>
                </motion.div>
            </section>

            {/* Bottom cross-links */}
            <section className="py-16 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black outfit text-white mb-1">Looking for technical docs?</h3>
                        <p className="text-slate-500 font-medium text-sm">Full API reference, integration guides, and SDK documentation.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link href="/docs" className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
                            View Docs <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                        <Link href="/case-studies" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
                            Case Studies <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    )
}
