"use client"

import { ExternalLink, ShieldCheck } from "lucide-react"

export function ManageSubscriptionButtons() {
    return (
        <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-xl shadow-white/5">
                Stripe Customer Portal <ExternalLink className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-3 bg-white/5 border border-white/10 text-slate-400 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all">
                Update Security <ShieldCheck className="h-4 w-4" />
            </button>
        </div>
    )
}
