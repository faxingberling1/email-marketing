"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    HelpCircle,
    Search,
    Activity,
    BookOpen,
    Bot,
    Video,
    Ticket,
    Star,
    Sparkles,
    Zap,
    TrendingUp,
    ShieldCheck,
    Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { KnowledgeGrid } from "@/components/KnowledgeGrid"
import { GuidanceHub } from "@/components/GuidanceHub"
import { SupportBot } from "@/components/SupportBot"
import { getKnowledgeBase, getTutorialGuides, getNextStepRecommendation, getSupportTickets } from "./actions"

export default function HelpPage() {
    const [articles, setArticles] = useState<any[]>([])
    const [tutorials, setTutorials] = useState<any[]>([])
    const [tickets, setTickets] = useState<any[]>([])
    const [recommendation, setRecommendation] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadHelpData() {
            setLoading(true)
            const [artResult, tutResult, recResult, tkResult] = await Promise.all([
                getKnowledgeBase(),
                getTutorialGuides(),
                getNextStepRecommendation(),
                getSupportTickets()
            ])
            setArticles(artResult)
            setTutorials(tutResult)
            setRecommendation(recResult)
            setTickets(tkResult)
            setLoading(false)
        }
        loadHelpData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <HelpCircle className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Synchronizing Neural Guidance...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-24 relative">
            {/* Header Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5 px-8 py-8 backdrop-blur-md"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <HelpCircle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Neural Support System</p>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase">Support Center</h1>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Status</p>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Fully Operational</p>
                        </div>
                        <div className="h-10 w-[1px] bg-white/5" />
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Node Latency</p>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">12ms</p>
                        </div>
                    </div>
                    <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 transition-all">
                        SUBMIT REQUEST
                    </button>
                </div>
            </motion.div>

            {/* Content Orbit */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
                {/* Knowledge Repository */}
                <div className="xl:col-span-3 space-y-8 h-full">
                    <KnowledgeGrid articles={articles} />
                </div>

                {/* Guidance Hub */}
                <div className="xl:col-span-2 space-y-8 h-full">
                    <GuidanceHub
                        tutorials={tutorials}
                        tickets={tickets}
                        recommendation={recommendation}
                    />
                </div>
            </div>

            {/* Neural Bot Overlay */}
            <SupportBot />

            {/* Global Signal Indicator */}
            <div className="flex items-center justify-center gap-10 pt-12 opacity-20 group">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Node Protocol: SECURE</span>
                </div>
                <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div animate={{ x: [-80, 80] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="h-full w-10 bg-indigo-500/40" />
                </div>
                <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Multi-Orbital Guidance</span>
                </div>
            </div>
        </div>
    )
}
