"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Bot,
  FileText,
  GraduationCap,
  ArrowRight,
  Building2,
} from "lucide-react";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Internships",
    description:
      "Discover internship opportunities from verified companies across multiple domains.",
  },
  {
    icon: Bot,
    title: "AI Career Assistant",
    description:
      "Get AI-powered guidance for career planning, interview preparation and skill improvement.",
  },
  {
    icon: FileText,
    title: "Resume Analysis",
    description:
      "Build ATS-friendly resumes and receive suggestions to improve your profile.",
  },
  
  {
    icon: Building2,
    title: "Recruiter Portal",
    description:
      "Companies can post internships, manage applications and hire talented students.",
  },
  
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="text-center">

          <span className="text-[#0880EF] font-semibold uppercase tracking-widest">
            Our Services
          </span>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
            Everything You Need in One Place
          </h2>

          <p className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg leading-8">
            StepUp Intern provides students and recruiters with
            everything required to discover opportunities,
            prepare for interviews and grow professionally.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-gray-200
                  shadow-sm
                  hover:shadow-xl
                  transition
                  p-8
                "
              >

                <div className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  mb-6
                ">

                  <Icon
                    size={30}
                    className="text-[#0880EF]"
                  />

                </div>

                <h3 className="text-2xl font-semibold text-gray-900">

                  {feature.title}

                </h3>

                <p className="text-gray-600 leading-7 mt-4">

                  {feature.description}

                </p>

                <button
                  className="
                    mt-8
                    text-[#0880EF]
                    font-semibold
                    flex
                    items-center
                    gap-2
                    hover:gap-3
                    transition-all
                  "
                >

                  Learn More

                  <ArrowRight size={18} />

                </button>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}