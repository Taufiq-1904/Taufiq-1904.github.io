"use client";

import { motion, useReducedMotion } from "framer-motion";

type CandleSpec = {
  left: string;
  top: string;
  height: number;
  duration: number;
  delay: number;
  hideOnMobile?: boolean;
};

const candles: CandleSpec[] = [
  { left: "7%", top: "20%", height: 92, duration: 7.5, delay: 0 },
  { left: "17%", top: "34%", height: 64, duration: 6.2, delay: 1.2, hideOnMobile: true },
  { left: "29%", top: "13%", height: 76, duration: 8.4, delay: 0.6 },
  { left: "66%", top: "11%", height: 70, duration: 7, delay: 1.8, hideOnMobile: true },
  { left: "80%", top: "30%", height: 98, duration: 8, delay: 0.3 },
  { left: "92%", top: "17%", height: 62, duration: 6.6, delay: 2.1, hideOnMobile: true },
];

function Candle({ spec }: { spec: CandleSpec }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute ${spec.hideOnMobile ? "hidden md:block" : ""}`}
      style={{ left: spec.left, top: spec.top, height: spec.height, aspectRatio: "40 / 96" }}
      animate={reduceMotion ? undefined : { y: [0, -16, 0], rotate: [-1.5, 1.5, -1.5] }}
      transition={{ duration: spec.duration, delay: spec.delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute left-1/2 top-[10%] aspect-square w-[420%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_200_100/0.34),rgb(255_180_80/0.1)_35%,transparent_65%)]"
        animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.65, 0.95, 0.55] }}
        transition={{ duration: 3.2, delay: spec.delay, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 40 96" className="relative size-full overflow-visible">
        <rect x="12" y="44" width="16" height="50" rx="2" fill="url(#candle-wax)" />
        <path d="M12 52 q-1.5 8 2 11 q2.5 -4 2 -11 Z" fill="#e6d8b2" opacity="0.85" />
        <rect x="19.2" y="37" width="1.6" height="9" fill="#2a2018" />
        <motion.path
          d="M20 6 C27 17 28 29 20 40 C12 29 13 17 20 6 Z"
          fill="url(#candle-flame)"
          style={{ originX: 0.5, originY: 1 }}
          animate={
            reduceMotion
              ? undefined
              : { scaleY: [1, 1.1, 0.93, 1.05, 1], scaleX: [1, 0.92, 1.05, 0.97, 1], rotate: [0, 2.5, -2, 1, 0] }
          }
          transition={{ duration: 2.2 + spec.delay * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

export function FloatingCandles() {
  return (
    <div aria-hidden className="absolute inset-0">
      {/* Gradients are defined once and shared by every candle */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="candle-wax" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#cdbd97" />
            <stop offset="0.5" stopColor="#f3ead3" />
            <stop offset="1" stopColor="#b9a87f" />
          </linearGradient>
          <linearGradient id="candle-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f0a030" />
            <stop offset="0.55" stopColor="#ffd877" />
            <stop offset="1" stopColor="#fff6d6" />
          </linearGradient>
        </defs>
      </svg>
      {candles.map((spec) => (
        <Candle key={spec.left} spec={spec} />
      ))}
    </div>
  );
}
