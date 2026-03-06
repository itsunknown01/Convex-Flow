"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/gsap-provider";
import ScrollReveal from "./ScrollReveal";

/* ═══════════════════════════════════════════════════════════════
   TRUST — Enterprise trust signals, metrics, security
   ═══════════════════════════════════════════════════════════════ */

const METRICS = [
  { value: "99.99%", label: "Uptime SLA", suffix: "" },
  { value: "100%", label: "Audit Coverage", suffix: "" },
  { value: "<50ms", label: "Decision Latency", suffix: "" },
  { value: "SOC 2", label: "Compliance Ready", suffix: "" },
] as const;

const TRUST_FEATURES = [
  {
    title: "Zero-Trust Architecture",
    description:
      "Every request authenticated. Every action authorized. No implicit trust.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="9"
          width="14"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6 9V6a4 4 0 018 0v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Immutable Audit Logs",
    description:
      "Tamper-proof records for every workflow execution, decision, and approval.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 4h12v14H4V4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 8h6M7 11h6M7 14h4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    title: "Role-Based Access",
    description:
      "Granular permissions ensure only authorized users can approve or modify workflows.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3 17v-1a5 5 0 0110 0v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 9l2 2 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export default function TrustSection() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

  // Counter animation for metrics
  useEffect(() => {
    if (!isReady || prefersReducedMotion || !metricsRef.current) return;

    const ctx = gsap.context(() => {
      const counters = metricsRef.current!.querySelectorAll(".metric-value");

      gsap.fromTo(
        counters,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: metricsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }, metricsRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      id="trust"
      className="landing-section relative"
      aria-labelledby="trust-heading"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--landing-accent-cyan)] opacity-[0.02] blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="landing-label">Enterprise Trust</span>
          <h2
            id="trust-heading"
            className="landing-headline mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl"
          >
            Built for
            <br />
            <span className="bg-gradient-to-r from-[var(--landing-accent-cyan)] to-[var(--landing-accent-blue)] bg-clip-text text-transparent">
              Enterprise Scale
            </span>
          </h2>
          <p className="landing-subheadline mt-4">
            Security, compliance, and reliability are not afterthoughts.
            They&apos;re foundational to every layer of Convex-Flow.
          </p>
        </ScrollReveal>

        {/* Metrics */}
        <div
          ref={metricsRef}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {METRICS.map((metric, i) => (
            <div
              key={i}
              className="metric-value rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <span className="text-2xl font-bold text-white md:text-3xl">
                {metric.value}
              </span>
              <p className="mt-1 text-xs text-[var(--landing-text-muted)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Features */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TRUST_FEATURES.map((feature, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04]">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[var(--landing-accent-cyan)]">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--landing-text-muted)]">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
