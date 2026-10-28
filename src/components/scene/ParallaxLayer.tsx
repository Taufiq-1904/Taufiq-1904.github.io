"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

type ParallaxLayerProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** Pixels of travel at the screen edge. Negative values move against the pointer. */
  depth: number;
  /** Scroll progress through the hero (0 to 1). Layers drift upward by this many pixels at the end. */
  scrollProgress?: MotionValue<number>;
  /** How far, in pixels, the layer moves down as the hero scrolls away. Nearer layers move more. */
  scrollTravel?: number;
  children: ReactNode;
};

export function ParallaxLayer({
  pointerX,
  pointerY,
  depth,
  scrollProgress,
  scrollTravel = 0,
  children,
}: ParallaxLayerProps) {
  const x = useTransform(pointerX, (v) => v * depth);
  const y = useTransform([pointerY, scrollProgress ?? pointerY], ([py, sp]: number[]) =>
    scrollProgress ? py * depth * 0.5 + sp * scrollTravel : py * depth * 0.5,
  );

  // The negative inset hides the edges while the layer slides around.
  return (
    <motion.div aria-hidden className="pointer-events-none absolute -inset-[3%] will-change-transform" style={{ x, y }}>
      {children}
    </motion.div>
  );
}
