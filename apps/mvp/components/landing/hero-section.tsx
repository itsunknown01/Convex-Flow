"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Play, Sparkles, Workflow, Users, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Hoisted static elements (Vercel best practice: rendering-hoist-jsx)
const companyLogos = [
  { name: "TechCorp", icon: Workflow },
  { name: "DataFlow", icon: Zap },
  { name: "AIFirst", icon: Sparkles },
  { name: "CloudScale", icon: Users },
];

const stats = [
  { value: 10000, label: "Workflows Run", suffix: "+" },
  { value: 99.9, label: "Uptime", suffix: "%" },
  { value: 50, label: "Enterprise Clients", suffix: "+" },
];

// Animated counter component
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  shouldAnimate = true,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  shouldAnimate?: boolean;
}) {
  const [count, setCount] = useState(shouldAnimate ? 0 : target);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(target * eased * 10) / 10);
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          animate();
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, hasAnimated, shouldAnimate]);

  return (
    <span ref={ref} className="font-variant-numeric tabular-nums">
      {Number.isInteger(target) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

/**
 * Hero Section - Premium animated introduction with background image.
 * Follows Vercel Web Interface Guidelines for accessibility and motion.
 */
export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Disable parallax for reduced motion
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "50%"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5],
    [1, prefersReducedMotion ? 1 : 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5],
    [1, prefersReducedMotion ? 1 : 1.1],
  );

  // Animation settings respecting reduced motion
  const fadeInUp = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="" // Decorative image
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-slate-950/70" />
      </motion.div>

      {/* Animated Gradient Effects - hidden for reduced motion */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 z-[1] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          {/* Animated Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[100px]"
          />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                top: `${20 + i * 12}%`,
                left: `${10 + i * 15}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm text-blue-400 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Enterprise AI Workflow Platform
          </span>
        </motion.div>

        {/* Headline - text-wrap: balance for better typography */}
        <motion.h1
          {...fadeInUp}
          transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.4 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
        >
          <span className="text-white drop-shadow-lg">
            Orchestrate AI Agents
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            with Confidence
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.6 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty"
        >
          Run, govern, and audit AI-driven workflows with full explainability,
          policy control, and human-in-the-loop governance.
        </motion.p>

        {/* CTA Buttons with focus-visible states */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-base font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 group"
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
            className="border-slate-600 text-white hover:bg-slate-800/80 backdrop-blur-sm px-8 py-6 text-base font-medium rounded-xl focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 group"
          >
            <Play
              className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 1 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  shouldAnimate={!prefersReducedMotion}
                />
              </div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 1.2 }}
          className="mt-12 flex flex-col items-center"
        >
          <p className="text-slate-400 text-sm mb-4">
            Trusted by innovative teams
          </p>
          <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
            {companyLogos.map((company) => (
              <motion.div
                key={company.name}
                whileHover={
                  prefersReducedMotion ? {} : { scale: 1.1, opacity: 1 }
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 opacity-70 hover:border-white/20 hover:opacity-100 transition-opacity"
              >
                <company.icon
                  className="h-5 w-5 text-slate-300"
                  aria-hidden="true"
                />
                <span className="text-sm text-slate-300 font-medium">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - hidden for reduced motion */}
      {!prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center text-slate-400"
          >
            <span className="text-xs mb-2 uppercase tracking-wider">
              Scroll
            </span>
            <div className="w-5 h-8 border-2 border-slate-500 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-2 bg-slate-400 rounded-full mt-1"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
