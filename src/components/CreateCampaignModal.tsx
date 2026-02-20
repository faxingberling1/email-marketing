"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Sparkles,
    Target,
    Calendar,
    Zap,
    Languages,
    BarChart3,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Eye,
    Type,
    BrainCircuit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { predictCampaignPerformance, generateCreative } from "../app/(dashboard)/dashboard/campaigns/actions"

interface CreateCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    segments: Array<{ id: string, name: string, count: number, recommended: boolean }>
}

export function CreateCampaignModal({ isOpen, onClose, segments }: CreateCampaignModalProps) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [selectedSegment, setSelectedSegment] = useState("")
    const [tone, setTone] = useState("Professional")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPredicting, setIsPredicting] = useState(false)
    const [prediction, setPrediction] = useState<any>(null)
    const [showPreview, setShowPreview] = useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)
        const result = await generateCreative(`Campaign for ${name}`, tone)
        setSubject(result.subject)
        setBody(result.body)
        setIsGenerating(false)
        setStep(2)
    }

    const handlePredict = async () => {
        setIsPredicting(true)
        const result = await predictCampaignPerformance({ name, subject, body, segment: selectedSegment })
        setPrediction(result)
        setIsPredicting(false)
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
                className="relative w-full max-w-4xl bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-3xl"
            >
                {/* Modal Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Intelligence Orchestrator</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Campaign Sequence Initiation</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[600px]">
                    {/* Left: Input Sidebar */}
                    <div className="p-8 border-r border-white/5 overflow-y-auto custom-scrollbar bg-white/[0.01]">
                        <div className="space-y-8">
                            {/* Step Indicator */}
                            <div className="flex items-center gap-2">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={cn(
                                            "h-1 px-4 rounded-full transition-all duration-500",
                                            step >= s ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "bg-white/5"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Section 1: Entity Branding */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Type className="h-3 w-3" /> Campaign Identity
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="ENTER MISSION NAME..."
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>

                            {/* Section 2: Tactical Segment */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Target className="h-3 w-3" /> Target Segment
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {segments.map((seg) => (
                                        <button
                                            key={seg.id}
                                            onClick={() => setSelectedSegment(seg.id)}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl border text-left transition-all relative group",
                                                selectedSegment === seg.id
                                                    ? "bg-indigo-500/10 border-indigo-500/30 text-white"
                                                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black tracking-widest uppercase">{seg.name}</span>
                                                <span className="text-[10px] font-mono text-slate-500">{seg.count.toLocaleString()}</span>
                                            </div>
                                            {seg.recommended && (
                                                <div className="mt-1 flex items-center gap-1">
                                                    <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                                                    <span className="text-[8px] font-black text-indigo-400 uppercase">AI Recommended</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section 3: Sentiment Adjustment */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Languages className="h-3 w-3" /> Sentiment Tone
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['Professional', 'Bold', 'Minimalist', 'Urgent'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                tone === t
                                                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                                                    : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Control */}
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !name || !selectedSegment}
                                className="w-full mt-6 flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        GENERATING INTELLIGENCE...
                                    </>
                                ) : (
                                    <>
                                        GENERATE CREATIVE
                                        <Zap className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Preview & Prediction HUD */}
                    <div className="p-8 space-y-8 bg-slate-950/40 relative h-full flex flex-col">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center space-y-4"
                                >
                                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                        <BrainCircuit className="h-8 w-8 text-slate-500 animate-pulse" />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting Parameter Entry</h3>
                                    <p className="text-[10px] font-bold text-slate-600 max-w-[200px] leading-relaxed italic">
                                        Define identity and segment targets to prime the generation sequence.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8 flex-1 flex flex-col"
                                >
                                    {/* Preview Container */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-4 w-4 text-indigo-400" />
                                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">REAL-TIME PREVIEW</h3>
                                            </div>
                                            <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                                <span className="text-[8px] font-black text-emerald-400 uppercase">SYNCHRONIZED</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                                <Sparkles className="h-24 w-24 text-white" />
                                            </div>

                                            <div className="pb-4 border-b border-white/5">
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">SUBJECT:</span>
                                                <h4 className="text-xs font-bold text-white tracking-wide">{subject}</h4>
                                            </div>
                                            <div>
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">BODY:</span>
                                                <p className="text-[10px] text-slate-300 leading-relaxed font-bold whitespace-pre-line">{body}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prediction HUD */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4 text-purple-400" />
                                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">FORTUNE TELLER HUD</h3>
                                            </div>
                                            <button
                                                onClick={handlePredict}
                                                disabled={isPredicting}
                                                className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all"
                                            >
                                                {isPredicting ? "PREDICTING..." : "RE-PREDICT"}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center flex flex-col justify-center gap-1 group hover:border-indigo-500/30 transition-all">
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">EST. OPEN RATE</span>
                                                <span className="text-xl font-black text-white tracking-tighter">{prediction?.predictedOpenRate || "--%"}</span>
                                            </div>
                                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center flex flex-col justify-center gap-1 group hover:border-purple-500/30 transition-all">
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-purple-400 transition-colors">EST. CLICK RATE</span>
                                                <span className="text-xl font-black text-white tracking-tighter">{prediction?.predictedClickRate || "--%"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 py-4 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/5 transition-all">
                                        FINALIZE & SCHEDULE
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

