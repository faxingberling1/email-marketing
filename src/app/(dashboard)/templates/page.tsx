"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Layout,
    LayoutGrid,
    PenTool,
    Sparkles,
    Zap,
    Globe,
    ArrowLeft,
    Search,
    Filter,
    Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PatternLibrary } from "@/components/PatternLibrary"
import { TemplateVisualEditor } from "@/components/TemplateVisualEditor"
import { TemplateNeuralHUD } from "@/components/TemplateNeuralHUD"
import { getTemplates } from "./actions"

export default function TemplatesPage() {
    const [view, setView] = useState<'library' | 'editor'>('library')
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

    useEffect(() => {
        async function loadTemplates() {
            setLoading(true)
            const result = await getTemplates()
            setTemplates(result)
            setLoading(false)
        }
        loadTemplates()
    }, [])

    const handleSelectTemplate = (template: any) => {
        setSelectedTemplate(template)
        setView('editor')
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Layout className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Synthesizing Pattern Library...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-3xl border border-indigo-500/20 bg-indigo-500/5 px-8 py-6 backdrop-blur-md"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {view === 'library' ? <LayoutGrid className="h-6 w-6" /> : <PenTool className="h-6 w-6" />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Creative Intelligence</p>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase">
                            {view === 'library' ? 'Pattern Repository' : 'Visual Orchestration'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {view === 'editor' && (
                        <button
                            onClick={() => setView('library')}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all bg-white/5 border border-white/5"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Return to Orbit
                        </button>
                    )}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH PATTERNS..."
                            className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-2.5 text-[10px] font-black text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all uppercase tracking-widest w-64"
                        />
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {view === 'library' ? (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-12"
                    >
                        {/* Featured AI Patterns */}
                        <div className="p-10 rounded-[3rem] border border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-125 transition-transform">
                                <Sparkles className="h-48 w-48 text-indigo-400" />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="h-4 w-4 text-indigo-400" />
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Neural Recommendation Engine</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-white tracking-tighter">SYNTHESIZED HIGH-PERFORMERS</h2>
                                    </div>
                                    <button
                                        onClick={() => setView('editor')}
                                        className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all scale-105 active:scale-95"
                                    >
                                        INITIALIZE BLANK CANVAS
                                    </button>
                                </div>
                                <PatternLibrary
                                    templates={templates}
                                    onSelect={handleSelectTemplate}
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 xl:grid-cols-4 gap-8"
                    >
                        <div className="xl:col-span-3">
                            <TemplateVisualEditor />
                        </div>
                        <div className="xl:col-span-1">
                            <TemplateNeuralHUD />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tactical Status */}
            <div className="flex items-center justify-center gap-10 pt-8 opacity-20 group">
                <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Creative Engine: Stable</span>
                </div>
                <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div animate={{ x: [-80, 80] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="h-full w-10 bg-indigo-500/40" />
                </div>
                <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Sync Node: Patterns-V2</span>
                </div>
            </div>
        </div>
    )
}
