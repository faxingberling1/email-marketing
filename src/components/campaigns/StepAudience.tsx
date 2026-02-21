"use client"

import { Users, FileUp, Sparkles, Filter, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepAudienceProps {
    segments: any[]
    selectedId: string
    onSelect: (id: string) => void
    plan: string
}

export function StepAudience({ segments, selectedId, onSelect, plan }: StepAudienceProps) {
    const isFree = plan === 'free'

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="h-3 w-3" /> Core Audience Segments
                    </label>
                    <div className="space-y-3">
                        {segments.map((seg) => (
                            <button
                                key={seg.id}
                                onClick={() => onSelect(seg.id)}
                                className={cn(
                                    "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                                    selectedId === seg.id
                                        ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                                )}
                            >
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest">{seg.name}</div>
                                    <div className="text-[9px] font-bold text-slate-500">{seg.count.toLocaleString()} Contacts</div>
                                </div>
                                {selectedId === seg.id && <Sparkles className="h-4 w-4 text-indigo-400" />}
                            </button>
                        ))}

                        <button className="w-full p-4 rounded-2xl border border-dashed border-white/10 text-slate-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-3">
                            <FileUp className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Import CSV Audience</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> AI Behavioral Clusters
                    </label>
                    <div className="space-y-3">
                        {[
                            { name: 'Hyper-Engaged (90d)', desc: 'Users with > 40% open rate.', icon: Filter, locked: isFree },
                            { name: 'Churn-Risk Watch', desc: 'Inactive for > 30 days.', icon: Filter, locked: isFree },
                            { name: 'High-Value Whales', desc: 'Top 5% by LTV / Revenue.', icon: Filter, locked: plan !== 'pro' }
                        ].map((cluster) => (
                            <button
                                key={cluster.name}
                                disabled={cluster.locked}
                                className={cn(
                                    "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                                    cluster.locked
                                        ? "bg-slate-900 border-white/5 opacity-50 cursor-not-allowed border-dashed"
                                        : "bg-white/5 border-white/5 text-slate-400 hover:border-indigo-500/30"
                                )}
                            >
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        {cluster.name}
                                        {cluster.locked && <Lock className="h-2.5 w-2.5" />}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.05em]">{cluster.desc}</div>
                                </div>
                                {!cluster.locked && <Filter className="h-4 w-4 text-slate-700 group-hover:text-indigo-400" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isFree && (
                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                    <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pro Insight Available</p>
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                            AI Clusters can increase open rates by 24%. <span className="text-white underline cursor-pointer">Upgrade to Starter</span> to unlock.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
