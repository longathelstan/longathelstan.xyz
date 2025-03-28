import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HoverFx } from "./hover-fx";

export interface SocialButtonProps extends React.ComponentPropsWithoutRef<"a"> {
  icon: React.ReactNode;
  title: string;
}


const SocialButton = React.forwardRef<HTMLAnchorElement, SocialButtonProps>(
  ({ className, icon, title, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <HoverFx glowSize={80} glowOpacity={0.2}>
        <motion.a
          ref={ref}
          className={cn(
            "relative overflow-hidden p-2 rounded-xl text-foreground bg-transparent group/social flex items-center justify-center transition-all duration-300",
            className
          )}
          
          whileHover={{
            scale: 1.15,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 10
            }
          }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          aria-label={title}
          title={title}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 z-0 bg-accent"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: "animate",
                    delay: 0.1,
                    stiffness: 300,
                    damping: 20,
                    duration: 0.2,
                  }
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: {
                    duration: 0.15,
                  }
                }}
                style={{
                  borderRadius: "1rem",
                }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative z-10"
            animate={{
              color: isHovered ? "var(--accent-foreground)" : "currentColor",
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        </motion.a>
      </HoverFx>
    );
  }
);

SocialButton.displayName = "SocialButton";

export { SocialButton };
