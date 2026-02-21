"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe,
    Sparkles,
    Zap,
    Target,
    Loader2,
    CheckCircle2,
    Activity,
    BrainCircuit,
    Wand2,
    MessageSquareQuote,
    Languages
} from "lucide-react"
import { cn } from "@/lib/utils"
import { translateTemplate, generateAIDraft } from "@/app/(dashboard)/templates/actions"

export function TemplateNeuralHUD() {
    const [activeTab, setActiveTab] = useState<'synthesis' | 'oracle'>('synthesis')
    const [language, setLanguage] = useState('English')
    const [tone, setTone] = useState('Professional')
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleSynthesize = async () => {
        setIsProcessing(true)
        const res = await translateTemplate("STUB_CONTENT", language, tone)
        setResult(res)
        setIsProcessing(false)
    }

    const handleAIGenerate = async () => {
        setIsProcessing(true)
        const res = await generateAIDraft("Write a high-conversion email for SaaS founders about our new AI features.", "growth")
        setResult(res)
        setIsProcessing(false)
    }

    return (
        <div className="rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-xl p-8 space-y-8 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Neural HUD</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Content Engine</p>
                    </div>
                </div>
            </div>

            {/* Tactical Tabs */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                <button
                    onClick={() => setActiveTab('synthesis')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'synthesis' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"
                    )}
                >
                    <Languages className="h-3.5 w-3.5" /> Synthesis
                </button>
                <button
                    onClick={() => setActiveTab('oracle')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'oracle' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"
                    )}
                >
                    <MessageSquareQuote className="h-3.5 w-3.5" /> Copy Oracle
                </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                {activeTab === 'synthesis' ? (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Globe className="h-3 w-3" /> Target Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>German</option>
                                <option>French</option>
                                <option>Japanese</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="h-3 w-3" /> Strategic Tone
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Professional', 'Bold', 'Minimalist', 'Empathetic'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={cn(
                                            "px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                                            tone === t
                                                ? "bg-indigo-500/20 border-indigo-500/40 text-white"
                                                : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSynthesize}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                            SYNTHESIZE PATTERN
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Target className="h-3 w-3" /> Tactical Brief
                            </p>
                            <textarea
                                placeholder="What's the goal of this copy segment?..."
                                className="w-full bg-transparent border-none p-0 text-xs font-medium text-white placeholder:text-slate-700 focus:ring-0 h-24 scrollbar-none"
                            />
                        </div>

                        <button
                            onClick={handleAIGenerate}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            CONSULT THE ORACLE
                        </button>
                    </div>
                )}

                <div className="relative pt-4">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Synthesis Complete</span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-400">92% Confidence</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-widest">
                                    Pattern generated with optimal tone matching. Ready for injection into canvas.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 opacity-40">
                                <Activity className="h-10 w-10 text-slate-700" />
                                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Neural Engine Idle</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
