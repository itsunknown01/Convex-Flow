"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/gsap-provider";
import ScrollReveal from "./ScrollReveal";

/* ═══════════════════════════════════════════════════════════════
   "THE PROBLEM" — Visualize chaos of uncontrolled AI automation
   Scroll transforms tangled chaos → signal of need for control
   ═══════════════════════════════════════════════════════════════ */

const PAIN_POINTS = [
  {
    stat: "73%",
    label: "of enterprise AI projects fail due to lack of governance",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 6v4m0 4h.01M18 10a8 8 0 11-16 0 8 8 0 0116 0z"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    stat: "89%",
    label: "of teams can't explain how their AI agents reach decisions",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 10h.01M12 10h.01M5.5 14.5c1.5 1.5 5 2.5 9-1"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="8" stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    stat: "$4.2M",
    label: "average cost of AI compliance failures per incident",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 2v16m4-12H8a2 2 0 000 4h4a2 2 0 010 4H6"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chaosRef = useRef<SVGSVGElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

  useEffect(() => {
    if (
      !isReady ||
      prefersReducedMotion ||
      !chaosRef.current ||
      !sectionRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const lines = chaosRef.current!.querySelectorAll(".chaos-line");

      // Animate chaos lines opacity and movement
      gsap.fromTo(
        lines,
        { strokeDashoffset: 300, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.4,
          stagger: 0.05,
          duration: 1.5,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="landing-section relative"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Chaos Visualization */}
          <div className="relative flex items-center justify-center">
            <svg
              ref={chaosRef}
              viewBox="0 0 500 400"
              fill="none"
              className="h-auto w-full max-w-md"
              aria-hidden="true"
            >
              {/* Tangled/chaotic lines representing uncontrolled automation */}
              {[
                "M50,200 C100,50 200,350 300,100 S450,300 480,200",
                "M30,150 C120,300 180,50 280,250 S400,80 470,180",
                "M60,300 C150,100 220,350 320,80 S420,320 490,150",
                "M40,250 C130,80 190,300 290,120 S410,280 460,200",
                "M70,100 C160,280 230,60 330,280 S430,100 480,250",
                "M20,350 C110,150 200,280 300,60 S440,250 490,120",
                "M80,180 C140,350 260,100 350,300 S400,120 470,280",
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  className="chaos-line"
                  stroke={
                    i % 3 === 0
                      ? "#ef4444"
                      : i % 3 === 1
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                  strokeWidth="1"
                  strokeDasharray="300"
                  strokeDashoffset="300"
                  opacity="0"
                  fill="none"
                />
              ))}

              {/* Warning nodes */}
              <circle
                cx="250"
                cy="200"
                r="30"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.8"
                opacity="0.2"
                strokeDasharray="4 4"
              />
              <circle
                cx="250"
                cy="200"
                r="60"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.5"
                opacity="0.15"
                strokeDasharray="6 6"
              />
              <text
                x="250"
                y="206"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="18"
                fontWeight="600"
                opacity="0.5"
              >
                ?
              </text>
            </svg>

            {/* Glow behind chaos */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-full bg-red-500/[0.08] blur-[60px]" />
            </div>
          </div>

          {/* Content */}
          <div>
            <ScrollReveal direction="right" delay={0.1}>
              <span className="landing-label">The Problem</span>
              <h2
                id="problem-heading"
                className="landing-headline mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl"
              >
                AI Without Guardrails
                <br />
                <span className="text-red-400/80">Is a Liability</span>
              </h2>
              <p className="landing-subheadline mt-4 max-w-lg">
                Most AI agent platforms let automation run unchecked — opaque
                decisions, no audit trails, and zero human oversight. The
                result? Risk, compliance failures, and broken trust.
              </p>
            </ScrollReveal>

            {/* Pain Point Stats */}
            <div className="mt-8 space-y-4">
              {PAIN_POINTS.map((point, i) => (
                <ScrollReveal key={i} direction="right" delay={0.15 + i * 0.1}>
                  <div className="flex items-start gap-4 rounded-lg border border-white/[0.04] bg-white/[0.02] px-5 py-4">
                    <div className="mt-0.5 shrink-0">{point.icon}</div>
                    <div>
                      <span className="text-lg font-bold text-white">
                        {point.stat}
                      </span>
                      <p className="mt-0.5 text-sm text-[var(--landing-text-secondary)]">
                        {point.label}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
