"use client"

import { motion } from "framer-motion"
import {
    Users,
    Target,
    Zap,
    ShieldCheck,
    AlertCircle,
    BrainCircuit,
    Activity,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Segment {
    id: string
    name: string
    engagement: number
    health: string
    reach: string
}

interface SegmentAnalyticsProps {
    segments: Segment[]
}

export function SegmentAnalytics({ segments }: SegmentAnalyticsProps) {
    const getHealthStyles = (health: string) => {
        switch (health) {
            case 'Optimal': return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            case 'Stable': return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
            case 'At-Risk': return "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
            default: return "text-slate-400 bg-slate-500/10 border-slate-500/20"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-purple-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Segment Health</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {segments.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-6 rounded-[2.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden transition-all hover:border-purple-500/30"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                    <Target className="h-5 w-5" />
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                                    getHealthStyles(s.health)
                                )}>
                                    {s.health}
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <h4 className="text-[12px] font-black text-white uppercase tracking-widest">{s.name}</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-white tracking-widest">{s.reach}</span>
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Units</span>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">
                                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Engagement Core</span>
                                    <span className="text-purple-400">{s.engagement}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.engagement}%` }}
                                        className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                                    />
                                </div>
                            </div>

                            <button className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between group/btn text-indigo-400 hover:text-indigo-300 transition-colors">
                                <span className="text-[8px] font-black uppercase tracking-widest">Deploy Retention sequence</span>
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>

                        {/* Background Energy Pulse */}
                        <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-purple-500/5 blur-[50px] pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
