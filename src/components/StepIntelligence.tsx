"use client"

import { motion } from "framer-motion"
import {
    Activity,
    TrendingUp,
    Target,
    Zap,
    BrainCircuit,
    ChevronRight,
    Search,
    Filter,
    BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

export function StepIntelligence() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Step Analysis</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                    Step 2 Analysis
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: 'Open Prob.', value: '64.2%', trend: '+4.2%', icon: Target },
                    { label: 'Click Prob.', value: '18.4%', trend: '+2.1%', icon: Zap },
                    { label: 'Bounce Risk', value: '0.4%', trend: 'Low', icon: Activity },
                    { label: 'Engagement Orbit', value: 'High', trend: 'Stable', icon: BarChart3 },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-3xl border border-white/5 bg-slate-900/40"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className="h-4 w-4 text-indigo-400" />
                            <span className={cn(
                                "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                                stat.trend.includes('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
                            )}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-xl font-black text-white tracking-widest leading-none">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Next Step Advisor</p>
                            <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Recommended: Delay +12h</h4>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                        Extending the wait period for Step 3 identifies a <span className="text-indigo-400">+4.8% completion rate</span> increase across SaaS segments.
                    </p>
                    <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-[0.3em] transition-all border border-white/5 flex items-center justify-center gap-2">
                        Apply Strategic Delay <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
