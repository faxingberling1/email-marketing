"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BrainCircuit, Zap, Globe, MessageSquare,
    Target, Sparkles, Loader2, Check, AlertCircle, Save
} from "lucide-react"
import { cn } from "@/lib/utils"
import { updateAISettings } from "@/app/(dashboard)/settings/actions"

interface AIPreferenceSettingsProps {
    data: {
        defaultLanguage: string
        defaultTone: string
        engagementThreshold: number
        autoOptimize: boolean
    }
}

export function AIPreferenceSettings({ data }: AIPreferenceSettingsProps) {
    const [preferences, setPreferences] = useState(data)
    const [threshold, setThreshold] = useState(data.engagementThreshold)
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Check if dirty
    const isDirty =
        preferences.defaultLanguage !== data.defaultLanguage ||
        preferences.defaultTone !== data.defaultTone ||
        preferences.autoOptimize !== data.autoOptimize ||
        threshold !== data.engagementThreshold

    const handleSave = async () => {
        setIsSaving(true)
        setError(null)
        const result = await updateAISettings({
            ...preferences,
            engagementThreshold: threshold
        })
        setIsSaving(false)
        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } else {
            setError(result.error || "Failed to sync neural settings")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Neural Configuration</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI & Tactical Tuning Console</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving || (!isDirty && !saved)}
                    className={cn(
                        "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                        saved
                            ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                            : isDirty
                                ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-xl shadow-indigo-500/20"
                                : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                    )}
                >
                    {isSaving ? (
                        <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> SYNCING...</span>
                    ) : saved ? (
                        <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> NEURAL SYNCED</span>
                    ) : (
                        <span className="flex items-center gap-2"><Save className="h-3.5 w-3.5" /> COMMIT NEURAL MAP</span>
                    )}
                </button>
            </div>

            {error && (
                <div className="mx-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 space-y-6">
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-indigo-400" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Synthesis Language</h4>
                        </div>
                        <select
                            value={preferences.defaultLanguage}
                            onChange={(e) => setPreferences({ ...preferences, defaultLanguage: e.target.value })}
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>German</option>
                            <option>French</option>
                            <option>Japanese</option>
                        </select>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 space-y-6">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-indigo-400" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Synthesizer Tone</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {['Professional', 'Bold', 'Minimalist', 'Empathetic'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setPreferences({ ...preferences, defaultTone: t })}
                                    className={cn(
                                        "px-4 py-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all",
                                        preferences.defaultTone === t
                                            ? "bg-indigo-500/20 border-indigo-500/40 text-white shadow-xl shadow-indigo-500/10"
                                            : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Target className="h-5 w-5 text-indigo-400" />
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Engagement Threshold</h4>
                            </div>
                            <span className="text-sm font-black text-indigo-400 tracking-widest">{threshold}%</span>
                        </div>

                        <div className="space-y-6">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={threshold}
                                onChange={(e) => setThreshold(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-950/80 rounded-full appearance-none cursor-pointer border border-white/5 shadow-inner 
                                    accent-indigo-500
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:h-5
                                    [&::-webkit-slider-thumb]:w-5
                                    [&::-webkit-slider-thumb]:rounded-xl
                                    [&::-webkit-slider-thumb]:bg-indigo-500
                                    [&::-webkit-slider-thumb]:border-4
                                    [&::-webkit-slider-thumb]:border-slate-950
                                    [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(99,102,241,0.5)]
                                    [&::-webkit-slider-thumb]:transition-all
                                    [&::-webkit-slider-thumb]:hover:scale-110
                                    [&::-webkit-slider-thumb]:active:scale-95
                                    cursor-grab active:cursor-grabbing"
                            />
                            <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
                                <span>Conservative</span>
                                <span>Tactical Peak</span>
                                <span>Aggressive</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                <span className="text-indigo-400">AI Recommendation:</span> {threshold > 85 ? "Aggressive threshold prioritized reach over precision." : threshold < 40 ? "Conservative threshold ensures maximum deliverability." : "Optimal threshold identifies high-conversion segments."}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Auto-Optimization</h4>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Real-time Tactical adjustments</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPreferences({ ...preferences, autoOptimize: !preferences.autoOptimize })}
                            className={cn(
                                "h-6 w-12 rounded-full relative transition-all duration-300 pointer-events-auto",
                                preferences.autoOptimize ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-slate-800"
                            )}
                        >
                            <motion.div
                                animate={{ x: preferences.autoOptimize ? 24 : 4 }}
                                className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-lg"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
