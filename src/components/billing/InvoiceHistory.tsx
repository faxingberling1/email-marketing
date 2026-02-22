"use client"

import { useState } from "react"
import { CheckCircle2, Download, Eye } from "lucide-react"
import { InvoicePreviewModal } from "./InvoicePreviewModal"

interface Invoice {
    id: string
    date: string
    amount: string
    status: string
}

export function InvoiceHistory() {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

    const invoices: Invoice[] = [
        { id: "MM-2024-8842", date: "Feb 1, 2024", amount: "$79.00", status: "Processed" },
        { id: "MM-2024-7129", date: "Jan 1, 2024", amount: "$79.00", status: "Processed" },
        { id: "MM-2023-6621", date: "Dec 1, 2023", amount: "$29.00", status: "Processed" },
    ]

    return (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Transactional History
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Full invoice history and payment methods are managed via the Secure Stripe Portal.
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5">
                            <th className="px-8 py-5">Reference</th>
                            <th className="px-8 py-5">Issue Date</th>
                            <th className="px-8 py-5">Valuation</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-5 text-sm font-black text-white tracking-widest uppercase italic">{inv.id}</td>
                                <td className="px-8 py-5 text-sm font-bold text-slate-500">{inv.date}</td>
                                <td className="px-8 py-5 text-sm font-black text-white">{inv.amount}</td>
                                <td className="px-8 py-5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedInvoice(inv)}
                                            className="h-9 w-9 inline-flex items-center justify-center bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"
                                            title="Preview Invoice"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="h-9 w-9 inline-flex items-center justify-center bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <InvoicePreviewModal
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
            />
        </div>
    )
}
