"use client"

import { motion } from "framer-motion"
import {
    Zap,
    Target,
    TrendingUp,
    Activity,
    ArrowUpRight,
    Users,
    BrainCircuit,
    ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Insight {
    id: string
    segment: string
    reason: string
    predictedUplift: string
    action: string
}

interface RetargetingHubProps {
    insights: Insight[]
}

export function RetargetingHub({ insights }: RetargetingHubProps) {
    return (
        <div className="rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden p-8 space-y-8 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Retargeting Intelligence</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Segment Reactivation</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 flex-1">
                {insights.map((insight, i) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-6 rounded-3xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users className="h-4 w-4 text-indigo-400" />
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">{insight.segment}</h4>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[12px] tracking-tighter">
                                <TrendingUp className="h-4 w-4" />
                                {insight.predictedUplift}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <BrainCircuit className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Synthesis Reason</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                                    {insight.reason}
                                </p>
                            </div>

                            <button className="w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 py-4 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all">
                                {insight.action} <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="pt-6 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4">
                    <ShieldAlert className="h-5 w-5 text-rose-400" />
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                        <span className="text-rose-400">Saturation Warning:</span> Enterprise segments are nearing fatigue. Recommendation: Deploy "Value-Only" digest.
                    </p>
                </div>
            </div>
        </div>
    )
}
