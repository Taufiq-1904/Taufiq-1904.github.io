import { mulberry32 } from "@/lib/random";

/**
 * A thin astronomical diagram: concentric rings, degree ticks, a crossing ecliptic, a few marked stars.
 * Original linework, drawn in code. Used faintly behind Ravenclaw's backdrop and hero.
 * Everything is computed from fixed numbers, so server and client render the same markup.
 */
// Rounded so the server and the browser print identical numbers (no hydration mismatch).
const round = (n: number) => Math.round(n * 100) / 100;

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180;
  const long = i % 6 === 0;
  const r1 = 186;
  const r2 = long ? 172 : 179;
  return {
    key: i,
    x1: round(200 + Math.cos(a) * r1),
    y1: round(200 + Math.sin(a) * r1),
    x2: round(200 + Math.cos(a) * r2),
    y2: round(200 + Math.sin(a) * r2),
    long,
  };
});

const rand = mulberry32(31);
const STARS = Array.from({ length: 9 }, (_, i) => {
  const a = rand() * Math.PI * 2;
  const r = 40 + rand() * 120;
  return { key: i, x: round(200 + Math.cos(a) * r), y: round(200 + Math.sin(a) * r), s: 1.6 + rand() * 1.8 };
});

export function AstroRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className={className} fill="none" stroke="currentColor" strokeLinecap="round">
      <circle cx="200" cy="200" r="196" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="168" strokeWidth="0.8" />
      <circle cx="200" cy="200" r="120" strokeWidth="0.8" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="64" strokeWidth="0.8" />
      {TICKS.map((t) => (
        <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={t.long ? 1.4 : 0.7} />
      ))}
      <ellipse cx="200" cy="200" rx="168" ry="62" transform="rotate(-23.4 200 200)" strokeWidth="0.9" />
      <path d="M200 4v392M4 200h392" strokeWidth="0.5" strokeDasharray="1 5" />
      {STARS.map((s) => (
        <g key={s.key} fill="currentColor" stroke="none">
          <circle cx={s.x} cy={s.y} r={s.s} />
          <path d={`M${s.x} ${s.y - s.s * 3.2}L${s.x + s.s * 0.5} ${s.y}L${s.x} ${s.y + s.s * 3.2}L${s.x - s.s * 0.5} ${s.y}Z`} opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}
