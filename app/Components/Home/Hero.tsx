"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Building2 ,BriefcaseBusiness,
  Bot} from "lucide-react";

import {
  heroContainer,
  heroWrapper,
  heroLeft,
  heroRight,
  heroBadge,
  heroTitle,
  heroHighlight,
  heroSubtitle,
  buttonGroup,
  primaryButton,
  secondaryButton,
  videoContainer,
  videoStyle,
  floatingCard,
  floatingIcon,
  floatingTitle,
  floatingSubtitle,
} from "../../constants/home";

export default function Hero() {
  return (
    <section className={heroContainer}>
      <div className={heroWrapper}>

        {/* Left Content */}

        <motion.div
          className={heroLeft}
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <span className={heroBadge}>
            🚀 Empowering Students with Real Opportunities
          </span>

          <h1 className={heroTitle}>
            Launch Your Career
            <br />

            with{" "}

            <span className={heroHighlight}>
              StepUp Intern
            </span>

          </h1>

          <p className={heroSubtitle}>
            Connect with internships, recruiters and AI-powered
            career tools that help you gain practical experience,
            build your skills and confidently step into the
            professional world.
          </p>

          <div className={buttonGroup}>

            <button className={primaryButton}>
              Explore Internships
            </button>

            <button className={secondaryButton}>
              Become a Partner
            </button>

          </div>
         {/* Hero Stats */}




        </motion.div>

        {/* Right Content */}
        

        <motion.div
  className={`${heroRight} relative flex items-center justify-center`}
  initial={{ x: 80, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
  
  

  {/* Laptop */}
 

 <div className="relative z-10 translate-x-6 translate-y-6">
  <Image
    src="/Laptop.png"
    alt="StepUp Dashboard"
    width={700}
    height={520}
    className="w-full max-w-[650px] object-contain"
    priority
  />
</div>
 

  {/* Floating Card 1 */}

  <motion.div
    className={`${floatingCard} absolute top-8 left-0 z-20`}
   animate={{ y: [0, -20, 0] }}

transition={{
  duration: 2.5,
  repeat: Infinity,
  ease: "easeInOut",
}}
  >
    <div className={floatingIcon}>
    <BriefcaseBusiness className="w-6 h-6 text-[#0880EF]" />
</div>

    <div>
      <h4 className={floatingTitle}>
        Verified Internships
      </h4>

      <p className={floatingSubtitle}>
        Apply to trusted companies
      </p>
    </div>
  </motion.div>

  {/* Floating Card 2 */}

  <motion.div
    className={`${floatingCard} absolute bottom-0 right-0 z-20`}
    animate={{ y: [0, 20, 0] }}

transition={{
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut",
}}
  >
    <div className={floatingIcon}>
    <Bot className="w-6 h-6 text-[#0880EF]" />
</div>

    <div>
      <h4 className={floatingTitle}>
        AI Career Assistant
      </h4>

      <p className={floatingSubtitle}>
        Smart career guidance
      </p>
    </div>
  </motion.div>

</motion.div>
<div className="absolute top-32 right-45 z-30 flex gap-5">

  {/* Students */}
  <div
    className="
      w-70
      h-20
      bg-white
      rounded-2xl
      shadow-xl
      border border-gray-100
      px-5
      flex
      items-center
      gap-4
    "
  >
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
      <Users className="w-6 h-6 text-[#0880EF]" />
    </div>

    <div>
      <h3 className="text-3xl font-bold text-[#0880EF]">
        100+
      </h3>

      <p className="text-gray-600 text-sm">
        Students Got Internships
      </p>
    </div>
  </div>

  {/* Partners */}
  <div
    className="
      w-65
      h-20
      bg-white
      rounded-2xl
      shadow-xl
      border border-gray-100
      px-5
      flex
      items-center
      gap-4
    "
  >
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
      <Building2 className="w-6 h-6 text-[#0880EF]" />
    </div>

    <div>
      <h3 className="text-3xl font-bold text-[#0880EF]">
        10+
      </h3>

      <p className="text-gray-600 text-sm">
        Hiring Partners
      </p>
    </div>
  </div>

</div>

      </div>
    </section>
  );
}