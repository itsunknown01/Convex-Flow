"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const problems = [
  {
    title: "Fragmented Workflows",
    description:
      "AI agents scattered across tools with no central orchestration.",
    icon: "⚡",
  },
  {
    title: "Zero Visibility",
    description: "Decisions made in black boxes without audit trails.",
    icon: "👁",
  },
  {
    title: "Compliance Nightmares",
    description: "No policy enforcement or human oversight when it matters.",
    icon: "⚠",
  },
];

// Glitch effect keyframes for text
const glitchVariants = {
  initial: { x: 0, opacity: 1 },
  glitch: {
    x: [0, -2, 2, -1, 1, 0],
    opacity: [1, 0.8, 1, 0.9, 1],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
};

/**
 * ProblemNarrative - Cinematic storytelling panels showing workflow chaos.
 * Features glitch effects, scroll-triggered reveals, and dramatic depth.
 */
export function ProblemNarrative() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Multi-layer parallax
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-15%", "15%"],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-5%", "5%"],
  );
  const bgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [0.95, 1.05, 1],
  );

  // Text reveal based on scroll
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const headingY = useTransform(
    scrollYProgress,
    [0.1, 0.25],
    prefersReducedMotion ? [0, 0] : [60, 0],
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[180vh] bg-slate-950"
      aria-labelledby="problem-heading"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background chaos image with parallax */}
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/landing/chaos-workflow.png"
            alt=""
            fill
            className="object-cover opacity-50"
            sizes="100vw"
          />
          {/* Scan lines overlay for glitch effect */}
          {!prefersReducedMotion && (
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)",
              }}
              aria-hidden="true"
            />
          )}
        </motion.div>

        {/* Red/orange danger glow */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-slate-950/60 to-orange-950/30" />

          {/* Pulsing danger glow */}
          {!prefersReducedMotion && (
            <motion.div
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-red-500/20 rounded-full blur-[150px]"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Content layer */}
        <motion.div
          style={{ y: contentY }}
          className="relative z-10 max-w-6xl mx-auto px-6 py-20"
        >
          {/* Section header with scroll-triggered reveal */}
          <motion.div
            style={{
              opacity: prefersReducedMotion ? 1 : headingOpacity,
              y: prefersReducedMotion ? 0 : headingY,
            }}
            className="mb-16 text-center md:text-left"
          >
            <motion.span
              className="inline-block text-red-400 text-sm font-semibold tracking-widest uppercase mb-4"
              style={{
                textShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
              }}
            >
              The Problem
            </motion.span>
            <h2
              id="problem-heading"
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-balance"
            >
              AI workflows are{" "}
              <motion.span
                variants={glitchVariants}
                initial="initial"
                animate={prefersReducedMotion ? "initial" : "glitch"}
                className="inline-block text-red-400 relative"
                style={{
                  textShadow:
                    "2px 0 #ff0000, -2px 0 #00ffff, 0 0 30px rgba(239, 68, 68, 0.8)",
                }}
              >
                out of control
                {/* Glitch layers */}
                {!prefersReducedMotion && (
                  <>
                    <span
                      className="absolute inset-0 text-cyan-400 opacity-50"
                      style={{ clipPath: "inset(45% 0 50% 0)", left: "2px" }}
                      aria-hidden="true"
                    >
                      out of control
                    </span>
                    <span
                      className="absolute inset-0 text-red-500 opacity-50"
                      style={{ clipPath: "inset(50% 0 30% 0)", left: "-2px" }}
                      aria-hidden="true"
                    >
                      out of control
                    </span>
                  </>
                )}
              </motion.span>
            </h2>
            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl">
              Modern AI deployments suffer from critical governance gaps that
              put your organization at risk.
            </p>
          </motion.div>

          {/* Problem cards with staggered reveal */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.title}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 60, scale: 0.9 }
                }
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: prefersReducedMotion ? 0 : 0.2 + i * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.02,
                        borderColor: "rgba(239, 68, 68, 0.5)",
                      }
                }
                className="group p-8 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-red-500/20 hover:bg-slate-900/80 transition-all duration-300"
                style={{
                  boxShadow: "0 0 40px rgba(239, 68, 68, 0.05)",
                }}
              >
                {/* Icon with glow */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/30 to-orange-500/20 flex items-center justify-center mb-5 group-hover:from-red-500/40 group-hover:to-orange-500/30 transition-all">
                  <span
                    className="text-2xl"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))",
                    }}
                  >
                    {problem.icon}
                  </span>
                </div>

                {/* Number badge */}
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-red-400/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-100 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {problem.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-red-500/50 to-orange-500/50 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
