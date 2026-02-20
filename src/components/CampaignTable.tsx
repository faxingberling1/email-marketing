"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    ArrowUpDown,
    ChevronRight,
    MoreHorizontal,
    Mail,
    BarChart3,
    Sparkles,
    Eye,
    Edit2,
    Trash2,
    Calendar,
    Target
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Campaign {
    id: string
    name: string
    sentDate: string
    status: 'Active' | 'Scheduled' | 'Paused'
    sentCount: string
    openRate: string
    clickRate: string
    retargetRecommended: boolean
    nextLaunchSuggestion: string
}

interface CampaignTableProps {
    campaigns: Campaign[]
}

export function CampaignTable({ campaigns = [] }: CampaignTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortConfig, setSortConfig] = useState<{ key: keyof Campaign; direction: 'asc' | 'desc' } | null>(null)

    // Filter and Sort Logic
    const filteredAndSortedCampaigns = useMemo(() => {
        let result = [...campaigns]

        // Filter
        if (searchTerm) {
            result = result.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (statusFilter !== "all") {
            result = result.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase())
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key]
                const bValue = b[sortConfig.key]

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return result
    }, [campaigns, searchTerm, statusFilter, sortConfig])

    const handleSort = (key: keyof Campaign) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    return (
        <div className="rounded-3xl border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden flex flex-col h-full min-h-[500px]">
            {/* Table Header / Controls */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <Mail className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Campaign Intelligence</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{filteredAndSortedCampaigns.length} Active Records</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH FREQUENCY..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9 w-full md:w-[240px] rounded-xl bg-slate-900/50 border border-white/5 pl-9 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 rounded-xl bg-slate-900/50 border border-white/5 px-3 text-[10px] font-black tracking-widest text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer uppercase"
                    >
                        <option value="all">ALL STATUS</option>
                        <option value="active">ACTIVE</option>
                        <option value="scheduled">SCHEDULED</option>
                        <option value="paused">PAUSED</option>
                    </select>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <button onClick={() => handleSort('name')} className="flex items-center gap-2 hover:text-white transition-colors">
                                    Campaign Entity <ArrowUpDown className="h-3 w-3" />
                                </button>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <button onClick={() => handleSort('sentCount' as any)} className="flex items-center gap-2 hover:text-white transition-colors">
                                    Dispatched <ArrowUpDown className="h-3 w-3" />
                                </button>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <button onClick={() => handleSort('openRate')} className="flex items-center gap-2 hover:text-white transition-colors">
                                    Open % <ArrowUpDown className="h-3 w-3" />
                                </button>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <button onClick={() => handleSort('clickRate')} className="flex items-center gap-2 hover:text-white transition-colors">
                                    Click % <ArrowUpDown className="h-3 w-3" />
                                </button>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Intelligence</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {filteredAndSortedCampaigns.map((campaign, i) => (
                                <motion.tr
                                    key={campaign.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={cn(
                                        "group/row relative hover:bg-white/[0.02] transition-colors",
                                        campaign.retargetRecommended && "bg-indigo-500/[0.02]"
                                    )}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-white tracking-wide group-hover/row:text-indigo-400 transition-colors">
                                                {campaign.name}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-500 text-uppercase tracking-tighter">
                                                INITIATED: {campaign.sentDate}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border",
                                            campaign.status === 'Active' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                            campaign.status === 'Scheduled' && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                            campaign.status === 'Paused' && "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                        )}>
                                            <div className={cn(
                                                "h-1 w-1 rounded-full",
                                                campaign.status === 'Active' && "bg-emerald-400 animate-pulse",
                                                campaign.status === 'Scheduled' && "bg-amber-400",
                                                campaign.status === 'Paused' && "bg-rose-400"
                                            )} />
                                            {campaign.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold font-mono text-white">{campaign.sentCount}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5 w-16">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-white">{campaign.openRate}</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: campaign.openRate }}
                                                    className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5 w-16">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-white">{campaign.clickRate}</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: campaign.clickRate }}
                                                    className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            {campaign.retargetRecommended && (
                                                <div className="relative group/tip">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                                        <Target className="h-4 w-4" />
                                                    </div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/tip:opacity-100 transition-all pointer-events-none z-30 min-w-[200px]">
                                                        <div className="bg-slate-900/95 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <Sparkles className="h-3 w-3 text-indigo-400" />
                                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Retarget Recommended</span>
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-300 leading-relaxed italic">
                                                                Low engagement detected relative to segment benchmarks.
                                                            </p>
                                                        </div>
                                                        <div className="w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="relative group/tip">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-500 border border-white/5 hover:border-white/20 transition-all">
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/tip:opacity-100 transition-all pointer-events-none z-30 min-w-[240px]">
                                                    <div className="bg-slate-900/95 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                                                        <div className="flex items-center gap-1.5 mb-1.5">
                                                            <Sparkles className="h-3 w-3 text-cyan-400" />
                                                            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Next Phase Optimal Window</span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-300 leading-relaxed italic">
                                                            {campaign.nextLaunchSuggestion}
                                                        </p>
                                                    </div>
                                                    <div className="w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all border border-white/5 hover:border-indigo-500/30">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/5 hover:border-rose-500/30">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination / Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Showing 1 to {filteredAndSortedCampaigns.length} of {campaigns.length} entries</span>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50" disabled>Previous</button>
                    <button className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/20 transition-all">Next</button>
                </div>
            </div>
        </div>
    )
}
