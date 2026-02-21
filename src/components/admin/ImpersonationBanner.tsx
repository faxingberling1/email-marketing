"use client"

import { useEffect, useState } from "react"
import { LogOut, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export function ImpersonationBanner() {
    const [workspaceName, setWorkspaceName] = useState<string | null>(null)
    const [exiting, setExiting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Read the non-httpOnly name cookie
        const match = document.cookie.match(/admin_impersonating_workspace_name=([^;]+)/)
        if (match) setWorkspaceName(decodeURIComponent(match[1]))
    }, [])

    if (!workspaceName) return null

    async function handleExit() {
        setExiting(true)
        await fetch("/api/admin/impersonate/end", { method: "POST" })
        setWorkspaceName(null)
        router.push("/admin")
        router.refresh()
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-amber-950 px-4 py-2.5 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="text-sm font-black uppercase tracking-wide">
                    Impersonating workspace: <span className="underline">{workspaceName}</span>
                </span>
            </div>
            <button
                onClick={handleExit}
                disabled={exiting}
                className="flex items-center gap-2 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-900/30 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
            >
                <LogOut className="h-3.5 w-3.5" />
                {exiting ? "Exiting…" : "Exit Impersonation"}
            </button>
        </div>
    )
}
