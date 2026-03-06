"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/common/gsap-provider";
import { ScrollReveal } from "./scroll-animations";

const METRICS = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "100%", label: "Audit Coverage" },
  { value: "<50ms", label: "Decision Latency" },
  { value: "SOC 2", label: "Compliance Ready" },
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

const STEPS = [
  {
    number: "01",
    title: "Define",
    subtitle: "Set Policy & Constraints",
    description:
      "Define guardrails, approval thresholds, and escalation policies as code. Specify what your AI agents can and cannot do.",
  },
  {
    number: "02",
    title: "Execute",
    subtitle: "AI Agents Run Within Guardrails",
    description:
      "Deploy intelligent agents that operate within your defined boundaries. Every action is traced with full reasoning context.",
  },
  {
    number: "03",
    title: "Govern",
    subtitle: "Human Oversight & Audit",
    description:
      "Review agent outputs at critical checkpoints. Approve, reject, or modify decisions with an immutable audit trail.",
  },
] as const;

export function PolicyHITLSection() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

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

  useEffect(() => {
    if (
      !isReady ||
      prefersReducedMotion ||
      !progressRef.current ||
      !sectionRef.current
    )
      return;

    const ctx = gsap.context(() => {
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
    <>
      {/* How It Works */}
      <section
        ref={sectionRef}
        id="how-it-works"
        className="landing-section relative"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-5xl px-6">
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

          <div className="relative mt-20">
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

            <div className="space-y-16 lg:space-y-24">
              {STEPS.map((step, i) => (
                <ScrollReveal
                  key={i}
                  direction="up"
                  delay={0.1}
                  threshold={0.2}
                >
                  <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 lg:pl-20">
                    <div className={i % 2 === 1 ? "lg:order-2" : ""}>
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
                    <div
                      className={`flex items-center justify-center rounded-xl border border-white/[0.04] bg-white/[0.01] p-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}
                    >
                      <div className="text-center text-[var(--landing-text-muted)]">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                          <span className="font-mono text-2xl font-bold text-[var(--landing-accent-blue)]">
                            {step.number}
                          </span>
                        </div>
                        <span className="text-xs">{step.subtitle}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Enterprise */}
      <section
        id="trust"
        className="landing-section relative"
        aria-labelledby="trust-heading"
      >
        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--landing-accent-cyan)] opacity-[0.02] blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6">
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
              Security, compliance, and reliability are foundational to every
              layer of Convex-Flow.
            </p>
          </ScrollReveal>

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
    </>
  );
}
