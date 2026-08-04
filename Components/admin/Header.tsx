"use client";

import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";
import Image from "next/image";



export default function Header() {
  const pathname = usePathname();

const { user } = useAuth();
const {sidebarOpen,} = useLayout();

const { toggleSidebar } = useLayout();


return (
<header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
  <div className="flex items-center gap-6">
    <button
  onClick={toggleSidebar}
  className="rounded-lg p-2 transition hover:bg-gray-100"
>
  <Menu size={24} />
</button>
<div className="flex items-center ">

  {/* Logo */}

  <div className="flex items-center gap-3">

    <Image
      src="/StepUpLogo_White.png"
      alt="StepUp"
      width={100}
      height={42}
    />

  </div>
  <div className="ml-5">
  <h1 className="text-2xl font-bold text-black">
    Admin Console
  </h1>
</div>

</div>
</div>
<div className="flex items-center gap-8">
  <button className="relative">

  <Bell
    size={24}
    className="text-black"
  />

  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-red-500"></span>

</button>
<div className="flex items-center gap-4">

  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0880EF] text-lg font-semibold text-white">

    {user?.name?.charAt(0).toUpperCase()}

  </div>
  <div>

  <p className="font-semibold text-black">
    {user?.name}
  </p>

  <p className="text-sm text-gray-500">
    Administrator
  </p>

</div>
</div>
</div>
</header>
);
}