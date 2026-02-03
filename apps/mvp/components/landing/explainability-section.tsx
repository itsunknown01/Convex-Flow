"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Eye, Layers, FileText, Search } from "lucide-react";

const explainabilityFeatures = [
  {
    icon: Eye,
    title: "Decision Transparency",
    description:
      "See exactly why each decision was made, with full reasoning chains.",
    color: "from-purple-500 to-violet-500",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
  {
    icon: Layers,
    title: "Layer-by-Layer View",
    description: "Drill down through workflow layers to understand data flow.",
    color: "from-blue-500 to-purple-500",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    icon: FileText,
    title: "Audit Reports",
    description: "Generate compliance-ready reports with one click.",
    color: "from-pink-500 to-purple-500",
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
  {
    icon: Search,
    title: "Root Cause Analysis",
    description: "Trace any outcome back to its originating trigger.",
    color: "from-violet-500 to-indigo-500",
    glowColor: "rgba(139, 92, 246, 0.5)",
  },
];

/**
 * ExplainabilitySection - Glass morphism layers with scroll-linked reveals.
 * Features stacked transparent cards, active feature highlighting, and 3D image rotation.
 */
export function ExplainabilitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image transforms with 3D perspective
  const imageScale = useTransform(
    scrollYProgress,
    [0.1, 0.35],
    prefersReducedMotion ? [1, 1] : [0.8, 1],
  );
  const imageRotateY = useTransform(
    scrollYProgress,
    [0.1, 0.35],
    prefersReducedMotion ? [0, 0] : [-15, 0],
  );
  const imageRotateX = useTransform(
    scrollYProgress,
    [0.1, 0.35],
    prefersReducedMotion ? [0, 0] : [10, 0],
  );
  const imageOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0.3, 1]);

  // Glass layers stagger effect
  const layer1Y = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    prefersReducedMotion ? [0, 0] : [40, 0],
  );
  const layer2Y = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    prefersReducedMotion ? [0, 0] : [80, 0],
  );
  const layer3Y = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    prefersReducedMotion ? [0, 0] : [120, 0],
  );

  // Heading reveal
  const headingOpacity = useTransform(scrollYProgress, [0.15, 0.28], [0, 1]);
  const headingY = useTransform(
    scrollYProgress,
    [0.15, 0.28],
    prefersReducedMotion ? [0, 0] : [60, 0],
  );

  // Feature highlight based on scroll position
  const activeFeature = useTransform(scrollYProgress, (value) => {
    if (value < 0.35) return -1;
    if (value < 0.45) return 0;
    if (value < 0.55) return 1;
    if (value < 0.65) return 2;
    return 3;
  });

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] bg-slate-950"
      aria-labelledby="explainability-heading"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-slate-950 to-blue-950/20" />

          {/* Ambient glow */}
          {!prefersReducedMotion && (
            <motion.div
              animate={{
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[150px]"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Content grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Stacked glass layers image */}
            <motion.div
              style={{
                scale: imageScale,
                rotateY: imageRotateY,
                rotateX: imageRotateX,
                opacity: prefersReducedMotion ? 1 : imageOpacity,
                perspective: "1000px",
              }}
              className="relative aspect-square max-w-lg mx-auto lg:mx-0"
            >
              {/* Stacked glass effect layers */}
              <motion.div
                style={{ y: layer1Y }}
                className="absolute inset-0 rounded-3xl bg-purple-500/5 backdrop-blur-sm border border-purple-500/20 shadow-2xl"
                aria-hidden="true"
              />
              <motion.div
                style={{ y: layer2Y }}
                className="absolute inset-4 rounded-2xl bg-blue-500/5 backdrop-blur-sm border border-blue-500/20 shadow-xl"
                aria-hidden="true"
              />
              <motion.div
                style={{ y: layer3Y }}
                className="absolute inset-8 rounded-xl bg-violet-500/5 backdrop-blur-sm border border-violet-500/20 shadow-lg"
                aria-hidden="true"
              />

              {/* Main image */}
              <Image
                src="/images/landing/glass-layers.png"
                alt="AI explainability visualization showing transparent layers of decision-making"
                fill
                className="object-contain relative z-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Glow effect behind image */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(168, 85, 247, 0.2), transparent 70%)",
                  filter: "blur(60px)",
                }}
                aria-hidden="true"
              />
            </motion.div>

            {/* Right: Content with scroll-linked feature highlighting */}
            <div>
              <motion.div
                style={{
                  opacity: prefersReducedMotion ? 1 : headingOpacity,
                  y: prefersReducedMotion ? 0 : headingY,
                }}
              >
                <span
                  className="inline-block text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4"
                  style={{
                    textShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                  }}
                >
                  Explainability
                </span>
                <h2
                  id="explainability-heading"
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-balance"
                >
                  See through the{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    black box
                  </span>
                </h2>
                <p className="mt-5 text-lg text-slate-400 leading-relaxed">
                  Every AI decision is transparent. Understand the
                  &quot;why&quot; behind every workflow outcome.
                </p>
              </motion.div>

              {/* Feature list with active state highlighting */}
              <div className="mt-10 space-y-4">
                {explainabilityFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, x: 40 }
                      }
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="group relative"
                    >
                      <motion.div
                        style={{
                          borderColor:
                            activeFeature.get() === i
                              ? feature.glowColor
                              : "rgba(71, 85, 105, 0.3)",
                          boxShadow:
                            activeFeature.get() === i
                              ? `0 0 30px ${feature.glowColor}`
                              : "none",
                        }}
                        whileHover={{
                          scale: 1.02,
                          borderColor: feature.glowColor,
                        }}
                        className="flex items-start gap-4 p-5 rounded-xl bg-slate-800/50 backdrop-blur-md border border-slate-700/30 transition-all duration-300 cursor-default"
                      >
                        {/* Icon with gradient background */}
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          style={{
                            boxShadow: `0 4px 20px ${feature.glowColor}`,
                          }}
                        >
                          <Icon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg group-hover:text-purple-100 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1 leading-relaxed group-hover:text-slate-300 transition-colors">
                            {feature.description}
                          </p>
                        </div>

                        {/* Active indicator */}
                        <div
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor:
                              activeFeature.get() === i
                                ? feature.glowColor
                                : "transparent",
                            boxShadow:
                              activeFeature.get() === i
                                ? `0 0 10px ${feature.glowColor}`
                                : "none",
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
