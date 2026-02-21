import { LandingHeader } from "@/components/LandingHeader"
import { LandingHero, LandingCmsData } from "@/components/LandingHero"
import { FeatureGrid } from "@/components/FeatureGrid"
import { HowItWorks } from "@/components/HowItWorks"
import { PricingSection } from "@/components/PricingSection"
import { Testimonials } from "@/components/Testimonials"
import { CTASection, LandingFooter, TrustSection } from "@/components/LandingBlocks"
import { prisma } from "@/lib/db"

export default async function LandingPage() {
  let headerData = undefined;
  let heroData: LandingCmsData | undefined = undefined;
  let featuresData = undefined;
  let howItWorksData = undefined;
  let testimonialsData = undefined;
  let pricingData = undefined;
  let trustCtaData = undefined;
  let footerData = undefined;

  try {
    const settings = await prisma.$queryRaw<any[]>`
      SELECT key, value FROM "SystemSetting" WHERE key LIKE 'cms_landing_%'
    `
    for (const setting of settings) {
      if (!setting.value) continue;
      try {
        const parsed = JSON.parse(setting.value);
        if (setting.key === 'cms_landing_header') headerData = parsed;
        if (setting.key === 'cms_landing_hero') heroData = parsed;
        if (setting.key === 'cms_landing_features') featuresData = parsed;
        if (setting.key === 'cms_landing_how_it_works') howItWorksData = parsed;
        if (setting.key === 'cms_landing_testimonials') testimonialsData = parsed;
        if (setting.key === 'cms_landing_pricing') pricingData = parsed;
        if (setting.key === 'cms_landing_trust_cta') trustCtaData = parsed;
        if (setting.key === 'cms_landing_footer') footerData = parsed;
      } catch (e) {
        console.error(`Error parsing CMS setting for key ${setting.key}:`, e);
      }
    }
  } catch (error) {
    console.error("Failed to load landing CMS data:", error)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <LandingHeader content={headerData} />
      <main>
        <LandingHero content={heroData} />
        <FeatureGrid content={featuresData} />
        <HowItWorks content={howItWorksData} />
        <Testimonials content={testimonialsData} />
        <PricingSection content={pricingData} />
        <TrustSection content={trustCtaData} />
        <CTASection content={trustCtaData} />
      </main>
      <LandingFooter content={footerData} />
    </div>
  )
}
