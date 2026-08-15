"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface NavbarProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
  homeRoute?: string;
  title?: string;
}

export default function Navbar({ isLoggedIn, onLogout, homeRoute = "/", title }: NavbarProps = {}) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  
  // Call useAuth unconditionally. It will throw if used outside AuthProvider.
  // We verified AuthProvider is at the root layout so this is safe.
  const authContext = useAuth();
  
  const isAuthenticated = authContext?.isAuthenticated ?? isLoggedIn;
  const user = authContext?.user;
  const doLogout = async () => {
    if (authContext?.logout) {
      try {
        await authContext.logout();
      } catch (err) {
        console.error(err);
      }
    }
    if (onLogout) onLogout();
    else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.replace("/");
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="
        fixed
        top-0
        left-0
        w-full
        bg-white/90
        backdrop-blur-md
        border-b
        border-gray-200
        shadow-sm
        z-50
      "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-2">

        {/* Logo and Optional Title */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/StepUpLogo_White.png"
              alt="StepUp Intern"
              width={95}
              height={32}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}

        <div className="hidden md:flex items-center gap-10 text-[17px]">
          <Link href={homeRoute} className="hover:text-[#0880EF] transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-[#0880EF] transition">
            About
          </Link>
          <Link href="/partners" className="hover:text-[#0880EF] transition">
            Partners
          </Link>
          <Link href="/internships" className="hover:text-[#0880EF] transition">
            Internships
          </Link>
          <div className="relative group">
            <button 
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="flex items-center gap-1 hover:text-[#0880EF] transition cursor-pointer"
            >
              Resources
              <svg className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {resourcesOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setResourcesOpen(false)} />
                <div className="absolute left-0 mt-2 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <Link
                    href="/student?tab=skill"
                    onClick={() => setResourcesOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition hover:text-[#0880EF]"
                  >
                    Skill Gap Analyzer
                  </Link>
                  <Link
                    href="/student?tab=ats"
                    onClick={() => setResourcesOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition hover:text-[#0880EF]"
                  >
                    ATS Checker
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[#E8F2FF] text-[#0B5CC4] font-bold shadow-sm hover:ring-2 hover:ring-blue-100 transition"
              >
                {(user as Record<string, unknown>)?.profilePicture ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={(user as Record<string, unknown>).profilePicture as string} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : "U"
                )}
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <div className="mb-2 border-b border-slate-100 px-3 pb-2 pt-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{user?.name || "User"}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email || ""}</p>
                    </div>
                    <Link
                      href={user?.role === "student" ? "/student" : user?.role === "recruiter" ? "/recruiter" : "/profile"}
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        doLogout();
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 rounded-lg bg-[#0880EF] text-white font-medium hover:bg-blue-700 transition"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-5 py-2 rounded-lg bg-[#0880EF] text-white font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </>
          )}
        </div>

      </div>
    </motion.nav>
  );
}