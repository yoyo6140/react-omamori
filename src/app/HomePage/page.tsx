import React from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/home/Hero";
import WishesSection from "../../components/home/WishesSection";
import MapSection from "../../components/home/MapSection";
import Footer from "../../components/Footer";
import Sakura from "../../components/effects/Sakura";
export default function HomePage() {
  return (
    <div className="bg-[var(--off-white)]">
      <Sakura />
      <Navbar />
      <main className="flex flex-col w-full">
        <Hero />
        <WishesSection />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};
