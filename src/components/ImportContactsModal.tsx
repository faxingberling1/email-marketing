"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Upload,
    ShieldCheck,
    Zap,
    AlertCircle,
    Loader2,
    CheckCircle2,
    FileText,
    Activity,
    BrainCircuit,
    Terminal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { validateImportEmails } from "@/app/(dashboard)/contacts/actions"

interface ImportContactsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ImportContactsModal({ isOpen, onClose }: ImportContactsModalProps) {
    const [step, setStep] = useState(1) // 1: Upload, 2: AI Check, 3: Completed
    const [isChecking, setIsChecking] = useState(false)
    const [validationResult, setValidationResult] = useState<any>(null)

    const handleFileUpload = () => {
        setIsChecking(true)
        setStep(2)
        // Simulate tactical AI check
        setTimeout(async () => {
            const result = await validateImportEmails(['test1@gmail.com', 'test2@gmail.com'])
            setValidationResult(result)
            setIsChecking(false)
        }, 3000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-3xl"
            >
                {/* Modal Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Deliverability Shield</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Intelligence Contact Ingress</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div
                                    onClick={handleFileUpload}
                                    className="relative group cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-indigo-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative border-2 border-dashed border-white/5 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 bg-white/5 transition-all hover:bg-white/[0.08] hover:border-indigo-500/30">
                                        <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                            <Upload className="h-8 w-8" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Drop Intelligence Packets</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CSV, XLS or Direct Sync (Max 50MB)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                        <BrainCircuit className="h-5 w-5 text-purple-400" />
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">AI Validation</p>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase">Deliverability Pre-Check</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                        <Activity className="h-5 w-5 text-indigo-400" />
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Cluster Sync</p>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase">Auto-Segmenting</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : step === 2 ? (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Terminal className="h-4 w-4 text-indigo-400" />
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">AI Signal Analysis Terminal</p>
                                        </div>
                                        <span className="text-[9px] font-mono text-indigo-500 animate-pulse">EXECUTING...</span>
                                    </div>

                                    <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 font-mono text-[10px] space-y-2 h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80 pointer-events-none" />
                                        <p className="text-emerald-500/60">Initializing Deliverability Pre-Check v4.2...</p>
                                        <p className="text-slate-500">Parsing intelligence packets (850 records)...</p>
                                        <p className="text-slate-500">Checking domain SPF/DKIM reputations...</p>
                                        {isChecking ? (
                                            <motion.p
                                                animate={{ opacity: [0, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.5 }}
                                                className="text-indigo-400"
                                            >
                                                Running deep behavioral engagement prediction...
                                            </motion.p>
                                        ) : (
                                            <>
                                                <p className="text-emerald-400">AI Validation Cluster: COMPLETE</p>
                                                <p className="text-slate-500">Filtering high-risk entities...</p>
                                                <p className="text-indigo-400">Synthesis finalized. Awaiting deployment.</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {!isChecking && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-3 gap-4"
                                    >
                                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                                            <p className="text-[18px] font-black text-white tracking-tighter">{validationResult?.valid}</p>
                                            <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">VALIDATED</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center">
                                            <p className="text-[18px] font-black text-white tracking-tighter">{validationResult?.invalid}</p>
                                            <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest">FLAGGED</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                                            <p className="text-[18px] font-black text-white tracking-tighter">{validationResult?.threatLevel}</p>
                                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">THREAT LEVEL</p>
                                        </div>
                                    </motion.div>
                                )}

                                <button
                                    onClick={() => setStep(3)}
                                    disabled={isChecking}
                                    className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
                                >
                                    {isChecking ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                                            CONDUCTING AI ANALYSIS...
                                        </>
                                    ) : (
                                        <>
                                            SYNC INTELLIGENCE
                                            <Zap className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Ingress Complete</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-[280px]">
                                    {validationResult?.valid} entities have been successfully clustered into their designated behavioral segments.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="mt-10 px-8 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Return to Command
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
