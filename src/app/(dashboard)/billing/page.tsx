"use client"

import { motion } from "framer-motion"
import { CreditCard, Zap, ShieldCheck, ArrowRight, BarChart3, Clock, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getSidebarData } from "@/app/(dashboard)/sidebar-actions"
import { PricingTable } from "@/components/PricingTable"
import { ManageSubscriptionButtons } from "@/components/billing/ManageSubscriptionButtons"
import { AddonSelector } from "@/components/billing/AddonSelector"
import { cn } from "@/lib/utils"

export default function BillingPage() {
    const { data: session } = useSession()
    const [dynamicData, setDynamicData] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSidebarData()
            if (data) setDynamicData(data)
        }
        fetchData()
    }, [])

    const currentPlan = dynamicData?.quotas?.plan || "Free"
    const aiUsage = dynamicData?.quotas?.ai || { used: 0, limit: 100, remaining: 100 }
    const emailUsage = dynamicData?.quotas?.emails || { used: 0, limit: 1000, remaining: 1000 }

    const usagePercent = (used: number, limit: number) => {
        return Math.min(Math.round((used / limit) * 100), 100)
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80">Financial Ops</span>
                        </div>
                        <h1 className="text-4xl font-black text-white outfit uppercase italic tracking-tight">Billing <span className="text-slate-500">Protocol</span></h1>
                    </div>
                </div>
            </div>

            {/* Current Plan Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap className="h-32 w-32 text-indigo-500" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 relative z-10">
                        <div className="flex-1">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Active Command Tier</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-5xl font-black text-white outfit uppercase italic">{currentPlan}</span>
                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                    Operational
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm font-medium mb-10 max-w-md">
                                Your account is currently running on the <span className="text-white font-bold">{currentPlan}</span> protocol.
                                High-priority AI nodes and unlimited sequences are available in higher tiers.
                            </p>
                            <ManageSubscriptionButtons />
                        </div>

                        <div className="w-full md:w-72 space-y-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Resource Utilization</h3>

                            {/* AI Credits Usage */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-indigo-400" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Credits</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500">{aiUsage.used} / {aiUsage.limit}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usagePercent(aiUsage.used, aiUsage.limit)}%` }}
                                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                    />
                                </div>
                            </div>

                            {/* Email Usage */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-3 w-3 text-emerald-400" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Relay Quota</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500">{emailUsage.used} / {emailUsage.limit}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usagePercent(emailUsage.used, emailUsage.limit)}%` }}
                                        className="h-full bg-gradient-to-r from-emerald-600 to-cyan-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden group flex flex-col justify-center text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                    <Clock className="h-10 w-10 text-indigo-400 mx-auto mb-6 opacity-50" />
                    <h4 className="text-xl font-black text-white outfit mb-2">Next Renewal</h4>
                    <p className="text-slate-400 text-sm font-medium mb-6">Your next tactical cycle begins in</p>
                    <div className="text-4xl font-black text-indigo-400 outfit mb-6">14 DAYS</div>
                    <button className="text-[10px] font-black text-white uppercase tracking-[0.2em] underline hover:text-indigo-300 transition-colors">
                        View Invoices
                    </button>
                </div>
            </div>

            {/* Add-ons & Refills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-black text-white outfit uppercase italic mb-2">Orbital <span className="text-amber-500">Logistics</span></h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Refill your mission parameters. Neural credits and relay quotas are deployed instantly upon authorization.
                        </p>
                    </div>
                    <AddonSelector />
                </div>

                <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center gap-6 group hover:bg-white/[0.04] transition-all">
                    <div className="h-24 w-24 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-12 w-12" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white outfit uppercase">Custom Deployment?</h3>
                        <p className="text-slate-400 text-sm font-medium max-w-[280px]">
                            Advanced enterprise requirements and custom relay volumes for planetary scale operations.
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl shadow-white/10">
                        Contact Command
                    </button>
                </div>
            </div>

            {/* Tactical Upgrades Section */}
            <div className="relative pt-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-white outfit uppercase italic mb-4">Tactical <span className="text-indigo-500">Upgrades</span></h2>
                    <p className="text-slate-400 text-sm font-medium">Select a more powerful command protocol to unlock advanced AI capabilities.</p>
                </div>
                <PricingTable />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                {[
                    { icon: ShieldCheck, title: "Secure Terminal", desc: "Enterprise-grade encryption for all financial relays." },
                    { icon: Sparkles, title: "Instant Deployment", desc: "Upgraded protocols activate across your nodes immediately." },
                    { icon: Zap, title: "Priority Node", desc: "Pro tiers get dedicated AI compute for zero latency." }
                ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                        <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                            <item.icon className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
