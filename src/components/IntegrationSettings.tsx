"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Link,
    RefreshCcw,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    Plus,
    Activity,
    ShieldCheck,
    AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { syncIntegration } from "@/app/(dashboard)/settings/actions"

interface Integration {
    id: string
    name: string
    status: string
    lastSync: string
}

interface IntegrationSettingsProps {
    integrations: Integration[]
}

export function IntegrationSettings({ integrations: initialIntegrations }: IntegrationSettingsProps) {
    const [integrations, setIntegrations] = useState(initialIntegrations)
    const [isSyncing, setIsSyncing] = useState<string | null>(null)

    const handleSync = async (id: string) => {
        setIsSyncing(id)
        const result = await syncIntegration(id)
        setIsSyncing(null)
        if (result.success) {
            setIntegrations(prev => prev.map(int =>
                int.id === id ? { ...int, lastSync: "Just now" } : int
            ))
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Connected': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            case 'Active': return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            case 'Pending': return "bg-amber-500/10 text-amber-400 border-amber-500/20"
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20"
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Link className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Global Integration Nodes</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cross-Platform Synchronization Hub</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/5 transition-all">
                    ADD NODE <Plus className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration, i) => (
                    <motion.div
                        key={integration.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-6 rounded-[2.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden transition-all hover:border-purple-500/30"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-purple-400 border border-white/5 transition-all">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div className={cn(
                                "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                                getStatusStyles(integration.status)
                            )}>
                                {integration.status}
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-purple-400 transition-colors">{integration.name}</h4>
                            <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-slate-600" />
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Last Orbital Sync: {integration.lastSync}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <button
                                onClick={() => handleSync(integration.id)}
                                disabled={isSyncing === integration.id}
                                className="flex items-center gap-2 text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors disabled:opacity-50"
                            >
                                <RefreshCcw className={cn("h-3.5 w-3.5", isSyncing === integration.id && "animate-spin")} />
                                {isSyncing === integration.id ? 'SYNCING...' : 'SYNC NODE'}
                            </button>
                            <button className="text-slate-600 hover:text-white transition-colors">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-purple-500/5 blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>

            <div className="p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Tactical Integrity Sync</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">All nodes reporting 100% data fidelity.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Orbital Health Optimal</span>
                </div>
            </div>
        </div>
    )
}
