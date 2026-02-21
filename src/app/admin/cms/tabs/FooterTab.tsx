"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, Menu, Plus, Trash2, GripVertical } from "lucide-react"

export type LandingFooterLink = { label: string; href: string; }

export type LandingCmsFooter = {
    brandDesc: string;
    copyright: string;
    socialTwitter: string;
    socialGithub: string;
    productLinks: LandingFooterLink[];
    companyLinks: LandingFooterLink[];
    legalLinks: LandingFooterLink[];
}

const DEFAULT_FOOTER: LandingCmsFooter = {
    brandDesc: "The predictive email marketing platform powered by artificial intelligence.",
    copyright: "© 2024 AI Email Marketing. All rights reserved.",
    socialTwitter: "https://twitter.com",
    socialGithub: "https://github.com",
    productLinks: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "API", href: "#" },
        { label: "Integrations", href: "#" }
    ],
    companyLinks: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" }
    ],
    legalLinks: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" }
    ]
}

export function FooterTab() {
    const [data, setData] = useState<LandingCmsFooter>(DEFAULT_FOOTER)
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
            const found = settings.find((s: any) => s.key === "cms_landing_footer")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_FOOTER, ...parsed })
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
            body: JSON.stringify({ key: "cms_landing_footer", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("Footer config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    const updateLink = (category: 'productLinks' | 'companyLinks' | 'legalLinks', index: number, key: keyof LandingFooterLink, val: string) => {
        const newLinks = [...data[category]]
        newLinks[index] = { ...newLinks[index], [key]: val }
        setData({ ...data, [category]: newLinks })
    }

    const removeLink = (category: 'productLinks' | 'companyLinks' | 'legalLinks', index: number) => {
        setData({ ...data, [category]: data[category].filter((_, i) => i !== index) })
    }

    const addLink = (category: 'productLinks' | 'companyLinks' | 'legalLinks') => {
        setData({ ...data, [category]: [...data[category], { label: "New Link", href: "#" }] })
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Footer Data...</div>

    const renderLinkGroup = (title: string, category: 'productLinks' | 'companyLinks' | 'legalLinks') => (
        <div className="bg-white/[0.02] p-5 rounded-xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center bg-black/20 p-2 rounded -mx-2 -mt-2 mb-2">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">{title}</h4>
                <button onClick={() => addLink(category)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition">
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            {data[category].map((link, index) => (
                <div key={index} className="flex flex-col gap-2 group relative">
                    <input
                        value={link.label}
                        onChange={e => updateLink(category, index, 'label', e.target.value)}
                        placeholder="Link Label"
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                    />
                    <input
                        value={link.href}
                        onChange={e => updateLink(category, index, 'href', e.target.value)}
                        placeholder="Link URL"
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-slate-400 focus:outline-none focus:border-indigo-500 font-bold"
                    />
                    <button
                        onClick={() => removeLink(category, index)}
                        className="absolute -right-2 top-8 opacity-0 group-hover:opacity-100 p-1 bg-rose-500/10 text-rose-400 rounded transition-opacity"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            ))}
        </div>
    )

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <Menu className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Footer Section Definition</span>
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
                {/* Brand & Socials Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                    <div className="md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Brand Description</label>
                        <input
                            value={data.brandDesc}
                            onChange={e => setData(p => ({ ...p, brandDesc: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Social: Twitter URL</label>
                        <input
                            value={data.socialTwitter}
                            onChange={e => setData(p => ({ ...p, socialTwitter: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Social: Github URL</label>
                        <input
                            value={data.socialGithub}
                            onChange={e => setData(p => ({ ...p, socialGithub: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Copyright Text</label>
                        <input
                            value={data.copyright}
                            onChange={e => setData(p => ({ ...p, copyright: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-400 focus:outline-none focus:border-indigo-500 font-medium text-xs"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderLinkGroup("Product", 'productLinks')}
                    {renderLinkGroup("Company", 'companyLinks')}
                    {renderLinkGroup("Legal", 'legalLinks')}
                </div>
            </div>
        </div>
    )
}
