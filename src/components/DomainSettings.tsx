"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe,
    ShieldCheck,
    AlertCircle,
    RefreshCcw,
    CheckCircle2,
    Target,
    Activity,
    Lock,
    X,
    Plus,
    Loader2,
    Trash2,
    Copy,
    Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { addDomain, refreshDomainStatus, removeDomain } from "@/app/(dashboard)/settings/actions"

interface Domain {
    id: string
    domain: string
    status: string
    spf: boolean
    dkim: boolean
    records: any[]
}

interface DomainSettingsProps {
    domains: Domain[]
}

export function DomainSettings({ domains: initialDomains }: DomainSettingsProps) {
    const [domains, setDomains] = useState(initialDomains)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newDomain, setNewDomain] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const [refreshingId, setRefreshingId] = useState<string | null>(null)
    const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
    const [copiedValue, setCopiedValue] = useState<string | null>(null)

    const handleAddDomain = async () => {
        if (!newDomain.includes(".")) {
            alert("Invalid Domain Protocol: Please enter a valid domain name.")
            return
        }
        setIsAdding(true)
        try {
            const res = await addDomain(newDomain)
            if (res.success) {
                setNewDomain("")
                setIsAddModalOpen(false)
                window.location.reload() // Simple reload to refresh the RSC data
            } else {
                alert(res.error)
            }
        } finally {
            setIsAdding(false)
        }
    }

    const handleRefresh = async (id: string) => {
        setRefreshingId(id)
        try {
            const res = await refreshDomainStatus(id)
            if (res.success) {
                // Update local state for immediate feedback
                setDomains(domains.map(d => d.id === id ? { ...d, status: res.status as string, dkim: res.status === 'verified' } : d))
            } else {
                alert(res.error)
            }
        } finally {
            setRefreshingId(null)
        }
    }

    const handleRemove = async (id: string) => {
        if (!confirm("Are you sure you want to terminate this domain node? All associated relays will be offline.")) return
        try {
            const res = await removeDomain(id)
            if (res.success) {
                setDomains(domains.filter(d => d.id !== id))
            } else {
                alert(res.error)
            }
        } catch (error) {
            alert("Internal Protocol Failure")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedValue(text)
        setTimeout(() => setCopiedValue(null), 2000)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Globe className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Tactical Domain Grid</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SPF/DKIM Verification Surveillance</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all"
                >
                    ADD DOMAIN <Plus className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="space-y-6">
                {domains.length === 0 && (
                    <div className="p-12 text-center rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.02]">
                        <Globe className="h-12 w-12 text-slate-700 mx-auto mb-4 opacity-20" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active domains identified</p>
                    </div>
                )}

                {domains.map((d, i) => (
                    <motion.div
                        key={d.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col rounded-[2.5rem] border border-white/5 bg-slate-900/40 overflow-hidden"
                    >
                        <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all",
                                    d.status === 'verified' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                )}>
                                    <Lock className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-sm font-black text-white uppercase tracking-wider">{d.domain}</h4>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                                            d.status === 'verified' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {d.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", d.spf ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-rose-400")} />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SPF AUTH</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", d.dkim ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-rose-400")} />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">DKIM AUTH</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleRefresh(d.id)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-widest border border-white/5 transition-all"
                                >
                                    {refreshingId === d.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                                    REFRESH STATUS
                                </button>
                                <button
                                    onClick={() => setExpandedDomain(expandedDomain === d.id ? null : d.id)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all"
                                >
                                    DNS TELEMETRY
                                </button>
                                <button
                                    onClick={() => handleRemove(d.id)}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 border border-white/5 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Telemetry Panel */}
                        <AnimatePresence>
                            {expandedDomain === d.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-black/20 border-t border-white/5 p-8"
                                >
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Required DNS Protocols</h5>
                                            <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-1 rounded">Add these TXT records to your DNS provider</span>
                                        </div>
                                        <div className="grid gap-4">
                                            {d.records?.map((record, rid) => (
                                                <div key={rid} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-white uppercase tracking-[0.1em]">{record.name} ({record.type})</span>
                                                        <div className={cn(
                                                            "px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                                                            record.status === 'verified' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                                                        )}>
                                                            {record.status}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[10px] text-slate-400 break-all relative group/copy">
                                                        <div className="flex-1 pr-10">{record.value}</div>
                                                        <button
                                                            onClick={() => copyToClipboard(record.value)}
                                                            className="absolute right-2 p-1.5 hover:bg-white/10 rounded-md transition-all text-indigo-400"
                                                        >
                                                            {copiedValue === record.value ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Add Domain Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Globe className="h-32 w-32 text-indigo-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Deploy Domain Node</h3>
                                    </div>
                                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Target FQDN</label>
                                        <input
                                            type="text"
                                            placeholder="mail.yourdomain.com"
                                            value={newDomain}
                                            onChange={(e) => setNewDomain(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all"
                                        />
                                    </div>

                                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
                                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                        <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest leading-relaxed">
                                            Ensure you have administrative access to your DNS provider to add the required DKIM and SPF relay records.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleAddDomain}
                                        disabled={isAdding || !newDomain}
                                        className="w-full py-5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "INITIALIZE NODE"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
