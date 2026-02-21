"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BrainCircuit,
    ArrowRight,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Zap,
    Signal,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Recommendation {
    id: number
    title: string
    text: string
    uplift: string
    priority: 'high' | 'medium' | 'low'
    copyText: string
}

interface AIPanelProps {
    growthForecast: string
    activityHorizon: string[]
    recommendations: Recommendation[]
}

export function AIPanel({
    growthForecast = "0%",
    activityHorizon = [],
    recommendations = []
}: AIPanelProps) {
    const [statusIndex, setStatusIndex] = useState(0)
    const [expandedRec, setExpandedRec] = useState<number | null>(null)
    const [copiedId, setCopiedId] = useState<number | null>(null)

    // Rotate status messages for "Activity Horizon"
    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % activityHorizon.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [activityHorizon.length])

    const handleCopy = (id: number, text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6 h-full"
        >
            <div className="rounded-3xl border border-indigo-500/30 bg-indigo-950/20 p-8 backdrop-blur-xl relative overflow-hidden group h-full flex flex-col">
                <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-indigo-500/10 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">AI Suggestions</h2>
                    </div>
                </div>

                <div className="space-y-8 flex-1 relative z-10">
                    {/* Growth Forecast */}
                    <div className="relative group/forecast overflow-hidden p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Predicted Growth</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-indigo-400">{growthForecast}</span>
                            <span className="text-[10px] font-bold text-slate-500">Month-over-month</span>
                        </div>
                        <TrendingUp className="absolute -right-2 -bottom-2 h-16 w-16 text-indigo-500/10 -rotate-12 group-hover/forecast:scale-110 group-hover/forecast:rotate-0 transition-transform duration-500" />
                    </div>

                    {/* Activity Horizon (Pulsing Signal) */}
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Recent Activity</p>
                        <div className="flex items-center gap-4 bg-slate-950/50 rounded-2xl px-5 py-4 border border-white/5 shadow-inner">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={statusIndex}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-xs font-bold text-slate-300 italic"
                                >
                                    {activityHorizon[statusIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Suggestions</p>
                            <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                {recommendations.length} ACTIVE
                            </span>
                        </div>
                        <div className="space-y-4">
                            {recommendations.map((rec) => (
                                <div
                                    key={rec.id}
                                    className={cn(
                                        "group/rec rounded-2xl border transition-all duration-300 relative overflow-hidden",
                                        rec.priority === 'high'
                                            ? "bg-indigo-600/10 border-indigo-500/30 hover:bg-indigo-600/15"
                                            : "bg-white/5 border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <button
                                        onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                                        className="w-full p-4 flex items-start justify-between gap-4 text-left"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xs font-black text-white uppercase tracking-wide truncate">{rec.title}</h3>
                                                <span className={cn(
                                                    "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                                                    rec.priority === 'high' ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-400"
                                                )}>
                                                    {rec.uplift} UPLIFT
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-[10px] text-slate-400 leading-relaxed font-medium",
                                                expandedRec !== rec.id && "truncate"
                                            )}>
                                                {rec.text}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 text-slate-500 group-hover/rec:text-white transition-colors">
                                            {expandedRec === rec.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedRec === rec.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-4 pb-4 border-t border-white/5 pt-4 bg-white/[0.02]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">What to do</span>
                                                    <button
                                                        onClick={() => handleCopy(rec.id, rec.copyText)}
                                                        className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-lg"
                                                    >
                                                        {copiedId === rec.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                        {copiedId === rec.id ? "COPIED" : "COPY"}
                                                    </button>
                                                </div>
                                                <p className="mt-2 text-xs font-bold text-white italic bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                                    “{rec.copyText}”
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 relative z-10 pt-6 border-t border-white/5">
                    <button className="w-full group relative overflow-hidden rounded-2xl bg-indigo-600 py-4 font-black text-white transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-indigo-600/30">
                        <motion.span
                            className="relative z-10 flex items-center justify-center gap-3 text-[10px] tracking-[0.2em] font-black"
                        >
                            INITIALIZE SEQUENCE
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </motion.span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Signal className="h-3 w-3 text-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Your data is secure</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
