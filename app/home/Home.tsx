"use client";

import Hero from "../../Components/Hero";
import AboutPreview from "../../Components/AboutPreview";
import Features from "../../Components/Features";
import Categories from "../../Components/Categories";
import PartnerCTA from "../../Components/PartnerCTA";
import FinalCTA from "../../Components/FinalCTA";
import Footer from "../../Components/Footer";
import PartnersMarquee from "../../Components/PartnersMarquee";



export default function Home() {
  return (
    <>
      <Hero />
      <PartnersMarquee />
      <AboutPreview />
      <Features />
      <Categories />
      <PartnerCTA />
      <FinalCTA />
      <Footer />
    </>
  );
}