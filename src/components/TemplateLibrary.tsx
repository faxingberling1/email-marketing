"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Layout,
    Globe,
    Palette,
    Star,
    Search,
    ChevronRight,
    Sparkles,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Template {
    id: string
    name: string
    category: string
    languages: string[]
    tone: string
    rating: number
}

interface TemplateLibraryProps {
    templates: Template[]
}

export function TemplateLibrary({ templates = [] }: TemplateLibraryProps) {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))]

    const filteredTemplates = templates.filter(t =>
        selectedCategory === "All" || t.category === selectedCategory
    )

    return (
        <div className="space-y-6">
            {/* Header / Filter HUD */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Layout className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Template Intelligence</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Generated Library</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                selectedCategory === cat
                                    ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                    : "text-slate-500 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredTemplates.map((template, i) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative flex flex-col rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-purple-500/30 transition-all p-6"
                    >
                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black text-white">{template.rating}</span>
                        </div>

                        {/* Category Label */}
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2">{template.category}</span>

                        <h3 className="text-sm font-bold text-white mb-6 group-hover:text-purple-400 transition-colors">
                            {template.name}
                        </h3>

                        {/* Metadata HUD */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LANGS</span>
                                </div>
                                <div className="flex gap-1">
                                    {template.languages.map(l => (
                                        <span key={l} className="text-[9px] font-black text-white bg-slate-800 px-1.5 py-0.5 rounded border border-white/5">{l}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Palette className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TONE</span>
                                </div>
                                <span className="text-[10px] font-black text-purple-400 uppercase">{template.tone}</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <button className="w-full relative overflow-hidden rounded-2xl bg-white/10 py-3.5 text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all hover:bg-purple-600 group/btn">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Deploy Template
                                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </span>
                        </button>

                        {/* AI Optimized Marker */}
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AI Readiness: 100% Verified</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
