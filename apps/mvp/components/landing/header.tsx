"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { cn } from "@workspace/ui/lib/utils";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(15, 23, 42, 0)", "rgba(15, 23, 42, 0.9)"],
  );

  const headerBackdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"],
  );

  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(51, 65, 85, 0.5)"],
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      style={{
        backgroundColor: headerBackground,
        backdropFilter: headerBackdropBlur,
        borderBottom: "1px solid",
        borderColor: headerBorder,
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center border border-blue-400/30">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <path d="M10 7h4" />
              <path d="M17 10v4" />
              <path d="M10 17h4" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Convex-Flow
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-white/5 data-[state=open]:bg-white/5 focus:bg-white/5">
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-slate-900 border-slate-800">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-600/20 to-blue-600 no-underline outline-none focus:shadow-md border border-blue-500/20"
                          href="/"
                        >
                          <div className="p-6 mt-auto">
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              Orchestrator
                            </div>
                            <p className="text-sm leading-tight text-blue-100/90">
                              The core engine for managing distributed AI
                              workflows.
                            </p>
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="#" title="Observability">
                      Real-time tracing and debugging for agent chains.
                    </ListItem>
                    <ListItem href="#" title="Policy Engine">
                      Enforce compliance and security rules automatically.
                    </ListItem>
                    <ListItem href="#" title="Human-in-the-Loop">
                      Seamless approval workflows for critical decisions.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-white/5 data-[state=open]:bg-white/5 focus:bg-white/5">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-900 border-slate-800">
                    <ListItem href="#" title="Enterprise">
                      Scalable infrastructure for large organizations.
                    </ListItem>
                    <ListItem href="#" title="Startups">
                      Rapid deployment for fast-moving teams.
                    </ListItem>
                    <ListItem href="#" title="FinTech">
                      Compliance-first automation for finance.
                    </ListItem>
                    <ListItem href="#" title="Healthcare">
                      HIPAA-compliant workflows.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#pricing" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5",
                    )}
                  >
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            asChild
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Link href="/login?view=signin">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 shadow-lg shadow-blue-900/20 border border-blue-500/20"
          >
            <Link href="/login?view=signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-950 border-b border-slate-800 p-6 flex flex-col gap-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Product
            </h3>
            <Link
              href="#"
              className="text-base font-medium text-gray-300 hover:text-white py-2 pl-4 border-l border-gray-800 hover:border-blue-500 transition-colors"
            >
              Orchestrator
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-gray-300 hover:text-white py-2 pl-4 border-l border-gray-800 hover:border-blue-500 transition-colors"
            >
              Observability
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-gray-300 hover:text-white py-2 pl-4 border-l border-gray-800 hover:border-blue-500 transition-colors"
            >
              Policy Engine
            </Link>
          </div>
          <div className="h-px bg-slate-800 my-2" />
          <Button
            variant="ghost"
            asChild
            className="text-gray-300 hover:text-white hover:bg-slate-900 justify-start"
          >
            <Link href="/login?view=signin">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white w-full shadow-lg"
          >
            <Link href="/login?view=signup">Get Started</Link>
          </Button>
        </div>
      )}
    </motion.header>
  );
}

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
  [key: string]: any;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-800 hover:text-accent-foreground focus:bg-slate-800 focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-400">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};
