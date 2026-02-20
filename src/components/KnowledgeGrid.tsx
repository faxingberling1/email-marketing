"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Search,
    BookOpen,
    Clock,
    ChevronRight,
    Star,
    Filter,
    Activity,
    BrainCircuit
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Article {
    id: string
    title: string
    category: string
    readTime: string
    resonance: number
}

interface KnowledgeGridProps {
    articles: Article[]
}

export function KnowledgeGrid({ articles: initialArticles }: KnowledgeGridProps) {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = ['All', 'Strategic', 'Automation', 'AI Tools', 'Analytics']

    const filteredArticles = initialArticles.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = activeCategory === 'All' || a.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Intelligence Grid</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Searchable Knowledge Repository</p>
                    </div>
                </div>

                <div className="relative group max-w-sm w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH NERUAL ARTICLES..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/5 group-hover:border-indigo-500/30 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-[0.2em]"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 px-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border",
                            activeCategory === cat
                                ? "bg-indigo-500 text-white border-indigo-500 shadow-xl shadow-indigo-500/20"
                                : "bg-white/5 text-slate-500 border-white/5 hover:text-white"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {filteredArticles.map((article, i) => (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase tracking-[0.2em]">
                                    {article.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[10px] tracking-widest">
                                    <Activity className="h-3.5 w-3.5" />
                                    {article.resonance}% RESONANCE
                                </div>
                            </div>
                            <h4 className="text-lg font-black text-white uppercase tracking-wider group-hover:text-indigo-400 transition-colors uppercase leading-tight">{article.title}</h4>
                        </div>

                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{article.readTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <BrainCircuit className="h-3.5 w-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">AI Augmented</span>
                                </div>
                            </div>
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-all border border-white/5 group-hover:border-indigo-500">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 flex items-center gap-5">
                <Star className="h-6 w-6 text-indigo-400" />
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                    <span className="text-indigo-400">Pro Tip:</span> Use "Neural Metrics" to automatically correlate knowledge gaps with campaign performance drops.
                </p>
            </div>
        </div>
    )
}
