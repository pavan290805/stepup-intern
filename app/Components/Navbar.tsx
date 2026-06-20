"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type NavbarProps = {
  onLoginClick: () => void;
  onSignupClick: () => void;
};

export default function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
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

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">

          <Image
          src="/StepUpLogo_White.png"
          alt="StepUp Intern"
          width={95}
          height={32}
          priority
        />
        </div>

        {/* Navigation */}

        <div className="hidden md:flex items-center gap-10 text-[17px]">

          <Link href="/" className="hover:text-[#0880EF] transition">
            Home
          </Link>

          <Link href="/about" className="hover:text-[#0880EF] transition">
            About
          </Link>

          <Link href="/internships" className="hover:text-[#0880EF] transition">
            Internships
          </Link>

          <Link href="/partners" className="hover:text-[#0880EF] transition">
            Partners
          </Link>

          <Link href="/contact" className="hover:text-[#0880EF] transition">
            Contact Us
          </Link>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-6">

          <button
            onClick={onLoginClick}
            className="
              px-5
              py-2
              rounded-lg
              bg-[#0880EF]
              text-white
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Log In
          </button>
          <button
            onClick={onSignupClick}
            className="
              px-5
              py-2
              rounded-lg
              bg-[#0880EF]
              text-white
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Get Started
          </button>

        </div>

      </div>
    </motion.nav>
  );
}