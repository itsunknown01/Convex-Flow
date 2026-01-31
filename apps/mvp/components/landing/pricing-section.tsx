"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useState } from "react";

// Hoisted static data (Vercel best practice: rendering-hoist-jsx)
const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small teams getting started.",
    price: { monthly: 0, annual: 0 },
    features: [
      "3 workflows",
      "100 runs per month",
      "Basic analytics",
      "Community support",
      "API access",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing teams that need more power and flexibility.",
    price: { monthly: 49, annual: 39 },
    features: [
      "Unlimited workflows",
      "10,000 runs per month",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Team collaboration",
      "Audit logs",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description:
      "For organizations with advanced security and compliance needs.",
    price: { monthly: null, annual: null },
    features: [
      "Unlimited everything",
      "Custom run limits",
      "SSO & SAML",
      "Dedicated CSM",
      "SLA guarantee",
      "Custom contracts",
      "On-premise option",
      "Advanced security",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 },
        },
      };

  const cardVariants = prefersReducedMotion
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
    <section
      id="pricing"
      className="relative py-24 lg:py-32 bg-slate-950"
      aria-labelledby="pricing-heading"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div
        className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]"
        aria-hidden="true"
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
          className="text-center mb-12"
        >
          <motion.span
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }
            }
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-blue-400 text-sm font-semibold uppercase tracking-wider px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-4"
          >
            Pricing
          </motion.span>
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance"
          >
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto text-pretty">
            Choose the plan that fits your needs. Upgrade or downgrade at any
            time.
          </p>
        </motion.div>

        {/* Animated Toggle with focus-visible */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              !annual ? "text-white" : "text-slate-500"
            }`}
          >
            Monthly
          </span>

          {/* Animated toggle switch */}
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-16 h-8 rounded-full bg-slate-800 p-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
          >
            {/* Background glow on active */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={false}
              animate={{ opacity: annual ? 1 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            />
            {/* Toggle knob */}
            <motion.div
              className="relative w-6 h-6 rounded-full bg-white shadow-lg"
              initial={false}
              animate={{ x: annual ? 32 : 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 500, damping: 30 }
              }
            />
          </button>

          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              annual ? "text-white" : "text-slate-500"
            }`}
          >
            Annual
            <motion.span
              initial={{ opacity: 0.7 }}
              animate={{ opacity: annual ? 1 : 0.7, scale: annual ? 1 : 0.9 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="ml-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Save 20%
            </motion.span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={cardVariants}
              whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative p-8 rounded-2xl border backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950 ${
                plan.popular
                  ? "border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-purple-500/5"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              {/* Popular Badge with pulse animation */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0.4)",
                              "0 0 0 8px rgba(59, 130, 246, 0)",
                              "0 0 0 0 rgba(59, 130, 246, 0)",
                            ],
                          }
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Most Popular
                  </motion.span>
                </div>
              )}

              {/* Glow effect for popular plan */}
              {plan.popular && (
                <div
                  className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
                  aria-hidden="true"
                />
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {plan.description}
                </p>
              </div>

              {/* Animated Price */}
              <div className="mb-6 h-16">
                {plan.price.monthly !== null ? (
                  <div className="flex items-baseline">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={annual ? "annual" : "monthly"}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, y: -20 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.3 }}
                        className="text-5xl font-bold text-white font-variant-numeric tabular-nums"
                      >
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </motion.span>
                    </AnimatePresence>
                    <span className="ml-2 text-slate-400">/month</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-white">Custom</div>
                )}
                {plan.price.monthly !== null && plan.price.monthly > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: annual ? 1 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    className="text-xs text-green-400 mt-1"
                  >
                    Billed annually ($
                    {(annual ? plan.price.annual : plan.price.monthly) * 12}
                    /year)
                  </motion.p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8" role="list">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, x: -10 }
                    }
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.1 * i }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`p-0.5 rounded-full flex-shrink-0 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-green-500"
                      }`}
                    >
                      <Check
                        className="h-4 w-4 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button with focus-visible */}
              <Button
                className={`w-full py-6 rounded-xl font-medium transition-shadow focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 focus-visible:ring-blue-400"
                    : "bg-slate-800 hover:bg-slate-700 text-white focus-visible:ring-slate-400"
                }`}
                asChild
              >
                <Link
                  href={
                    plan.name === "Enterprise"
                      ? "/contact"
                      : "/login?view=signup"
                  }
                >
                  {plan.cta}
                </Link>
              </Button>
            </motion.article>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 text-sm">
            🔒 Secure payments · 💳 No credit card required for Starter · ✅
            14-day free trial on Pro
          </p>
        </motion.div>
      </div>
    </section>
  );
}
