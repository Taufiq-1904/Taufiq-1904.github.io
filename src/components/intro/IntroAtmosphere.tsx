"use client";

import type { CSSProperties } from "react";

import { motion, type Variants } from "framer-motion";
import { mulberry32 } from "@/lib/random";
import { FloatingCandles } from "@/components/scene/FloatingCandles";
import { ForegroundLayer } from "@/components/scene/ForegroundLayer";
import { MagicParticles } from "@/components/scene/MagicParticles";
import { SkyLayer } from "@/components/scene/SkyLayer";
import { RUNE_NAMES, FloatingRuneGlyph } from "./Runes";

const easeCamera: [number, number, number, number] = [0.55, 0, 0.3, 1];

// Layers at different depths travel different distances, which is what sells the camera move.
const farVariants: Variants = {
  idle: { scale: 1 },
  opening: { scale: 1.7, transition: { delay: 1, duration: 2.9, ease: easeCamera } },
};

const nearVariants: Variants = {
  idle: { scale: 1 },
  opening: { scale: 3, transition: { delay: 1, duration: 2.9, ease: easeCamera } },
};

const rand = mulberry32(21);
const floatingRunes = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  name: RUNE_NAMES[(i * 3) % RUNE_NAMES.length],
  left: 4 + rand() * 90,
  top: 18 + rand() * 62,
  size: 14 + rand() * 14,
  delay: rand() * 10,
  duration: 9 + rand() * 6,
}));

/** Everything around the gate: sky, trees, fog, floating candles, golden motes and drifting runes. */
export function IntroAtmosphere() {
  return (
    <>
      {/* Far layers: moonlit sky and the dark tree line */}
      <motion.div
        aria-hidden
        variants={farVariants}
        className="absolute inset-0"
        style={{ originX: 0.5, originY: 0.55 }}
      >
        <SkyLayer />
        <div className="absolute inset-0">
          <ForegroundLayer />
        </div>
        <div className={`ig-fog ig-fogFar`} />
      </motion.div>

      {/* Near layers: candles, fog and runes in front of the gate */}
      <motion.div
        aria-hidden
        variants={nearVariants}
        className="pointer-events-none absolute inset-0 z-20"
        style={{ originX: 0.5, originY: 0.55 }}
      >
        {/* Candles fade out near the top so they never drift behind the title */}
        <div
          className="absolute inset-0 [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,transparent_15%,black_32%)] [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_15%,black_32%)]"
        >
          <FloatingCandles />
        </div>
        {floatingRunes.map((r) => (
          <FloatingRuneGlyph
            key={r.id}
            name={r.name}
            className="ig-floatRune"
            style={
              {
                left: `${r.left}%`,
                top: `${r.top}%`,
                width: r.size,
                height: r.size * (32 / 24),
                "--delay": `${r.delay.toFixed(1)}s`,
                "--dur": `${r.duration.toFixed(1)}s`,
              } as CSSProperties
            }
          />
        ))}
        <div className={`ig-fog ig-fogNear`} />
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        <MagicParticles count={70} />
      </div>

      {/* Vignette keeps the eye on the gate and the copy readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_50%_55%,transparent_40%,rgb(5_4_10/0.72)_100%)]"
      />
    </>
  );
}
