import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  glowOnHover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, hoverLift = false, glowOnHover = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverLift ? { y: -5 } : {}}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "glass-card rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group",
          glowOnHover && "hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)]",
          className
        )}
        {...props}
      >
        {glowOnHover && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
