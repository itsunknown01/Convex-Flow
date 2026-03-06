import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Security", href: "#trust" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status", href: "#" },
  ],
} as const;

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/[0.06] bg-[var(--landing-bg)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="2"
                  width="10"
                  height="10"
                  rx="2"
                  fill="url(#fg)"
                  opacity="0.9"
                />
                <rect
                  x="16"
                  y="2"
                  width="10"
                  height="10"
                  rx="2"
                  fill="url(#fg)"
                  opacity="0.5"
                />
                <rect
                  x="2"
                  y="16"
                  width="10"
                  height="10"
                  rx="2"
                  fill="url(#fg)"
                  opacity="0.5"
                />
                <rect
                  x="16"
                  y="16"
                  width="10"
                  height="10"
                  rx="2"
                  fill="url(#fg)"
                  opacity="0.7"
                />
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              Convex
              <span className="text-[var(--landing-accent-blue)]">Flow</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-[var(--landing-text-muted)]">
              Enterprise AI workflow automation with explainability, policy
              control, and human-in-the-loop governance.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white">{heading}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--landing-text-muted)] transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-xs text-[var(--landing-text-muted)]">
            &copy; {new Date().getFullYear()} Convex-Flow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-[var(--landing-text-muted)] hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-[var(--landing-text-muted)] hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
