import { VaultOverviewCards } from "@/components/VaultOverviewCards";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";
import { FAQSection } from "./FAQSection";

export const MarketingView = () => {
  return (
    <>
      {/* Vault Overview Cards */}
      <div className="max-w-5xl mx-auto animate-fade-in">
        <VaultOverviewCards />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Main Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  );
};
