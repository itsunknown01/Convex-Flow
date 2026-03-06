"use client";

import {
  useEffect,
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapContextValue {
  isReady: boolean;
  prefersReducedMotion: boolean;
}

const GsapContext = createContext<GsapContextValue>({
  isReady: false,
  prefersReducedMotion: false,
});

export const useGsapContext = () => useContext(GsapContext);

export function GsapProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        // Kill all active GSAP animations when user enables reduced motion
        gsap.globalTimeline.clear();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      }
    };
    mq.addEventListener("change", handler);

    // Configure GSAP defaults for performance
    gsap.defaults({
      ease: "power2.out",
      duration: 0.8,
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    });

    setIsReady(true);

    return () => {
      mq.removeEventListener("change", handler);
      // Cleanup all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <GsapContext.Provider value={{ isReady, prefersReducedMotion }}>
      {children}
    </GsapContext.Provider>
  );
}
