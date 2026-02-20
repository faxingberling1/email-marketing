"use client"

import { motion } from "framer-motion"
import {
    FlaskConical,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Sparkles,
    ArrowRight,
    Zap,
    Target
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Variation {
    id: string
    variation: string
    performance: string
    status: 'Winning' | 'Losing'
}

interface ABTestingReportsProps {
    data: Variation[]
}

export function ABTestingReports({ data }: ABTestingReportsProps) {
    return (
        <div className="rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden p-8 space-y-8 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <FlaskConical className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">A/B Variation Reports</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Subject Sentiment Split</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 flex-1">
                {data.map((v, i) => (
                    <motion.div
                        key={v.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "group p-6 rounded-3xl border transition-all flex items-center justify-between overflow-hidden relative",
                            v.status === 'Winning'
                                ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                        )}
                    >
                        <div className="flex items-center gap-6 relative z-10">
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center border transition-all",
                                v.status === 'Winning'
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                    : "bg-white/5 text-slate-500 border-white/5"
                            )}>
                                {v.status === 'Winning' ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 block">Variation {v.id}</span>
                                <h4 className="text-sm font-bold text-white tracking-wide">{v.variation}</h4>
                            </div>
                        </div>

                        <div className="text-right relative z-10">
                            <div className={cn(
                                "flex items-center justify-end gap-1.5 font-black text-xl tracking-tighter mb-0.5",
                                v.status === 'Winning' ? "text-emerald-400" : "text-slate-400"
                            )}>
                                {v.status === 'Winning' && <TrendingUp className="h-4 w-4" />}
                                {v.performance}
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                                v.status === 'Winning' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-white/5"
                            )}>
                                {v.status}
                            </span>
                        </div>

                        {v.status === 'Winning' && (
                            <div className="absolute -right-8 -top-8 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl opacity-40 animate-pulse" />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">AI Strategic Differentiator</h3>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                        Variation A shows superior resonance with <span className="text-emerald-400">Founder Segment</span> due to high-urgency subject phrasing. Predicted uplift: +6.4% on full rollout.
                    </p>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-[9px] font-black text-white uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-600/20">
                    Apply Winning Variation <Zap className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}
