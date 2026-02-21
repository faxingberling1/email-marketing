"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Activity,
    BarChart3,
    TrendingUp,
    Target,
    Zap,
    Radar,
    ActivitySquare,
    Globe,
    Calendar,
    Filter,
    ArrowUpRight,
    BrainCircuit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EngagementOverview } from "@/components/EngagementOverview"
import { CampaignComparison } from "@/components/CampaignComparison"
import { SegmentAnalytics } from "@/components/SegmentAnalytics"
import { ABTestingReports } from "@/components/ABTestingReports"
import { getAnalyticsData } from "./actions"

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [timeframe, setTimeframe] = useState('7D')

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const result = await getAnalyticsData()
            setData(result)
            setLoading(false)
        }
        loadData()
    }, [timeframe])

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <BarChart3 className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Loading analytics...</p>
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
                        <ActivitySquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Analytics</p>
                        <h1 className="text-xl font-black text-white tracking-tight">Performance Overview</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/5">
                        {['7D', '30D', '90D', 'ALL'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all",
                                    timeframe === t ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-all">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>

            {/* Top Row: Strategic Forecast & Engagement Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <EngagementOverview data={data?.engagementOverview} />
                </div>

                {/* Growth Orb Panel */}
                <div className="p-8 rounded-[2.5rem] border border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Globe className="h-32 w-32 text-indigo-400 animate-[spin_20s_linear_infinite]" />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <Radar className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Growth Forecast</h3>
                        </div>

                        <div className="space-y-8 py-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expected Subscribers</p>
                                <h4 className="text-3xl font-black text-white tracking-tighter">{data?.growthOrb?.predictedSubscribers}</h4>
                                <div className="mt-2 flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    <TrendingUp className="h-3 w-3" />
                                    Growing
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Engagement Forecast</p>
                                    <p className="text-lg font-black text-indigo-400 tracking-tighter">{data?.growthOrb?.engagementForecast}</p>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="h-4 w-4 text-indigo-400" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">AI Confidence</span>
                                    </div>
                                    <span className="text-lg font-black text-white tracking-tighter">{data?.growthOrb?.conversionConfidence}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                        <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-4 rounded-2xl text-[8px] font-black text-white uppercase tracking-[0.3em] transition-all border border-white/5">
                            Refresh Forecast <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Row: Campaign Comparison & A/B Reports */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <CampaignComparison campaigns={data?.campaignComparison || []} />
                <ABTestingReports data={data?.abTesting || []} />
            </div>

            {/* Bottom Section: Segment Analytics */}
            <div className="pt-4">
                <SegmentAnalytics segments={data?.segmentHealth || []} />
            </div>

            {/* Global Signal Indicator */}
            <div className="flex items-center justify-center gap-10 pt-8 opacity-20 group">
                <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Connected</span>
                </div>
                <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div animate={{ x: [-80, 80] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="h-full w-10 bg-indigo-500/40" />
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Last updated: 0.4s ago</span>
                </div>
            </div>
        </div>
    )
}
