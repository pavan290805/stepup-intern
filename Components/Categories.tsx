"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  "Artificial Intelligence",
  "Web Development",
  "Data Science",
  "Java",
  "Python",
  "UI / UX",
  "Cloud Computing",
  "Cyber Security",
  "Digital Marketing",
  "Finance",
  "Human Resources",
  "Machine Learning",
];

export default function Categories() {
  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="text-center">

          <span className="text-[#0880EF] font-semibold uppercase tracking-widest">
            Internship Domains
          </span>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
            Explore Popular Categories
          </h2>

          <p className="text-gray-600 mt-6 text-lg max-w-3xl mx-auto leading-8">
            Discover internship opportunities across different
            industries and technologies. Find the domain that
            matches your interests and career goals.
          </p>

        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: .6 }}
          viewport={{ once: true }}
          className="
            flex
            flex-wrap
            justify-center
            gap-5
            mt-16
          "
        >

          {categories.map((category, index) => (

            <motion.div
              key={index}
              whileHover={{
                scale: 1.05,
                y: -5
              }}
              whileTap={{
                scale: .96
              }}
            >

              <Link href="/internships">

                <div
                  className="
                    px-7
                    py-4
                    rounded-full
                    border
                    border-gray-300
                    text-gray-700
                    font-semibold
                    hover:bg-[#0880EF]
                    hover:text-white
                    hover:border-[#0880EF]
                    transition
                    cursor-pointer
                    shadow-sm
                    hover:shadow-lg
                  "
                >

                  {category}

                </div>

              </Link>

            </motion.div>

          ))}

        </motion.div>

      </div>

    </section>
  );
}