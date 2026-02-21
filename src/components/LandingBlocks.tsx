"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Zap, Target, ShieldCheck, Lock, Server } from "lucide-react"

export function TrustSection() {
    return (
        <section className="py-24 relative bg-slate-900/30 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-white outfit mb-4">Enterprise-Grade Trust & Security</h2>
                    <p className="text-slate-400 font-medium">Built to ensure your campaigns reach the inbox safely and securely.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div className="text-center group">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                            <Server className="h-8 w-8 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Maximum Deliverability</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Dedicated IPs and automated SPF/DKIM/DMARC configuration to secure your sender reputation.</p>
                    </div>
                    <div className="text-center group">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                            <ShieldCheck className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">GDPR Compliant</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Built-in consent management, right-to-be-forgotten automation, and strict European data processing compliance.</p>
                    </div>
                    <div className="text-center group">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                            <Lock className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Data Security</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">End-to-end 256-bit AES encryption for all contact data at rest and in transit.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden bg-slate-950 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="glass p-12 md:p-24 rounded-[3rem] border border-indigo-500/20 text-center relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.15)] bg-indigo-950/20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10 animate-pulse-slow" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8 relative z-10"
                    >
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-4">
                            <Target className="h-10 w-10 text-white" />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black outfit leading-tight text-white mb-6">
                            Start Sending <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Smarter Emails Today</span>
                        </h2>

                        <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            Personalized campaigns. AI-powered. Unlimited potential.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                            <Link href="/signup" className="group relative overflow-hidden rounded-2xl bg-white px-12 py-5 font-black text-slate-950 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/20">
                                <span className="relative z-10 flex items-center gap-3 text-sm tracking-[0.2em] uppercase">
                                    Get Started Free
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link href="/demo" className="group relative overflow-hidden rounded-2xl bg-indigo-600 px-12 py-5 font-black text-white hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/20">
                                <span className="relative z-10 flex items-center gap-3 text-sm tracking-[0.2em] uppercase">
                                    Request Demo
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export function LandingFooter() {
    return (
        <footer className="py-20 border-t border-white/5 bg-slate-950 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="col-span-1 md:col-span-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <Target className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold outfit tracking-tight text-white">
                            AEM<span className="text-indigo-500">.AI</span>
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed font-medium">
                        AI Email Marketing powered by intelligent automation.
                    </p>
                </div>

                <div className="col-span-1 md:col-span-2 md:col-start-7">
                    <h4 className="font-bold text-xs mb-6 uppercase tracking-[0.2em] text-white">Product</h4>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium tracking-wide">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                        <li><a href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h4 className="font-bold text-xs mb-6 uppercase tracking-[0.2em] text-white">Resources</h4>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium tracking-wide">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                        <li><a href="/help" className="hover:text-indigo-400 transition-colors">Help/Docs</a></li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h4 className="font-bold text-xs mb-6 uppercase tracking-[0.2em] text-white">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium tracking-wide">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms & Privacy</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                    &copy; 2026 AEM.AI ORBITAL SYSTEMS. ALL RIGHTS RESERVED.
                </div>
            </div>
        </footer>
    )
}
