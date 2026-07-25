"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  partnersSection,
  partnersContainer,
  partnersTitle,
  partnersSubtitle,
  marqueeWrapper,
  marqueeRow,
  partnerCard,
  partnerLogo,
} from "./constants/home";

const partners = [
  "/Partners/logo1.png",
  "/Partners/logo2.png",
  "/Partners/logo3.png",
  "/Partners/logo4.png",
  "/Partners/logo5.png",
  "/Partners/logo6.png",
  "/Partners/logo7.png",
  "/Partners/logo8.png",
  "/Partners/logo9.png",
  "/Partners/logo10.png",
  "/Partners/logo11.png",
  "/Partners/logo12.png",
];

const firstRow = partners.slice(0, 6);
const secondRow = partners.slice(6);

export default function PartnersMarquee() {
  return (
    <section className={partnersSection}>
      <div className={partnersContainer}>

        <h2 className={partnersTitle}>
          Trusted by Leading Hiring Recruiters
        </h2>

        <p className={partnersSubtitle}>
          Companies empowering students with real internship opportunities.
        </p>

        {/* First Row */}

        <div className={marqueeWrapper}>

          <motion.div
            className={marqueeRow}
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...firstRow, ...firstRow].map((logo, index) => (
              <div className={partnerCard} key={index}>
                <Image
                  src={logo}
                  alt={`Recruiter ${index + 1}`}
                  width={150}
                  height={70}
                  className={partnerLogo}
                />
              </div>
            ))}
          </motion.div>

        </div>

        {/* Second Row */}

        <div className={`${marqueeWrapper} mt-8`}>

          <motion.div
            className={marqueeRow}
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...secondRow, ...secondRow].map((logo, index) => (
              <div className={partnerCard} key={index}>
                <Image
                  src={logo}
                  alt={`Recruiter ${index + 7}`}
                  width={150}
                  height={70}
                  className={partnerLogo}
                />
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}