"use client";

import ScrollReveal from "./ScrollReveal";

/* ═══════════════════════════════════════════════════════════════
   "THE SOLUTION" — Convex-Flow value proposition
   Clean geometric flow, key differentiators
   ═══════════════════════════════════════════════════════════════ */

const DIFFERENTIATORS = [
  {
    title: "Explainable Decisions",
    description:
      "Every agent action comes with a full reasoning trace. See exactly why decisions were made, not just what happened.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 14l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "var(--landing-accent-blue)",
  },
  {
    title: "Policy-Driven Control",
    description:
      "Define guardrails as code. Set constraints, approval thresholds, and escalation rules before agents execute.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2l7 4v6c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "var(--landing-accent-purple)",
  },
  {
    title: "Human-in-the-Loop",
    description:
      "Critical decisions route to human reviewers automatically. Set approval gates for high-stakes operations.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6 20v-1a6 6 0 0112 0v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M17 10l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "var(--landing-accent-cyan)",
  },
  {
    title: "Audit Trail",
    description:
      "Complete provenance tracking for every workflow execution. Meet compliance requirements with immutable logs.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 2v6h6M8 13h8M8 17h8M8 9h2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "var(--landing-accent-blue)",
  },
] as const;

export default function SolutionSection() {
  return (
    <section
      id="features"
      className="landing-section relative"
      aria-labelledby="solution-heading"
    >
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-[400px] w-[600px] rounded-full bg-[var(--landing-accent-blue)] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="landing-label">The Solution</span>
          <h2
            id="solution-heading"
            className="landing-headline mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl"
          >
            Automation You Can
            <br />
            <span className="bg-gradient-to-r from-[var(--landing-accent-blue)] via-[var(--landing-accent-purple)] to-[var(--landing-accent-cyan)] bg-clip-text text-transparent">
              Trust and Verify
            </span>
          </h2>
          <p className="landing-subheadline mt-4">
            Convex-Flow gives you the power of AI agent automation with the
            control, transparency, and governance enterprises demand.
          </p>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {DIFFERENTIATORS.map((item, i) => (
            <ScrollReveal
              key={i}
              direction="up"
              delay={i * 0.1}
              threshold={0.15}
            >
              <div className="group relative h-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04]">
                {/* Icon */}
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] transition-colors duration-300 group-hover:border-white/[0.12]"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--landing-text-secondary)]">
                  {item.description}
                </p>

                {/* Corner glow on hover */}
                <div
                  className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-0 blur-[40px] transition-opacity duration-500 group-hover:opacity-100"
                  style={{ backgroundColor: item.color, opacity: 0 }}
                  aria-hidden="true"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
