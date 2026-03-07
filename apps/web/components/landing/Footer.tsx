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
                <path
                  d="M 14 0 L 26.12 7 L 26.12 21 L 14 28 L 1.88 21 L 1.88 7 Z"
                  fill="url(#fg)"
                />
                <path
                  d="M 14 5.5 L 21.36 9.75 L 21.36 18.25 L 14 22.5 L 6.64 18.25 L 6.64 9.75 Z"
                  fill="#0f172a"
                />
                <circle cx="14" cy="14" r="2.5" fill="#f8fafc" />
                <circle cx="14" cy="5.5" r="1.5" fill="#f8fafc" />
                <circle cx="6.64" cy="18.25" r="1.5" fill="#f8fafc" />
                <circle cx="21.36" cy="18.25" r="1.5" fill="#f8fafc" />
                <path
                  d="M 14 11.5 L 14 7"
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 12 15 L 8 17.5"
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 16 15 L 20 17.5"
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="fg"
                    x1="0"
                    y1="28"
                    x2="28"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#9333ea" />
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
