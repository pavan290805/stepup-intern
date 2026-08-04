"use client";

import {
  createContext,
  useState,
  ReactNode,
} from "react";

interface LayoutContextType {
  sidebarOpen: boolean;

  toggleSidebar: () => void;
}

export const LayoutContext =
  createContext<LayoutContextType | undefined>(
    undefined
  );

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({
  children,
}: LayoutProviderProps) {
  // ============================
  // Sidebar State
  // ============================

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  // ============================
  // Toggle Sidebar
  // ============================

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}