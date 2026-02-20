"use client"

import { motion } from "framer-motion"
import {
    Zap,
    MousePointer2,
    Mail,
    Users,
    ShoppingCart,
    TrendingUp,
    ArrowRight,
    Target,
    Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

const TRIGGER_TYPES = [
    { id: 'open', label: 'Email Open', icon: Mail, description: 'Triggers when a contact opens a tactical campaign.' },
    { id: 'click', label: 'Link Click', icon: MousePointer2, description: 'Triggers on interaction with specific creative CTAs.' },
    { id: 'segment', label: 'Segment Join', icon: Users, description: 'Triggers when AI auto-clusters move a contact.' },
    { id: 'cart', label: 'Abandoned Cart', icon: ShoppingCart, description: 'Triggers on session expiration with pending items.' },
]

export function AutomationTriggers() {
    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Orbital Trigger Setup</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Behavioral Event Configuration</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {TRIGGER_TYPES.map((t, i) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 border border-white/5 group-hover:border-indigo-500/20 transition-all">
                                    <t.icon className="h-5 w-5" />
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrendingUp className="h-3 w-3 text-indigo-400" />
                                    <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">AI Recommended</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{t.label}</h4>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{t.description}</p>
                            </div>
                        </div>

                        <button className="mt-6 flex items-center justify-between group/btn text-indigo-400 hover:text-indigo-300 transition-colors">
                            <span className="text-[8px] font-black uppercase tracking-widest">Select Trigger</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <Activity className="h-5 w-5 text-indigo-400" />
                    <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Tactical Tip</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                            "Link Click" triggers show +12% higher conversion when paired with instant "Wait" steps.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
