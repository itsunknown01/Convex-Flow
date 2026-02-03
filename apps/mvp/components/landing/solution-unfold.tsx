"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Workflow, Shield, Users, BarChart3 } from "lucide-react";

const solutions = [
  {
    icon: Workflow,
    title: "Visual Orchestration",
    description: "Design workflows visually. Deploy with confidence.",
    color: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.4)",
    delay: 0,
  },
  {
    icon: Shield,
    title: "Policy Engine",
    description: "Automated compliance. Zero manual overhead.",
    color: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.4)",
    delay: 0.1,
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description: "Critical decisions require human approval.",
    color: "from-green-500 to-emerald-500",
    glowColor: "rgba(34, 197, 94, 0.4)",
    delay: 0.2,
  },
  {
    icon: BarChart3,
    title: "Complete Audit Trail",
    description: "Every decision. Every action. Fully traceable.",
    color: "from-orange-500 to-amber-500",
    glowColor: "rgba(249, 115, 22, 0.4)",
    delay: 0.3,
  },
];

/**
 * SolutionUnfold - Cinematic solution reveals with 3D perspective.
 * Cards unfold from the center with depth and glow effects.
 */
export function SolutionUnfold() {
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
    prefersReducedMotion ? ["0%", "0%"] : ["15%", "-15%"],
  );
  const bgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.1, 1, 1.1],
  );

  // Data flow overlay parallax (opposite direction)
  const overlayY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-10%", "10%"],
  );

  // Content transforms
  const headingY = useTransform(
    scrollYProgress,
    [0.1, 0.25],
    prefersReducedMotion ? [0, 0] : [80, 0],
  );
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // Card 3D perspective unfold
  const cardRotateX = useTransform(
    scrollYProgress,
    [0.15, 0.4],
    prefersReducedMotion ? [0, 0] : [25, 0],
  );
  const cardScale = useTransform(
    scrollYProgress,
    [0.15, 0.4],
    prefersReducedMotion ? [1, 1] : [0.85, 1],
  );
  const cardOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

  return (
    <section
      ref={ref}
      id="features"
      className="relative min-h-[220vh] bg-slate-950"
      aria-labelledby="solution-heading"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background ordered flow image */}
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/landing/ordered-flow.png"
            alt=""
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </motion.div>

        {/* Data flow overlay layer */}
        <motion.div
          style={{ y: overlayY }}
          className="absolute inset-0 z-[1] pointer-events-none opacity-30 mix-blend-screen"
          aria-hidden="true"
        >
          <Image
            src="/images/landing/data-flow.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Blue/cyan gradient overlay */}
        <div className="absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950/70 to-cyan-950/30" />

          {/* Ambient glow orbs */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-[100px]"
                aria-hidden="true"
              />
              <motion.div
                animate={{
                  opacity: [0.15, 0.3, 0.15],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-cyan-500/10 rounded-full blur-[100px]"
                aria-hidden="true"
              />
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          {/* Section header with scroll-triggered reveal */}
          <motion.div
            style={{
              y: prefersReducedMotion ? 0 : headingY,
              opacity: prefersReducedMotion ? 1 : headingOpacity,
            }}
            className="text-center mb-16"
          >
            <span
              className="inline-block text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4"
              style={{
                textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
              }}
            >
              The Solution
            </span>
            <h2
              id="solution-heading"
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-balance"
            >
              Bring{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                order
              </span>{" "}
              to AI workflows
            </h2>
            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Convex Flow gives you complete control over AI orchestration, from
              design to deployment to audit.
            </p>
          </motion.div>

          {/* Solution cards - 3D perspective unfold */}
          <motion.div
            style={{
              rotateX: cardRotateX,
              scale: cardScale,
              opacity: prefersReducedMotion ? 1 : cardOpacity,
              perspective: "1000px",
            }}
            className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto"
          >
            {solutions.map((solution, i) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 40 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: solution.delay,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 1.03,
                          y: -5,
                          boxShadow: `0 20px 60px ${solution.glowColor}`,
                        }
                  }
                  className="group relative p-8 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:border-slate-500/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Card glow effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${solution.glowColor}, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />

                  {/* Icon container with gradient */}
                  <div
                    className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-5 shadow-lg transition-all duration-300`}
                    style={{
                      boxShadow: `0 8px 32px ${solution.glowColor}`,
                    }}
                  >
                    <Icon
                      className="h-8 w-8 text-white drop-shadow-md"
                      aria-hidden="true"
                    />

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>
                  </div>

                  <h3 className="relative text-xl font-semibold text-white mb-3 group-hover:text-cyan-100 transition-colors">
                    {solution.title}
                  </h3>
                  <p className="relative text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {solution.description}
                  </p>

                  {/* Connection indicator */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Center connection visual */}
          {!prefersReducedMotion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none hidden md:block"
              aria-hidden="true"
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full rounded-full bg-cyan-400"
                style={{
                  boxShadow: "0 0 30px rgba(34, 211, 238, 0.8)",
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
