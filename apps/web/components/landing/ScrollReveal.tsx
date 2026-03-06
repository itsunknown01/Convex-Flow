"use client";

import { type ReactNode } from "react";
import { useScrollReveal, type RevealDirection } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "article";
}

/**
 * Declarative scroll-reveal wrapper.
 * Wraps children in a div that animates into view on scroll.
 *
 * For staggered children, add `data-reveal-child` to each element.
 */
export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  stagger = 0,
  threshold = 0.2,
  once = true,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    direction,
    delay,
    duration,
    stagger,
    threshold,
    once,
  });

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
