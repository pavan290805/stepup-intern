"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";



export default function FinalCTA() {
  const router = useRouter();
  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="
            bg-[#0880EF]
            rounded-3xl
            px-10
            lg:px-20
            py-16
            text-center
            shadow-xl
          "
        >

          <h2 className="text-4xl lg:text-5xl font-bold text-white">

            Ready to Start Your Career Journey?

          </h2>

          <p className="text-blue-100 text-lg leading-8 mt-6 max-w-3xl mx-auto">

            Join StepUp Intern today and explore internships,
            AI-powered career guidance, resume building,
            interview preparation and much more.

          </p>

          <button
            onClick={()=> router.push("/signup")}
            className="
              mt-10
              bg-white
              text-[#0880EF]
              px-8
              py-4
              rounded-xl
              font-semibold
              inline-flex
              items-center
              gap-3
              hover:bg-gray-100
              transition
            "
          >

            Get Started

            <ArrowRight size={20} />

          </button>

        </motion.div>

      </div>

    </section>
  );
}