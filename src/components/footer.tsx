"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="border-t border-border bg-card/50 py-6 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="container flex max-w-6xl items-center justify-center px-4">
        <motion.p
          className="flex items-center text-sm text-muted-foreground"
          whileHover={{ scale: 1.02 }}
        >
          © {currentYear} longathelstan. Built with{" "}
          <motion.span
            className="inline-flex items-center mx-1"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <Heart className="h-3 w-3 mx-1 text-red-500" />
          </motion.span>
          {" "}and Next.js
        </motion.p>
      </div>
    </motion.footer>
  );
}
