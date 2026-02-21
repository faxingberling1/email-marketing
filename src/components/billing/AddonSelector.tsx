"use client"

import { useState } from "react"
import { Zap, Loader2 } from "lucide-react"
import { createAddonCheckoutSession } from "@/app/(dashboard)/billing/actions"

interface AddonTier {
    credits: number
    price: number
    desc: string
    best?: boolean
}

export function AddonSelector() {
    const [loading, setLoading] = useState<number | null>(null)

    const tiers: AddonTier[] = [
        { credits: 500, price: 10, desc: "Neural allocation boost for creators." },
        { credits: 2000, price: 35, desc: "High-capacity brainpower for marketers." },
        { credits: 5000, price: 75, desc: "Maximum intelligence for enterprises.", best: true },
    ]

    const handlePurchase = async (tier: AddonTier, index: number) => {
        setLoading(index)
        try {
            const { url } = await createAddonCheckoutSession(tier.credits, tier.price)
            if (url) window.location.href = url
        } catch (error) {
            console.error("Purchase error:", error)
            alert("Failed to initiate checkout. Please try again.")
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="space-y-4">
            {tiers.map((add, i) => (
                <div
                    key={add.credits}
                    className="group relative flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-sm font-black text-white mb-1 tracking-tight">
                                {add.credits.toLocaleString()} Credits
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold">{add.desc}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-lg font-black text-white mb-2">${add.price}</div>
                        <button
                            disabled={loading !== null}
                            onClick={() => handlePurchase(add, i)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading === i ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                "Purchase"
                            )}
                        </button>
                    </div>

                    {add.best && (
                        <span className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-widest rounded-md">
                            Best Value
                        </span>
                    )}
                </div>
            ))}
        </div>
    )
}
