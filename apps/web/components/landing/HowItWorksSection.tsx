"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/gsap-provider";
import ScrollReveal from "./ScrollReveal";

/* ═══════════════════════════════════════════════════════════════
   "HOW IT WORKS" — 3-step workflow with scroll-linked progression
   ═══════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    number: "01",
    title: "Define",
    subtitle: "Set Policy & Constraints",
    description:
      "Define guardrails, approval thresholds, and escalation policies as code. Specify what your AI agents can and cannot do before they execute.",
    visual: (
      <svg
        viewBox="0 0 280 180"
        fill="none"
        className="h-auto w-full"
        aria-hidden="true"
      >
        {/* Shield / Policy Gate */}
        <path
          d="M140 30l60 30v40c0 35-24 65-60 75-36-10-60-40-60-75V60l60-30z"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M140 50l40 20v28c0 24-16 44-40 52-24-8-40-28-40-52V70l40-20z"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          opacity="0.3"
        />
        {/* Rule lines */}
        <line
          x1="120"
          y1="82"
          x2="160"
          y2="82"
          stroke="#3b82f6"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="125"
          y1="92"
          x2="155"
          y2="92"
          stroke="#3b82f6"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="128"
          y1="102"
          x2="152"
          y2="102"
          stroke="#3b82f6"
          strokeWidth="1"
          opacity="0.3"
        />
        {/* Checkmark */}
        <path
          d="M132 95l5 5 11-11"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Execute",
    subtitle: "AI Agents Run Within Guardrails",
    description:
      "Deploy intelligent agents that operate within your defined boundaries. Every action is traced, every decision is logged with full reasoning context.",
    visual: (
      <svg
        viewBox="0 0 280 180"
        fill="none"
        className="h-auto w-full"
        aria-hidden="true"
      >
        {/* Flow nodes */}
        <circle
          cx="60"
          cy="90"
          r="12"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle
          cx="140"
          cy="60"
          r="12"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle
          cx="140"
          cy="120"
          r="12"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle
          cx="220"
          cy="90"
          r="12"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Flow arrows */}
        <path d="M72 85l56-20" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <path d="M72 95l56 20" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <path
          d="M152 65l56 20"
          stroke="#8b5cf6"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M152 115l56-20"
          stroke="#8b5cf6"
          strokeWidth="1"
          opacity="0.4"
        />
        {/* Center dots indicating processing */}
        <circle cx="60" cy="90" r="4" fill="#8b5cf6" opacity="0.5" />
        <circle cx="140" cy="60" r="4" fill="#8b5cf6" opacity="0.5" />
        <circle cx="140" cy="120" r="4" fill="#8b5cf6" opacity="0.5" />
        <circle cx="220" cy="90" r="4" fill="#8b5cf6" opacity="0.5" />
        {/* Guardrail boundary */}
        <rect
          x="30"
          y="30"
          width="220"
          height="120"
          rx="12"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="0.8"
          strokeDasharray="6 4"
          opacity="0.2"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Govern",
    subtitle: "Human Oversight & Audit",
    description:
      "Review agent outputs at critical checkpoints. Approve, reject, or modify decisions. Every action creates an immutable audit trail for compliance.",
    visual: (
      <svg
        viewBox="0 0 280 180"
        fill="none"
        className="h-auto w-full"
        aria-hidden="true"
      >
        {/* Human icon */}
        <circle
          cx="140"
          cy="55"
          r="16"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle
          cx="140"
          cy="55"
          r="8"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1"
          opacity="0.3"
        />
        {/* Approval actions */}
        <rect
          x="70"
          y="100"
          width="50"
          height="28"
          rx="6"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <text
          x="95"
          y="118"
          textAnchor="middle"
          fill="#22c55e"
          fontSize="10"
          fontWeight="500"
          opacity="0.7"
        >
          Approve
        </text>
        <rect
          x="160"
          y="100"
          width="50"
          height="28"
          rx="6"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <text
          x="185"
          y="118"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="10"
          fontWeight="500"
          opacity="0.7"
        >
          Reject
        </text>
        {/* Connection lines */}
        <path
          d="M132 70L95 100"
          stroke="#06b6d4"
          strokeWidth="0.8"
          opacity="0.3"
        />
        <path
          d="M148 70L185 100"
          stroke="#06b6d4"
          strokeWidth="0.8"
          opacity="0.3"
        />
        {/* Audit trail */}
        <path d="M140 140v20" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
        <rect
          x="110"
          y="150"
          width="60"
          height="16"
          rx="3"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="0.8"
          opacity="0.3"
        />
        <text
          x="140"
          y="162"
          textAnchor="middle"
          fill="#06b6d4"
          fontSize="8"
          fontWeight="400"
          opacity="0.5"
        >
          Audit Log
        </text>
      </svg>
    ),
  },
] as const;

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

  useEffect(() => {
    if (
      !isReady ||
      prefersReducedMotion ||
      !progressRef.current ||
      !sectionRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // Animate the connecting progress line
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="landing-section relative"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="landing-label">How It Works</span>
          <h2
            id="how-heading"
            className="landing-headline mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl"
          >
            Three Steps to
            <br />
            <span className="bg-gradient-to-r from-[var(--landing-accent-blue)] to-[var(--landing-accent-cyan)] bg-clip-text text-transparent">
              Controlled Automation
            </span>
          </h2>
        </ScrollReveal>

        {/* Steps with connecting line */}
        <div className="relative mt-20">
          {/* Progress line (desktop only) */}
          <div
            className="absolute left-8 top-0 bottom-0 hidden w-px bg-white/[0.06] lg:block"
            aria-hidden="true"
          >
            <div
              ref={progressRef}
              className="glow-line-vertical h-full origin-top"
              style={{ transformOrigin: "top" }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 lg:space-y-24">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} direction="up" delay={0.1} threshold={0.2}>
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 lg:pl-20">
                  {/* Content */}
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    {/* Step indicator */}
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] font-mono text-sm font-bold text-[var(--landing-accent-blue)]">
                        {step.number}
                      </span>
                      <div>
                        <span className="text-xl font-bold text-white">
                          {step.title}
                        </span>
                        <span className="ml-2 text-sm text-[var(--landing-text-muted)]">
                          — {step.subtitle}
                        </span>
                      </div>
                    </div>
                    <p className="landing-subheadline max-w-md">
                      {step.description}
                    </p>
                  </div>

                  {/* Visual */}
                  <div
                    className={`flex items-center justify-center rounded-xl border border-white/[0.04] bg-white/[0.01] p-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    {step.visual}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
