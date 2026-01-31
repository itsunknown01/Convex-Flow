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
  },
  {
    icon: Layers,
    title: "Layer-by-Layer View",
    description: "Drill down through workflow layers to understand data flow.",
  },
  {
    icon: FileText,
    title: "Audit Reports",
    description: "Generate compliance-ready reports with one click.",
  },
  {
    icon: Search,
    title: "Root Cause Analysis",
    description: "Trace any outcome back to its originating trigger.",
  },
];

/**
 * ExplainabilitySection - Scroll-linked reveals showing AI transparency.
 * Glass layers visual with captions that appear based on scroll progress.
 */
export function ExplainabilitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image transforms
  const imageScale = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    prefersReducedMotion ? [1, 1] : [0.85, 1],
  );
  const imageRotate = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    prefersReducedMotion ? [0, 0] : [-5, 0],
  );
  const imageOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0.5, 1]);

  // Staggered feature reveals
  const feature1Opacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const feature2Opacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const feature3Opacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const feature4Opacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const featureOpacities = [
    feature1Opacity,
    feature2Opacity,
    feature3Opacity,
    feature4Opacity,
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-[180vh] bg-slate-950"
      aria-labelledby="explainability-heading"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-slate-950 to-purple-950/20 z-0" />

        {/* Content grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image with 3D transform */}
            <motion.div
              style={{
                scale: imageScale,
                rotateY: imageRotate,
                opacity: prefersReducedMotion ? 1 : imageOpacity,
              }}
              className="relative aspect-square max-w-lg mx-auto lg:mx-0"
            >
              <Image
                src="/images/landing/glass-layers.png"
                alt="AI explainability visualization showing transparent layers"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
            </motion.div>

            {/* Right: Content */}
            <div>
              <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
                Explainability
              </span>
              <h2
                id="explainability-heading"
                className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance"
              >
                See through the{" "}
                <span className="text-purple-400">black box</span>
              </h2>
              <p className="mt-4 text-lg text-slate-400 leading-relaxed">
                Every AI decision is transparent. Understand the &quot;why&quot;
                behind every workflow outcome.
              </p>

              {/* Feature list with scroll-linked reveals */}
              <div className="mt-10 space-y-6">
                {explainabilityFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      style={{
                        opacity: prefersReducedMotion ? 1 : featureOpacities[i],
                      }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/30"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon
                          className="h-5 w-5 text-purple-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
