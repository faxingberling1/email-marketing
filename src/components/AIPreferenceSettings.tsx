"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    BrainCircuit,
    Zap,
    Globe,
    Sliders,
    Target,
    MessageSquare,
    TrendingUp,
    Shield,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

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

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Neural Configuration</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI & Tactical Tuning Console</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Default Synthesis Preferences */}
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

                {/* Behavioral Optimization */}
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
                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                <span>Conservative</span>
                                <span>Tactical Peak</span>
                                <span>Aggressive</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                <span className="text-indigo-400">AI Recommendation:</span> 78% Threshold identifies high-conversion SaaS Founders with minimal churn risk.
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
