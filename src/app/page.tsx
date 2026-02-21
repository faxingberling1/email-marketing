import { LandingHeader } from "@/components/LandingHeader"
import { LandingHero } from "@/components/LandingHero"
import { FeatureGrid } from "@/components/FeatureGrid"
import { HowItWorks } from "@/components/HowItWorks"
import { PricingTable } from "@/components/PricingTable"
import { Testimonials } from "@/components/Testimonials"
import { CTASection, LandingFooter, TrustSection } from "@/components/LandingBlocks"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <LandingHeader />
      <main>
        <LandingHero />
        <FeatureGrid />
        <HowItWorks />
        <Testimonials />
        <PricingTable />
        <TrustSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
