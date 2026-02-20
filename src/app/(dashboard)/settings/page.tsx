"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    CreditCard,
    Link,
    BrainCircuit,
    Globe,
    Settings2,
    Activity,
    Shield,
    Target,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ProfileSettings } from "@/components/ProfileSettings"
import { SubscriptionSettings } from "@/components/SubscriptionSettings"
import { IntegrationSettings } from "@/components/IntegrationSettings"
import { AIPreferenceSettings } from "@/components/AIPreferenceSettings"
import { DomainSettings } from "@/components/DomainSettings"
import { getSettingsData } from "./actions"

type TabType = 'profile' | 'subscription' | 'integrations' | 'ai' | 'domains'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('profile')
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const result = await getSettingsData()
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
                    <Settings2 className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Synchronizing Core Modules...</p>
            </div>
        )
    }

    const tabs = [
        { id: 'profile', label: 'Identity', icon: User },
        { id: 'subscription', label: 'Orbital Sync', icon: CreditCard },
        { id: 'integrations', label: 'Nodes', icon: Link },
        { id: 'ai', label: 'Neural', icon: BrainCircuit },
        { id: 'domains', label: 'Domains', icon: Globe },
    ]

    return (
        <div className="space-y-8 pb-12">
            {/* Header Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5 px-8 py-8 backdrop-blur-md"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Settings2 className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Mission Configuration Hub</p>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase">SYSTEM CONTROL</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-[1.5rem] bg-white/5 border border-white/5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all relative",
                                activeTab === tab.id ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "text-slate-500 hover:text-white"
                            )}
                        >
                            <tab.icon className="h-3.5 w-3.5" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="tab-active" className="absolute inset-0 rounded-2xl bg-indigo-500 -z-10" />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="min-h-[600px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-xl p-10 lg:p-12 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Orbital Accent */}
                        <div className="absolute top-0 right-0 h-96 w-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 h-full">
                            {activeTab === 'profile' && <ProfileSettings data={data.profile} />}
                            {activeTab === 'subscription' && <SubscriptionSettings data={data.subscription} />}
                            {activeTab === 'integrations' && <IntegrationSettings integrations={data.integrations} />}
                            {activeTab === 'ai' && <AIPreferenceSettings data={data.aiPreferences} />}
                            {activeTab === 'domains' && <DomainSettings domains={data.domains} />}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Tactical System Metadata */}
            <div className="flex items-center justify-center gap-12 pt-8 opacity-20 group">
                <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Core Integrity: 100%</span>
                </div>
                <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} className="h-full w-12 bg-indigo-500/40" />
                </div>
                <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Node Sync: Nominal</span>
                </div>
            </div>
        </div>
    )
}
