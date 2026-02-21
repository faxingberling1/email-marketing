"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, Shield, Server, ShieldCheck, Lock } from "lucide-react"

export type LandingCmsTrustCta = {
    trustHeading: string;
    trustSub: string;
    trustItems: { title: string; desc: string; icon: string }[];
    ctaHeading1: string;
    ctaHeading2: string;
    ctaSub: string;
    btn1: string;
    btn2: string;
}

const DEFAULT_TRUST_CTA: LandingCmsTrustCta = {
    trustHeading: "Enterprise-Grade Trust & Security",
    trustSub: "Built to ensure your campaigns reach the inbox safely and securely.",
    trustItems: [
        { title: "Maximum Deliverability", desc: "Dedicated IPs and automated SPF/DKIM/DMARC configuration to secure your sender reputation.", icon: "Server" },
        { title: "GDPR Compliant", desc: "Built-in consent management, right-to-be-forgotten automation, and strict European data processing compliance.", icon: "ShieldCheck" },
        { title: "Data Security", desc: "End-to-end 256-bit AES encryption for all contact data at rest and in transit.", icon: "Lock" }
    ],
    ctaHeading1: "Scale Your Growth",
    ctaHeading2: "With Neural Intelligence",
    ctaSub: "The future of email is now.",
    btn1: "Start Building",
    btn2: "Sign In"
}

export function CtaTrustTab() {
    const [data, setData] = useState<LandingCmsTrustCta>(DEFAULT_TRUST_CTA)
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
            const found = settings.find((s: any) => s.key === "cms_landing_trust_cta")
            if (found && found.value) {
                try {
                    const parsed = JSON.parse(found.value)
                    setData({ ...DEFAULT_TRUST_CTA, ...parsed })
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
            body: JSON.stringify({ key: "cms_landing_trust_cta", value: JSON.stringify(data) })
        })
        setSaving(false)
        if (res.ok) {
            showToast("Trust & CTA config updated!")
        } else {
            showToast("Failed to update", false)
        }
    }

    const updateTrustItem = (index: number, key: string, val: string) => {
        const newItems = [...data.trustItems]
        newItems[index] = { ...newItems[index], [key]: val }
        setData({ ...data, trustItems: newItems })
    }

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Trust & CTA Data...</div>

    return (
        <div className="animate-in fade-in duration-500">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <Shield className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Trust & CTA Section Definition</span>
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
                {/* CTA Form Block */}
                <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20">
                    <h3 className="text-sm font-black text-indigo-400 outfit mb-6 uppercase tracking-widest">Bottom Call-to-Action</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Heading Part 1 (White)</label>
                            <input
                                value={data.ctaHeading1}
                                onChange={e => setData(p => ({ ...p, ctaHeading1: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Heading Part 2 (Gradient)</label>
                            <input
                                value={data.ctaHeading2}
                                onChange={e => setData(p => ({ ...p, ctaHeading2: e.target.value }))}
                                className="w-full bg-black/40 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-400 focus:outline-none focus:border-indigo-500 font-bold"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">CTA Subtitle</label>
                            <input
                                value={data.ctaSub}
                                onChange={e => setData(p => ({ ...p, ctaSub: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Primary Button</label>
                            <input
                                value={data.btn1}
                                onChange={e => setData(p => ({ ...p, btn1: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold uppercase tracking-widest text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Secondary Button</label>
                            <input
                                value={data.btn2}
                                onChange={e => setData(p => ({ ...p, btn2: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold uppercase tracking-widest text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Trust Form Block */}
                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                    <h3 className="text-sm font-black text-white outfit mb-6 uppercase tracking-widest">Enterprise Trust Pillars</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-white/10 pb-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Trust Heading</label>
                            <input
                                value={data.trustHeading}
                                onChange={e => setData(p => ({ ...p, trustHeading: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Trust Subtitle</label>
                            <input
                                value={data.trustSub}
                                onChange={e => setData(p => ({ ...p, trustSub: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.trustItems.map((item, index) => (
                            <div key={index} className="flex flex-col gap-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pillar {index + 1}</span>
                                <input
                                    value={item.title}
                                    onChange={e => updateTrustItem(index, 'title', e.target.value)}
                                    className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold w-full"
                                />
                                <textarea
                                    value={item.desc}
                                    onChange={e => updateTrustItem(index, 'desc', e.target.value)}
                                    rows={3}
                                    className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-bold w-full resize-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
