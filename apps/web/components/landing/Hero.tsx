"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/gsap-provider";

/* ═══════════════════════════════════════════════════════════════
   HERO — Full-viewport parallax hero with 3 depth layers
   ═══════════════════════════════════════════════════════════════ */

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

  /* ── Entrance animation ─────────────────────────────────── */
  useEffect(() => {
    if (!isReady || !headlineRef.current) return;

    if (prefersReducedMotion) {
      // Static reveal — no animation
      gsap.set([headlineRef.current, subRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Headline words stagger in
      const words = headlineRef.current!.querySelectorAll(".hero-word");
      tl.fromTo(
        words,
        { opacity: 0, y: 40, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.08 },
      );

      // Subheadline
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.3",
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3",
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  /* ── Parallax scroll ────────────────────────────────────── */
  useEffect(() => {
    if (!isReady || prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      // Layer 0 (back) — slowest
      if (layer0Ref.current) {
        gsap.to(layer0Ref.current, {
          y: -80,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // Layer 1 (mid)
      if (layer1Ref.current) {
        gsap.to(layer1Ref.current, {
          y: -140,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // Layer 2 (front) — fastest
      if (layer2Ref.current) {
        gsap.to(layer2Ref.current, {
          y: -220,
          opacity: 0,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
      aria-labelledby="hero-headline"
    >
      {/* ── Layer 0: Gradient Mesh Background ───────────────── */}
      <div
        ref={layer0Ref}
        className="pointer-events-none absolute inset-0 hero-gradient-mesh"
        aria-hidden="true"
      >
        {/* Radial glow orbs */}
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--landing-accent-blue)] opacity-[0.05] blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--landing-accent-purple)] opacity-[0.04] blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[var(--landing-accent-cyan)] opacity-[0.03] blur-[100px]" />
      </div>

      {/* ── Layer 1: Geometric Network Nodes ────────────────── */}
      <div
        ref={layer1Ref}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Network connection lines */}
          <line
            x1="200"
            y1="200"
            x2="400"
            y2="350"
            stroke="url(#line-grad)"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1="400"
            y1="350"
            x2="700"
            y2="250"
            stroke="url(#line-grad)"
            strokeWidth="0.5"
            opacity="0.25"
          />
          <line
            x1="700"
            y1="250"
            x2="950"
            y2="400"
            stroke="url(#line-grad)"
            strokeWidth="0.5"
            opacity="0.2"
          />
          <line
            x1="300"
            y1="500"
            x2="600"
            y2="550"
            stroke="url(#line-grad)"
            strokeWidth="0.5"
            opacity="0.2"
          />
          <line
            x1="600"
            y1="550"
            x2="900"
            y2="500"
            stroke="url(#line-grad)"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <line
            x1="400"
            y1="350"
            x2="300"
            y2="500"
            stroke="url(#line-grad)"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <line
            x1="700"
            y1="250"
            x2="600"
            y2="550"
            stroke="url(#line-grad)"
            strokeWidth="0.5"
            opacity="0.1"
          />

          {/* Nodes */}
          <circle cx="200" cy="200" r="3" fill="#3b82f6" opacity="0.5" />
          <circle
            cx="200"
            cy="200"
            r="8"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.5"
            opacity="0.2"
          />
          <circle cx="400" cy="350" r="4" fill="#8b5cf6" opacity="0.4" />
          <circle
            cx="400"
            cy="350"
            r="10"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <circle cx="700" cy="250" r="3" fill="#06b6d4" opacity="0.5" />
          <circle
            cx="700"
            cy="250"
            r="8"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.5"
            opacity="0.2"
          />
          <circle cx="950" cy="400" r="4" fill="#3b82f6" opacity="0.3" />
          <circle cx="300" cy="500" r="3" fill="#8b5cf6" opacity="0.3" />
          <circle cx="600" cy="550" r="3" fill="#06b6d4" opacity="0.3" />
          <circle cx="900" cy="500" r="3" fill="#3b82f6" opacity="0.25" />

          {/* Small hexagonal shapes for geometric feel */}
          <polygon
            points="150,650 165,640 180,650 180,665 165,675 150,665"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <polygon
            points="1000,180 1015,170 1030,180 1030,195 1015,205 1000,195"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="0.5"
            opacity="0.12"
          />
          <rect
            x="80"
            y="380"
            width="16"
            height="16"
            rx="2"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.5"
            opacity="0.12"
            transform="rotate(45 88 388)"
          />

          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Layer 2: Content (front) ────────────────────────── */}
      <div
        ref={layer2Ref}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        {/* Label badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--landing-accent-cyan)]" />
          <span className="landing-label">Enterprise AI Automation</span>
        </div>

        {/* Headline — Real DOM text for LCP */}
        <h1
          ref={headlineRef}
          id="hero-headline"
          className="landing-headline font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <span className="hero-word inline-block">Automate&nbsp;</span>
          <span className="hero-word inline-block">AI&nbsp;</span>
          <span className="hero-word inline-block">Workflows</span>
          <br className="hidden sm:block" />
          <span className="hero-word inline-block">With&nbsp;</span>
          <span className="hero-word inline-block bg-gradient-to-r from-[var(--landing-accent-blue)] via-[var(--landing-accent-purple)] to-[var(--landing-accent-cyan)] bg-clip-text text-transparent">
            Full&nbsp;
          </span>
          <span className="hero-word inline-block bg-gradient-to-r from-[var(--landing-accent-purple)] to-[var(--landing-accent-cyan)] bg-clip-text text-transparent">
            Control
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="landing-subheadline mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          Explainable, policy-driven agent orchestration with human-in-the-loop
          governance. Safe, auditable automation at enterprise scale.
        </p>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <a
            href="#cta"
            className="cta-glow inline-flex items-center gap-2 rounded-lg bg-[var(--landing-accent-blue)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 cursor-pointer"
          >
            Start Building
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
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/[0.06] cursor-pointer"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* ── Bottom gradient fade ────────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--landing-bg)] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
