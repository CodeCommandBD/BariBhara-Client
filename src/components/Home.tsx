import { useEffect } from "react";
import HeroSection from "./home/HeroSection";
import TrustBar from "./home/TrustBar";
import MarketplaceSection from "./home/MarketplaceSection";
import SaaSSection from "./home/SaaSSection";
import HowItWorksSection from "./home/HowItWorksSection";
import PricingSection from "./home/PricingSection";

const Home = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []);

  return (
    <div className="w-full">
      <HeroSection />
      <TrustBar />
      <MarketplaceSection />
      <SaaSSection />
      <HowItWorksSection />
      <PricingSection />
    </div>
  );
};

export default Home;
