"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, ChevronRight, ArrowRight, User } from "lucide-react"

export function LandingHero() {
    return (
        <section className="relative pt-44 pb-32 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10" />
            <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-wide mb-8"
                >
                    <Sparkles className="h-4 w-4" />
                    AI-Powered Email Marketing
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold outfit leading-[1.1] mb-8"
                >
                    Personalized. Optimized. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                        Automated.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
                >
                    Leverage predictive AI for instant content generation, smart segmentation, and automated campaign optimization. Boost engagement effortlessly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link href="/signup" className="group relative overflow-hidden rounded-2xl bg-indigo-600 px-10 py-5 font-black text-white hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/30">
                        <span className="relative z-10 flex items-center gap-3 text-sm tracking-[0.2em] uppercase">
                            Get Started Free
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                    </Link>

                    <Link href="/demo" className="group flex items-center gap-3 text-slate-400 hover:text-white px-8 py-5 font-black text-sm uppercase tracking-[0.2em] transition-colors bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5">
                        Watch Demo
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* High-Fidelity Dashboard Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
                className="max-w-[1000px] mx-auto mt-24 px-6 relative"
            >
                {/* Orbital Glow Behind Mockup */}
                <div className="absolute inset-x-20 inset-y-10 bg-indigo-500/20 blur-[100px] -z-10 rounded-full" />

                <div className="rounded-[2.5rem] border border-white/10 p-4 shadow-2xl bg-slate-900/40 backdrop-blur-xl group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="bg-slate-950 rounded-[2rem] overflow-hidden flex shadow-inner relative z-10 border border-black/50">
                        {/* Sidebar Mock */}
                        <div className="w-16 md:w-56 border-r border-white/5 p-4 md:p-6 flex flex-col gap-6 bg-slate-950/50">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20" />
                                <div className="h-4 w-24 bg-white/10 rounded hidden md:block" />
                            </div>
                            <div className="space-y-4 mt-8">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex items-center gap-3 opacity-50">
                                        <div className="h-5 w-5 bg-white/10 rounded-md" />
                                        <div className="h-3 w-16 bg-white/5 rounded hidden md:block" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Mock */}
                        <div className="flex-1 p-6 md:p-10 flex flex-col gap-8 relative overflow-hidden">
                            {/* Animated Grid Background */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                            <div className="flex justify-between items-center z-10">
                                <div className="h-6 w-48 bg-white/10 rounded-lg" />
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 bg-indigo-500/20 rounded-full animate-pulse" />
                                    <div className="h-8 w-8 bg-white/10 rounded-full" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 z-10">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col justify-between group-hover:border-indigo-500/20 transition-colors duration-500">
                                        <div className="h-3 w-12 bg-white/10 rounded" />
                                        <div className="h-6 w-20 bg-indigo-400/20 rounded" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-6 flex-1 z-10">
                                <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden group-hover:border-indigo-500/20 transition-colors duration-700">
                                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                                    <svg className="absolute bottom-4 left-4 right-4 h-24 w-[calc(100%-2rem)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <motion.path
                                            d="M0,100 C20,80 40,90 60,40 C80,-10 100,20 100,20"
                                            fill="none"
                                            stroke="#6366f1"
                                            strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                                            style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.5))' }}
                                        />
                                    </svg>

                                    {/* AI Suggestion Visual Proof */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: 2, duration: 0.5, type: "spring" }}
                                        className="absolute top-6 left-6 right-6 bg-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-2xl flex items-start gap-4"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                            <Sparkles className="h-4 w-4 text-indigo-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white mb-1">AI Optimization Suggested</div>
                                            <div className="text-xs text-slate-400">“Increase open rate by 14% by changing subject to: 'Unlock Your Exclusive Beta Access'”</div>
                                            <div className="mt-3 flex gap-2">
                                                <div className="h-6 w-16 bg-indigo-600 rounded flex items-center justify-center text-[10px] font-bold text-white">Apply</div>
                                                <div className="h-6 w-16 bg-white/5 rounded flex items-center justify-center text-[10px] font-bold text-slate-300">Dismiss</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="col-span-1 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6 flex flex-col justify-between">
                                    <div className="h-4 w-24 bg-indigo-400/30 rounded mb-4" />
                                    <div className="space-y-3">
                                        {[1, 2].map(i => (
                                            <div key={i} className="h-12 bg-indigo-500/10 rounded-xl" />
                                        ))}
                                    </div>
                                    <div className="h-8 w-full bg-indigo-600/20 mt-4 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
