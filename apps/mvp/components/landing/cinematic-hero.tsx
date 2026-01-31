"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

/**
 * CinematicHero - Full viewport hero with cinematic parallax and scroll cue.
 * GTA VI-style immersive opening with layered depth.
 */
export function CinematicHero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax layers at different speeds
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "30%"],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "50%"],
  );
  const fadeOut = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[200vh]" // Extended height for scroll room
      aria-label="Hero section"
    >
      {/* Sticky container for the viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background layer - slowest parallax */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
          <Image
            src="/images/landing/hero-neural.png"
            alt=""
            fill
            className="object-cover scale-110"
            priority
            sizes="100vw"
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
        </motion.div>

        {/* Floating particles layer */}
        {!prefersReducedMotion && (
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            aria-hidden="true"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
                style={{
                  top: `${15 + i * 10}%`,
                  left: `${5 + i * 12}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content layer - faster parallax */}
        <motion.div
          style={{ y: contentY, opacity: fadeOut }}
          className="relative z-10 h-full flex flex-col items-center justify-center px-6"
        >
          {/* Cinematic title treatment */}
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-center max-w-5xl"
          >
            {/* Eyebrow */}
            <motion.span
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-block text-blue-400 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6"
            >
              The Future of AI Governance
            </motion.span>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance">
              <span className="block text-white drop-shadow-2xl">
                Orchestrate AI
              </span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Without Chaos
              </span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-8 text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed text-pretty"
            >
              Run, govern, and audit AI-driven workflows with full
              explainability, policy control, and human-in-the-loop governance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-base font-semibold rounded-full shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 group"
                asChild
              >
                <Link href="/login?view=signup">
                  Start Building
                  <ArrowRight
                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-base font-medium rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            style={{ opacity: fadeOut }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center text-white/60"
            >
              <span className="text-xs tracking-widest uppercase mb-3">
                Scroll to explore
              </span>
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
