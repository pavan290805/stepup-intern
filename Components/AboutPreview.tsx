"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
        {/* Background Image */}

<div className="absolute right-0 top-0 h-full w-1/2 opacity-40">

  <Image
    src="/about-bg.png"
    alt="Background"
    fill
    sizes="(max-width: 1024px) 100vw, 50vw"
    className="object-cover object-right"
  />

</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >

            <span className="text-[#0880EF] font-semibold uppercase tracking-widest">
              About StepUp Intern
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 leading-tight">
              More than an Internship Platform
            </h2>

            <p className="text-gray-600 text-lg leading-8 mt-8">

              StepUp Intern helps students discover internship
              opportunities, prepare for interviews, build
              professional resumes, and connect with recruiters
              through an AI-powered career ecosystem.

            </p>

            <p className="text-gray-600 text-lg leading-8 mt-6">

              Whether you're searching for your first internship
              or looking for the right talent, StepUp Intern
              provides everything in one place.

            </p>

            <Link href="/about">

              <button
                className="
                  mt-10
                  bg-[#0880EF]
                  text-white
                  px-8
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >
                Learn More
              </button>

            </Link>

          </motion.div>

          {/* Right Side */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >

           

          </motion.div>

        </div>

      </div>

    </section>
  );
}
