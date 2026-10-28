"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Slide in from the side instead of rising. */
  x?: number;
  /** Start slightly smaller and grow into place. */
  scale?: number;
  className?: string;
};

/** Fades and slides content in once, the first time it scrolls into view. */
export function Reveal({ children, delay = 0, y = 24, x = 0, scale = 1, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  );
}
