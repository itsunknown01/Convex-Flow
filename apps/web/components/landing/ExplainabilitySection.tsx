"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/gsap-provider";
import ScrollReveal from "./ScrollReveal";

/* ═══════════════════════════════════════════════════════════════
   EXPLAINABILITY — AI reasoning layers & policy gates
   Stacked transparent cards showing decision path
   ═══════════════════════════════════════════════════════════════ */

const REASONING_LAYERS = [
  {
    label: "Input Signal",
    description: "Raw data and context ingested by the agent",
    color: "#3b82f6",
    opacity: 0.9,
  },
  {
    label: "Policy Check",
    description: "Constraints and guardrails evaluated",
    color: "#8b5cf6",
    opacity: 0.75,
  },
  {
    label: "Reasoning",
    description: "Chain-of-thought decision logic traced",
    color: "#06b6d4",
    opacity: 0.6,
  },
  {
    label: "Action Output",
    description: "Final decision with confidence score",
    color: "#22c55e",
    opacity: 0.45,
  },
] as const;

export default function ExplainabilitySection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

  useEffect(() => {
    if (!isReady || prefersReducedMotion || !stackRef.current) return;

    const ctx = gsap.context(() => {
      const cards = stackRef.current!.querySelectorAll(".reasoning-card");

      // Stagger-reveal each reasoning layer on scroll
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
          rotateX: -5,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top 75%",
            end: "center center",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, stackRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      className="landing-section relative"
      aria-labelledby="explainability-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Stacked Reasoning Layers Visual */}
          <div
            ref={stackRef}
            className="relative flex flex-col gap-3"
            style={{ perspective: "1000px" }}
          >
            {REASONING_LAYERS.map((layer, i) => (
              <div
                key={i}
                className="reasoning-card rounded-lg border bg-white/[0.02] p-4 transition-colors duration-300 hover:bg-white/[0.04]"
                style={{
                  borderColor: `${layer.color}20`,
                  opacity: prefersReducedMotion ? 1 : 0,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Step indicator */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                    style={{
                      backgroundColor: `${layer.color}15`,
                      color: layer.color,
                      border: `1px solid ${layer.color}30`,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {layer.label}
                    </span>
                    <p className="text-xs text-[var(--landing-text-muted)]">
                      {layer.description}
                    </p>
                  </div>
                  {/* Status indicator */}
                  <div className="ml-auto">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: layer.color,
                        opacity: layer.opacity,
                      }}
                    />
                  </div>
                </div>
                {/* Connection line to next layer */}
                {i < REASONING_LAYERS.length - 1 && (
                  <div
                    className="ml-4 mt-2 h-3 w-px"
                    style={{ backgroundColor: `${layer.color}20` }}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}

            {/* Flow arrow at bottom */}
            <div
              className="flex items-center justify-center pt-2"
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4v12m0 0l-4-4m4 4l4-4"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
              </svg>
              <span className="ml-2 text-xs font-medium text-green-400/60">
                Fully traceable
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <ScrollReveal direction="right">
              <span className="landing-label">Explainability</span>
              <h2
                id="explainability-heading"
                className="landing-headline mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl"
              >
                See Every Layer of
                <br />
                <span className="bg-gradient-to-r from-[var(--landing-accent-blue)] to-[var(--landing-accent-purple)] bg-clip-text text-transparent">
                  AI Reasoning
                </span>
              </h2>
              <p className="landing-subheadline mt-4 max-w-lg">
                No black boxes. Convex-Flow surfaces every step of the decision
                process — from input signals through policy checks to final
                output. Auditors and stakeholders can verify exactly how
                decisions are made.
              </p>

              {/* Feature bullets */}
              <ul className="mt-8 space-y-3">
                {[
                  "Complete chain-of-thought traces for every decision",
                  "Policy compliance status at each checkpoint",
                  "Confidence scores and risk assessments",
                  "Exportable audit reports for regulatory review",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--landing-text-secondary)]"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 8l3 3 5-5"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
