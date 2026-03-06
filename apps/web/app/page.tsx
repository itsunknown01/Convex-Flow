import dynamic from "next/dynamic";
import Hero from "@/components/landing/Hero";
import SectionTransition from "@/components/landing/SectionTransition";

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE — Cinematic scroll-driven experience
   Hero is loaded eagerly for LCP. Below-fold sections are
   dynamically imported for bundle splitting.
   ═══════════════════════════════════════════════════════════════ */

// Dynamic imports for below-fold sections (code-split)
const ProblemSection = dynamic(
  () => import("@/components/landing/ProblemSection"),
  { ssr: true },
);
const SolutionSection = dynamic(
  () => import("@/components/landing/SolutionSection"),
  { ssr: true },
);
const HowItWorksSection = dynamic(
  () => import("@/components/landing/HowItWorksSection"),
  { ssr: true },
);
const ExplainabilitySection = dynamic(
  () => import("@/components/landing/ExplainabilitySection"),
  { ssr: true },
);
const TrustSection = dynamic(
  () => import("@/components/landing/TrustSection"),
  { ssr: true },
);
const CTASection = dynamic(() => import("@/components/landing/CTASection"), {
  ssr: true,
});

export default function Page() {
  return (
    <>
      {/* ── Hero (eager, LCP-critical) ──────────────────────── */}
      <Hero />

      {/* ── Story Sections ──────────────────────────────────── */}
      <SectionTransition variant="glow" />
      <ProblemSection />

      <SectionTransition variant="fade" />
      <SolutionSection />

      <SectionTransition variant="glow" />
      <HowItWorksSection />

      <SectionTransition variant="fade" />
      <ExplainabilitySection />

      <SectionTransition variant="glow" />
      <TrustSection />

      <SectionTransition variant="space" />

      {/* ── Final CTA ───────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
