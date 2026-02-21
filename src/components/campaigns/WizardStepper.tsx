"use client"

import { motion } from "framer-motion"
import { Check, Dot } from "lucide-react"
import { cn } from "@/lib/utils"

interface WizardStepperProps {
    steps: string[]
    currentStep: number
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
    return (
        <div className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-slate-900/20">
            {steps.map((label, idx) => {
                const stepNum = idx + 1
                const isComplete = currentStep > stepNum
                const isActive = currentStep === stepNum

                return (
                    <div key={label} className="flex items-center gap-3 group">
                        <div className="relative">
                            <motion.div
                                animate={isActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className={cn(
                                    "h-8 w-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border",
                                    isComplete ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                                        isActive ? "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]" :
                                            "bg-white/5 border-white/5 text-slate-600"
                                )}
                            >
                                {isComplete ? <Check className="h-4 w-4" /> : stepNum}
                            </motion.div>

                            {isActive && (
                                <motion.div
                                    layoutId="step-glow"
                                    className="absolute -inset-2 bg-indigo-500/10 blur-xl rounded-full z-[-1]"
                                />
                            )}
                        </div>

                        <div className="hidden xl:block">
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest transition-colors",
                                isActive ? "text-white" : isComplete ? "text-slate-400" : "text-slate-700"
                            )}>
                                {label}
                            </span>
                        </div>

                        {idx < steps.length - 1 && (
                            <div className="hidden xl:flex items-center mx-2 h-4">
                                <Dot className="text-slate-800" />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
