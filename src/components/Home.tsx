import HeroSection from "./home/HeroSection";
import TrustBar from "./home/TrustBar";
import MarketplaceSection from "./home/MarketplaceSection";
import SaaSSection from "./home/SaaSSection";
import HowItWorksSection from "./home/HowItWorksSection";
import PricingSection from "./home/PricingSection";

const Home = () => {
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
