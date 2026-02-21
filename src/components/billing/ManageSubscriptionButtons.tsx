"use client"

import { useState } from "react"
import { createPortalSession } from "@/app/(dashboard)/billing/actions"
import { Loader2 } from "lucide-react"

export function ManageSubscriptionButtons() {
    const [loading, setLoading] = useState(false)

    const handleManage = async () => {
        setLoading(true)
        try {
            const { url } = await createPortalSession()
            if (url) window.location.href = url
        } catch (error) {
            console.error("Portal error:", error)
            alert("No active subscription found. Please upgrade to a plan first.")
        } finally {
            setLoading(null as any)
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-4">
            <button
                onClick={handleManage}
                disabled={loading}
                className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm transition-all hover:bg-slate-200 active:scale-95 shadow-xl shadow-indigo-500/10 flex items-center gap-2"
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Manage Subscription
            </button>
            <button className="px-6 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm transition-all hover:bg-white/10 active:scale-95">
                View Usage History
            </button>
        </div>
    )
}
