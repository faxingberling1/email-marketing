"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Plus,
    Rocket,
    BarChart3,
    Zap,
    Activity,
    BrainCircuit,
    Sparkles,
    Mail
} from "lucide-react"
import { CampaignTable } from "@/components/CampaignTable"
import { CreateCampaignModal } from "@/components/CreateCampaignModal"
import { getCampaignsData } from "./actions"

export default function CampaignsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    async function loadData() {
        setLoading(true)
        const result = await getCampaignsData()
        setData(result)
        setLoading(false)
    }

    useEffect(() => {
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
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Loading campaigns...</p>
            </div>
        )
    }

    const campaigns = data?.campaigns || []
    const stats = data?.stats || {}
    const hasCampaigns = campaigns.length > 0

    return (
        <div className="space-y-8 pb-12">
            {/* Header Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-3xl border border-indigo-500/20 bg-indigo-500/5 px-8 py-6 backdrop-blur-md"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Activity className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Campaigns</p>
                        <h1 className="text-xl font-black text-white tracking-tight">Manage Campaigns</h1>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all group"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    New Campaign
                </button>
            </motion.div>

            {hasCampaigns ? (
                <>
                    {/* Tactical Briefing Stats — only shown when real data exists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl group hover:border-indigo-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400">
                                    <Rocket className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    {stats.totalCampaigns} campaign{stats.totalCampaigns !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Sent</p>
                                <h3 className="text-2xl font-black text-white tracking-tighter">
                                    {stats.totalSent?.toLocaleString() ?? '0'}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl group hover:border-purple-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Live Data</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg. Open Rate</p>
                                <h3 className="text-2xl font-black text-white tracking-tighter">
                                    {stats.avgOpenRate !== null && stats.avgOpenRate !== undefined ? `${stats.avgOpenRate}%` : '—'}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="h-16 w-16 text-indigo-400" />
                            </div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                    <BrainCircuit className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI Active</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg. Click Rate</p>
                                <h3 className="text-2xl font-black text-white tracking-tighter">
                                    {stats.avgClickRate !== null && stats.avgClickRate !== undefined ? `${stats.avgClickRate}%` : '—'}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Campaign Intelligence Hub */}
                    <div className="space-y-4">
                        <CampaignTable campaigns={campaigns} onRefresh={loadData} />
                    </div>
                </>
            ) : (
                /* Empty State for new users */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-32 gap-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                            <Mail className="h-10 w-10 text-indigo-400" />
                        </div>
                    </div>
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">No Campaigns Yet</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Launch your first campaign to start reaching your audience. Use AI to generate compelling subject lines and content in seconds.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 px-8 py-4 rounded-2xl text-sm font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all group"
                    >
                        <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                        Create Your First Campaign
                    </button>
                </motion.div>
            )}

            {/* Campaign Creation Modal */}
            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    loadData()
                }}
                segments={data?.segments || []}
                plan={data?.plan || 'free'}
                quotas={data?.quotas || { ai: { remaining: 0 }, emails: { remaining: 0 } }}
            />
        </div>
    )
}
