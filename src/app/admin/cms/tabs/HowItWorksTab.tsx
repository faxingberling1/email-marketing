"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, ListOrdered, Plus, Trash2, GripVertical } from "lucide-react"

export type LandingHowStep = {
    title: string;
    desc: string;
    icon: string;
    highlight: string;
}

export type LandingCmsHowItWorks = {
    headingLine1: string;
    headingLine2: string;
    subtitle: string;
    steps: LandingHowStep[];
}

const DEFAULT_HOW: LandingCmsHowItWorks = {
    headingLine1: "How It ",
    headingLine2: "Works.",
    subtitle: "From data sync to tactical optimization in five automated steps.",
    steps: [
        { title: "Import Contacts", desc: "Upload CSV or sync from your CRM", icon: "UploadCloud", highlight: "Data Synced" },
        { title: "Launch AI", desc: "Templates and email suggestions ready for your segments", icon: "Sparkles", highlight: "AI Ready" },
        { title: "Create Campaign", desc: "AI recommends subject line, content, and send time", icon: "Zap", highlight: "Campaign Built" },
        { title: "Initialize Sequence", desc: "Schedule emails and let AI optimize performance", icon: "Activity", highlight: "Sequence Live" },
        { title: "Track & Optimize", desc: "Real-time analytics and AI recommendations for next action", icon: "Activity", highlight: "Continuous Uplift" },
    ]
}

const AVAILABLE_ICONS = ["UploadCloud", "Sparkles", "Zap", "Activity", "Database", "LineChart", "Settings", "RefreshCw", "Send"]

export function HowItWorksTab() {
    const [data, setData] = useState<LandingCmsHowItWorks>(DEFAULT_HOW)
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
            const found = settings.find((s: any) => s.key === "cms_landing_how_it_works")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_HOW, ...parsed })
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
            body: JSON.stringify({ key: "cms_landing_how_it_works", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("How It Works config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    const updateStep = (index: number, key: keyof LandingHowStep, val: string) => {
        const newSteps = [...data.steps]
        newSteps[index] = { ...newSteps[index], [key]: val }
        setData({ ...data, steps: newSteps })
    }

    const removeStep = (index: number) => {
        setData({ ...data, steps: data.steps.filter((_, i) => i !== index) })
    }

    const addStep = () => {
        setData({
            ...data,
            steps: [...data.steps, { title: "New Step", desc: "Description here.", icon: "Activity", highlight: "Status" }]
        })
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading How It Works Data...</div>

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <ListOrdered className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">How It Works Section Definition</span>
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
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Heading Part 2 (Gradient)</label>
                        <input
                            value={data.headingLine2}
                            onChange={e => setData(p => ({ ...p, headingLine2: e.target.value }))}
                            className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 focus:outline-none focus:border-emerald-500 font-bold"
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

                {/* Steps Config */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-white outfit uppercase tracking-widest">Process Steps ({data.steps.length})</h3>
                        <button onClick={addStep} className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="h-4 w-4" /> Add Step
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {data.steps.map((step, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-white/5 bg-slate-950 hover:border-white/10 transition-colors group">
                                <div className="flex items-center justify-center shrink-0 cursor-move text-slate-600 group-hover:text-slate-400">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            value={step.title}
                                            onChange={e => updateStep(index, 'title', e.target.value)}
                                            placeholder="Step Title"
                                            className="w-full bg-black/40 border border-white/5 mb-2 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                                        />
                                        <input
                                            value={step.desc}
                                            onChange={e => updateStep(index, 'desc', e.target.value)}
                                            placeholder="Step Description"
                                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-16">Highlight</span>
                                            <input
                                                value={step.highlight}
                                                onChange={e => updateStep(index, 'highlight', e.target.value)}
                                                placeholder="Data Synced..."
                                                className="flex-1 bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-bold"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-16">Icon</span>
                                            <select
                                                value={step.icon}
                                                onChange={e => updateStep(index, 'icon', e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-bold outline-none"
                                            >
                                                {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center shrink-0">
                                    <button onClick={() => removeStep(index)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
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
