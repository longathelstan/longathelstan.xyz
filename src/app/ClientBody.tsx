"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface ClientBodyProps {
  children: ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const variants = {
    hidden: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] }
    }
  };

  // Apply a class to the body element for smooth transitions
  useEffect(() => {
    document.body.classList.add("theme-transition");

    // Clean up
    return () => {
      document.body.classList.remove("theme-transition");
    };
  }, []);

  return (
    <body
      suppressHydrationWarning
      className={`${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          className="flex flex-col min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </body>
  );
}
