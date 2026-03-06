import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/header";
import { FooterSection } from "@/components/landing/footer-section";
import { GsapProvider } from "@/components/common/gsap-provider";

export const metadata: Metadata = {
  title: "Convex-Flow | Enterprise AI Workflow Automation",
  description:
    "Orchestrate AI agents with confidence. Full explainability, policy control, and human-in-the-loop governance.",
};

/**
 * Landing page layout - no sidebar, full-width cinematic experience.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GsapProvider>
      <LandingHeader />
      {children}
      <FooterSection />
    </GsapProvider>
  );
}
