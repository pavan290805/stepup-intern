"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { useRecruiterProfile } from "./useRecruiterProfile";

type HeaderProps = {
  onCreate?: () => void;
};

export default function Header({ onCreate }: HeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "/";
  const page = searchParams?.get("page") ?? "";

  const navItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "about", label: "About Us", href: "/about" },
    { key: "internships", label: "Internships", href: "/?page=edit-internships" },
    { key: "contact", label: "Contact Us", href: "/contact" },
    { key: "profile", label: "Profile", href: "/?page=profile" },
  ];

  // Mobile-only menu (hamburger) — intentionally separate from desktop nav
  const mobileNav = [
    { key: "internships", label: "Internships", href: "/?page=edit-internships" },
    { key: "interviews", label: "Interviews", href: "/?page=interviews" },
    { key: "profile", label: "Profile", href: "/?page=profile" },
  ];

  const isActiveNavItem = (key: string) => {
    if (key === "home") {
      return pathname === "/" && !page;
    }

    if (key === "about") {
      return pathname === "/about";
    }

    if (key === "contact") {
      return pathname === "/contact";
    }

    if (key === "internships") {
      return page?.includes("internships") ?? false;
    }

    if (key === "profile") {
      return page === "profile";
    }

    return false;
  };

  const { profile } = useRecruiterProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [navOpen, setNavOpen] = useState(false);

  const baseItem = "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition";
  const activeClass = (p: string) =>
    baseItem +
    (p === page || (p === "dashboard" && !page)
      ? " bg-[#E8F2FF] text-[#0B5CC4] shadow-sm"
      : " text-slate-600 hover:bg-slate-100 hover:text-slate-900");

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarContent = profile.picture ? (
    <img src={profile.picture} alt={profile.name} className="h-11 w-11 rounded-full object-cover" />
  ) : (
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F2FF] text-base font-bold text-[#0B5CC4]">
      {initials}
    </span>
  );

  const toggleDropdown = () => setDropdownOpen((current) => !current);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("recruiter_nav_open");
      if (stored === "true") setNavOpen(true);
    }
  }, []);

  const toggleNav = () => {
    setNavOpen((current) => {
      const next = !current;
      if (typeof window !== "undefined") window.localStorage.setItem("recruiter_nav_open", String(next));
      return next;
    });
  };

  const closeNav = () => {
    setNavOpen(false);
    if (typeof window !== "undefined") window.localStorage.setItem("recruiter_nav_open", "false");
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky inset-x-0 top-0 z-[9999] border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm overflow-visible px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center px-0 py-4">
        <div className="flex items-center gap-3">
          <button
              type="button"
              onClick={toggleNav}
              className="inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-2xl bg-transparent text-slate-700 transition hover:bg-blue-50 hover:text-[#0880EF] focus:outline-none focus:ring-2 focus:ring-[#0880EF]/30 group"
              aria-expanded={navOpen}
              aria-label="Open navigation"
            >
              <span className="block h-0.5 w-6 rounded-full bg-slate-700 transition-colors group-hover:bg-[#0880EF]" />
              <span className="block h-0.5 w-6 rounded-full bg-slate-700 transition-colors group-hover:bg-[#0880EF]" />
              <span className="block h-0.5 w-6 rounded-full bg-slate-700 transition-colors group-hover:bg-[#0880EF]" />
            </button>

            <div className="flex items-center gap-4">
              <div className="leading-none">
                <p className="text-3xl font-bold tracking-tight text-[#0880EF] lg:text-4xl">StepUp</p>
                <p className="text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">Intern</p>
              </div>
              <div className="hidden h-12 w-px bg-slate-200 sm:block" />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0880EF] sm:text-sm">Recruiter Portal</p>
                <h1 className="text-2xl font-bold tracking-tight text-[#083B87] lg:text-3xl">Recruiter Dashboard</h1>
              </div>
            </div>
          </div>

          <nav className="hidden justify-self-center md:flex flex-wrap items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={
                  "inline-flex items-center rounded-full px-6 py-3 text-lg font-semibold transition " +
                  (isActiveNavItem(item.key)
                    ? "bg-[#E8F2FF] text-[#0B5CC4] shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex justify-end">
            <div className="relative z-10">
              <button
                type="button"
                onClick={toggleDropdown}
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-6 sm:py-4 sm:text-lg"
              >
                {avatarContent}
                <span className="hidden sm:inline text-base font-medium sm:text-lg">{profile.name}</span>
              </button>

              {dropdownOpen ? (
                <div className="absolute right-0 z-[1001] mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                    <p className="text-xs text-slate-500">{profile.role}</p>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/?page=profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      className="w-full rounded-2xl bg-[#0880EF] px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-[#0A67C6]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

      {mounted && navOpen ? (
        createPortal(
          <>
            <div className="fixed inset-0 z-[9998] bg-slate-950/30 opacity-100 transition-opacity duration-200" onClick={closeNav} />
            <aside className="fixed inset-y-0 left-0 z-[9999] w-72 border-r border-slate-200 bg-white p-4 shadow-2xl transition-transform duration-200 ease-out">
              <div className="relative">
                <p className="text-sm font-semibold text-slate-900 text-center">Menu</p>
                <button
                  type="button"
                  onClick={closeNav}
                  className="absolute -right-2 -top-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  aria-label="Close navigation"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
              <nav className="mt-6 space-y-2">
                {mobileNav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeNav}
                  className={
                    "block w-full rounded-2xl px-4 py-2 text-left text-sm transition " +
                    (isActiveNavItem(item.key)
                      ? "bg-[#E8F2FF] text-[#0B5CC4]"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900")
                  }
                >
                  {item.label}
                </Link>
              ))}
              </nav>
            </aside>
          </>,
          document.body,
        )
      ) : null}
      <div className="h-2" aria-hidden="true" />
    </header>
    
  );
}
