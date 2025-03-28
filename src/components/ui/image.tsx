"use client";

import { useState } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageProps extends NextImageProps {
  className?: string;
}

export function Image({ className, alt, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 bg-muted/30 animate-pulse"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <NextImage
        className={cn("transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        alt={alt}
        loading="lazy"
        quality={90}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
