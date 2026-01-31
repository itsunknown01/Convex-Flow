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
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * CinematicCTA - Elegant closing section with convergence visual
 * and clear conversion goal.
 */
export function CinematicCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // Content reveal
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.5],
    prefersReducedMotion ? [0, 0] : [60, 0],
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.6],
    prefersReducedMotion ? [1, 1] : [1.1, 1],
  );

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background convergence image */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/landing/convergence.png"
          alt=""
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_70%,rgba(2,6,23,1)_100%)]" />
      </motion.div>

      {/* Animated particles */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          aria-hidden="true"
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 bg-blue-400/50 rounded-full"
              style={{
                top: `${20 + (i % 6) * 12}%`,
                left: `${10 + i * 7}%`,
              }}
            />
          ))}
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
        {/* Badge */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }
          }
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-8"
        >
          <Sparkles className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span className="text-blue-400 text-sm font-medium">
            Start Free Today
          </span>
        </motion.div>

        {/* Headline */}
        <h2
          id="cta-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance"
        >
          Ready to bring{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            clarity
          </span>{" "}
          to your AI workflows?
        </h2>

        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of teams who trust Convex Flow to orchestrate, govern,
          and audit their AI workflows with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 group"
            asChild
          >
            <Link href="/login?view=signup">
              Get Started Free
              <ArrowRight
                className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-slate-600 text-white hover:bg-slate-800/80 backdrop-blur-sm px-10 py-7 text-lg font-medium rounded-full focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            asChild
          >
            <Link href="/contact">Talk to Sales</Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            14-day free trial
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Cancel anytime
          </span>
        </div>
      </motion.div>
    </section>
  );
}
