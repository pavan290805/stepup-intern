"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/internships", label: "Internships" },
  { href: "/partners", label: "Recruiters" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 top-0 z-50 w-full border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/StepUpLogo_White.png"
            alt="StepUp Intern"
            width={95}
            height={32}
            priority
            className="h-8 w-auto sm:h-9 lg:h-10"
          />
        </Link>

        <div className="hidden items-center gap-5 text-[15px] font-medium text-gray-700 md:flex lg:gap-8 lg:text-[16px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#0880EF]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-5"
          >
            Log In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-5"
          >
            Get Started
          </button>
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex rounded-md p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white/95 px-4 py-4 shadow-sm md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-[#0880EF]"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/login");
                }}
                className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/signup");
                }}
                className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}