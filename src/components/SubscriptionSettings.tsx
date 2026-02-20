"use client"

import { motion } from "framer-motion"
import {
    CreditCard,
    Zap,
    ArrowUpRight,
    Activity,
    BarChart3,
    Compass,
    Rocket,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SubscriptionSettingsProps {
    data: {
        plan: string
        usage: number
        nextBilling: string
        limit: string
    }
}

export function SubscriptionSettings({ data }: SubscriptionSettingsProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Rocket className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Orbital Resources</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subscription & Usage Intelligence</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Plan Card */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Compass className="h-32 w-32 text-indigo-400 animate-[spin_20s_linear_infinite]" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase tracking-[0.2em]">Active Protocol</span>
                        </div>

                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tighter mb-2">{data.plan}</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optimized for High-Frequency Synthesis</p>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300">Next Orbital Sync</span>
                                <span className="text-xs font-black text-white">{data.nextBilling}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300">Tactical Limit</span>
                                <span className="text-xs font-black text-white">{data.limit}</span>
                            </div>
                        </div>

                        <button className="w-full mt-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-4 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.3em] transition-all border border-white/5 shadow-xl shadow-white/5">
                            UPGRADE CAPACITY <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Usage Surveillance */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity className="h-5 w-5 text-emerald-400" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Usage Surveillance</h4>
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 tracking-widest">{data.usage}%</span>
                    </div>

                    <div className="space-y-4">
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data.usage}%` }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-1000"
                            />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                            <span className="text-emerald-400">Tactical Status:</span> Nominal. You have used 74,240 of your 100,000 unit capacity this cycle.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <BarChart3 className="h-4 w-4 text-indigo-400" />
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Velocity Growth</p>
                            <h5 className="text-lg font-black text-white">+12.4%</h5>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AI Synthesis Efficiency</p>
                            <h5 className="text-lg font-black text-white">92.8%</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Features List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {[
                    'Automated Retargeting Logic',
                    'Neural Subject Analysis',
                    'Multi-Node Integration Sync',
                    'Strategic Sequence Architect',
                    'Orbital Engagement Heatmaps',
                    'Predictive Growth Analytics'
                ].map((feature, i) => (
                    <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                    >
                        <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{feature}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
