"use client"

import { useState, useEffect } from "react"
import { Sparkles, Save, RefreshCw, LayoutGrid, Plus, Trash2, GripVertical } from "lucide-react"

export type LandingFeature = {
    title: string;
    desc: string;
    icon: string;
    color: string;
}

export type LandingCmsFeatures = {
    headingLine1: string;
    headingLine2: string;
    subtitle: string;
    items: LandingFeature[];
}

const DEFAULT_FEATURES: LandingCmsFeatures = {
    headingLine1: "Core Competitive ",
    headingLine2: "Features.",
    subtitle: "Advanced tools, simplified by artificial intelligence.",
    items: [
        { title: "AI-Powered Campaigns", desc: "Automatically generate subject lines, email copy, and templates optimized for engagement.", icon: "Sparkles", color: "indigo" },
        { title: "Real-Time Analytics", desc: "Track open rate, click rate, engagement trends, and AI insights in real-time.", icon: "BarChart3", color: "blue" },
        { title: "Segmentation & AI Clusters", desc: "Automatically segment contacts using AI behavior prediction for high conversion.", icon: "Users", color: "purple" },
        { title: "Automation & Sequences", desc: "Set up email workflows with AI recommendations for optimal timing and actions.", icon: "Zap", color: "emerald" },
        { title: "Retargeting & Optimization", desc: "AI recommends re-engagement strategies for hyper-engaged or underperforming segments.", icon: "Target", color: "rose" },
        { title: "Templates Library", desc: "Pre-built AI templates, fully customizable and optimized for engagement.", icon: "Layout", color: "cyan" },
    ]
}

const AVAILABLE_ICONS = ["Sparkles", "BarChart3", "Users", "Zap", "Target", "Layout", "Activity", "Globe", "ShieldCheck", "Mail", "MousePointer2"]
const AVAILABLE_COLORS = ["indigo", "blue", "purple", "emerald", "rose", "cyan"]

export function FeaturesTab() {
    const [data, setData] = useState<LandingCmsFeatures>(DEFAULT_FEATURES)
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
            const found = settings.find((s: any) => s.key === "cms_landing_features")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_FEATURES, ...parsed })
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
            body: JSON.stringify({ key: "cms_landing_features", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("Features config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    const updateItem = (index: number, key: keyof LandingFeature, val: string) => {
        const newItems = [...data.items]
        newItems[index] = { ...newItems[index], [key]: val }
        setData({ ...data, items: newItems })
    }

    const removeItem = (index: number) => {
        setData({ ...data, items: data.items.filter((_, i) => i !== index) })
    }

    const addItem = () => {
        setData({
            ...data,
            items: [...data.items, { title: "New Feature", desc: "Description here.", icon: "Sparkles", color: "indigo" }]
        })
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Features Data...</div>

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <LayoutGrid className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Features Section Definition</span>
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
                        Publish Features
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Header Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-black text-white outfit mb-4 uppercase tracking-widest">Section Heading</h3>
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
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Heading Part 2 (Indigo)</label>
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

                {/* Items Config */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-white outfit uppercase tracking-widest">Feature List ({data.items.length})</h3>
                        <button onClick={addItem} className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="h-4 w-4" /> Add Feature
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {data.items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-white/5 bg-slate-950 hover:border-white/10 transition-colors group">
                                <div className="flex items-center justify-center shrink-0 cursor-move text-slate-600 group-hover:text-slate-400">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            value={item.title}
                                            onChange={e => updateItem(index, 'title', e.target.value)}
                                            placeholder="Feature Title"
                                            className="w-full bg-black/40 border border-white/5 mb-2 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                                        />
                                        <textarea
                                            value={item.desc}
                                            onChange={e => updateItem(index, 'desc', e.target.value)}
                                            placeholder="Feature Description"
                                            rows={2}
                                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-12">Icon</span>
                                            <select
                                                value={item.icon}
                                                onChange={e => updateItem(index, 'icon', e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-bold outline-none"
                                            >
                                                {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-12">Color</span>
                                            <div className="flex gap-1.5 flex-1">
                                                {AVAILABLE_COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => updateItem(index, 'color', c)}
                                                        className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${item.color === c ? 'border-white scale-110' : 'border-transparent'} bg-${c}-500`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center shrink-0">
                                    <button onClick={() => removeItem(index)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
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
