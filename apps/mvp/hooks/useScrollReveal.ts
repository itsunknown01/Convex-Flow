"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/common/gsap-provider";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface UseScrollRevealOptions {
  direction?: RevealDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  once?: boolean;
  scrub?: boolean | number;
}

const DIRECTION_MAP: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const {
    direction = "up",
    distance,
    delay = 0,
    duration = 0.8,
    stagger = 0,
    threshold = 0.2,
    once = true,
    scrub = false,
  } = options;

  const ref = useRef<T>(null);
  const { isReady, prefersReducedMotion } = useGsapContext();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    if (prefersReducedMotion) {
      gsap.set(ref.current, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const offset = DIRECTION_MAP[direction];
    const fromX = distance
      ? offset.x > 0
        ? distance
        : offset.x < 0
          ? -distance
          : 0
      : offset.x;
    const fromY = distance
      ? offset.y > 0
        ? distance
        : offset.y < 0
          ? -distance
          : 0
      : offset.y;

    const ctx = gsap.context(() => {
      const children =
        stagger > 0
          ? ref.current!.querySelectorAll("[data-reveal-child]")
          : null;

      const target = children && children.length > 0 ? children : ref.current;

      gsap.fromTo(
        target!,
        { opacity: 0, x: fromX, y: fromY },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: `top ${100 - threshold * 100}%`,
            end: scrub ? `bottom ${50}%` : undefined,
            scrub: scrub,
            toggleActions: once
              ? "play none none none"
              : "play none none reverse",
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [
    isReady,
    prefersReducedMotion,
    direction,
    distance,
    delay,
    duration,
    stagger,
    threshold,
    once,
    scrub,
  ]);

  return ref;
}
