"use client"

import { motion } from "framer-motion"
import {
    Target,
    Zap,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    CheckCircle2,
    Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Campaign {
    id: string
    name: string
    opens: string
    clicks: string
    conversion: string
    delta: string
}

interface CampaignComparisonProps {
    campaigns: Campaign[]
}

export function CampaignComparison({ campaigns }: CampaignComparisonProps) {
    return (
        <div className="rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Tactical Benchmarking</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Orbital Campaign Comparison</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase tracking-widest">AI ACTIVE</span>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    {campaigns.map((c, i) => {
                        const isPositive = c.delta.startsWith('+')
                        return (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 rounded-3xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 border border-white/5 group-hover:border-indigo-500/20 transition-all">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1 group-hover:text-indigo-400 transition-colors uppercase">{c.name}</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1 w-1 rounded-full bg-slate-600" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.opens} Opens</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1 w-1 rounded-full bg-slate-600" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.clicks} Clicks</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 text-right">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conversion</p>
                                        <h4 className="text-lg font-black text-white tracking-widest">{c.conversion}</h4>
                                    </div>
                                    <div className="min-w-[80px]">
                                        <div className={cn(
                                            "flex items-center justify-end gap-1 font-black text-[12px] tracking-tighter",
                                            isPositive ? "text-emerald-400" : "text-rose-400"
                                        )}>
                                            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                            {c.delta}
                                        </div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">vs Average</p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
                    <Activity className="h-5 w-5 text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-widest">
                        <span className="text-indigo-400">Winning Signal Detected:</span> "Beta Tester Recruitment" shows +18% uplift due to "Bold" sentiment tone.
                    </p>
                </div>
            </div>
        </div>
    )
}
