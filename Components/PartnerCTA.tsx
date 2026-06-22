"use client";

import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PartnerCTA() {
  return (
    <section className="py-24 bg-[#0880EF]">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-10
            lg:p-16
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-10
          "
        >

          {/* Left Side */}

          <div className="max-w-2xl">

            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">

              <Building2
                size={32}
                className="text-[#0880EF]"
              />

            </div>

            <h2 className="text-4xl font-bold text-gray-900">

              Looking to Hire Talented Students?

            </h2>

            <p className="text-gray-600 text-lg leading-8 mt-6">

              Partner with StepUp Intern to connect with skilled,
              motivated students from different domains. Post
              internships, manage applications and discover your
              next future employee through one platform.

            </p>

          </div>

          {/* Right Side */}

          <div className="flex flex-col items-center gap-5">

            <Link href="/partners">

              <button
                className="
                  bg-[#0880EF]
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  flex
                  items-center
                  gap-3
                  hover:bg-blue-700
                  transition
                "
              >

                Become a Partner

                <ArrowRight size={20} />

              </button>

            </Link>

            <p className="text-sm text-gray-500">

              Learn how StepUp Intern helps companies
              hire smarter.

            </p>

          </div>

        </motion.div>

      </div>

    </section>
  );
}