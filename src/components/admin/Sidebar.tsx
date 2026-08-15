"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  BriefcaseBusiness,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    title: "Recruiters",
    href: "/admin/recruiters",
    icon: UserCheck,
  },
  {
    title: "Internships",
    href: "/admin/internships",
    icon: BriefcaseBusiness,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

const { logout } = useAuth();

const {sidebarOpen,} = useLayout();

return (
  <aside
    className={`flex h-[calc(100vh-80px)] flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
      sidebarOpen ? "w-72" : "w-20"
    }`}
  >
<nav className="flex-1 px-3 py-6">

  <div className="space-y-2">
  {navigationItems.map((item) => {
    const Icon = item.icon;

const active = item.href ==="/admin" ? pathname === "/admin": pathname.startsWith(item.href);

return(
<Link
  key={item.href}
  href={item.href}
  className={`flex items-center rounded-xl transition-all duration-200 ${
    sidebarOpen
      ? "justify-start px-4 py-3"
      : "justify-center py-3"
  } ${
    active
      ? "bg-[#0880EF] text-white"
      : "text-black hover:bg-[#0880EF]/10"
  }`}
>
  <Icon size={22} />
  {sidebarOpen && (
  <span className="ml-4 font-medium">
    {item.title}
  </span>
)}
</Link>
)})}
</div>
</nav>
<div className="border-t border-gray-200 p-4">

  <button
    onClick={logout}
    className={`flex w-full items-center rounded-xl transition-all duration-200 hover:bg-red-50 ${
      sidebarOpen
        ? "justify-start px-4 py-3"
        : "justify-center py-3"
    }`}
  >
    <LogOut
  size={22}
  className="text-red-600"
/>
{sidebarOpen && (
  <span className="ml-4 font-medium text-red-600">
    Logout
  </span>
)}
  </button>
  </div>
  </aside>
);
}