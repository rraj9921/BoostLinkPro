"use client";
import Navbar from "./Navbar";
import Hero from "./sections/Hero";
import LogoBar from "./sections/LogoBar";
import Features from "./sections/Features";
import HowItWorks from "./sections/HowItWorks";
import Testimonials from "./sections/Testimonials";
import Pricing from "./sections/Pricing";
import CtaBanner from "./sections/CtaBanner";
import Footer from "./sections/Footer";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <Hero />
      <LogoBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </div>
  );
}
