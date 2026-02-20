"use client"

import { motion } from "framer-motion"
import {
    Layout,
    Heart,
    MoreHorizontal,
    Zap,
    Eye,
    Edit3,
    Sparkles,
    Clock,
    Search
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Template {
    id: string
    name: string
    description: string
    category: string
    engagementScore: number
    thumbnail: string
    lastEdited: string
    isFavorite?: boolean
}

interface PatternLibraryProps {
    templates: Template[]
    onSelect: (template: Template) => void
}

export function PatternLibrary({ templates, onSelect }: PatternLibraryProps) {
    const [filter, setFilter] = useState('All')

    const filteredTemplates = templates.filter(t =>
        filter === 'All' || t.category === filter
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Layout className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Strategy Pattern Library</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Creative Repository</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/5">
                        {['All', 'AI Recommended', 'User Created', 'Custom'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    filter === f ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-white"
                                )}
                            >
                                {f === 'AI Recommended' ? 'AI' : f === 'User Created' ? 'USER' : f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((t, i) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative rounded-[2.5rem] border border-white/5 bg-slate-900/40 overflow-hidden hover:border-indigo-500/30 transition-all flex flex-col"
                    >
                        {/* Thumbnail Area */}
                        <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden group-hover:bg-slate-900 transition-colors">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                                <Layout className="h-20 w-20 text-slate-700" />
                            </div>

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                                <button
                                    onClick={() => onSelect(t)}
                                    className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-indigo-500/20"
                                >
                                    <Edit3 className="h-5 w-5" />
                                </button>
                                <button className="h-12 w-12 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                                    <Eye className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Engagement Badge */}
                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <Zap className="h-3 w-3 text-emerald-400" />
                                <span className="text-[10px] font-black text-white">{t.engagementScore}%</span>
                            </div>

                            {t.category === 'AI Recommended' && (
                                <div className="absolute top-4 left-4 h-8 w-8 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-2">{t.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest line-clamp-1">{t.description}</p>
                                </div>
                                <button className="text-slate-500 hover:text-rose-400 transition-colors">
                                    <Heart className={cn("h-4 w-4", t.isFavorite && "fill-rose-400 text-rose-400")} />
                                </button>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-slate-600" />
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Edited {t.lastEdited}</span>
                                </div>
                                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                                    Initialize Orbit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
