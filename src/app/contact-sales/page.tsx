"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    ShieldCheck,
    Zap,
    Globe,
    Lock,
    ArrowRight,
    MessageSquare,
    ChevronRight,
    Building2,
    Mail,
    Phone,
    CheckCircle2
} from "lucide-react"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import Link from "next/link"

const enterpriseValues = [
    {
        icon: ShieldCheck,
        title: "SLA Uptime Guarantee",
        desc: "99.99% service level agreement with dedicated priority support orchestration."
    },
    {
        icon: Lock,
        title: "Enterprise SSO & Security",
        desc: "SAMLV2, OAuth, and SCIM provisioning for global identity management."
    },
    {
        icon: Zap,
        title: "Dedicated Infrastructure",
        desc: "Isolated high-performance neural compute clusters for your mission-critical data."
    },
    {
        icon: Globe,
        title: "Global Compliance",
        desc: "GDPR, SOC2 Type II, and HIPAA ready infrastructure for domestic and international scale."
    }
]

export default function ContactSalesPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-red-500/30">
            <LandingHeader />

            <main className="pt-32 pb-20 overflow-hidden relative">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* Left Side: Enterprise Value */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-12"
                        >
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                    <Building2 className="h-4 w-4 text-red-500" />
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Enterprise Core</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black outfit tracking-tighter leading-tight">
                                    Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Neural Intelligence</span>.
                                </h1>
                                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                                    Strategic partnership for high-volume marketers requiring dedicated AI infrastructure and uncompromising deliverability.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {enterpriseValues.map((val, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group"
                                    >
                                        <val.icon className="h-8 w-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-2">{val.title}</h3>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{val.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/5 flex items-center gap-8 opacity-60">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Response Protocol</span>
                                    <span className="text-white font-bold text-sm italic">Under 2 Hours</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dedicated Node</span>
                                    <span className="text-white font-bold text-sm italic">Account Manager</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />

                            <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 flex flex-col items-center text-center space-y-6"
                                    >
                                        <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-black text-white outfit">Protocol Initiated</h2>
                                            <p className="text-slate-400 font-medium max-w-[280px] mx-auto">
                                                An Enterprise strategist will contact your node within the next 2 orbital hours.
                                            </p>
                                        </div>
                                        <Link href="/" className="text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all pt-4">
                                            Return to Origin <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block pl-1">Full Identity</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Alex Richards"
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-red-500/50 outline-none transition-all placeholder:text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block pl-1">Work Email</label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="alex@company.com"
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-red-500/50 outline-none transition-all placeholder:text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block pl-1">Company Entity</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Neural Systems Inc."
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-red-500/50 outline-none transition-all placeholder:text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block pl-1">Estimated Volume</label>
                                                <select className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-slate-300 text-sm focus:border-red-500/50 outline-none transition-all appearance-none cursor-pointer">
                                                    <option>200k - 500k monthly</option>
                                                    <option>500k - 2M monthly</option>
                                                    <option>2M+ monthly</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block pl-1">Strategic Requirements</label>
                                            <textarea
                                                required
                                                rows={4}
                                                placeholder="Tell us about your high-volume scaling objectives..."
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-red-500/50 outline-none transition-all placeholder:text-slate-700 resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full py-5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-red-600/20 hover:bg-red-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? (
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Initiate Commercial Dialogue <ChevronRight className="h-4 w-4" /></>
                                            )}
                                        </button>

                                        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4">
                                            By submitting, you agree to our <span className="text-slate-500 underline cursor-pointer">Strategic Terms</span>
                                        </p>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
