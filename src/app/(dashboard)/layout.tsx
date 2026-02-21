import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SidebarProvider } from "@/components/SidebarContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden relative">
                    {/* Continuous Orbital Atmosphere */}
                    <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse z-0" />
                    <div className="absolute bottom-[20%] left-[20%] w-[600px] h-[600px] bg-sky-600/5 rounded-full blur-[150px] pointer-events-none z-0" />

                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                        <div className="mx-auto max-w-6xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
