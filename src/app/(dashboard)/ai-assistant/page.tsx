"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BrainCircuit,
    Sparkles,
    Zap,
    Activity,
    Target,
    BarChart3,
    PenTool,
    Library,
    ChevronRight,
    Search
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SubjectGenerator } from "@/components/SubjectGenerator"
import { CopyComposer } from "@/components/CopyComposer"
import { IntelligenceDashboard } from "@/components/IntelligenceDashboard"
import { TemplateLibrary } from "@/components/TemplateLibrary"
import { getAIIntelligence, getAITemplates } from "./actions"

export default function AIAssistantPage() {
    const [data, setData] = useState<any>(null)
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'create' | 'optimize' | 'library'>('create')

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [intel, temps] = await Promise.all([
                getAIIntelligence(),
                getAITemplates()
            ])
            setData(intel)
            setTemplates(temps)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <BrainCircuit className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Neural Interface...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* AI Assistant Sub-Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5 px-8 py-8 backdrop-blur-md gap-6"
            >
                <div className="flex items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] relative">
                        <BrainCircuit className="h-8 w-8" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950"
                        />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/60 mb-1">Central Intelligence Hub</p>
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">AI Assistant Console</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5">
                    {[
                        { id: 'create', label: 'Create', icon: PenTool },
                        { id: 'optimize', label: 'Optimize', icon: Activity },
                        { id: 'library', label: 'Library', icon: Library },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id
                                    ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                    : "text-slate-500 hover:text-white"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'create' && (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                    >
                        <SubjectGenerator />
                        <CopyComposer />
                    </motion.div>
                )}

                {activeTab === 'optimize' && (
                    <motion.div
                        key="optimize"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <IntelligenceDashboard
                            forecasts={data?.performanceForecasts || []}
                            issues={data?.underperformingAreas || []}
                            windows={data?.optimalSendWindows || []}
                        />
                    </motion.div>
                )}

                {activeTab === 'library' && (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400">
                                    <Library className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Tactical Template Library</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pre-Built Intelligence Patterns</p>
                                </div>
                            </div>
                            <div className="relative group w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transition-colors group-focus-within:text-indigo-400" />
                                <input
                                    type="text"
                                    placeholder="SEARCH PATTERNS..."
                                    className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-10 py-2.5 text-[10px] font-bold text-white uppercase tracking-widest focus:outline-none focus:border-indigo-500/30"
                                />
                            </div>
                        </div>
                        <TemplateLibrary templates={templates} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
