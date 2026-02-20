"use client"

import { motion } from "framer-motion"
import {
    Activity,
    TrendingUp,
    AlertCircle,
    Clock,
    Zap,
    LayoutDashboard,
    ArrowRight,
    Target,
    BarChart3,
    BrainCircuit
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Prediction {
    id: string
    name: string
    predictedUplift: string
    status: string
}

interface Issue {
    id: string
    area: string
    segment: string
    suggestion: string
    impact: string
}

interface Window {
    segment: string
    window: string
}

interface IntelligenceDashboardProps {
    forecasts: Prediction[]
    issues: Issue[]
    windows: Window[]
}

export function IntelligenceDashboard({ forecasts = [], issues = [], windows = [] }: IntelligenceDashboardProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Performance Surveillance */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2 px-2">
                    <Activity className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Performance HUD</h3>
                </div>

                <div className="space-y-4">
                    {forecasts.map((f, i) => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 relative overflow-hidden group hover:border-indigo-500/30 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">FORECAST ACTIVE</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            </div>

                            <h4 className="text-sm font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{f.name}</h4>

                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white tracking-tighter">{f.predictedUplift}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">EST. UPLIFT</span>
                            </div>

                            {/* HUD Energy Bar */}
                            <div className="mt-6 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Column 2: Tactical Friction Points */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 mb-2 px-2">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Tactical Friction Mitigation</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {issues.map((issue, i) => (
                        <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 space-y-4 hover:bg-slate-900 transition-all relative group overflow-hidden"
                        >
                            {/* Alert Flare */}
                            <div className="absolute -left-12 -top-12 h-24 w-24 bg-rose-500/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />

                            <div className="flex items-center justify-between relative z-10">
                                <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">{issue.area}</span>
                                <span className={cn(
                                    "text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest",
                                    issue.impact === 'High' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                )}>
                                    IMPACT: {issue.impact}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Target className="h-3 w-3" /> Target: {issue.segment}
                                </h4>
                                <p className="text-xs font-bold text-white leading-relaxed">{issue.suggestion}</p>
                            </div>

                            <button className="flex items-center gap-2 text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all pt-2 relative z-10 group/btn">
                                EXECUTE OPTIMIZATION <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </motion.div>
                    ))}

                    <div className="md:col-span-2 p-6 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                <Clock className="h-7 w-7" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Temporal Sync Windows</h4>
                                <div className="flex flex-wrap gap-3">
                                    {windows.map(w => (
                                        <div key={w.segment} className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                            <span className="text-[8px] font-black text-slate-500 uppercase">{w.segment}:</span>
                                            <span className="text-[8px] font-black text-indigo-400 uppercase">{w.window}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="bg-indigo-500 hover:bg-indigo-400 text-[9px] font-black text-white px-6 py-3 rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 transition-all whitespace-nowrap">
                            AUTO-SYNC ALL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
