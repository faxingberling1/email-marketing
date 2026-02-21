"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, MessageSquare, Plus, Trash2, GripVertical } from "lucide-react"

export type LandingTestimonial = {
    name: string;
    role: string;
    content: string;
    avatar: string;
}

export type LandingCmsTestimonials = {
    headingLine1: string;
    headingLine2: string;
    companies: string;
    items: LandingTestimonial[];
}

const DEFAULT_TESTIMONIALS: LandingCmsTestimonials = {
    headingLine1: "Trusted by ",
    headingLine2: "Early Adopters.",
    companies: "Acme Corp, GlobalTech, Nexus, Quantum, Stark Ind",
    items: [
        { name: "Sarah Jenkins", role: "CMO, Nexus Tech", content: "AI Email Marketing helped us increase open rates by 38% in just one month!", avatar: "SJ" },
        { name: "David Chen", role: "Founder, Orbital SaaS", content: "The AI recommendations are like having a marketing assistant 24/7.", avatar: "DC" }
    ]
}

export function TestimonialsTab() {
    const [data, setData] = useState<LandingCmsTestimonials>(DEFAULT_TESTIMONIALS)
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
            const found = settings.find((s: any) => s.key === "cms_landing_testimonials")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_TESTIMONIALS, ...parsed })
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
            body: JSON.stringify({ key: "cms_landing_testimonials", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("Testimonials config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    const updateItem = (index: number, key: keyof LandingTestimonial, val: string) => {
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
            items: [...data.items, { name: "New User", role: "Role", content: "Amazing product!", avatar: "NU" }]
        })
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Testimonial Data...</div>

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Testimonials Section Definition</span>
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
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Heading Part 2 (Indigo)</label>
                        <input
                            value={data.headingLine2}
                            onChange={e => setData(p => ({ ...p, headingLine2: e.target.value }))}
                            className="w-full bg-black/40 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-400 focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Company Logos (Comma Separated)</label>
                        <input
                            value={data.companies}
                            onChange={e => setData(p => ({ ...p, companies: e.target.value }))}
                            placeholder="Acme Corp, GlobalTech, Nexus"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                        />
                    </div>
                </div>

                {/* Reviews Config */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-white outfit uppercase tracking-widest">Customer Reviews ({data.items.length})</h3>
                        <button onClick={addItem} className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="h-4 w-4" /> Add Review
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {data.items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-white/5 bg-slate-950 hover:border-white/10 transition-colors group">
                                <div className="flex items-center justify-center shrink-0 cursor-move text-slate-600 group-hover:text-slate-400">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <input
                                            value={item.name}
                                            onChange={e => updateItem(index, 'name', e.target.value)}
                                            placeholder="User Name"
                                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                value={item.role}
                                                onChange={e => updateItem(index, 'role', e.target.value)}
                                                placeholder="Role / Title"
                                                className="w-full flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 font-bold uppercase tracking-widest"
                                            />
                                            <input
                                                value={item.avatar}
                                                onChange={e => updateItem(index, 'avatar', e.target.value)}
                                                placeholder="Initials"
                                                className="w-16 text-center bg-black/40 border border-white/5 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold tracking-widest"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col h-full">
                                        <textarea
                                            value={item.content}
                                            onChange={e => updateItem(index, 'content', e.target.value)}
                                            placeholder="Testimonial Quote"
                                            className="w-full h-full min-h-[5rem] bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none font-medium italic"
                                        />
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
