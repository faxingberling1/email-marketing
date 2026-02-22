"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    Zap,
    Clock,
    Mail,
    Plus,
    Trash2,
    GripVertical,
    ChevronDown,
    Settings2,
    Sparkles,
    MousePointer2,
    Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SequenceStep {
    id: string
    type: "delay" | "email"
    delayTime?: number // in minutes
    subject?: string
    content?: string
    triggerEvent?: "delay" | "opened" | "clicked"
}

interface StepSequenceProps {
    steps: SequenceStep[]
    onChange: (steps: SequenceStep[]) => void
}

export function StepSequence({ steps, onChange }: StepSequenceProps) {
    const addStep = (type: "delay" | "email") => {
        const newStep: SequenceStep = {
            id: `step-${Math.random().toString(36).substring(2, 9)}`,
            type,
            delayTime: type === "delay" ? 1440 : undefined, // Default 1 day
            triggerEvent: "delay",
            subject: type === "email" ? "" : undefined,
            content: type === "email" ? "" : undefined
        }
        onChange([...steps, newStep])
    }

    const removeStep = (id: string) => {
        onChange(steps.filter(s => s.id !== id))
    }

    const updateStep = (id: string, data: Partial<SequenceStep>) => {
        onChange(steps.map(s => s.id === id ? { ...s, ...data } : s))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">Automation Flow</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Construct your multi-step engagement sequence</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => addStep("delay")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all hover:bg-white/10"
                    >
                        <Clock className="h-3.5 w-3.5" /> ADD WAIT
                    </button>
                    <button
                        onClick={() => addStep("email")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase text-indigo-400 hover:bg-indigo-500/20 transition-all"
                    >
                        <Mail className="h-3.5 w-3.5" /> ADD EMAIL
                    </button>
                </div>
            </div>

            <div className="relative space-y-4">
                {steps.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02]">
                        <Zap className="h-10 w-10 text-slate-700 mb-4 animate-pulse" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Sequence Terminal Empty</p>
                        <p className="text-[9px] text-slate-500 mt-2">Initialize your flow by adding a wait period or an email node.</p>
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className="group relative flex items-start gap-4"
                        >
                            {/* Sequence Line */}
                            {index < steps.length - 1 && (
                                <div className="absolute left-[22px] top-[44px] bottom-[-20px] w-0.5 bg-gradient-to-b from-indigo-500/30 to-transparent" />
                            )}

                            {/* Node Icon */}
                            <div className={cn(
                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-md z-10",
                                step.type === "delay"
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                            )}>
                                {step.type === "delay" ? <Clock className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                            </div>

                            {/* Node Content */}
                            <div className="flex-1 rounded-3xl border border-white/5 bg-slate-900/40 p-5 group-hover:border-white/10 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest font-mono">NODE_{index + 1}</span>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                                            {step.type === "delay" ? "Wait Period" : "Automated Email"}
                                        </h4>
                                    </div>
                                    <button
                                        onClick={() => removeStep(step.id)}
                                        className="text-slate-600 hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {step.type === "delay" ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Delay Duration</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="number"
                                                    value={step.delayTime}
                                                    onChange={(e) => updateStep(step.id, { delayTime: parseInt(e.target.value) })}
                                                    className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                                                />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minutes</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Trigger Event</label>
                                            <select
                                                value={step.triggerEvent}
                                                onChange={(e) => updateStep(step.id, { triggerEvent: e.target.value as any })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
                                            >
                                                <option value="delay">After Delay</option>
                                                <option value="opened">If Previous Opened</option>
                                                <option value="clicked">If Previous Clicked</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Email Subject</label>
                                            <input
                                                type="text"
                                                placeholder="Enter subject line..."
                                                value={step.subject}
                                                onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                                            <p className="text-[9px] font-bold text-indigo-300/60 uppercase tracking-widest italic">AI Creative Engine Online</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats/Status Hub */}
                            <div className="w-32 self-center text-right hidden lg:block">
                                <div className="space-y-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center justify-end gap-2 text-[9px] font-black text-slate-600 uppercase">
                                        <Settings2 className="h-3 w-3" /> STABLE
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-[9px] font-black text-emerald-500/60 uppercase">
                                        <Activity className="h-3 w-3" /> VERIFIED
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {steps.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4 py-8"
                    >
                        <div className="h-8 w-0.5 bg-gradient-to-b from-indigo-500/30 to-transparent" />
                        <div className="px-6 py-2 rounded-full border border-white/5 bg-slate-900/60 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            End of Sequence Orbit
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
