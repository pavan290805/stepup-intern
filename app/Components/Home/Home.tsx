"use client";

import Hero from "./Hero";
import AboutPreview from "./AboutPreview";
import Features from "./Features";
import Categories from "./Categories";
import PartnerCTA from "./PartnerCTA";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import PartnersMarquee from "./PartnersMarquee";

type HomeProps = {
  onGetStarted: () => void;
};

export default function Home({ onGetStarted }: HomeProps) {
  return (
    <>
      <Hero />
      <PartnersMarquee />
      <AboutPreview />
      <Features />
      <Categories />
      <PartnerCTA />
      <FinalCTA onGetStarted={onGetStarted} />
      <Footer />
    </>
  );
}