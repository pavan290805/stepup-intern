"use client";

import Link from "next/link";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-6">
          
          {/* Brand Section */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-12">
            <Link href="/" className="mb-3 block">
              <Image
                src="/StepUpLogo_Black.png"
                alt="StepUp Intern"
                width={120}
                height={48}
                className="h-auto w-auto"
              />
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              StepUp Intern is an AI-powered internship platform connecting students and recruiters while helping careers grow through modern technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-2 text-sm tracking-wide">Quick Links</h3>
            <ul className="flex flex-col gap-1.5 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link href="/internships" className="hover:text-white transition-colors duration-200">Internships</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors duration-200">Recruiters</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-medium mb-2 text-sm tracking-wide">Resources</h3>
            <ul className="flex flex-col gap-1.5 text-xs">
              <li><Link href="#" className="hover:text-white transition-colors duration-200">Career Resources</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200">AI Assistant</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200">Resume Builder</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-2 text-sm tracking-wide">Connect</h3>
            <div className="flex gap-3 items-center mb-3">
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
        <div className="border-t border-gray-800/80 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
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