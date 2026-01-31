"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

// Hoisted static data (Vercel best practice: rendering-hoist-jsx)
const testimonials = [
  {
    id: 1,
    quote:
      "Convex Flow transformed how we manage our AI workflows. The human-in-the-loop governance gives us the confidence to deploy AI at scale.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    avatar: "SC",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "The audit trail and policy engine are game-changers. We passed our SOC 2 audit with flying colors thanks to the complete traceability.",
    author: "Michael Rivera",
    role: "Chief Compliance Officer",
    company: "FinanceFlow",
    avatar: "MR",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "We reduced our workflow deployment time by 80%. The visual designer makes it easy for our team to build and iterate quickly.",
    author: "Emily Watson",
    role: "Head of AI",
    company: "DataScale",
    avatar: "EW",
    rating: 5,
  },
  {
    id: 4,
    quote:
      "The real-time monitoring and instant alerts have saved us countless hours. We catch issues before they become problems.",
    author: "James Park",
    role: "DevOps Lead",
    company: "CloudFirst",
    avatar: "JP",
    rating: 5,
  },
];

const statsData = [
  { value: "500+", label: "Companies" },
  { value: "10M+", label: "Workflows Run" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "4.9/5", label: "Customer Rating" },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  }, []);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    goToNext();
  }, [goToNext]);

  // Auto-rotate testimonials (disabled for reduced motion)
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, prefersReducedMotion, goToNext]);

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section
      className="relative py-24 lg:py-32 bg-slate-950 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div
        className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
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
          <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2
            id="testimonials-heading"
            className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance"
          >
            Loved by engineering teams
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto text-pretty">
            See what leaders at innovative companies say about Convex Flow.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          {/* Main testimonial card */}
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.figure
                key={activeIndex}
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -50 }
                }
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm"
                role="group"
                aria-roledescription="slide"
                aria-label={`${activeIndex + 1} of ${testimonials.length}`}
              >
                {/* Quote icon */}
                <Quote
                  className="absolute top-6 left-6 h-10 w-10 text-purple-500/20"
                  aria-hidden="true"
                />

                {/* Stars */}
                <div
                  className="flex gap-1 mb-6"
                  role="img"
                  aria-label={`${currentTestimonial?.rating ?? 5} out of 5 stars`}
                >
                  {[...Array(currentTestimonial?.rating ?? 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote - using curly quotes */}
                <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8">
                  "{currentTestimonial?.quote}"
                </blockquote>

                {/* Author */}
                <figcaption className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg"
                    aria-hidden="true"
                  >
                    {currentTestimonial?.avatar}
                  </div>
                  <div>
                    <cite className="font-semibold text-white not-italic">
                      {currentTestimonial?.author}
                    </cite>
                    <div className="text-slate-400 text-sm">
                      {currentTestimonial?.role} at{" "}
                      {currentTestimonial?.company}
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Navigation arrows with focus-visible */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Dots indicator */}
          <div
            className="flex justify-center gap-2 mt-8"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(index);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none ${
                  index === activeIndex
                    ? "bg-purple-500 w-8"
                    : "bg-slate-600 hover:bg-slate-500 w-2.5"
                }`}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {statsData.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-variant-numeric tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
