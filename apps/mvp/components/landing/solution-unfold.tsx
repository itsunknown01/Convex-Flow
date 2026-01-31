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
  },
  {
    icon: Shield,
    title: "Policy Engine",
    description: "Automated compliance. Zero manual overhead.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description: "Critical decisions require human approval.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Complete Audit Trail",
    description: "Every decision. Every action. Fully traceable.",
    color: "from-orange-500 to-amber-500",
  },
];

/**
 * SolutionUnfold - Solution reveals that "unfold" as user scrolls.
 * Creates a sense of opening/revealing the product capabilities.
 */
export function SolutionUnfold() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Background parallax
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["10%", "-10%"],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.75, 0.9],
    [0, 1, 1, 0],
  );

  // Card reveal transforms
  const card1X = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    prefersReducedMotion ? [0, 0] : [-100, 0],
  );
  const card2X = useTransform(
    scrollYProgress,
    [0.2, 0.4],
    prefersReducedMotion ? [0, 0] : [100, 0],
  );
  const card3X = useTransform(
    scrollYProgress,
    [0.25, 0.45],
    prefersReducedMotion ? [0, 0] : [-100, 0],
  );
  const card4X = useTransform(
    scrollYProgress,
    [0.3, 0.5],
    prefersReducedMotion ? [0, 0] : [100, 0],
  );
  const cardTransforms = [card1X, card2X, card3X, card4X];

  const cardOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] bg-slate-950"
      aria-labelledby="solution-heading"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background ordered flow image */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
          <Image
            src="/images/landing/ordered-flow.png"
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </motion.div>

        {/* Blue/cyan glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-cyan-950/20 z-[1]" />

        {/* Content */}
        <motion.div
          style={{ opacity: prefersReducedMotion ? 1 : contentOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-6 w-full"
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
              The Solution
            </span>
            <h2
              id="solution-heading"
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance"
            >
              Bring{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                order
              </span>{" "}
              to AI workflows
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
              Convex Flow gives you complete control over AI orchestration, from
              design to deployment to audit.
            </p>
          </div>

          {/* Solution cards - unfold from sides */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {solutions.map((solution, i) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  style={{
                    x: cardTransforms[i],
                    opacity: prefersReducedMotion ? 1 : cardOpacity,
                  }}
                  className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 transition-colors group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-slate-400">{solution.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
