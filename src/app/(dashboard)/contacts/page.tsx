"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus,
    Users,
    UserPlus,
    Search,
    BrainCircuit,
    Zap,
    Activity,
    Radar,
    AlertCircle,
    Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactTable } from "@/components/ContactTable"
import { SegmentClusters } from "@/components/SegmentClusters"
import { ImportContactsModal } from "@/components/ImportContactsModal"
import { getContactsData } from "./actions"

export default function ContactsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isImportOpen, setIsImportOpen] = useState(false)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const result = await getContactsData()
            setData(result)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Zap className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Synchronizing Relationship Intelligence...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Status Bar (Sub-header) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-3xl border border-indigo-500/20 bg-indigo-500/5 px-8 py-6 backdrop-blur-md"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Entity Database Hub</p>
                        <h1 className="text-xl font-black text-white tracking-tight">RELATIONSHIP TACTICS</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsImportOpen(true)}
                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/5 transition-all group"
                    >
                        <Download className="h-4 w-4" />
                        Import Packets
                    </button>
                    <button
                        className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all group"
                    >
                        <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                        New Entity
                    </button>
                </div>
            </motion.div>

            {/* Tactical Intelligence HUDs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SegmentClusters clusters={data?.clusters || []} />
                </div>

                {/* Relationship Radar Panel */}
                <div className="p-6 rounded-[2.5rem] border border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Radar className="h-32 w-32 text-indigo-400 animate-pulse" />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <Radar className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Relationship Radar</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg. Conversion Likelihood</span>
                                <span className="text-xl font-black text-emerald-400 tracking-tighter">{data?.predictions?.avgLikelihoodToConvert}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Predicted Churn Orbit</span>
                                <span className="text-xl font-black text-rose-400 tracking-tighter">{data?.predictions?.predictedChurnRate}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5 text-indigo-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">At-Risk Entities</span>
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter">{data?.predictions?.atRiskCount}</span>
                            </div>
                        </div>
                    </div>

                    <button className="mt-8 w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl text-[8px] font-black text-white uppercase tracking-[0.3em] transition-all relative z-10 border border-white/5">
                        Launch Retention Sequence
                    </button>
                </div>
            </div>

            {/* Tactical Contacts Table */}
            <div className="space-y-4">
                <ContactTable contacts={data?.contacts || []} />
            </div>

            {/* Tactical Ingress Modal */}
            <ImportContactsModal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
            />
        </div>
    )
}
