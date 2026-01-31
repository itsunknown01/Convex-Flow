"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollSectionProps {
  children: (scrollProgress: MotionValue<number>) => ReactNode;
  className?: string;
  offset?: ["start" | "center" | "end", "start" | "center" | "end"];
}

/**
 * ScrollSection - A wrapper that provides scroll progress (0-1) to children.
 * Tracks the element's position relative to the viewport.
 */
export function ScrollSection({
  children,
  className = "",
  offset = ["start", "end"],
}: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${offset[0]} end`, `${offset[1]} start`],
  });

  // For reduced motion, provide a static value
  const staticProgress = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const progress = prefersReducedMotion ? staticProgress : scrollYProgress;

  return (
    <div ref={ref} className={className}>
      {children(progress)}
    </div>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number; // 0 = no movement, 1 = normal, negative = opposite
  className?: string;
  scrollProgress: MotionValue<number>;
}

/**
 * ParallaxLayer - Creates parallax depth effect based on scroll progress.
 * Speed controls how much the layer moves relative to scroll.
 */
export function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
  scrollProgress,
}: ParallaxLayerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Calculate parallax offset: speed of 0.5 means moves at half the rate
  const y = useTransform(
    scrollProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : [`${-speed * 20}%`, `${speed * 20}%`],
  );

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface FadeRevealProps {
  children: ReactNode;
  scrollProgress: MotionValue<number>;
  className?: string;
  start?: number; // 0-1, when to start fading in
  end?: number; // 0-1, when to be fully visible
  direction?: "up" | "down" | "left" | "right" | "none";
}

/**
 * FadeReveal - Fades and slides content based on scroll progress.
 */
export function FadeReveal({
  children,
  scrollProgress,
  className = "",
  start = 0,
  end = 0.5,
  direction = "up",
}: FadeRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);

  const translateValue = prefersReducedMotion ? 0 : 50;
  const translateMap = {
    up: { x: [0, 0], y: [translateValue, 0] },
    down: { x: [0, 0], y: [-translateValue, 0] },
    left: { x: [translateValue, 0], y: [0, 0] },
    right: { x: [-translateValue, 0], y: [0, 0] },
    none: { x: [0, 0], y: [0, 0] },
  };

  const activeDirection = direction || "up";

  const x = useTransform<number, number>(
    scrollProgress,
    [start, end],
    translateMap[activeDirection].x,
  );
  const y = useTransform<number, number>(
    scrollProgress,
    [start, end],
    translateMap[activeDirection].y,
  );

  return (
    <motion.div
      style={{ opacity: prefersReducedMotion ? 1 : opacity, x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScaleRevealProps {
  children: ReactNode;
  scrollProgress: MotionValue<number>;
  className?: string;
  start?: number;
  end?: number;
  initialScale?: number;
}

/**
 * ScaleReveal - Scales content based on scroll progress.
 */
export function ScaleReveal({
  children,
  scrollProgress,
  className = "",
  start = 0,
  end = 0.5,
  initialScale = 0.8,
}: ScaleRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const scale = useTransform(
    scrollProgress,
    [start, end],
    prefersReducedMotion ? [1, 1] : [initialScale, 1],
  );
  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);

  return (
    <motion.div
      style={{
        scale,
        opacity: prefersReducedMotion ? 1 : opacity,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
