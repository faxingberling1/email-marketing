"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, CreditCard, Plus, Trash2, GripVertical } from "lucide-react"

export type LandingPricingPlan = {
    id: string;
    name: string;
    price: string;
    desc: string;
    accent: string;
    badge: string | null;
    features: string[];
    cta: string;
    bestFor: string;
}

export type LandingPricingFaq = { q: string; a: string; }

export type LandingCmsPricing = {
    headingLine1: string;
    headingLine2: string;
    subtitle: string;
    plans: LandingPricingPlan[];
    faqs: LandingPricingFaq[];
}

const DEFAULT_PRICING: LandingCmsPricing = {
    headingLine1: "Pricing That ",
    headingLine2: "Scales",
    subtitle: "Simple Plans. Powerful AI. Predictable Costs.",
    plans: [
        {
            id: "starter", name: "Starter", price: "29", desc: "Best for founders & small lists", accent: "emerald", badge: null,
            features: ["Up to 1,000 contacts", "10,000 emails / month", "300 AI credits / month", "AI subject line generator"], cta: "Start Free Trial", bestFor: "testing campaigns and small audiences"
        },
        {
            id: "growth", name: "Growth", price: "79", desc: "Built for scaling startups", accent: "blue", badge: "⭐ Most Popular",
            features: ["Up to 10,000 contacts", "75,000 emails / month", "2,000 AI credits / month", "Advanced AI email generation"], cta: "Upgrade to Growth", bestFor: "growing teams optimizing engagement"
        }
    ],
    faqs: [
        { q: "What happens if I exceed AI credits?", a: "You can purchase add-ons or upgrade anytime. We'll notify you when you reach 80% and 100% of your limit." },
        { q: "What happens if I exceed email limit?", a: "You’ll receive a notification before your limit is reached. You can upgrade to a higher tier instantly to maintain your campaign schedule." }
    ]
}

const AVAILABLE_ACCENTS = ["emerald", "blue", "purple", "red"]

export function PricingTab() {
    const [data, setData] = useState<LandingCmsPricing>(DEFAULT_PRICING)
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
            const found = settings.find((s: any) => s.key === "cms_landing_pricing")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_PRICING, ...parsed })
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
            body: JSON.stringify({ key: "cms_landing_pricing", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("Pricing config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    // Plan Actions
    const updatePlan = (index: number, key: keyof LandingPricingPlan, val: any) => {
        const newPlans = [...data.plans]
        newPlans[index] = { ...newPlans[index], [key]: val }
        setData({ ...data, plans: newPlans })
    }

    // FAQ Actions
    const updateFaq = (index: number, key: keyof LandingPricingFaq, val: string) => {
        const newFaqs = [...data.faqs]
        newFaqs[index] = { ...newFaqs[index], [key]: val }
        setData({ ...data, faqs: newFaqs })
    }
    const removeFaq = (index: number) => setData({ ...data, faqs: data.faqs.filter((_, i) => i !== index) })
    const addFaq = () => setData({ ...data, faqs: [...data.faqs, { q: "New Question", a: "New Answer" }] })

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Pricing Data...</div>

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <CreditCard className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Pricing Section Definition</span>
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
                        Publish Section
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Header Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-black text-white outfit mb-4 uppercase tracking-widest">Pricing Heading</h3>
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Heading Part 1 (White)</label>
                        <input
                            value={data.headingLine1}
                            onChange={e => setData(p => ({ ...p, headingLine1: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Heading Part 2 (Gradient)</label>
                        <input
                            value={data.headingLine2}
                            onChange={e => setData(p => ({ ...p, headingLine2: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-indigo-400 focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Subtitle</label>
                        <input
                            value={data.subtitle}
                            onChange={e => setData(p => ({ ...p, subtitle: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                        />
                    </div>
                </div>

                {/* Plans Overview (List only names/prices for brevity here, features are in comparison table) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-white outfit uppercase tracking-widest mb-2">Tier Definitions ({data.plans.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.plans.map((plan, index) => (
                            <div key={index} className={`p-4 rounded-xl border border-white/5 bg-slate-950/50 flex flex-col gap-3 group relative overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-full h-1 bg-${plan.accent}-500/50`} />

                                <div className="flex justify-between items-center">
                                    <input
                                        value={plan.name}
                                        onChange={e => updatePlan(index, "name", e.target.value)}
                                        className="bg-transparent border-none text-white font-black outfit text-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 -mx-1"
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="text-slate-500 font-bold">$</span>
                                        <input
                                            value={plan.price}
                                            onChange={e => updatePlan(index, "price", e.target.value)}
                                            className="w-12 bg-transparent border-none text-white font-black text-xl italic focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                                        />
                                    </div>
                                </div>
                                <input
                                    value={plan.desc}
                                    onChange={e => updatePlan(index, "desc", e.target.value)}
                                    placeholder="Description"
                                    className="bg-transparent border-none text-slate-400 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 -mx-1"
                                />
                                <input
                                    value={plan.badge || ""}
                                    onChange={e => updatePlan(index, "badge", e.target.value || null)}
                                    placeholder="Badge (e.g. ⭐ Most Popular)"
                                    className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 flex-1 mt-2 py-1 placeholder-indigo-400/30"
                                />
                                <div className="pt-2 border-t border-white/5 mt-auto">
                                    <input
                                        value={plan.cta}
                                        onChange={e => updatePlan(index, "cta", e.target.value)}
                                        placeholder="Button Text"
                                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold text-center"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQs Config */}
                <div className="space-y-4 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-white outfit uppercase tracking-widest">Frequently Asked Questions ({data.faqs.length})</h3>
                        <button onClick={addFaq} className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="h-4 w-4" /> Add FAQ
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {data.faqs.map((faq, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-white/5 bg-slate-950 hover:border-white/10 transition-colors group">
                                <div className="flex items-center justify-center shrink-0 cursor-move text-slate-600 group-hover:text-slate-400">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <input
                                        value={faq.q}
                                        onChange={e => updateFaq(index, 'q', e.target.value)}
                                        placeholder="Question"
                                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                                    />
                                    <textarea
                                        value={faq.a}
                                        onChange={e => updateFaq(index, 'a', e.target.value)}
                                        placeholder="Answer"
                                        rows={2}
                                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                                    />
                                </div>
                                <div className="flex items-center justify-center shrink-0">
                                    <button onClick={() => removeFaq(index)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
