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

// Text animation variants for cinematic word-by-word reveal
const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay: 0.8 + i * 0.12,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/**
 * CinematicHero - Full viewport hero with GTA VI-style cinematic parallax.
 * Features 3-layer depth, word-by-word text animation, and dramatic scroll effects.
 */
export function CinematicHero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // 3-layer parallax system - each layer moves at different speed
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "40%"],
  );
  const midY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "25%"],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "60%"],
  );

  // Opacity and scale transforms for dramatic effect
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1.1, 1.1] : [1.1, 1.3],
  );
  const overlayScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.15],
  );

  // Title words for staggered animation
  const titleLine1 = ["Orchestrate", "AI"];
  const titleLine2 = ["Without", "Chaos"];

  return (
    <section ref={ref} className="relative h-[200vh]" aria-label="Hero section">
      {/* Sticky container for the viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Layer 1: Deep background - slowest parallax */}
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/landing/hero-neural.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-purple-950/30" />
        </motion.div>

        {/* Layer 2: Geometric overlay - medium parallax */}
        <motion.div
          style={{ y: midY, scale: overlayScale }}
          className="absolute inset-0 z-[1] pointer-events-none"
          aria-hidden="true"
        >
          <Image
            src="/images/landing/geometric-overlay.png"
            alt=""
            fill
            className="object-cover opacity-40 mix-blend-screen"
            sizes="100vw"
          />
        </motion.div>

        {/* Animated glow orbs */}
        {!prefersReducedMotion && (
          <div
            className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            {/* Large ambient glow */}
            <motion.div
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px]"
            />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.6, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  top: `${10 + i * 7}%`,
                  left: `${5 + i * 8}%`,
                  boxShadow: "0 0 10px 2px rgba(34, 211, 238, 0.6)",
                }}
              />
            ))}
          </div>
        )}

        {/* Layer 3: Content - fastest parallax */}
        <motion.div
          style={{ y: contentY, opacity: fadeOut }}
          className="relative z-10 h-full flex flex-col items-center justify-center px-6"
        >
          {/* Cinematic title treatment */}
          <div className="text-center max-w-5xl">
            {/* Eyebrow with glow */}
            <motion.span
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-block text-blue-400 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6"
              style={{
                textShadow: "0 0 30px rgba(96, 165, 250, 0.5)",
              }}
            >
              The Future of AI Governance
            </motion.span>

            {/* Main headline with word-by-word reveal */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-white drop-shadow-2xl">
                {prefersReducedMotion
                  ? "Orchestrate AI"
                  : titleLine1.map((word, i) => (
                      <motion.span
                        key={word}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={wordVariants}
                        className="inline-block mr-[0.25em]"
                        style={{
                          textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
              </span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {prefersReducedMotion
                  ? "Without Chaos"
                  : titleLine2.map((word, i) => (
                      <motion.span
                        key={word}
                        custom={i + titleLine1.length}
                        initial="hidden"
                        animate="visible"
                        variants={wordVariants}
                        className="inline-block mr-[0.25em]"
                      >
                        {word}
                      </motion.span>
                    ))}
              </span>
            </h1>

            {/* Subheadline with blur reveal */}
            <motion.p
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 20, filter: "blur(10px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-8 text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed text-pretty"
            >
              Run, govern, and audit AI-driven workflows with full
              explainability, policy control, and human-in-the-loop governance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="relative bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-base font-semibold rounded-full shadow-2xl shadow-white/20 hover:shadow-white/40 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 group touch-action-manipulation overflow-hidden"
                asChild
              >
                <Link href="/login?view=signup">
                  {/* Button glow effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/30 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center">
                    Start Building
                    <ArrowRight
                      className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm px-8 py-6 text-base font-medium rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 touch-action-manipulation transition-all"
                asChild
              >
                <Link href="#features">Watch Demo</Link>
              </Button>
            </motion.div>
          </div>

          {/* Scroll indicator with glow */}
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
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        boxShadow: [
                          "0 0 0px rgba(96, 165, 250, 0)",
                          "0 0 20px rgba(96, 165, 250, 0.6)",
                          "0 0 0px rgba(96, 165, 250, 0)",
                        ],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="p-2 rounded-full border border-white/20"
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade with noise texture */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
