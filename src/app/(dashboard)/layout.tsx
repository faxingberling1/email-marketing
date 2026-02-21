import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

import { SidebarProvider } from "@/components/SidebarContext";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Link, BanIcon, LogOut, ArrowLeft } from "lucide-react";
import { signOut } from "@/app/auth/actions";


import { verifyImpersonationToken } from "@/lib/impersonation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const cookieStore = await cookies();

    // Verify signed impersonation token
    const impToken = cookieStore.get("impersonation_token")?.value;
    const impersonation = impToken ? verifyImpersonationToken(impToken) : null;
    const impersonatedName = impersonation?.workspaceName;


    // ── Maintenance Mode Check ──
    let isMaintenanceActive = false;
    const maintenanceEntry = await prisma.$queryRaw<{ value: string }[]>`
        SELECT value FROM "SystemSetting" WHERE key = 'maintenance_mode' LIMIT 1
    `;
    const maintenanceModeEnabled = maintenanceEntry[0]?.value === 'true';

    // Only block if user is NOT a super_admin
    const userRole = session?.user?.id ? (await prisma.$queryRaw<{ global_role: string }[]>`
        SELECT global_role FROM "User" WHERE id = ${session.user.id} LIMIT 1
    `)[0]?.global_role : null;

    if (maintenanceModeEnabled && userRole !== 'super_admin') {
        isMaintenanceActive = true;
    }

    // ── Suspension Check ──
    let isSuspended = false;
    let wsName = "";

    if (session?.user?.id) {
        const rows = await prisma.$queryRaw<{ health_status: string; name: string }[]>`
            SELECT w.health_status, w.name
            FROM "Workspace" w
            LEFT JOIN "User" u ON u."workspaceId" = w.id
            WHERE u.id = ${session.user.id}
            LIMIT 1
        `;
        if (rows[0]?.health_status === "suspended") {
            isSuspended = true;
            wsName = rows[0].name;
        }
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-slate-950 text-white overflow-hidden relative">
                {/* ── Impersonation Banner ── */}
                {impersonatedName && (
                    <div className="absolute top-0 inset-x-0 z-[100] bg-gradient-to-r from-amber-600 to-orange-600 h-10 flex items-center justify-center gap-4 px-8 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Administrating:</span>
                            <span className="text-sm font-black text-white outfit">{impersonatedName}</span>
                        </div>
                        <form action="/api/admin/impersonate/end" method="POST">
                            <button type="submit" className="flex items-center gap-1.5 px-3 py-1 bg-black/20 hover:bg-black/40 rounded-full border border-white/20 text-[10px] font-black text-white transition-all">
                                <ArrowLeft className="h-3 w-3" /> EXIT IMPERSONATION
                            </button>
                        </form>
                    </div>
                )}

                <Sidebar />
                <div className={cn(
                    "flex flex-1 flex-col overflow-hidden relative",
                    impersonatedName ? "pt-10" : ""
                )}>
                    {/* Continuous Orbital Atmosphere */}
                    <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse z-0" />
                    <div className="absolute bottom-[20%] left-[20%] w-[600px] h-[600px] bg-sky-600/5 rounded-full blur-[150px] pointer-events-none z-0" />

                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                        {/* ── Maintenance Mode Overlay ── */}
                        {isMaintenanceActive ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto">
                                <div className="h-20 w-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-xl animate-pulse" />
                                    <ArrowLeft className="h-10 w-10 text-indigo-400 relative z-10 rotate-180" />
                                </div>
                                <h1 className="text-3xl font-black outfit text-white mb-4 uppercase tracking-tight italic">Platform Maintenance</h1>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                                    We are currently performing scheduled system upgrades to the AI engine.
                                    Dashboard access is temporarily restricted to <span className="text-indigo-400 font-black">SUPER ADMINS</span>.
                                </p>
                                <div className="space-y-4 w-full">
                                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        Estimated Restore: 15:00 UTC
                                    </div>
                                    <form action="/api/auth/signout" method="POST">
                                        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black text-sm font-black rounded-2xl hover:bg-slate-200 transition-all uppercase letter-spacing-1">
                                            Logout
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : isSuspended ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto">
                                <div className="h-20 w-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8">
                                    <BanIcon className="h-10 w-10 text-rose-500" />
                                </div>
                                <h1 className="text-3xl font-black outfit text-white mb-4 uppercase tracking-tight">Workspace Suspended</h1>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                                    The workspace <span className="text-white font-bold">"{wsName}"</span> has been suspended due to
                                    policy violations or payment issues. All active campaigns and AI operations have been paused.
                                </p>
                                <div className="space-y-4 w-full">
                                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-xs text-slate-500 font-bold">
                                        Reference ID: {wsName.slice(0, 4)}-SOS
                                    </div>
                                    <form action="/api/auth/signout" method="POST">
                                        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black text-sm font-black rounded-2xl hover:bg-slate-200 transition-all">
                                            Return to Login
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto max-w-6xl">
                                {children}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

// Helper for classNames because I can't import cn from @/lib/utils in this context without ensuring it's available
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

