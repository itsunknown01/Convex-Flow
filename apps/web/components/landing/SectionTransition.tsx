/**
 * Visual transition element between landing sections.
 * Creates a gradient line or spacer to separate content blocks.
 */

interface SectionTransitionProps {
  variant?: "glow" | "fade" | "space";
  className?: string;
}

export default function SectionTransition({
  variant = "glow",
  className = "",
}: SectionTransitionProps) {
  if (variant === "space") {
    return <div className={`h-16 md:h-24 ${className}`} aria-hidden="true" />;
  }

  if (variant === "fade") {
    return (
      <div
        className={`mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  // "glow" default
  return (
    <div className={`relative py-4 ${className}`} aria-hidden="true">
      <div className="glow-line mx-auto max-w-3xl" />
    </div>
  );
}
