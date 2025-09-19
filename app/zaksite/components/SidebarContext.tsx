"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext<{ isOpen: boolean; setIsOpen: (open: boolean) => void } | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Custom hook for SidebarContext
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
