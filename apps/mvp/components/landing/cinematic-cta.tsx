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
import { ArrowRight, Sparkles, Check } from "lucide-react";
import Link from "next/link";

const trustIndicators = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
];

/**
 * CinematicCTA - Grand finale with convergence animation and pulsing glow effects.
 * Elements draw together as user scrolls, building to a dramatic conversion moment.
 */
export function CinematicCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // Convergence effect - elements draw together
  const convergenceScale = useTransform(
    scrollYProgress,
    [0, 0.6],
    prefersReducedMotion ? [1, 1] : [1.2, 1],
  );
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const contentY = useTransform(
    scrollYProgress,
    [0.1, 0.5],
    prefersReducedMotion ? [0, 0] : [80, 0],
  );

  // Button glow intensity
  const buttonGlow = useTransform(scrollYProgress, [0.5, 0.8], [0.3, 0.6]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background convergence image with zoom effect */}
      <motion.div
        style={{ scale: convergenceScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/landing/convergence.png"
          alt=""
          fill
          className="object-cover opacity-50"
          sizes="100vw"
        />
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.7)_60%,rgba(2,6,23,1)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950" />
      </motion.div>

      {/* Animated convergence lines */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Center convergence glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Floating particles converging */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 40 + (i % 3) * 15;
            return (
              <motion.div
                key={i}
                animate={{
                  x: [
                    Math.cos(angle) * radius + "%",
                    Math.cos(angle) * (radius - 10) + "%",
                    Math.cos(angle) * radius + "%",
                  ],
                  y: [
                    Math.sin(angle) * radius + "%",
                    Math.sin(angle) * (radius - 10) + "%",
                    Math.sin(angle) * radius + "%",
                  ],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + (i % 4),
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
                style={{
                  backgroundColor:
                    i % 3 === 0
                      ? "rgba(59, 130, 246, 0.8)"
                      : i % 3 === 1
                        ? "rgba(168, 85, 247, 0.8)"
                        : "rgba(34, 211, 238, 0.8)",
                  boxShadow: `0 0 10px currentColor`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content */}
      <motion.div
        style={{
          opacity: prefersReducedMotion ? 1 : contentOpacity,
          y: contentY,
        }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Badge with glow */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
          }
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-500/40 bg-blue-500/15 backdrop-blur-md mb-8"
          style={{
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)",
          }}
        >
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    rotate: [0, 15, -15, 0],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Sparkles className="h-4 w-4 text-blue-400" aria-hidden="true" />
          </motion.div>
          <span className="text-blue-300 text-sm font-medium">
            Start Free Today
          </span>
        </motion.div>

        {/* Headline with gradient text */}
        <motion.h2
          id="cta-heading"
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 30, filter: "blur(10px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-balance"
        >
          Ready to bring{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            clarity
          </span>{" "}
          to your AI workflows?
        </motion.h2>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Join hundreds of teams who trust Convex Flow to orchestrate, govern,
          and audit their AI workflows with confidence.
        </motion.p>

        {/* CTA Buttons with glow effects */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            className="relative"
          >
            {/* Pulsing glow behind button */}
            {!prefersReducedMotion && (
              <motion.div
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 -z-10 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.5))",
                  filter: "blur(20px)",
                }}
                aria-hidden="true"
              />
            )}
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-2xl transition-all focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 group touch-action-manipulation overflow-hidden"
              asChild
            >
              <Link href="/login?view=signup">
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center">
                  Get Started Free
                  <ArrowRight
                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Button>
          </motion.div>

          <Button
            variant="outline"
            size="lg"
            className="border-slate-500/50 text-white hover:bg-white/10 hover:border-slate-400/50 backdrop-blur-md px-10 py-7 text-lg font-medium rounded-full focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 touch-action-manipulation transition-all"
            asChild
          >
            <Link href="/contact">Talk to Sales</Link>
          </Button>
        </motion.div>

        {/* Trust indicators with animated checkmarks */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          {trustIndicators.map((indicator, i) => (
            <motion.span
              key={indicator}
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-slate-400"
            >
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 1 + i * 0.1,
                  type: "spring",
                  stiffness: 400,
                }}
              >
                <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
              </motion.div>
              {indicator}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
