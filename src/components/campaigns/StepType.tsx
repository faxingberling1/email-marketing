"use client"

import { Zap, Repeat, Target, Sparkles, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StepTypeProps {
    selectedType: string
    onSelect: (type: string) => void
    plan: string
}

export function StepType({ selectedType, onSelect, plan }: StepTypeProps) {
    const types = [
        {
            id: 'BROADCAST',
            name: 'Broadcast',
            desc: 'One-time transmission to broad segments.',
            icon: Target,
            isLocked: false
        },
        {
            id: 'AUTOMATION',
            name: 'Drip Sequence',
            desc: 'Multi-stage engagement workflows.',
            icon: Repeat,
            isLocked: plan === 'free'
        },
        {
            id: 'TRIGGERED',
            name: 'Triggered',
            desc: 'Behavior-based individual events.',
            icon: Zap,
            isLocked: plan === 'free'
        },
        {
            id: 'AI_OPTIMIZED',
            name: 'Neural Optimized',
            desc: 'AI decides timing and audience clustering.',
            icon: Sparkles,
            isLocked: plan === 'free' || plan === 'starter'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
            {types.map((t) => (
                <button
                    key={t.id}
                    disabled={t.isLocked}
                    onClick={() => onSelect(t.id)}
                    className={cn(
                        "relative p-6 rounded-3xl border text-left transition-all overflow-hidden group",
                        selectedType === t.id
                            ? "bg-indigo-500/10 border-indigo-500/40 shadow-2xl shadow-indigo-500/5"
                            : "bg-white/[0.02] border-white/5 hover:border-white/10 grayscale hover:grayscale-0",
                        t.isLocked && "opacity-50 cursor-not-allowed border-dashed"
                    )}
                >
                    {t.isLocked && (
                        <div className="absolute top-4 right-4 text-slate-600">
                            <Lock className="h-4 w-4" />
                        </div>
                    )}

                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all",
                        selectedType === t.id ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-indigo-400"
                    )}>
                        <t.icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">{t.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{t.desc}</p>

                    {selectedType === t.id && (
                        <motion.div
                            layoutId="type-active"
                            className="absolute bottom-0 left-0 h-1 w-full bg-indigo-500"
                        />
                    )}
                </button>
            ))}
        </div>
    )
}
