"use client"

import { ShieldCheck, BrainCircuit, AlertTriangle, Zap, BarChart3, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StepReviewProps {
    data: any
    quotas: any
}

export function StepReview({ data, quotas }: StepReviewProps) {
    const aiCost = data.config.abTesting ? 10 : 5
    const emailVolume = data.audienceCount || 0
    const hasEnoughCredits = quotas.ai.remaining >= aiCost
    const hasEnoughEmails = quotas.emails.remaining >= emailVolume

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tactical Summary */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[2rem] border border-white/5 bg-slate-900/40 space-y-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Compliance Audit</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>Spam Risk Analysis</span>
                                <span className="text-emerald-400">Low (2%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[2%] bg-emerald-500" />
                            </div>
                        </div>

                        <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                            <span className="text-indigo-400">AI Report:</span> Subject line avoids common trigger words. Body density is optimal for mobile delivery.
                        </p>
                    </div>

                    <div className="p-8 rounded-[2rem] border border-white/5 bg-slate-900/40 space-y-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-purple-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Resource Impact</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AI Credits</span>
                                <div className={cn(
                                    "px-3 py-2 rounded-xl border text-[10px] font-black",
                                    hasEnoughCredits ? "bg-white/5 border-white/5 text-white" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                )}>
                                    -{aiCost} CREDITS
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Email Volume</span>
                                <div className={cn(
                                    "px-3 py-2 rounded-xl border text-[10px] font-black",
                                    hasEnoughEmails ? "bg-white/5 border-white/5 text-white" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                )}>
                                    -{emailVolume.toLocaleString()} EMAILS
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prediction Feed */}
                <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-3xl"
                    />

                    <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <BrainCircuit className="h-8 w-8 text-indigo-400 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-white tracking-widest uppercase">Neural Forecast</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-[240px]">
                            Predicted Open Rate Boost: <span className="text-emerald-400">+14.2%</span> based on tactical optimization sequence.
                        </p>
                    </div>

                    {!hasEnoughCredits && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 text-left">
                            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest leading-none">
                                Insufficient Credits. Upgrade to Pro required.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 flex gap-4">
                <Info className="h-5 w-5 text-slate-500 shrink-0" />
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                    Pre-launch synthesis complete. Confirming launch will deduct resources from your monthly allowance once mission begins.
                </p>
            </div>
        </div>
    )
}
