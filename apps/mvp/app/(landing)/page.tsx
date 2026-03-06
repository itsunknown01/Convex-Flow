import {
  CinematicHero,
  ProblemNarrative,
  SolutionUnfold,
  ExplainabilitySection,
  PolicyHITLSection,
  CinematicCTA,
  SectionTransition,
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
    <main
      className="landing-noise"
      style={{
        backgroundColor: "var(--landing-bg)",
        color: "var(--landing-text-primary)",
      }}
    >
      <div className="landing-grid-bg">
        {/* 1. Hero - Full viewport cinematic opening */}
        <CinematicHero />

        {/* 2. Problem - Chaos visualization */}
        <SectionTransition variant="glow" />
        <ProblemNarrative />

        {/* 3. Solution - Capabilities unfold */}
        <SectionTransition variant="fade" />
        <SolutionUnfold />

        {/* 4. Explainability - Glass layers */}
        <SectionTransition variant="glow" />
        <ExplainabilitySection />

        {/* 5. Policy & HITL + Trust */}
        <SectionTransition variant="fade" />
        <PolicyHITLSection />

        <SectionTransition variant="space" />

        {/* 6. CTA - Final conversion */}
        <CinematicCTA />
      </div>
    </main>
  );
}
