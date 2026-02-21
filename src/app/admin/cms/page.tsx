"use client"

import { useState, useEffect } from "react"
import { LayoutTemplate, LayoutGrid, ListOrdered, MessageSquare, CreditCard, Shield, Menu, PanelTop } from "lucide-react"
import { HeroTab } from "./tabs/HeroTab"
import { HeaderTab } from "./tabs/HeaderTab"
import { FeaturesTab } from "./tabs/FeaturesTab"
import { HowItWorksTab } from "./tabs/HowItWorksTab"
import { TestimonialsTab } from "./tabs/TestimonialsTab"
import { PricingTab } from "./tabs/PricingTab"
import { CtaTrustTab } from "./tabs/CtaTrustTab"
import { FooterTab } from "./tabs/FooterTab"

export const TABS = [
    { id: "header", label: "Header Config", icon: LayoutTemplate },
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "features", label: "Features", icon: LayoutGrid },
    { id: "how_it_works", label: "How It Works", icon: ListOrdered },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "pricing", label: "Pricing", icon: CreditCard },
    { id: "trust_cta", label: "Trust & CTA", icon: Shield },
    { id: "footer", label: "Footer", icon: Menu },
]

export default function AdminCmsPage() {
    const [activeTab, setActiveTab] = useState<
        "header" | "hero" | "features" | "how_it_works" | "testimonials" | "pricing" | "trust_cta" | "footer"
    >("header")

    return (
        <div className="max-w-6xl space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white outfit flex items-center gap-3">
                        <PanelTop className="h-8 w-8 text-indigo-400" />
                        Landing Page CMS
                    </h1>
                    <p className="text-slate-500 text-sm font-bold mt-1">Real-time Public Interface Configuration</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 pb-px gap-6">
                {TABS.map(tab => {
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 pb-4 text-sm font-black tracking-wide border-b-2 transition-colors whitespace-nowrap ${active ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <tab.icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-slate-600"}`} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Contents */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative shadow-indigo-500/10 min-h-[500px]">
                {activeTab === "header" && <HeaderTab />}
                {activeTab === "hero" && <HeroTab />}
                {activeTab === "features" && <FeaturesTab />}
                {activeTab === "how_it_works" && <HowItWorksTab />}
                {activeTab === "testimonials" && <TestimonialsTab />}
                {activeTab === "pricing" && <PricingTab />}
                {activeTab === "trust_cta" && <CtaTrustTab />}
                {activeTab === "footer" && <FooterTab />}

                {(!["header", "hero", "features", "how_it_works", "testimonials", "pricing", "trust_cta", "footer"].includes(activeTab)) && (
                    <div className="animate-in fade-in duration-500 p-16 text-center h-full flex flex-col items-center justify-center">
                        <div className="inline-flex h-16 w-16 mb-4 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                            <Menu className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{TABS.find(t => t.id === activeTab)?.label} CMS Configuration</h3>
                        <p className="text-slate-500">This module is being constructed. Check back soon.</p>
                    </div>
                )}
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex gap-4">
                <LayoutTemplate className="h-6 w-6 text-indigo-400 shrink-0" />
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Live Updates</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">Changes made here are immediately reflected on the public landing page via Next.js React Server Components and dynamic Prisma fetching. No build step is required.</p>
                </div>
            </div>
        </div>
    )
}
