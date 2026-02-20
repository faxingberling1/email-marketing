"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sparkles,
    TrendingUp,
    Copy,
    CheckCircle2,
    RotateCcw,
    Zap,
    Target,
    Loader2,
    BarChart3,
    Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateSubjectLines } from "@/app/(dashboard)/ai-assistant/actions"

interface SubjectOption {
    id: string
    text: string
    predictedOpenRate: string
    confidence: string
}

export function SubjectGenerator() {
    const [prompt, setPrompt] = useState("")
    const [segment, setSegment] = useState("SaaS Founders")
    const [isGenerating, setIsGenerating] = useState(false)
    const [options, setOptions] = useState<SubjectOption[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!prompt) return
        setIsGenerating(true)
        const result = await generateSubjectLines(prompt, segment)
        setOptions(result)
        setIsGenerating(false)
    }

    const handleCopy = (option: SubjectOption) => {
        navigator.clipboard.writeText(option.text)
        setCopiedId(option.id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="flex flex-col h-full rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden p-8 gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Subject Line Oracle</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Predictive Open Rate Optimization</p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Target className="h-3 w-3" /> Tactical Context
                        </label>
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="WHAT IS THE CAMPAIGN ABOUT?..."
                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono tracking-wider"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="h-3 w-3" /> Audience Segment
                        </label>
                        <select
                            value={segment}
                            onChange={(e) => setSegment(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                        >
                            <option>SaaS Founders</option>
                            <option>Growth Hackers</option>
                            <option>Enterprise Tech</option>
                            <option>Retail Managers</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            CONSULTING ORACLE...
                        </>
                    ) : (
                        <>
                            GENERATE RANKED OPTIONS
                            <Sparkles className="h-4 w-4" />
                        </>
                    )}
                </button>
            </div>

            {/* Output Section */}
            <div className="flex-1 min-h-[300px] relative">
                <AnimatePresence mode="wait">
                    {options.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                <BarChart3 className="h-8 w-8 text-slate-700" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest max-w-[200px]">
                                Input context and segment to synthesize ranked subject line candidates.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid grid-cols-1 gap-4"
                        >
                            {options.map((option, i) => (
                                <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 h-full w-1 border-l-2 border-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="space-y-2 flex-1 mr-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                i === 0 ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-indigo-400"
                                            )} />
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                                Rank {i + 1} {i === 0 && <span className="text-emerald-400 ml-1">AI HIGH-PERFORMANCE CHOICE</span>}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-white tracking-wide">{option.text}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1.5 text-emerald-400 mb-0.5">
                                                <TrendingUp className="h-3 w-3" />
                                                <span className="text-[14px] font-black tracking-tighter">{option.predictedOpenRate}</span>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">EST. OPEN</span>
                                        </div>

                                        <button
                                            onClick={() => handleCopy(option)}
                                            className={cn(
                                                "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                                copiedId === option.id
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                                            )}
                                        >
                                            {copiedId === option.id ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tactical Marker */}
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Neural Prediction Engine: Online</span>
                </div>
                <button
                    onClick={() => { setOptions([]); setPrompt(""); }}
                    className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                    <RotateCcw className="h-3 w-3" /> RESET SEQUENCE
                </button>
            </div>
        </div>
    )
}
