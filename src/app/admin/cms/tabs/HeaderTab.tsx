"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, PanelTop } from "lucide-react"

export type LandingCmsHeader = {
    brandName: string;
    brandHighlight: string;
    navLinks: { name: string; href: string }[];
    signInText: string;
    getStartedText: string;
}

const DEFAULT_HEADER: LandingCmsHeader = {
    brandName: "Mail",
    brandHighlight: "Mind",
    navLinks: [
        { name: "Features", href: "/#features" },
        { name: "Intelligence", href: "/#intelligence" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Resources", href: "/#resources" },
    ],
    signInText: "Sign In",
    getStartedText: "Get Started",
}

export function HeaderTab() {
    const [data, setData] = useState<LandingCmsHeader>(DEFAULT_HEADER)
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
            const found = settings.find((s: any) => s.key === "cms_landing_header")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_HEADER, ...parsed })
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
            body: JSON.stringify({ key: "cms_landing_header", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("Header config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    const updateLink = (index: number, key: keyof LandingCmsHeader['navLinks'][0], val: string) => {
        const newLinks = [...data.navLinks]
        newLinks[index] = { ...newLinks[index], [key]: val }
        setData({ ...data, navLinks: newLinks })
    }

    const addLink = () => {
        setData({ ...data, navLinks: [...data.navLinks, { name: "New Link", href: "/#" }] })
    }

    const removeLink = (index: number) => {
        const newLinks = [...data.navLinks]
        newLinks.splice(index, 1)
        setData({ ...data, navLinks: newLinks })
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Header Data...</div>

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <PanelTop className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Header Configuration</span>
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
                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Brand Name</label>
                        <input
                            value={data.brandName}
                            onChange={e => setData({ ...data, brandName: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Brand Highlight (Gradient)</label>
                        <input
                            value={data.brandHighlight}
                            onChange={e => setData({ ...data, brandHighlight: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-indigo-400 focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Sign In Text</label>
                        <input
                            value={data.signInText}
                            onChange={e => setData({ ...data, signInText: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Get Started Text</label>
                        <input
                            value={data.getStartedText}
                            onChange={e => setData({ ...data, getStartedText: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                </div>

                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                        <h3 className="text-sm font-black text-white outfit uppercase tracking-widest">Navigation Links</h3>
                        <button
                            onClick={addLink}
                            className="text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300"
                        >
                            + Add Link
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.navLinks.map((link, i) => (
                            <div key={i} className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="flex-1">
                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Label</label>
                                    <input
                                        value={link.name}
                                        onChange={e => updateLink(i, 'name', e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                                        placeholder="Features"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">URL (href)</label>
                                    <input
                                        value={link.href}
                                        onChange={e => updateLink(i, 'href', e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                                        placeholder="/#features"
                                    />
                                </div>
                                <button onClick={() => removeLink(i)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors mt-4">
                                    <RefreshCw className="h-4 w-4 rotate-45" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
