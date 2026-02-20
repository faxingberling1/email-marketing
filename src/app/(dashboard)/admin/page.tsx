"use client"

import { Shield, Users, Mail, Settings, Activity, Server } from "lucide-react"

const systemStats = [
    { name: "Total Users", value: "1,284", icon: Users },
    { name: "Total Campaigns", value: "8,402", icon: Mail },
    { name: "Platform Health", value: "99.9%", icon: Activity },
    { name: "Server Load", value: "24%", icon: Server },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2">
                    <Shield className="h-6 w-6 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-white outfit">Admin Control Center</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {systemStats.map((stat) => (
                    <div key={stat.name} className="glass rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <stat.icon className="h-5 w-5 text-indigo-400" />
                            <span className="text-sm font-medium text-slate-400">{stat.name}</span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-white outfit">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white outfit mb-6">User Management (Simulation)</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-800" />
                                <div>
                                    <p className="text-sm font-bold text-white">User {i}</p>
                                    <p className="text-xs text-slate-500">user_{i}@example.com</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-bold text-indigo-400 uppercase">Pro Plan</span>
                                <button className="text-xs font-bold text-slate-500 hover:text-white">Suspend</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
