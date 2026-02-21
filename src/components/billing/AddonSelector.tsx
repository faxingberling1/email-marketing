"use client"

import { useState } from "react"
import { Zap, ShoppingCart, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const ADDONS = [
    { id: 'ai_100', name: '100 AI Credits', price: '$10', desc: 'Short-term tactical capacity.' },
    { id: 'ai_500', name: '500 AI Credits', price: '$45', desc: 'Standard monthly orchestration.' },
    { id: 'ai_2000', name: '2,000 AI Credits', price: '$150', desc: 'Pro-level neural volume.' },
]

export function AddonSelector() {
    const [isPurchasing, setIsPurchasing] = useState<string | null>(null)

    const handlePurchase = (id: string) => {
        setIsPurchasing(id)
        setTimeout(() => setIsPurchasing(null), 2000)
    }

    return (
        <div className="space-y-4">
            {ADDONS.map((addon) => (
                <div
                    key={addon.id}
                    className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 transition-all group-hover:bg-amber-500 group-hover:text-white">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm font-black text-white mb-0.5 tracking-tight uppercase">{addon.name}</div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{addon.desc}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-lg font-black text-white mb-2">{addon.price}</div>
                        <button
                            onClick={() => handlePurchase(addon.id)}
                            disabled={!!isPurchasing}
                            className="px-5 py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50"
                        >
                            {isPurchasing === addon.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    PURCHASE <ShoppingCart className="h-3 w-3" />
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
