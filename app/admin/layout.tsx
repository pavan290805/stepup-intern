"use client";

import { ReactNode } from "react";
import Header from "../../Components/admin/Header";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="flex h-screen flex-col">

      <Header />

      <main className="flex-1 overflow-y-auto bg-[#F5F8FE] p-6">
        {children}
      </main>

    </div>
  );
}