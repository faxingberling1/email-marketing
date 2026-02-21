"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use, useEffect, useState } from "react"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import { posts, authors } from "../data"
import {
    Clock, ArrowLeft, ArrowRight, Tag, Quote, BookOpen,
    Share2, Heart, ChevronRight, Sparkles, TrendingUp
} from "lucide-react"

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const post = posts.find(p => p.id === slug)
    if (!post) notFound()

    const author = authors[post.authorKey]
    const related = posts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2)
    const otherPosts = posts.filter(p => p.id !== post.id && !related.find(r => r.id === p.id)).slice(0, 2)
    const allRelated = [...related, ...otherPosts].slice(0, 3)

    // Reading progress bar
    const [progress, setProgress] = useState(0)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement
            const scrolled = el.scrollTop
            const total = el.scrollHeight - el.clientHeight
            setProgress(total > 0 ? (scrolled / total) * 100 : 0)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const currentIndex = posts.findIndex(p => p.id === slug)
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Reading progress bar */}
            <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-white/5">
                <motion.div
                    className={`h-full bg-gradient-to-r ${post.color}`}
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05 }}
                />
            </div>

            <LandingHeader />

            {/* ── Article Hero ── */}
            <section className="relative pt-44 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-500/8 via-transparent to-transparent blur-3xl -z-10" />

                <div className="max-w-3xl mx-auto">
                    {/* Back link */}
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                        <Link href="/blog"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-200 text-sm font-bold uppercase tracking-widest transition-colors mb-10">
                            <ArrowLeft className="h-4 w-4" /> Back to Blog
                        </Link>
                    </motion.div>

                    {/* Category + meta */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="flex flex-wrap items-center gap-3 mb-6">
                        <span className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${post.color} text-white text-[10px] font-black uppercase tracking-widest`}>
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                            <Clock className="h-3.5 w-3.5" /> {post.readTime} read
                        </span>
                        <span className="text-slate-700 text-xs font-bold">{post.date}</span>
                        <span className="text-slate-700 text-xs font-bold">{post.views} views</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="text-4xl md:text-5xl font-black outfit tracking-tighter text-white leading-[1.05] mb-5">
                        {post.title}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
                        {post.subtitle}
                    </motion.p>

                    {/* Author row */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="flex items-center gap-4 pb-10 border-b border-white/5">
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${author.color} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg`}>
                            {author.initials}
                        </div>
                        <div className="flex-1">
                            <div className="font-black text-white">{author.name}</div>
                            <div className="text-sm font-bold text-slate-500">{author.role}</div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setLiked(!liked)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-black uppercase tracking-widest transition-all ${liked
                                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                                    : "bg-white/[0.03] border-white/5 text-slate-500 hover:text-slate-200 hover:border-white/10"
                                    }`}>
                                <Heart className={`h-4 w-4 ${liked ? "fill-rose-400" : ""}`} />
                                {liked ? "Liked" : post.likes}
                            </button>
                            <button
                                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.03] text-slate-500 hover:text-slate-200 hover:border-white/10 text-sm font-black uppercase tracking-widest transition-all">
                                <Share2 className="h-4 w-4" /> Share
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Article Body ── */}
            <section className="px-6 pb-20">
                <div className="max-w-3xl mx-auto">
                    {/* Accent line */}
                    <div className={`h-0.5 w-20 bg-gradient-to-r ${post.color} rounded-full mb-14`} />

                    {/* Pull quote (first paragraph) */}
                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="relative border-l-4 border-indigo-500/40 pl-8 mb-14 py-2">
                        <Quote className="absolute top-0 left-6 h-5 w-5 text-indigo-500/20 -translate-x-full" />
                        <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed italic">
                            {post.body[0]}
                        </p>
                    </motion.blockquote>

                    {/* Body paragraphs */}
                    <div className="space-y-7">
                        {post.body.slice(1).map((para, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ delay: i * 0.04 }}
                                className="text-slate-300 text-lg leading-[1.85] font-medium"
                            >
                                {para}
                            </motion.p>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-14 pt-10 border-t border-white/5">
                        <Tag className="h-4 w-4 text-slate-700 mr-1" />
                        {post.tags.map(t => (
                            <Link key={t} href={`/blog?search=${t}`}
                                className="px-3 py-1.5 bg-white/[0.03] border border-white/5 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/20 text-[11px] font-black uppercase tracking-widest rounded-full transition-all">
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Author Bio Card ── */}
            <section className="px-6 pb-16">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 flex gap-6 items-start hover:border-indigo-500/10 transition-all">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${author.color} flex items-center justify-center text-white font-black text-base shrink-0 shadow-xl`}>
                            {author.initials}
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 mb-2">About the Author</div>
                            <div className="font-black text-white text-lg outfit mb-0.5">{author.name}</div>
                            <div className="text-sm font-bold text-slate-500 mb-3">{author.role}</div>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">{author.bio}</p>
                            <div className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">
                                {author.articles} articles published
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Prev / Next ── */}
            <section className="px-6 pb-16">
                <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {prevPost ? (
                        <Link href={`/blog/${prevPost.id}`}
                            className="group flex items-start gap-4 bg-white/[0.025] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/20 transition-all">
                            <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors group-hover:-translate-x-1" />
                            <div>
                                <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Previous</div>
                                <div className="font-black text-slate-300 text-sm leading-snug group-hover:text-white transition-colors">{prevPost.title}</div>
                            </div>
                        </Link>
                    ) : <div />}
                    {nextPost ? (
                        <Link href={`/blog/${nextPost.id}`}
                            className="group flex items-start gap-4 bg-white/[0.025] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/20 transition-all text-right justify-end sm:text-right">
                            <div>
                                <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Next</div>
                                <div className="font-black text-slate-300 text-sm leading-snug group-hover:text-white transition-colors">{nextPost.title}</div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors group-hover:translate-x-1" />
                        </Link>
                    ) : <div />}
                </div>
            </section>

            {/* ── Related Articles ── */}
            {allRelated.length > 0 && (
                <section className="px-6 pb-24 border-t border-white/5 pt-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <TrendingUp className="h-4 w-4 text-slate-600" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Keep Reading</h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {allRelated.map((rel, i) => {
                                const relAuthor = authors[rel.authorKey]
                                return (
                                    <motion.div key={rel.id}
                                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                        <Link href={`/blog/${rel.id}`}
                                            className="group block bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
                                            <div className={`h-0.5 w-full bg-gradient-to-r ${rel.color}`} />
                                            <div className="p-5">
                                                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">{rel.category} · {rel.readTime}</div>
                                                <h3 className="font-black text-slate-300 text-sm leading-snug mb-3 group-hover:text-white transition-colors line-clamp-2">{rel.title}</h3>
                                                <p className="text-slate-600 text-xs font-medium leading-relaxed line-clamp-2 mb-4">{rel.excerpt}</p>
                                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${relAuthor.color} flex items-center justify-center text-white font-black text-[9px]`}>{relAuthor.initials}</div>
                                                        <span className="text-[10px] font-bold text-slate-600">{relAuthor.name.split(" ")[0]}</span>
                                                    </div>
                                                    <ArrowRight className="h-3.5 w-3.5 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/blog"
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 text-sm font-black uppercase tracking-widest transition-colors">
                                <BookOpen className="h-4 w-4" /> View All Articles
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                        <Sparkles className="h-7 w-7 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-black outfit text-white tracking-tighter mb-3">
                        Ready to Put This Into Practice?
                    </h2>
                    <p className="text-slate-400 font-medium mb-8">
                        MailMind's AI engine handles the strategy automatically. Start your free trial and see results in 14 days.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup"
                            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-indigo-500/20">
                            Start Free Trial <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/blog"
                            className="flex items-center gap-2 text-slate-400 hover:text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all bg-white/5 hover:bg-white/10 border border-white/5">
                            <ChevronRight className="h-4 w-4 rotate-180" /> More Articles
                        </Link>
                    </div>
                </motion.div>
            </section>

            <LandingFooter />
        </div>
    )
}
