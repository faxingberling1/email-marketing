"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
    ChevronRight,
    Zap,
    Target,
    ShieldCheck,
    Lock,
    Server,
    Mail,
    Twitter,
    Github,
    Linkedin,
    ArrowUpRight,
    Sparkles
} from "lucide-react"

export function TrustSection() {
    return (
        <section className="py-24 relative bg-slate-900/30 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-white outfit mb-4">Enterprise-Grade Trust & Security</h2>
                    <p className="text-slate-400 font-medium">Built to ensure your campaigns reach the inbox safely and securely.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div className="text-center group p-8 rounded-[32px] border border-transparent hover:border-white/5 transition-all hover:bg-white/[0.02]">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all border border-indigo-500/20 group-hover:scale-110 group-hover:rotate-3">
                            <Server className="h-8 w-8 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Maximum Deliverability</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-bold">Dedicated IPs and automated SPF/DKIM/DMARC configuration to secure your sender reputation.</p>
                    </div>
                    <div className="text-center group p-8 rounded-[32px] border border-transparent hover:border-white/5 transition-all hover:bg-white/[0.02]">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all border border-emerald-500/20 group-hover:scale-110 group-hover:rotate-3">
                            <ShieldCheck className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">GDPR Compliant</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-bold">Built-in consent management, right-to-be-forgotten automation, and strict European data processing compliance.</p>
                    </div>
                    <div className="text-center group p-8 rounded-[32px] border border-transparent hover:border-white/5 transition-all hover:bg-white/[0.02]">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all border border-blue-500/20 group-hover:scale-110 group-hover:rotate-3">
                            <Lock className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Data Security</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-bold">End-to-end 256-bit AES encryption for all contact data at rest and in transit.</p>
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
                <div className="glass p-12 md:p-20 rounded-[4rem] border border-indigo-500/20 text-center relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.15)] bg-indigo-950/20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10 animate-pulse-slow" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8 relative z-10"
                    >
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-[32px] bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-4">
                            <Sparkles className="h-10 w-10 text-indigo-400" />
                        </div>

                        <h2 className="text-4xl md:text-7xl font-black outfit leading-tight text-white mb-6 tracking-tighter">
                            Scale Your Growth <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">With Neural Intelligence</span>
                        </h2>

                        <p className="text-indigo-200/60 text-lg md:text-xl max-w-2xl mx-auto font-black uppercase tracking-widest italic">
                            The future of email is now.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link href="/signup" className="group relative overflow-hidden rounded-2xl bg-white px-10 py-5 font-black text-slate-950 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10">
                                <span className="relative z-10 flex items-center gap-3 text-sm tracking-[0.2em] uppercase leading-none">
                                    Start Building
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link href="/login" className="px-10 py-5 font-black text-white hover:text-indigo-400 transition-colors text-sm tracking-[0.2em] uppercase leading-none">
                                Sign In
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
        <footer className="relative pt-32 pb-16 bg-slate-950 overflow-hidden border-t border-white/5">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-24">
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-indigo-600/20">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black outfit tracking-tighter text-white">
                                Mail<span className="gradient-text">Mind</span>
                            </span>
                        </Link>

                        <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                            Next-generation email marketing powered by localized intelligence and medical-grade automation scaling.
                        </p>

                        <div className="flex items-center gap-4">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Github, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="h-10 w-10 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Infrastructure</h4>
                        <ul className="space-y-4">
                            {["Features", "Intelligence", "Pricing", "Security"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-bold text-sm flex items-center gap-1 group">
                                        {link}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Resources</h4>
                        <ul className="space-y-4">
                            {["Case Studies", "Neural Blog", "Documentation", "Support"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-bold text-sm flex items-center gap-1 group">
                                        {link}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Optimization Column */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="glass p-8 rounded-[32px] border border-white/10 bg-slate-900/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="h-12 w-12 text-indigo-400" />
                            </div>
                            <h4 className="text-sm font-black outfit mb-2">Neural Newsletter</h4>
                            <p className="text-xs text-slate-500 font-bold mb-4">Get the latest optimization signals sent to your inbox weekly.</p>

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter work email"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-bold text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none transition-all pr-12"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
                                    <ChevronRight className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Security Schema</a>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 text-center md:text-right">
                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            &copy; 2026 MailMind Orbital Systems.
                        </div>
                        <div className="text-slate-700 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center md:justify-end gap-2">
                            <div className="h-1 w-1 rounded-full bg-indigo-500" />
                            Intelligence Deployed Global-1
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export function LandingFooter_legacy() {
    return <LandingFooter />
}
