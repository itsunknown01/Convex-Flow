"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Shield, UserCheck, Lock, FileCheck } from "lucide-react";

const policyFeatures = [
  {
    icon: Shield,
    label: "Policy Enforcement",
    description: "Automatic compliance with your security policies",
  },
  {
    icon: UserCheck,
    label: "Human Approval",
    description: "Critical decisions require human sign-off",
  },
  {
    icon: Lock,
    label: "Access Control",
    description: "Role-based permissions for every workflow",
  },
  {
    icon: FileCheck,
    label: "Compliance Ready",
    description: "SOC 2, GDPR, and HIPAA compatible",
  },
];

/**
 * PolicyHITLSection - Visual metaphor with parallax depth showing
 * human-AI collaboration through policy controls.
 */
export function PolicyHITLSection() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Multi-layer parallax for depth
  const bgLayer = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["15%", "-15%"],
  );
  const fgLayer = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-10%", "10%"],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.3, 0.7, 0.85],
    [0, 1, 1, 0],
  );

  // Badge reveals
  const badge1Y = useTransform(
    scrollYProgress,
    [0.2, 0.35],
    prefersReducedMotion ? [0, 0] : [30, 0],
  );
  const badge2Y = useTransform(
    scrollYProgress,
    [0.25, 0.4],
    prefersReducedMotion ? [0, 0] : [30, 0],
  );
  const badge3Y = useTransform(
    scrollYProgress,
    [0.3, 0.45],
    prefersReducedMotion ? [0, 0] : [30, 0],
  );
  const badge4Y = useTransform(
    scrollYProgress,
    [0.35, 0.5],
    prefersReducedMotion ? [0, 0] : [30, 0],
  );
  const badgeTransforms = [badge1Y, badge2Y, badge3Y, badge4Y];

  const badgeOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-[180vh] bg-slate-950 overflow-hidden"
      aria-labelledby="policy-heading"
    >
      {/* Background layer - slowest parallax */}
      <motion.div style={{ y: bgLayer }} className="absolute inset-0 z-0">
        {/* Ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-amber-950/10 to-slate-950" />
      </motion.div>

      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Foreground image layer - faster parallax */}
        <motion.div style={{ y: fgLayer }} className="absolute inset-0 z-[1]">
          <Image
            src="/images/landing/human-digital.png"
            alt=""
            fill
            className="object-cover opacity-50"
            sizes="100vw"
          />
          {/* Overlay to darken and colorize */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/60 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity: prefersReducedMotion ? 1 : contentOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
                Governance
              </span>
              <h2
                id="policy-heading"
                className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance"
              >
                Human wisdom. <span className="text-amber-400">AI speed.</span>
              </h2>
              <p className="mt-4 text-lg text-slate-400 leading-relaxed max-w-lg">
                Keep humans in control of critical decisions while AI handles
                the heavy lifting. The perfect balance of efficiency and
                oversight.
              </p>

              {/* Policy badges */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {policyFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.label}
                      style={{
                        y: badgeTransforms[i],
                        opacity: prefersReducedMotion ? 1 : badgeOpacity,
                      }}
                      className="p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          className="h-5 w-5 text-amber-400"
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-white text-sm">
                          {feature.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Visual emphasis (empty for image to show through) */}
            <div className="hidden lg:block" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
