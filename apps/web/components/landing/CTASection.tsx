"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/gsap-provider";

/* ═══════════════════════════════════════════════════════════════
   CTA SECTION — Final call to action with cinematic reveal
   ═══════════════════════════════════════════════════════════════ */

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

  useEffect(() => {
    if (
      !isReady ||
      prefersReducedMotion ||
      !cardRef.current ||
      !sectionRef.current
    )
      return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="landing-section relative"
      aria-labelledby="cta-heading"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-[400px] w-[600px] rounded-full bg-[var(--landing-accent-blue)] opacity-[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6">
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center sm:p-14 md:p-20"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          {/* Gradient border glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.1), transparent, rgba(139,92,246,0.08))",
            }}
            aria-hidden="true"
          />

          {/* Inner grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 landing-grid-bg opacity-50"
            aria-hidden="true"
          />

          <div className="relative">
            <span className="landing-label">Ready to Start?</span>
            <h2
              id="cta-heading"
              className="landing-headline mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl"
            >
              Ship AI Workflows
              <br />
              <span className="bg-gradient-to-r from-[var(--landing-accent-blue)] via-[var(--landing-accent-purple)] to-[var(--landing-accent-cyan)] bg-clip-text text-transparent">
                With Confidence
              </span>
            </h2>
            <p className="landing-subheadline mx-auto mt-4 max-w-lg">
              Join forward-thinking enterprises building safe, explainable AI
              automation with Convex-Flow.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#"
                className="cta-glow inline-flex items-center gap-2 rounded-lg bg-[var(--landing-accent-blue)] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 cursor-pointer"
              >
                Start Free Trial
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/[0.06] cursor-pointer"
              >
                Book a Demo
              </a>
            </div>

            <p className="mt-6 text-xs text-[var(--landing-text-muted)]">
              No credit card required · 14-day free trial · SOC 2 compliant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
