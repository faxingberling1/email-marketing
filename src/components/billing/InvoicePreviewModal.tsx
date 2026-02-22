"use client"

import { X, Download, Printer, CreditCard, ShieldCheck, Sparkles, Receipt } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Invoice {
    id: string
    date: string
    amount: string
    status: string
}

interface InvoicePreviewModalProps {
    invoice: Invoice | null
    onClose: () => void
}

export function InvoicePreviewModal({ invoice, onClose }: InvoicePreviewModalProps) {
    if (!invoice) return null

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        const originalTitle = document.title
        document.title = `Invoice_${invoice.id}_Mission_Control`
        window.print()
        setTimeout(() => {
            document.title = originalTitle
        }, 1000)
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md no-print"
                />

                <motion.div
                    id="printable-invoice"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden print:shadow-none print:border-none print:rounded-none"
                >
                    {/* Tactical Header Overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent no-print" />

                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white outfit uppercase tracking-tighter">
                                        Mission <span className="text-indigo-400">Control</span>
                                    </h2>
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Orbital Billing System</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Invoice Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 p-6 bg-white/[0.02] border border-white/5 rounded-3xl print:bg-slate-100 print:text-slate-900 print:border-slate-200">
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Receipt ID</p>
                                <p className="text-xs font-black text-white print:text-slate-900 uppercase tracking-wider">{invoice.id}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Issue Date</p>
                                <p className="text-xs font-bold text-slate-300 print:text-slate-700">{invoice.date}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</p>
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.1em]">{invoice.status}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Valuation</p>
                                <p className="text-sm font-black text-indigo-400 print:text-indigo-600">{invoice.amount}</p>
                            </div>
                        </div>

                        {/* Itemized Table */}
                        <div className="space-y-4 mb-12">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 mb-4">Neural Allocation Breakdown</h3>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl print:border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center no-print">
                                            <Receipt className="h-4 w-4 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white print:text-slate-900">Pro Plan Subscription (Monthly)</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">MAR 1 - MAR 31, 2024</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black text-white print:text-slate-900">$79.00</p>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl print:border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center no-print">
                                            <Sparkles className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white print:text-slate-900">AI Neural Boost Add-on</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">50k Neural Sequences</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black text-white print:text-slate-900">$0.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Footer */}
                        <div className="border-t border-white/5 pt-8 mb-12">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500">Subtotal</span>
                                <span className="text-xs font-black text-white">{invoice.amount}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-bold text-slate-500">Tax (0%)</span>
                                <span className="text-xs font-black text-white">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl shadow-inner">
                                <span className="text-sm font-black text-white uppercase tracking-widest">Amount Balanced</span>
                                <span className="text-2xl font-black text-indigo-400 outfit">{invoice.amount}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 no-print">
                            <button
                                onClick={handleDownload}
                                className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                            >
                                <Download className="h-4 w-4" /> Download PDF
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                <Printer className="h-4 w-4" /> Print Receipt
                            </button>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="bg-slate-950/50 px-8 py-4 flex items-center justify-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                            Transaction Verified via 256-bit Tactical Encryption
                        </span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
