"use client"

import { Type, Info } from "lucide-react"

interface StepIdentityProps {
    data: { name: string; description: string; senderEmail: string }
    onChange: (data: any) => void
}

export function StepIdentity({ data, onChange }: StepIdentityProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Type className="h-3 w-3" /> Mission Designation
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                    placeholder="E.G. PRODUCT_LAUNCH_ALPHA_24..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-mono uppercase tracking-[0.1em]"
                />
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    Strategic Description
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    placeholder="BRIEF THE SYSTEM ON THE GOALS OF THIS MISSION..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-5 text-sm font-medium text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all min-h-[120px]"
                />
            </div>

            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                <Info className="h-5 w-5 text-indigo-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                    Campaign identity is used for internal orchestration and audit logging.
                    Ensure designation follows your organization's naming protocol.
                </p>
            </div>
        </div>
    )
}
