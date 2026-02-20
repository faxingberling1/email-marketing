"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    PenTool,
    Languages,
    Palette,
    Zap,
    CheckCircle2,
    RotateCcw,
    Send,
    Loader2,
    Sparkles,
    Check,
    Edit3,
    Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateEmailCopy } from "@/app/(dashboard)/ai-assistant/actions"

export function CopyComposer() {
    const [prompt, setPrompt] = useState("")
    const [tone, setTone] = useState("Professional")
    const [language, setLanguage] = useState("English")
    const [isGenerating, setIsGenerating] = useState(false)
    const [copy, setCopy] = useState<any>(null)
    const [status, setStatus] = useState<'idle' | 'editing' | 'accepted'>('idle')

    const handleCompose = async () => {
        if (!prompt) return
        setIsGenerating(true)
        const result = await generateEmailCopy({ prompt, tone, language, segment: 'Target Audience' })
        setCopy(result)
        setIsGenerating(false)
        setStatus('idle')
    }

    return (
        <div className="flex flex-col h-full rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden p-8 gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <PenTool className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Neural Copy Composer</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Multi-Segment Creative Synthesis</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-[500px]">
                {/* Controls Column */}
                <div className="space-y-8 h-full flex flex-col">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="h-3 w-3" /> Creative Prompt
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="DESCRIBE YOUR CREATIVE VISION..."
                            className="w-full h-32 bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all font-mono tracking-wider resize-none custom-scrollbar"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Palette className="h-3 w-3" /> Sentiment Tone
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Professional', 'Bold', 'Friendly', 'Urgent'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={cn(
                                            "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
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

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Languages className="h-3 w-3" /> Target Language
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['English', 'Spanish', 'German', 'French'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLanguage(l)}
                                        className={cn(
                                            "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                                            language === l
                                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                                                : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                                        )}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={handleCompose}
                            disabled={isGenerating || !prompt}
                            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/5 shadow-xl transition-all disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    SYNTHESIZING...
                                </>
                            ) : (
                                <>
                                    COMPOSE COPY
                                    <Sparkles className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-2 relative h-full flex flex-col bg-slate-950/40 rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-purple-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Real-Time Synthesis Preview</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">SIGNAL STABLE</span>
                        </div>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
                        <AnimatePresence mode="wait">
                            {!copy ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                        <PenTool className="h-8 w-8 text-slate-800" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest max-w-[240px]">
                                        Define your vision and sentiments to trigger the neural composer.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    {/* Action HUD */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setStatus('accepted')}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                status === 'accepted' ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/5"
                                            )}
                                        >
                                            <Check className="h-3.5 w-3.5" /> {status === 'accepted' ? 'ACCEPTED' : 'ACCEPT COPY'}
                                        </button>
                                        <button
                                            onClick={() => setStatus('editing')}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                status === 'editing' ? "bg-purple-500 text-white" : "bg-white/5 text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 border border-white/5"
                                            )}
                                        >
                                            <Edit3 className="h-3.5 w-3.5" /> {status === 'editing' ? 'EDITING' : 'EDIT MODE'}
                                        </button>
                                        <button
                                            onClick={handleCompose}
                                            className="px-4 py-3 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-all"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Copy Body */}
                                    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 relative group">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <span className="text-[8px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 uppercase">{copy.tone}</span>
                                            <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase">{copy.language}</span>
                                        </div>

                                        {status === 'editing' ? (
                                            <textarea
                                                value={copy.content}
                                                onChange={(e) => setCopy({ ...copy, content: e.target.value })}
                                                className="w-full bg-transparent text-sm font-bold text-slate-300 leading-relaxed min-h-[300px] outline-none border-none resize-none"
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-300 leading-relaxed whitespace-pre-line tracking-wide">
                                                {copy.content}
                                            </p>
                                        )}

                                        <div className="absolute bottom-6 left-8 flex items-center gap-2 opacity-30">
                                            <Sparkles className="h-4 w-4 text-purple-400" />
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Synthesis ID: {copy.id.slice(-6)}</span>
                                        </div>
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 py-4 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-purple-500/20 transition-all">
                                        DEPLOY TO CAMPAIGN
                                        <Send className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
