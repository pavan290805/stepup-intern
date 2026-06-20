"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pageTitles: Record<string, string> = {
  "/recruiter": "Recruiter Dashboard",
  "/recruiter/internships": "Internship Management",
  "/recruiter/create-internship": "Create Internship",
  "/recruiter/interviews": "Interviews",
  "/recruiter/analytics": "Analytics",
  "/recruiter/profile": "Profile",
  "/recruiter/settings": "Settings",
};
  return (
    <div className="h-20 bg-white shadow-sm border-b flex items-center justify-between px-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          {pageTitles[pathname] || "Recruiter Dashboard"}
        </h1>

        <p className="text-gray-500">
          Manage candidates and company profile
        </p>
      </div>

      <div className="flex items-center gap-5">
<div className="relative">
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="text-2xl hover:scale-110 transition relative"
  >
    🔔

    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
      3
    </span>
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border z-50">
      <div className="p-4 border-b font-semibold">
        Notifications
      </div>

      <div className="p-4 hover:bg-gray-50">
        🎉 New application received for Frontend Intern
      </div>

      <div className="p-4 hover:bg-gray-50">
        ✅ Rahul has been shortlisted
      </div>

      <div className="p-4 hover:bg-gray-50">
        ⏰ AI/ML Internship closes in 2 days
      </div>
    </div>
  )}
</div>

        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#1E88E5] text-white flex items-center justify-center font-bold text-lg">
              L
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Lalith Kumar
              </h3>

              <p className="text-gray-500 text-sm">
                Recruiter
              </p>
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border z-50">
<Link
  href="/recruiter/profile"
  className="block px-4 py-3 hover:bg-gray-100"
>
  👤 My Profile
</Link>

              <Link
                href="/recruiter/settings"
                className="block px-4 py-3 hover:bg-gray-100"
              >
                ⚙️ Settings
              </Link>

              <hr />

              <Link
                href="/"
                className="block px-4 py-3 text-red-500 hover:bg-red-50"
              >
                🚪 Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}