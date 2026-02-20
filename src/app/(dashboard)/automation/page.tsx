"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Zap,
    BarChart3,
    ArrowLeft,
    Activity,
    Target,
    MousePointer2,
    Search,
    Filter,
    Plus,
    ActivitySquare,
    Play,
    Settings2,
    Clock,
    Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SequenceFlow } from "@/components/SequenceFlow"
import { AutomationTriggers } from "@/components/AutomationTriggers"
import { RetargetingHub } from "@/components/RetargetingHub"
import { StepIntelligence } from "@/components/StepIntelligence"
import { getAutomationSequences, getSequenceFlow, getRetargetingInsights } from "./actions"

export default function AutomationPage() {
    const [view, setView] = useState<'hub' | 'editor'>('hub')
    const [sequences, setSequences] = useState<any[]>([])
    const [flowSteps, setFlowSteps] = useState<any[]>([])
    const [insights, setInsights] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSequence, setSelectedSequence] = useState<any>(null)

    useEffect(() => {
        async function loadHubData() {
            setLoading(true)
            const [seqResult, insightResult] = await Promise.all([
                getAutomationSequences(),
                getRetargetingInsights()
            ])
            setSequences(seqResult)
            setInsights(insightResult)
            setLoading(false)
        }
        loadHubData()
    }, [])

    const handleSelectSequence = async (seq: any) => {
        setLoading(true)
        setSelectedSequence(seq)
        const flow = await getSequenceFlow(seq.id)
        setFlowSteps(flow)
        setView('editor')
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Zap className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Syncing Sequence Intelligence...</p>
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
                        <ActivitySquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Orbital Orchestration</p>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase">
                            {view === 'hub' ? 'Automation Hub' : 'Sequence Architect'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {view === 'editor' && (
                        <button
                            onClick={() => setView('hub')}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all bg-white/5 border border-white/5"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Return to Hub
                        </button>
                    )}
                    <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2">
                        <Plus className="h-4 w-4" /> CREATE SEQUENCE
                    </button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {view === 'hub' ? (
                    <motion.div
                        key="hub"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {/* Sequences Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="grid grid-cols-1 gap-4">
                                {sequences.map((seq, i) => (
                                    <motion.div
                                        key={seq.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => handleSelectSequence(seq)}
                                        className="group p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 border border-white/5 transition-all">
                                                <Zap className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                                                        seq.status === 'Optimized' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                                    )}>
                                                        {seq.status}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Edited {seq.lastOptimization}</span>
                                                </div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-wider">{seq.name}</h3>
                                                <div className="flex items-center gap-6 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="h-3 w-3 text-slate-600" />
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{seq.steps} Steps</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Target className="h-3 w-3 text-slate-600" />
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{seq.activeContacts} Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Conversion</p>
                                            <h4 className="text-2xl font-black text-white tracking-widest">{seq.avgConversion}</h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <RetargetingHub insights={insights} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 xl:grid-cols-4 gap-8"
                    >
                        <div className="xl:col-span-3 space-y-8">
                            <SequenceFlow steps={flowSteps} />
                        </div>
                        <div className="xl:col-span-1 space-y-8">
                            <AutomationTriggers />
                            <StepIntelligence />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Signal Indicator */}
            <div className="flex items-center justify-center gap-10 pt-8 opacity-20 group">
                <div className="flex items-center gap-3">
                    <Settings2 className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Engine: V4-SYNTH</span>
                </div>
                <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div animate={{ x: [-80, 80] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="h-full w-10 bg-indigo-500/40" />
                </div>
                <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Nodes Synchronized</span>
                </div>
            </div>
        </div>
    )
}
