"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ThemeSwitch from "./theme-switch";
import { motion } from "framer-motion";

export default function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
   // { href: "https://git.necron.dev", label: "Git", external: true },
  ];

  return (
    <motion.header
      className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container flex h-16 max-w-6xl items-center justify-between px-4">
        <nav role="navigation" className="flex items-center gap-1" data-swup-preload-all="">
          {navLinks.map((link, index) => (
            link.external ? (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md flex items-center"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(var(--muted), 0.2)"
                }}
                transition={{ duration: 0.2 }}
              >
                {link.label} <ExternalLink className="ml-1 h-4 w-4" />
              </motion.a>
            ) : (
              <motion.div key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md inline-block"
                >
                  <motion.span
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(var(--muted), 0.2)"
                    }}
                    className="inline-block w-full h-full px-1"
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              </motion.div>
            )
          ))}
        </nav>
        <ThemeSwitch />
      </div>
    </motion.header>
  );
}
