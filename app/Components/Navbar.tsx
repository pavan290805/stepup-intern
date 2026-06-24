"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-4">

        <button className="text-gray-600 text-2xl">
          ☰
        </button>

        <h1 className="text-2xl font-bold leading-none">
          <span className="text-blue-600">StepUp</span>
          <span className="text-gray-900"> Intern</span>
        </h1>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-[11px] tracking-[4px] text-blue-500 font-semibold uppercase">
            Recruiter Portal
          </p>

          <h2 className="text-3xl font-bold text-blue-900">
            Recruiter Dashboard
          </h2>
        </div>

      </div>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-8">

        <Link
          href="/recruiter"
          className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium"
        >
          Home
        </Link>

        <Link
          href="/about"
          className="text-gray-700 hover:text-blue-600"
        >
          About Us
        </Link>
<Link
  href="/recruiter"
  className="hover:text-blue-600 transition"
>
  Dashboard
</Link>
        <Link
          href="/contact"
          className="text-gray-700 hover:text-blue-600"
        >
          Contact Us
        </Link>

        <Link
          href="/recruiter/profile"
          className="text-gray-700 hover:text-blue-600"
        >
          Profile
        </Link>

      </div>

      {/* Profile */}
      <div className="relative">

        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50"
        >

          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
            LK
          </div>

          <span className="font-medium text-gray-700">
            Lalith Kumar
          </span>

        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

            <Link
              href="/recruiter/profile"
              className="block px-4 py-3 hover:bg-gray-50"
            >
              Profile
            </Link>

            <Link
              href="/"
              className="block px-4 py-3 text-red-500 hover:bg-red-50"
            >
              Logout
            </Link>

          </div>
        )}

      </div>

    </nav>
  );
}