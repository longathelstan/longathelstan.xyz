"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Stars } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HoverFx } from "@/components/ui/hover-fx";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle color mode"
        className="rounded-md"
      >
        <span className="h-[1.2rem] w-[1.2rem]"></span>
      </Button>
    );
  }

  return (
    <HoverFx glowSize={70} glowOpacity={0.2} glowColor={theme === "dark" ? "var(--primary)" : "var(--accent)"}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle color mode"
        onClick={toggleTheme}
        className="rounded-md relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.div
                key="sun"
                initial={{ y: 20, opacity: 0, rotate: -30 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotate: isHovered ? 30 : 0,
                  scale: isHovered ? 1.2 : 1
                }}
                exit={{ y: -20, opacity: 0, rotate: 30 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: 20, opacity: 0, rotate: 30 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotate: isHovered ? -30 : 0,
                  scale: isHovered ? 1.2 : 1
                }}
                exit={{ y: -20, opacity: 0, rotate: -30 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Background stars animation for dark mode */}
        {theme === "dark" && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 -z-10 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-primary/50"
                    initial={{
                      x: Math.random() * 24 - 12,
                      y: Math.random() * 24 - 12,
                      scale: 0
                    }}
                    animate={{
                      scale: Math.random() * 0.5 + 0.3,
                      opacity: Math.random() * 0.5 + 0.5
                    }}
                    transition={{
                      duration: 0.3 + Math.random() * 0.7,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  >
                    <Stars size={8} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Sun rays animation for light mode */}
        {theme === "light" && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 -z-10 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-accent/70 rounded-full"
                    initial={{
                      width: 1,
                      height: 6,
                      x: -0.5,
                      y: -3,
                      opacity: 0
                    }}
                    animate={{
                      opacity: 0.7,
                      height: [6, 10, 6]
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: 'center',
                      transform: `rotate(${i * 45}deg) translateY(-12px)`
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Button>
    </HoverFx>
  );
}
