"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { 
    ChevronLeft, Mail, BarChart3, Clock, Rocket, Send 
} from "lucide-react"
import { sendCampaign } from "../actions"

export default function CampaignDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    // In a real implementation, we would fetch campaign details from the DB here
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)

    const handleSendDraft = async () => {
        setSending(true)
        const res = await sendCampaign(id)
        if (res.success) {
            alert(`Campaign sent successfully to ${res.sent} contacts!`)
            router.push('/campaigns')
        } else {
            alert("Error sending campaign: " + res.error)
        }
        setSending(false)
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-12">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors"
            >
                <ChevronLeft className="h-4 w-4" /> Back to Campaigns
            </button>
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white outfit tracking-tight">Campaign Overview</h1>
                    <p className="text-slate-400 text-sm mt-1">Detailed performance and intelligence for this campaign.</p>
                </div>
                <button
                    onClick={handleSendDraft}
                    disabled={sending}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                    {sending ? "SENDING..." : <><Send className="h-4 w-4" /> SEND DRAFT</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <h3 className="text-2xl font-black text-white tracking-tighter">Viewing Details</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Open Rate</p>
                    <h3 className="text-2xl font-black text-emerald-400 tracking-tighter">--%</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Click Rate</p>
                    <h3 className="text-2xl font-black text-cyan-400 tracking-tighter">--%</h3>
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-950/20 flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <BarChart3 className="h-12 w-12 text-slate-700" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest">More Details Coming Soon</h4>
                <p className="text-xs text-slate-500 text-center max-w-sm">
                    Campaign detailed analytics and content preview will be populated here as tracking data comes in.
                </p>
            </div>
        </div>
    )
}
