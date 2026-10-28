import type { CSSProperties } from "react";

/** Hand-drawn Elder Futhark strokes, so the runes render identically on every device (no font needed). */
const GLYPHS = {
  fehu: "M6 30V2M6 10L18 2M6 19L18 11",
  uruz: "M6 30V2L18 10V30",
  ansuz: "M6 30V2L18 10M6 12L18 20",
  raidho: "M6 30V2L18 9L6 16L18 30",
  kenaz: "M18 6L8 16L18 26",
  gebo: "M6 4L18 28M18 4L6 28",
  wunjo: "M6 30V2L18 9L6 16",
  isa: "M12 2V30",
  sowilo: "M16 2L8 12L16 20L8 30",
  algiz: "M12 30V2M12 14L4 4M12 14L20 4",
  tiwaz: "M12 30V2L5 10M12 2L19 10",
  berkano: "M6 30V2L16 9L6 16L16 23L6 30",
  ingwaz: "M12 4L20 16L12 28L4 16Z",
  dagaz: "M5 4L19 28V4L5 28Z",
} as const;

export type RuneName = keyof typeof GLYPHS;

export const RUNE_NAMES = Object.keys(GLYPHS) as RuneName[];

type RuneProps = {
  name: RuneName;
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
};

/** A rune centred on (x, y). A wide faint stroke underneath stands in for a glow. */
export function Rune({ name, x, y, size = 1, rotate = 0, className, style }: RuneProps) {
  return (
    <g
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate.toFixed(1)}) scale(${size}) translate(-12 -16)`}
      className={className}
      style={style}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={GLYPHS[name]} stroke="#f6dc8e" strokeOpacity={0.28} strokeWidth={5.5} />
      <path d={GLYPHS[name]} stroke="#f6dc8e" strokeWidth={2.2} />
    </g>
  );
}

/** A single free-floating rune as its own SVG, for the drifting particles layer. */
export function FloatingRuneGlyph({ name, className, style }: { name: RuneName; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 32" aria-hidden className={className} style={style} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={GLYPHS[name]} stroke="#f6dc8e" strokeOpacity={0.3} strokeWidth={5} />
      <path d={GLYPHS[name]} stroke="#f6dc8e" strokeWidth={2} />
    </svg>
  );
}
