"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage users, recruiters, companies and internships
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell
            size={22}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
          />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2">
          <UserCircle
            size={36}
            className="text-gray-600"
          />
          <div>
            <p className="font-medium">Admin</p>
            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}