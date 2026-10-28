"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "framer-motion";

const BROOM_WIDTH = 44;

/**
 * Reading progress as a small broomstick flying along a thin gold track at the bottom edge of the navbar.
 *
 * The scroll position is measured here (scroll, window resize and a ResizeObserver on <body>), so the broom stays
 * correct when content expands or collapses, when the viewport changes, and for keyboard, touch and anchor
 * navigation alike. Only transforms and opacity are animated, so nothing shifts the layout. With reduced motion
 * the broom simply sits at the real position: no spring, no trail.
 */
export function FlyingBroomProgress() {
  const reduceMotion = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const width = useMotionValue(0);
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 110, damping: 22, mass: 0.7 });
  const value = reduceMotion ? progress : smooth;

  const x = useTransform([value, width], ([p, w]: number[]) => p * Math.max(0, w - BROOM_WIDTH));
  const fill = useTransform(value, (p) => p);
  const speed = useVelocity(smooth);
  const trailOpacity = useTransform(speed, (v) => Math.min(1, Math.abs(v) * 6));

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      if (track.current) width.set(track.current.clientWidth);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [progress, width]);

  return (
    <div ref={track} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px">
      <motion.span
        style={{ scaleX: fill }}
        className="absolute inset-0 origin-left bg-linear-to-r from-gold-700 via-gold-400 to-gold-300 shadow-[0_0_8px_rgb(var(--accent-rgb)/0.7)]"
      />
      <motion.div style={{ x }} className="absolute bottom-0 left-0 h-4 -translate-y-px" >
        <motion.span
          style={{ opacity: trailOpacity }}
          className="absolute right-full top-1/2 h-px w-16 -translate-y-1/2 bg-linear-to-l from-gold-300/80 to-transparent motion-reduce:hidden"
        />
        <svg viewBox="0 0 44 16" width={BROOM_WIDTH} height={16} className="block overflow-visible drop-shadow-[0_0_6px_rgb(var(--accent-rgb)/0.55)]">
          <path d="M1 8 C6 3 12 4 17 7.4 L17 8.6 C12 12 6 13 1 8 Z" fill="#b98a3e" stroke="#7a5522" strokeWidth="0.6" />
          <path d="M4 8 H16 M6 6 L16 7.6 M6 10 L16 8.4" stroke="#7a5522" strokeWidth="0.5" strokeLinecap="round" />
          <rect x="15.5" y="6.2" width="3" height="3.6" rx="0.8" fill="#d6a94a" />
          <path d="M18 8 H43" stroke="#8b5a2b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M20 7.4 H41" stroke="#c4925a" strokeWidth="0.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
