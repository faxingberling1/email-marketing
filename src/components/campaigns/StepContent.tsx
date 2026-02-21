"use client"

import { Layout, Sparkles, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepContentProps {
    templates: any[]
    selectedId: string
    onSelect: (id: string) => void
}

export function StepContent({ templates, selectedId, onSelect }: StepContentProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* AI Generation Card */}
                <button
                    onClick={() => onSelect('ai_generate')}
                    className={cn(
                        "relative aspect-[3/4] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all group overflow-hidden",
                        selectedId === 'ai_generate'
                            ? "bg-indigo-500/10 border-indigo-500/40"
                            : "bg-white/[0.02] border-white/5 hover:border-white/20"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Wand2 className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Neural Synthesis</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Let AI build a high-conversion template from scratch based on mission briefing.</p>
                </button>

                {/* Template Cards */}
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={cn(
                            "relative aspect-[3/4] rounded-[2.5rem] border-2 flex flex-col items-center justify-center p-8 text-center transition-all group overflow-hidden bg-slate-900",
                            selectedId === template.id
                                ? "border-indigo-500 shadow-2xl shadow-indigo-500/20"
                                : "border-white/5 hover:border-white/20"
                        )}
                    >
                        <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all pointer-events-none">
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <Layout className="h-12 w-12 text-slate-700" />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 to-transparent">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{template.name}</h3>
                            <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                                <Sparkles className="h-2.5 w-2.5" />
                                <span className="text-[8px] font-black uppercase tracking-widest">{template.engagementScore}% Engagement</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
