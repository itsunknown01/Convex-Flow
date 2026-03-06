import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Syne } from "next/font/google";
import "@workspace/ui/globals.css";
import "./landing.css";
import { Providers } from "@/components/providers";
import { GsapProvider } from "@/components/gsap-provider";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Convex-Flow — Enterprise AI Workflow Automation",
  description:
    "Automate AI agent workflows with explainability, policy-driven control, and human-in-the-loop governance. Safe, auditable automation at scale.",
  keywords: [
    "AI workflow automation",
    "enterprise AI",
    "explainable AI",
    "human-in-the-loop",
    "AI governance",
    "policy-driven automation",
  ],
  openGraph: {
    title: "Convex-Flow — Enterprise AI Workflow Automation",
    description:
      "Safe, auditable AI automation at scale with policy control and human governance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
        style={{
          background: "var(--landing-bg)",
          color: "var(--landing-text-primary)",
        }}
      >
        <Providers>
          <GsapProvider>
            <div className="landing-noise landing-grid-bg relative min-h-screen">
              <Navbar />
              <main>{children}</main>
              <Footer />
            </div>
          </GsapProvider>
        </Providers>
      </body>
    </html>
  );
}
