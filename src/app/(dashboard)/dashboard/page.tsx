"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Mail,
    TrendingUp,
    MousePointer2,
    Send,
    Zap,
    Rocket,
    CheckCircle2,
    Activity,
    BrainCircuit,
    ChevronRight,
    Calendar,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    ArrowUpRight,
    Layout
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getDashboardStats } from "./actions"
import { MetricCard } from "@/components/MetricCard"
import { EngagementChart } from "@/components/EngagementChart"
import { AIPanel } from "@/components/AIPanel"
import { CommandButtons } from "@/components/CommandButtons"
import { CampaignTable } from "@/components/CampaignTable"
import { QuotaAlert } from "@/components/shared/QuotaAlert"
import { SequenceFlow } from "@/components/SequenceFlow"
import { TemplateLibrary } from "@/components/TemplateLibrary"

export default function DashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const result = await getDashboardStats()
            if (result) {
                // Map back the icons for metrics
                const metricsWithIcons = result.metrics.map((s: any) => {
                    if (s.name === 'Total Contacts') return { ...s, icon: Users }
                    if (s.name === 'Emails Sent') return { ...s, icon: Send }
                    if (s.name === 'Avg. Open Rate') return { ...s, icon: TrendingUp }
                    if (s.name === 'Click Rate') return { ...s, icon: MousePointer2 }
                    return { ...s, icon: Zap }
                })
                setData({ ...result, metrics: metricsWithIcons })
            }
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
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <QuotaAlert
                type="ai"
                remaining={data?.quotas?.ai?.remaining || 0}
                limit={(data?.quotas?.ai?.remaining || 0) + (data?.quotas?.ai?.used || 0)}
                plan={data?.quotas?.plan || 'free'}
            />

            {/* Header Status Bar (Sub-header) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-indigo-500/5 px-6 py-4 backdrop-blur-md"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                        <Activity className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">AI Status</p>
                        <p className="text-sm font-bold text-white tracking-wide">Ready</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-400">Status: <span className="text-white">Good</span></span>
                </div>
            </motion.div>

            {/* Strategic Command Center */}
            <CommandButtons commands={data?.commands || []} />

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data?.metrics.map((stat: any, i: number) => (
                    <MetricCard
                        key={stat.name}
                        index={i}
                        {...stat}
                    />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <EngagementChart
                    data={data?.trendData}
                    peakEngagement={data?.peakEngagement}
                />

                {/* AI Panel */}
                <AIPanel
                    growthForecast={data?.aiPanel?.growthForecast}
                    activityHorizon={data?.aiPanel?.activityHorizon}
                    recommendations={data?.aiPanel?.recommendations}
                />
            </div>

            {/* Campaign Intelligence Hub */}
            <div className="space-y-4">
                <CampaignTable campaigns={data?.recentCampaigns || []} />
            </div>

        </div>
    )
}
