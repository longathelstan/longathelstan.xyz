"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverFxProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number; // Size of the glow effect in px
  glowOpacity?: number; // Opacity of the glow (0-1)
  disabled?: boolean;
}

export function HoverFx({
  children,
  className,
  glowColor = "var(--accent)",
  glowSize = 60,
  glowOpacity = 0.15,
  disabled = false,
}: HoverFxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Reset position when not hovered to avoid jumpy transitions
  useEffect(() => {
    if (!isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: rect.width / 2,
        y: rect.height / 2,
      });
    }
  }, [isHovered]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      {!disabled && (
        <motion.div
          className="pointer-events-none absolute z-0"
          animate={{
            opacity: isHovered ? glowOpacity : 0,
            scale: isHovered ? 1 : 0.8,
            x: mousePosition.x - glowSize / 2,
            y: mousePosition.y - glowSize / 2,
          }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.3 },
            x: { duration: 0.1, ease: "linear" },
            y: { duration: 0.1, ease: "linear" },
          }}
          style={{
            width: glowSize,
            height: glowSize,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
