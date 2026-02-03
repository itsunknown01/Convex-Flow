"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Shield, UserCheck, Lock, FileCheck, CheckCircle2 } from "lucide-react";

const policyFeatures = [
  {
    icon: Shield,
    label: "Policy Enforcement",
    description: "Automatic compliance with your security policies",
    color: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
  {
    icon: UserCheck,
    label: "Human Approval",
    description: "Critical decisions require human sign-off",
    color: "from-yellow-500 to-amber-500",
    glowColor: "rgba(234, 179, 8, 0.5)",
  },
  {
    icon: Lock,
    label: "Access Control",
    description: "Role-based permissions for every workflow",
    color: "from-orange-500 to-red-500",
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
  {
    icon: FileCheck,
    label: "Compliance Ready",
    description: "SOC 2, GDPR, and HIPAA compatible",
    color: "from-amber-400 to-yellow-500",
    glowColor: "rgba(251, 191, 36, 0.5)",
  },
];

const trustBadges = ["SOC 2", "GDPR", "HIPAA", "ISO 27001"];

/**
 * PolicyHITLSection - Human-AI collaboration visual with split-screen effect.
 * Features golden amber vs blue color contrast, staggered badge reveals, and convergence animation.
 */
export function PolicyHITLSection() {
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
    prefersReducedMotion ? ["0%", "0%"] : ["20%", "-20%"],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-10%", "10%"],
  );
  const imageX = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    prefersReducedMotion ? ["0%", "0%"] : ["10%", "0%"],
  );

  // Heading reveal
  const headingOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const headingY = useTransform(
    scrollYProgress,
    [0.15, 0.3],
    prefersReducedMotion ? [0, 0] : [60, 0],
  );

  // Badge stagger reveals with scale
  const badgeScale = useTransform(
    scrollYProgress,
    [0.25, 0.4],
    prefersReducedMotion ? [1, 1] : [0.8, 1],
  );
  const badgeOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] bg-slate-950 overflow-hidden"
      aria-labelledby="policy-heading"
    >
      {/* Background gradient with amber glow */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-amber-950/15 to-slate-950" />

        {/* Split color effect - amber left, blue right */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              animate={{
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-amber-500/10 to-transparent"
              aria-hidden="true"
            />
            <motion.div
              animate={{
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent"
              aria-hidden="true"
            />
          </>
        )}
      </motion.div>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Human-AI collaboration image with parallax */}
        <motion.div style={{ x: imageX }} className="absolute inset-0 z-[1]">
          <Image
            src="/images/landing/human-ai-collab.png"
            alt=""
            fill
            className="object-cover opacity-60"
            sizes="100vw"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: contentY }}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <motion.div
                style={{
                  opacity: prefersReducedMotion ? 1 : headingOpacity,
                  y: prefersReducedMotion ? 0 : headingY,
                }}
              >
                <span
                  className="inline-block text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4"
                  style={{
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
                  }}
                >
                  Governance
                </span>
                <h2
                  id="policy-heading"
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-balance"
                >
                  Human wisdom.{" "}
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    AI speed.
                  </span>
                </h2>
                <p className="mt-5 text-lg text-slate-400 leading-relaxed max-w-lg">
                  Keep humans in control of critical decisions while AI handles
                  the heavy lifting. The perfect balance of efficiency and
                  oversight.
                </p>
              </motion.div>

              {/* Policy badges with staggered reveal */}
              <motion.div
                style={{
                  scale: badgeScale,
                  opacity: prefersReducedMotion ? 1 : badgeOpacity,
                }}
                className="mt-10 grid grid-cols-2 gap-4"
              >
                {policyFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.label}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 30, scale: 0.9 }
                      }
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      whileHover={
                        prefersReducedMotion
                          ? {}
                          : {
                              scale: 1.05,
                              boxShadow: `0 10px 40px ${feature.glowColor}`,
                            }
                      }
                      className="group p-5 rounded-xl bg-slate-800/60 backdrop-blur-md border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                          style={{
                            boxShadow: `0 4px 15px ${feature.glowColor}`,
                          }}
                        >
                          <Icon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </div>
                        <span className="font-semibold text-white group-hover:text-amber-100 transition-colors">
                          {feature.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                {trustBadges.map((badge, i) => (
                  <motion.div
                    key={badge}
                    initial={prefersReducedMotion ? {} : { scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6 + i * 0.1,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30"
                  >
                    <CheckCircle2
                      className="h-4 w-4 text-green-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-green-300">
                      {badge}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: Visual emphasis with glowing orb */}
            <div className="hidden lg:flex items-center justify-center">
              {!prefersReducedMotion && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-64 h-64 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent 70%)",
                    filter: "blur(40px)",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
