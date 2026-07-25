"use client";

import Hero from "../../Components/home/Hero";
import AboutPreview from "../../Components/home/AboutPreview";
import Features from "../../Components/home/Features";
import Categories from "../../Components/home/Categories";
import PartnerCTA from "../../Components/home/PartnerCTA";
import FinalCTA from "../../Components/home/FinalCTA";
import Footer from "../../Components/home/Footer";
import PartnersMarquee from "../../Components/home/PartnersMarquee";



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