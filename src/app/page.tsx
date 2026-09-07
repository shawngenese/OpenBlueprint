import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HeroSheet } from "@/components/landing/hero-sheet";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SectionsShowcase } from "@/components/landing/sections-showcase";
import { FeatureBreakdown } from "@/components/landing/feature-breakdown";
import { Comparison } from "@/components/landing/comparison";
import { StackStrip } from "@/components/landing/stack-strip";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Project Consultant",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Turn rough app ideas into structured, editable 20-section technical blueprints. Clarifier ≤5 questions, Zod-validated generation via gpt-4o-mini, per-section regeneration, filtered Executive/Technical/Complete views, and PDF export.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Nav />

      {/* Main: 12-col grid shell — Phase 7/8 sections hydrate here */}
      <main id="main" className="mx-auto max-w-6xl px-6 scroll-pt-14">
        <section className="grid grid-cols-12 gap-6 py-10 sm:py-14 lg:py-16">
          <Hero />
          <HeroSheet />
        </section>

        <HowItWorks />
        <SectionsShowcase />
        <FeatureBreakdown />
        <Comparison />
        <StackStrip />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
