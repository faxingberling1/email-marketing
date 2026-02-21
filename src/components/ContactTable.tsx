"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    MoreHorizontal,
    Users,
    Mail,
    Zap,
    Activity,
    Target,
    TrendingUp,
    AlertCircle,
    Download,
    Trash2,
    CheckCircle2,
    ArrowUpDown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Contact {
    id: string
    name: string
    email: string
    phone?: string
    businessName?: string
    tags?: string[]
    segment: string
    score: number
    activity: string
    status: 'Optimal' | 'Stable' | 'Critical' | 'Passive'
}

interface ContactTableProps {
    contacts: Contact[]
    onDelete?: (id: string) => void
    onMail?: (email: string) => void
}

export function ContactTable({ contacts = [], onDelete, onMail }: ContactTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState<{ key: keyof Contact; direction: 'asc' | 'desc' } | null>(null)

    const filteredAndSortedContacts = useMemo(() => {
        let result = [...contacts]

        // Filter
        if (searchTerm) {
            result = result.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.phone?.includes(searchTerm)
            )
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? ""
                const bValue = b[sortConfig.key] ?? ""

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return result
    }, [contacts, searchTerm, sortConfig])

    const handleSort = (key: keyof Contact) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400"
        if (score >= 40) return "text-indigo-400"
        return "text-rose-400"
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Optimal': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            case 'Critical': return "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
            case 'Stable': return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20"
        }
    }

    return (
        <div className="rounded-3xl border border-white/5 bg-slate-950/20 backdrop-blur-xl overflow-hidden flex flex-col h-full">
            {/* Table Header / Controls */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Contacts</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{filteredAndSortedContacts.length} Active Contacts</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border border-white/5 rounded-xl px-9 py-2 text-[10px] font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all w-full md:w-64 tracking-widest"
                        />
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-all">
                        <Filter className="h-4 w-4" />
                    </button>
                    <div className="h-6 w-[1px] bg-white/5 mx-1" />
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all">
                        <Download className="h-3.5 w-3.5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Scrollable Table Area */}
            <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th onClick={() => handleSort('name')} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                <div className="flex items-center gap-2">
                                    Name <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Segment</th>
                            <th onClick={() => handleSort('score')} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                <div className="flex items-center gap-2">
                                    Engagement <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {filteredAndSortedContacts.map((contact, i) => (
                                <motion.tr
                                    key={contact.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="group hover:bg-white/[0.02] transition-all"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-white/5 text-slate-400 group-hover:text-indigo-400 transition-colors">
                                                <Target className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-[12px] font-black text-white tracking-wide uppercase">{contact.name}</p>
                                                    {contact.businessName && (
                                                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                                                            {contact.businessName}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] font-bold text-slate-500 font-mono">{contact.email}</p>
                                                    {contact.phone && (
                                                        <p className="text-[10px] font-bold text-slate-600 font-mono border-l border-white/10 pl-3">{contact.phone}</p>
                                                    )}
                                                </div>
                                                {contact.tags && contact.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {contact.tags.map(tag => (
                                                            <span key={tag} className="text-[7px] px-1 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold border border-white/5 uppercase tracking-tighter">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                contact.segment.includes('Founder') ? "bg-indigo-400" :
                                                    contact.segment.includes('High') ? "bg-emerald-400" :
                                                        contact.segment.includes('Churn') ? "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]" : "bg-slate-400"
                                            )} />
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{contact.segment}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                                            <div className="flex items-center justify-between text-[10px] font-black tracking-widest">
                                                <span className={getScoreColor(contact.score)}>{contact.score}%</span>
                                                <span className="text-slate-500 uppercase">{contact.activity}</span>
                                            </div>
                                            <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${contact.score}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        contact.score >= 80 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" :
                                                            contact.score >= 40 ? "bg-indigo-500" : "bg-rose-500"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <div className={cn(
                                                "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-[0.2em]",
                                                getStatusStyles(contact.status)
                                            )}>
                                                {contact.status}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onMail?.(contact.email)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-indigo-400 hover:bg-white/10 transition-all"
                                            >
                                                <Mail className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete?.(contact.id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-white/10 transition-all font-bold"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>Showing {filteredAndSortedContacts.length} Contacts</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400/60 font-mono">Live Data</span>
                </div>
            </div>
        </div>
    )
}
