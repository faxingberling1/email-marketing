"use client"

import { motion } from "framer-motion"
import {
    Mail,
    Clock,
    GitBranch,
    Zap,
    CheckCircle2,
    AlertCircle,
    ArrowDown,
    Activity,
    Target
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FlowStep {
    id: string
    type: string
    label: string
    status: string
    performance?: string
    delay?: string
}

interface SequenceFlowProps {
    steps: FlowStep[]
}

export function SequenceFlow({ steps = [] }: SequenceFlowProps) {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active': return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            case 'optimized': return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
            case 'stable': return "text-slate-400 bg-slate-500/10 border-slate-500/20"
            case 'needs_work': return "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
            default: return "text-slate-400 bg-slate-500/10 border-slate-500/20"
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'trigger': return Zap
            case 'email': return Mail
            case 'wait': return Clock
            case 'condition': return GitBranch
            default: return Activity
        }
    }

    return (
        <div className="relative p-8 rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden h-full flex flex-col items-center">
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Activity className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Flow Orchestration</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Sequence Node View</p>
                </div>
            </div>

            <div className="mt-20 space-y-4 w-full max-w-md flex flex-col items-center">
                {steps.map((step, i) => {
                    const Icon = getIcon(step.type)
                    return (
                        <div key={step.id} className="w-full flex flex-col items-center">
                            {i > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 40, opacity: 0.2 }}
                                    className="w-[2px] bg-slate-700 relative"
                                >
                                    <ArrowDown className="absolute -bottom-2 -left-[7px] h-4 w-4 text-slate-700" />
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "w-full group relative p-6 rounded-[2rem] border transition-all flex items-center justify-between",
                                    step.status === 'needs_work' ? "bg-rose-500/5 border-rose-500/20" : "bg-slate-900/40 border-white/5 hover:border-indigo-500/30"
                                )}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                                        step.status === 'optimized' ? "bg-indigo-500/10 text-indigo-400" : "bg-white/5 text-slate-500"
                                    )}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                                                getStatusStyles(step.status)
                                            )}>
                                                {step.status.replace('_', ' ')}
                                            </span>
                                            {step.delay && (
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">• Delay: {step.delay}</span>
                                            )}
                                        </div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">{step.label}</h4>
                                        {step.performance && (
                                            <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                                                Performance: <span className="text-indigo-400">{step.performance}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {step.status === 'needs_work' && (
                                    <div className="flex items-center gap-2 text-rose-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Low Resonance</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-12 w-full max-w-md pt-8 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
                    <Target className="h-5 w-5 text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-widest">
                        <span className="text-indigo-400">AI Sequence Suggestion:</span> Swap Step 2 and 3 for +6.8% predicted resonance uplift.
                    </p>
                </div>
            </div>
        </div>
    )
}
