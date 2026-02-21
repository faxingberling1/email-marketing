"use client"

import { useState, useEffect } from "react"
import { Sparkles, Save, RefreshCw, LayoutTemplate } from "lucide-react"

export type LandingCmsHero = {
    badgeText: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
}

const DEFAULT_HERO: LandingCmsHero = {
    badgeText: "AI-Powered Email Marketing",
    titleLine1: "Personalized. Optimized.",
    titleLine2: "Automated.",
    subtitle: "Leverage predictive AI for instant content generation, smart segmentation, and automated campaign optimization. Boost engagement effortlessly.",
    primaryCtaText: "Get Started Free",
    secondaryCtaText: "Watch Demo"
}

export function HeroTab() {
    const [data, setData] = useState<LandingCmsHero>(DEFAULT_HERO)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok })
        setTimeout(() => setToast(null), 3000)
    }

    const load = async () => {
        setLoading(true)
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
            const settings = await res.json()
            const found = settings.find((s: any) => s.key === "cms_landing_hero")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_HERO, ...parsed })
                } catch (e) { }
            }
        }
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const handleSave = async () => {
        setSaving(true)
        const res = await fetch("/api/admin/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "cms_landing_hero", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("Hero config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Hero Data...</div>

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <LayoutTemplate className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Hero Section Definition</span>
                </div>
                <div className="flex items-center gap-4">
                    {toast && (
                        <span className={`text-xs font-bold ${toast.ok ? "text-emerald-400" : "text-rose-400"}`}>
                            {toast.msg}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-black text-xs transition-all disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Publish Hero
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-indigo-400" /> Hero Badge Text
                    </label>
                    <input
                        value={data.badgeText}
                        onChange={e => setData(p => ({ ...p, badgeText: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Main Title (Line 1)</label>
                        <input
                            value={data.titleLine1}
                            onChange={e => setData(p => ({ ...p, titleLine1: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold text-lg"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Main Title (Animated Line)</label>
                        <input
                            value={data.titleLine2}
                            onChange={e => setData(p => ({ ...p, titleLine2: e.target.value }))}
                            className="w-full bg-black/40 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-300 focus:outline-none focus:border-indigo-400 font-bold text-lg"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Subtitle / Description</label>
                    <textarea
                        value={data.subtitle}
                        onChange={e => setData(p => ({ ...p, subtitle: e.target.value }))}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium leading-relaxed resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Primary CTA Button</label>
                        <input
                            value={data.primaryCtaText}
                            onChange={e => setData(p => ({ ...p, primaryCtaText: e.target.value }))}
                            className="w-full bg-indigo-600/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-300 focus:outline-none focus:border-indigo-500 font-black text-sm uppercase tracking-widest"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Secondary CTA Button</label>
                        <input
                            value={data.secondaryCtaText}
                            onChange={e => setData(p => ({ ...p, secondaryCtaText: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-white/30 font-black text-sm uppercase tracking-widest"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
