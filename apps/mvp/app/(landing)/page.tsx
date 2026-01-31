import {
  CinematicHero,
  ProblemNarrative,
  SolutionUnfold,
  ExplainabilitySection,
  PolicyHITLSection,
  CinematicCTA,
  FooterSection,
} from "@/components/landing";

/**
 * Cinematic Landing Page
 *
 * A scroll-driven, immersive experience showcasing Convex Flow's
 * AI orchestration capabilities through layered parallax and
 * narrative storytelling.
 */
export default function LandingPage() {
  return (
    <main className="bg-slate-950 text-white">
      {/* 1. Hero - Full viewport cinematic opening */}
      <CinematicHero />

      {/* 2. Problem - Chaos visualization with depth */}
      <ProblemNarrative />

      {/* 3. Solution - Capabilities unfold on scroll */}
      <SolutionUnfold />

      {/* 4. Explainability - Glass layers with progressive reveals */}
      <ExplainabilitySection />

      {/* 5. Policy & HITL - Human-AI collaboration depth */}
      <PolicyHITLSection />

      {/* 6. CTA - Convergence and conversion */}
      <CinematicCTA />

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
