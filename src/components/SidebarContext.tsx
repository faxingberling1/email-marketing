"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    // Automatically collapse on medium screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true)
            } else {
                setIsCollapsed(false)
            }
        };

        window.addEventListener("resize", handleResize)
        handleResize() // Initial check

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            setIsCollapsed,
            isMobileOpen,
            setIsMobileOpen
        }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
