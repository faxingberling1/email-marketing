"use client"

import { motion } from "framer-motion"
import {
    Globe,
    ShieldCheck,
    AlertCircle,
    ShieldAlert,
    RefreshCcw,
    CheckCircle2,
    Target,
    Activity,
    Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Domain {
    domain: string
    status: string
    spf: boolean
    dkim: boolean
}

interface DomainSettingsProps {
    domains: Domain[]
}

export function DomainSettings({ domains }: DomainSettingsProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Globe className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Tactical Domain Grid</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SPF/DKIM Verification Surveillance</p>
                </div>
            </div>

            <div className="space-y-6">
                {domains.map((d, i) => (
                    <motion.div
                        key={d.domain}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-8 h-full"
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all",
                                d.status === 'Verified' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                            )}>
                                <Lock className="h-7 w-7" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-sm font-black text-white uppercase tracking-wider">{d.domain}</h4>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                                        d.status === 'Verified' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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
                            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-widest border border-white/5 transition-all">
                                DNS TELEMETRY <RefreshCcw className="h-3.5 w-3.5" />
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all">
                                CONFIGURE NODE
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 rounded-[2.5rem] border border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden group h-full">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-indigo-400" />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Domain Optimization Hub</h4>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest underline decoration-indigo-500/30">AI OPTIMIZATION IDENTIFIED</p>
                            <h5 className="text-xl font-black text-white tracking-widest">relay.antigravity.ai</h5>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end gap-2 text-emerald-400 mb-1">
                                <Activity className="h-4 w-4" />
                                <span className="text-lg font-black tracking-tighter">+4.2%</span>
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deliverability Forecast</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                        Deploying this subdomain for transactional syntheses minimizes bounce risk on enterprise segments.
                    </p>
                    <button className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 py-4 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.3em] transition-all shadow-xl shadow-indigo-500/20">
                        ACTIVATE OPTIMIZED DOMAIN <RefreshCcw className="h-3.5 w-3.5" />
                    </button>
                </div>
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>
        </div>
    )
}
