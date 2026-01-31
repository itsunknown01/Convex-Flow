"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

/**
 * ProblemNarrative - Layered storytelling panels showing workflow chaos.
 * Panels stack with depth and reveal as user scrolls.
 */
export function ProblemNarrative() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Staggered parallax for depth
  const layer1Y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-10%", "10%"],
  );
  const layer2Y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-5%", "5%"],
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.9],
    [0, 1, 1, 0],
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    prefersReducedMotion ? [1, 1] : [0.9, 1],
  );

  const problems = [
    {
      title: "Fragmented Workflows",
      description:
        "AI agents scattered across tools with no central orchestration.",
    },
    {
      title: "Zero Visibility",
      description: "Decisions made in black boxes without audit trails.",
    },
    {
      title: "Compliance Nightmares",
      description: "No policy enforcement or human oversight when it matters.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-[150vh] bg-slate-950"
      aria-labelledby="problem-heading"
    >
      {/* Sticky content container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background chaos image with parallax */}
        <motion.div
          style={{ y: layer1Y, scale: imageScale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/landing/chaos-workflow.png"
            alt=""
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </motion.div>

        {/* Red glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-orange-950/20 z-[1]" />

        {/* Content */}
        <motion.div
          style={{
            y: layer2Y,
            opacity: prefersReducedMotion ? 1 : textOpacity,
          }}
          className="relative z-10 max-w-6xl mx-auto px-6"
        >
          {/* Section header */}
          <div className="mb-16">
            <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">
              The Problem
            </span>
            <h2
              id="problem-heading"
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance"
            >
              AI workflows are{" "}
              <span className="text-red-400">out of control</span>
            </h2>
          </div>

          {/* Problem cards with stagger */}
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.title}
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: prefersReducedMotion ? 0 : i * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-red-500/20 hover:border-red-500/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-red-400">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {problem.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
