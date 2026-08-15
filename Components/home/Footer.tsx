"use client";

import Link from "next/link";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-1.5 lg:py-1.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5">
          
          {/* Brand Section - Left Side */}
          <div className="flex items-center gap-2 flex-1">
            <Link href="/" className="block shrink-0 leading-none py-0">
              <Image
                src="/StepUpLogo_Black.png"
                alt="StepUp Intern"
                width={70}
                height={28}
                className="h-auto w-auto block"
              />
            </Link>
            <p className="text-xs leading-tight max-w-sm py-0">
              StepUp Intern is an AI-powered internship platform connecting students and recruiters while helping careers grow through modern technology.
            </p>
          </div>

          {/* Connect - Right Side */}
          <div className="flex flex-col md:items-center items-start shrink-0 pt-0">
            <h3 className="text-white font-medium mb-0.5 text-sm tracking-wide">Connect</h3>
            <div className="flex gap-3 items-center mb-0.5">
              <a 
                href="https://www.instagram.com/stepup_intern/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
              >
                <Image src="/InstagramLogo.png" alt="Instagram" width={20} height={20} className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/stepup-intern/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
              >
                <Image src="/LinkedinLogo_White.svg" alt="LinkedIn" width={20} height={20} className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/918341011206" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
              >
                <Image src="/WhatsappLogo.png" alt="WhatsApp" width={20} height={20} className="w-4 h-4" />
              </a>
            </div>
            <a href="mailto:info@stepupintern.com" className="text-xs hover:text-white transition-colors">
              info@stepupintern.com
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/80 mt-1 pt-0.5 flex flex-col md:flex-row justify-between items-center gap-0.5">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} StepUp Intern. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}