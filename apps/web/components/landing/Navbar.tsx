"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/gsap-provider";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Trust", href: "#trust" },
] as const;

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isReady || prefersReducedMotion || !navRef.current) return;

    const ctx = gsap.context(() => {
      // Navbar becomes more opaque on scroll
      gsap.fromTo(
        navRef.current,
        { backdropFilter: "blur(8px)", backgroundColor: "rgba(5,10,20,0.4)" },
        {
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(5,10,20,0.85)",
          scrollTrigger: {
            trigger: "body",
            start: "80px top",
            end: "200px top",
            scrub: 0.3,
          },
        },
      );
    }, navRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
      style={{
        backgroundColor: "rgba(5,10,20,0.4)",
        backdropFilter: "blur(8px)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
        >
          {/* Geometric logo mark */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect
              x="2"
              y="2"
              width="10"
              height="10"
              rx="2"
              fill="url(#logo-grad)"
              opacity="0.9"
            />
            <rect
              x="16"
              y="2"
              width="10"
              height="10"
              rx="2"
              fill="url(#logo-grad)"
              opacity="0.5"
            />
            <rect
              x="2"
              y="16"
              width="10"
              height="10"
              rx="2"
              fill="url(#logo-grad)"
              opacity="0.5"
            />
            <rect
              x="16"
              y="16"
              width="10"
              height="10"
              rx="2"
              fill="url(#logo-grad)"
              opacity="0.7"
            />
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span>
            Convex
            <span className="text-[var(--landing-accent-blue)]">Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--landing-text-secondary)] transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            className="cta-glow rounded-lg bg-[var(--landing-accent-blue)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--landing-accent-blue)]/90"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-[var(--landing-bg)]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--landing-text-secondary)] transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-[var(--landing-accent-blue)] px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
