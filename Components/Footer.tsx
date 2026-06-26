"use client";

import Link from "next/link";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">

          {/* Logo */}

          <div>

            <Image
              src="/StepUpLogo_Black.png"
              alt="StepUp Intern"
              width={150}
              height={60}
            />

            <p className="text-gray-400 mt-6 leading-7">

              StepUp Intern is an AI-powered internship
              platform connecting students and recruiters
              while helping careers grow through modern
              technology.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link href="/">Home</Link>

              <Link href="/about">About</Link>

              <Link href="/internships">Internships</Link>

              <Link href="/partners">Recruiters</Link>

              <Link href="/contact">Contact</Link>

            </div>
            

          </div>

          {/* Resources */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Resources
            </h3>

            <div className="flex flex-col gap-3">

              <Link href="#">
                Career Resources
              </Link>

              <Link href="#">
                AI Assistant
              </Link>

              <Link href="#">
                Resume Builder
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Connect
            </h3>
            <div className="flex gap-5">

  <a
    href="https://www.instagram.com/stepup_intern/"
    target="_blank"
    rel="noopener noreferrer"
    className="transition hover:scale-110"
  >
    <Image
      src="/InstagramLogo.png"
      alt="Instagram"
      width={38}
      height={38}
    />
  </a>

  <a
    href="https://www.linkedin.com/company/stepup-intern/"
    target="_blank"
    rel="noopener noreferrer"
    className="transition hover:scale-110"
  >
    <Image
      src="/LinkedinLogo_White.svg"
      alt="LinkedIn"
      width={34}
      height={34}
    />
  </a>

  <a
    href="https://wa.me/918341011206"
    target="_blank"
    rel="noopener noreferrer"
    className="transition hover:scale-110"
  >
    <Image
      src="/WhatsappLogo.png"
      alt="WhatsApp"
      width={34}
      height={34}
    />
  </a>

</div>
            

            <p className="text-gray-400 mt-8">
                info@stepupintern.com
            </p>

          </div>

        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-400">

            © 2026 StepUp Intern. All Rights Reserved.

          </p>

          <div className="flex gap-6 mt-4 md:mt-0">

            <Link href="#">
              Privacy Policy
            </Link>

            <Link href="#">
              Terms of Service
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}