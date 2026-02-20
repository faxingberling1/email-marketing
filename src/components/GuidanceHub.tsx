"use client"

import { motion } from "framer-motion"
import {
    Play,
    Ticket,
    CheckCircle2,
    Clock,
    Lock,
    ArrowRight,
    Search,
    Video,
    Activity,
    AlertCircle,
    ChevronRight,
    TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Tutorial {
    id: string
    title: string
    status: string
    thumbnail: string | null
}

interface Ticket {
    id: string
    subject: string
    status: string
    priority: string
    lastUpdate: string
}

interface GuidanceHubProps {
    tutorials: Tutorial[]
    tickets: Ticket[]
    recommendation: {
        insight: string
        recommendation: string
        action: string
    } | null
}

export function GuidanceHub({ tutorials, tickets, recommendation }: GuidanceHubProps) {
    return (
        <div className="space-y-10 h-full flex flex-col">
            {/* AI Recommendation Panel */}
            {recommendation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5 overflow-hidden relative group"
                >
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-indigo-400" />
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Orbital Strategic Advisor</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic">
                                    "{recommendation.insight}"
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <p className="text-[12px] font-black text-white uppercase tracking-widest max-w-sm">
                                    {recommendation.recommendation}
                                </p>
                                <button className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 px-8 py-3.5 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all flex-shrink-0">
                                    {recommendation.action} <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1">
                {/* Tutorial Guides */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <Video className="h-5 w-5 text-indigo-400" />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Walkthrough Orchestration</h4>
                    </div>
                    <div className="space-y-4">
                        {tutorials.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "p-6 rounded-3xl border transition-all group flex items-center justify-between",
                                    t.status === 'Locked' ? "bg-slate-900/20 border-white/5 opacity-50" : "bg-slate-900/40 border-white/5 hover:border-indigo-500/30 cursor-pointer"
                                )}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center border",
                                        t.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            t.status === 'In Progress' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                                "bg-white/5 text-slate-700 border-white/5"
                                    )}>
                                        {t.status === 'Locked' ? <Lock className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{t.title}</h5>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                                t.status === 'Completed' ? "text-emerald-400 bg-emerald-500/5" :
                                                    t.status === 'In Progress' ? "text-indigo-400 bg-indigo-500/5" :
                                                        "text-slate-600 bg-white/5"
                                            )}>
                                                {t.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {t.status !== 'Locked' && <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Support Tickets */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <Ticket className="h-5 w-5 text-indigo-400" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Support Nodes</h4>
                        </div>
                        <button className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1">
                            New Ticket <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {tickets.map((tk, i) => (
                            <motion.div
                                key={tk.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn(
                                        "px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                                        tk.priority === 'High' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                    )}>
                                        {tk.priority} Priority
                                    </div>
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Update: {tk.lastUpdate}</span>
                                </div>
                                <h5 className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-indigo-400 transition-colors mb-4">{tk.subject}</h5>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Activity className="h-3 w-3" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">{tk.status}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">View Thread</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-center gap-8 opacity-40">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Knowledge Cloud Synchronized</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Node Latency: Optimal</span>
                </div>
            </div>
        </div>
    )
}
