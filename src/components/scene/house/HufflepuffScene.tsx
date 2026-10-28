import type { CSSProperties } from "react";
import { mulberry32 } from "@/lib/random";

/**
 * Hufflepuff's hero: ivy hanging from the glass roof, swaying lanterns, a few slow leaves and golden
 * feathers. Warm, soft and unhurried; deliberately few moving parts.
 */

/** Point on a cubic Bézier, rounded so server and client write identical strings. */
function bez(t: number, p: readonly number[]) {
  const u = 1 - t;
  const x = u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6];
  const y = u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7];
  return [x, y] as const;
}

type Vine = { stem: string; leaves: { key: number; x: string; y: string; rot: string; scale: string; tone: number }[] };

function makeVine(points: readonly number[], count: number, seed: number): Vine {
  const rand = mulberry32(seed);
  const stem = `M${points[0]} ${points[1]}C${points[2]} ${points[3]} ${points[4]} ${points[5]} ${points[6]} ${points[7]}`;
  const leaves = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.6) / (count + 0.4);
    const [x, y] = bez(t, points);
    const side = i % 2 === 0 ? 1 : -1;
    return {
      key: i,
      x: x.toFixed(1),
      y: y.toFixed(1),
      rot: (side * (28 + rand() * 40) + 90).toFixed(0),
      scale: (0.8 + rand() * 0.7 + (1 - t) * 0.25).toFixed(2),
      tone: Math.floor(rand() * 3),
    };
  });
  return { stem, leaves };
}

const LEAF_FILL = ["#65744a", "#7e8f58", "#4d5c36"] as const;
const LEAF_PATH = "M0 0C7-9 20-8 26 0C20 8 7 9 0 0Z";

const VINES_LEFT = [
  makeVine([20, 0, 70, 120, -10, 220, 44, 360], 11, 5),
  makeVine([90, 0, 130, 70, 100, 150, 130, 230], 7, 9),
];
const VINES_RIGHT = [
  makeVine([380, 0, 330, 130, 410, 240, 360, 380], 11, 14),
  makeVine([310, 0, 270, 60, 300, 140, 270, 200], 6, 21),
];

function Ivy({ vines, className }: { vines: Vine[]; className?: string }) {
  return (
    <svg viewBox="0 0 420 400" aria-hidden className={className} fill="none">
      {vines.map((v, i) => (
        <g key={i}>
          <path d={v.stem} stroke="#3d4a2b" strokeWidth="3" strokeLinecap="round" />
          {v.leaves.map((l) => (
            <path
              key={l.key}
              d={LEAF_PATH}
              fill={LEAF_FILL[l.tone]}
              transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.scale})`}
              opacity="0.95"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

function Lantern({ className, delay }: { className?: string; delay?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 70 170" aria-hidden className="w-full overflow-visible">
        <path d="M35 0V58" stroke="#6b5230" strokeWidth="2" />
        <circle cx="35" cy="100" r="58" fill="url(#hf-glow)" className="glow-pulse" style={{ animationDelay: delay }} />
        <path d="M26 58h18l3 8H23Z" fill="#3a2a14" />
        <path d="M22 66h26l5 6v44l-5 6H22l-5-6V72Z" fill="#fff0c0" fillOpacity="0.28" stroke="#d5a928" strokeWidth="2" />
        <path d="M35 72c6 8 8 18 0 30c-8-12-6-22 0-30Z" fill="#ffd877" className="flame-flick" />
        <path d="M22 66V122M48 66V122" stroke="#d5a928" strokeWidth="1" opacity="0.7" />
        <path d="M20 122h30l-4 8H24Z" fill="#3a2a14" />
      </svg>
    </div>
  );
}

export function HufflepuffArchitecture() {
  return (
    <div className="absolute inset-0">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <radialGradient id="hf-glow">
            <stop offset="0" stopColor="#ffe5a1" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="#f5c93a" stopOpacity="0.2" />
            <stop offset="1" stopColor="#d5a928" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hf-feather" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff2c4" />
            <stop offset="1" stopColor="#d5a928" />
          </linearGradient>
        </defs>
      </svg>
      <Ivy vines={VINES_LEFT} className="sway-slow absolute -left-2 -top-2 hidden w-[clamp(180px,24vw,380px)] sm:block" />
      <Ivy vines={VINES_RIGHT} className="sway absolute -right-2 -top-2 hidden w-[clamp(180px,24vw,380px)] sm:block" />
      <Lantern className="sway absolute left-[30%] top-0 hidden w-[clamp(34px,3.6vw,58px)] md:block" />
      <Lantern className="sway-slow absolute right-[31%] top-0 hidden w-[clamp(34px,3.6vw,58px)] md:block" delay="-2s" />
      <Lantern className="sway absolute left-[7%] top-0 w-[clamp(30px,8vw,48px)] sm:hidden" delay="-1s" />
    </div>
  );
}

const LEAVES = [
  { left: "8%", dur: "19s", delay: "0s", drift: "70px", tone: 0 },
  { left: "22%", dur: "24s", delay: "-9s", drift: "-50px", tone: 1 },
  { left: "35%", dur: "21s", delay: "-4s", drift: "80px", tone: 2 },
  { left: "52%", dur: "26s", delay: "-14s", drift: "-70px", tone: 1 },
  { left: "63%", dur: "22s", delay: "-7s", drift: "60px", tone: 0 },
  { left: "74%", dur: "25s", delay: "-18s", drift: "-60px", tone: 2 },
  { left: "86%", dur: "20s", delay: "-11s", drift: "50px", tone: 1 },
  { left: "95%", dur: "27s", delay: "-2s", drift: "-80px", tone: 0 },
] as const;
const LEAF_TONES = ["#8a9a5b", "#c9a227", "#65744a"] as const;

export function HufflepuffFloaters() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className="leaf"
          style={{ left: l.left, "--dur": l.dur, "--delay": l.delay, "--drift": l.drift } as CSSProperties}
        >
          <svg viewBox="-2 -12 32 24" aria-hidden>
            <path d={LEAF_PATH} fill={LEAF_TONES[l.tone]} opacity="0.9" />
            <path d="M0 0H25" stroke="#2c3520" strokeWidth="0.8" opacity="0.5" />
          </svg>
        </span>
      ))}
      <svg viewBox="0 0 40 120" aria-hidden className="bob-b absolute left-[16%] top-[34%] hidden w-5 rotate-[-18deg] opacity-80 drop-shadow-[0_0_12px_rgb(245_201_58/0.6)] md:block">
        <path d="M20 2C38 24 40 62 20 108C0 62 2 24 20 2Z" fill="url(#hf-feather)" />
        <path d="M20 4V116" stroke="#8a6a1c" strokeWidth="1.2" opacity="0.7" />
      </svg>
      <svg viewBox="0 0 40 120" aria-hidden className="bob-c absolute right-[19%] top-[48%] hidden w-4 rotate-[22deg] opacity-70 drop-shadow-[0_0_12px_rgb(245_201_58/0.6)] md:block">
        <path d="M20 2C38 24 40 62 20 108C0 62 2 24 20 2Z" fill="url(#hf-feather)" />
        <path d="M20 4V116" stroke="#8a6a1c" strokeWidth="1.2" opacity="0.7" />
      </svg>
    </div>
  );
}

function Fronds({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 300" aria-hidden className={className} fill="#0f1609">
      <g>
        <path d="M180 300C176 220 120 150 20 120C100 120 170 170 182 252Z" />
        <path d="M184 300C188 200 240 120 340 80C268 110 200 170 190 260Z" />
        <path d="M182 300C180 180 160 90 190 10C210 100 200 200 190 300Z" />
        <path d="M178 300C150 240 90 220 30 236C96 226 150 250 182 300Z" opacity="0.9" />
        <path d="M186 300C220 236 280 214 340 226C276 220 220 246 184 300Z" opacity="0.9" />
      </g>
      <g stroke="#65744a" strokeOpacity="0.35" strokeWidth="1.4" fill="none">
        <path d="M180 296C176 220 130 160 40 128" />
        <path d="M186 296C190 206 244 130 330 90" />
        <path d="M184 296C182 190 168 100 190 24" />
      </g>
    </svg>
  );
}

export function HufflepuffForeground() {
  return (
    <div className="absolute inset-0">
      <Fronds className="absolute -bottom-3 -left-6 w-[clamp(160px,22vw,340px)] drop-shadow-[0_0_20px_rgb(0_0_0/0.45)]" />
      <Fronds className="absolute -bottom-3 -right-8 w-[clamp(140px,19vw,300px)] -scale-x-100" />
    </div>
  );
}
