"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Workflow,
  Shield,
  Users,
  BarChart3,
  Zap,
  Lock,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

// Hoisted static data (Vercel best practice: rendering-hoist-jsx)
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconGradient: string;
  href: string;
}

const features: Feature[] = [
  {
    icon: Workflow,
    title: "AI Orchestration",
    description:
      "Visually design and deploy complex AI agent workflows with drag-and-drop simplicity.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-400 to-cyan-400",
    href: "#features",
  },
  {
    icon: Shield,
    title: "Policy Engine",
    description:
      "Enforce compliance rules and security policies automatically across all workflows.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconGradient: "from-purple-400 to-pink-400",
    href: "#features",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description:
      "Seamless approval workflows for critical decisions requiring human oversight.",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconGradient: "from-green-400 to-emerald-400",
    href: "#features",
  },
  {
    icon: BarChart3,
    title: "Audit Trail",
    description:
      "Complete traceability with detailed logs of every decision and action.",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconGradient: "from-orange-400 to-amber-400",
    href: "#features",
  },
  {
    icon: Zap,
    title: "Real-time Execution",
    description:
      "Lightning-fast workflow execution with live monitoring and instant alerts.",
    gradient: "from-yellow-500/20 to-lime-500/20",
    iconGradient: "from-yellow-400 to-lime-400",
    href: "#features",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant infrastructure with end-to-end encryption and SSO support.",
    gradient: "from-red-500/20 to-rose-500/20",
    iconGradient: "from-red-400 to-rose-400",
    href: "#features",
  },
];

function FeatureCard({
  feature,
  prefersReducedMotion,
}: {
  feature: Feature;
  prefersReducedMotion: boolean | null;
}) {
  const Icon = feature.icon;

  const itemVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        },
      };

  return (
    <motion.article
      variants={itemVariants}
      whileHover={prefersReducedMotion ? {} : { y: -5, scale: 1.02 }}
      className="group relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950"
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-2xl bg-slate-900/90" />
      </div>

      {/* Hover gradient fill */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={
            prefersReducedMotion ? {} : { rotate: [0, -10, 10, 0], scale: 1.1 }
          }
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconGradient} mb-4 shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
          {feature.description}
        </p>

        {/* Learn more link - proper anchor */}
        <Link
          href={feature.href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus-visible:outline-none"
        >
          Learn more
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}

export function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      };

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-slate-950">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950"
        aria-hidden="true"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }
            }
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-blue-400 text-sm font-semibold uppercase tracking-wider px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-4"
          >
            Features
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance">
            Everything you need to manage AI
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto text-pretty">
            A complete platform for building, deploying, and governing AI
            workflows at enterprise scale.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400">
            Want to see all features?{" "}
            <Link
              href="#pricing"
              className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
            >
              View full feature list
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
