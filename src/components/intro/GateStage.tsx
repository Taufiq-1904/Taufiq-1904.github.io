"use client";

import { motion, type Variants } from "framer-motion";
import { mulberry32 } from "@/lib/random";
import {
  APEX_Y,
  DOOR_H,
  FOCAL_Y_PCT,
  GATE_H,
  GATE_W,
  GROUND_Y,
  HALF,
  OPEN_W,
  OPEN_X,
  SPRING_Y,
  archLine,
  archY,
  doorOutline,
  openingPath,
  pct,
} from "./gateGeometry";
import { Rune, RUNE_NAMES } from "./Runes";

/* ------------------------------------------------------------------ */
/* Motion. Variant labels ("idle" / "opening") are driven by IntroGate. */
/* ------------------------------------------------------------------ */

const easeDoor: [number, number, number, number] = [0.45, 0, 0.2, 1];
const easeCamera: [number, number, number, number] = [0.55, 0, 0.3, 1];

/** The camera dolly: the whole gate rushes toward the viewer, aimed at the opening. */
const stageVariants: Variants = {
  idle: { scale: 1 },
  opening: { scale: 5.2, transition: { delay: 3.0, duration: 2.4, ease: easeCamera } },
};

const leftDoorVariants: Variants = {
  idle: { rotateY: 0 },
  opening: { rotateY: 78, transition: { delay: 2.6, duration: 2.3, ease: easeDoor } },
};

const rightDoorVariants: Variants = {
  idle: { rotateY: 0 },
  opening: { rotateY: -78, transition: { delay: 2.6, duration: 2.3, ease: easeDoor } },
};

const lightVariants: Variants = {
  idle: { opacity: 0.2 },
  opening: { opacity: 1, transition: { delay: 2.7, duration: 2.0, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/* Doors                                                                */
/* ------------------------------------------------------------------ */

const PANEL_Y = 372;
const BARS = [29, 55, 81, 107, 133, 159, 185];
const STILES = [3, 197];

function DoorArt({ side }: { side: "left" | "right" }) {
  // Everything is authored for the left leaf (hinge at x = 0) and mapped for the right one.
  const x = (xd: number) => (side === "left" ? xd : HALF - xd);
  const seamX = x(HALF);
  const sigilY = (PANEL_Y + DOOR_H) / 2 + 4;
  const angles = side === "left" ? [105, 135, 165, 195, 225, 255] : [-75, -45, -15, 15, 45, 75];
  const ring = 65;
  const polar = (deg: number, r: number) => ({
    px: seamX + r * Math.cos((deg * Math.PI) / 180),
    py: sigilY - r * Math.sin((deg * Math.PI) / 180),
  });
  const gradId = `ig-panel-${side}`;

  return (
    <svg
      viewBox={`0 0 ${HALF} ${DOOR_H}`}
      preserveAspectRatio="none"
      aria-hidden
      className="block size-full"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1730" />
          <stop offset="1" stopColor="#0a0813" />
        </linearGradient>
      </defs>

      {/* Bars (the iron is see-through, so the castle beyond shows between them) */}
      <g strokeLinecap="round">
        {[...STILES, ...BARS].map((xd) => {
          const top = archY(xd);
          const thick = STILES.includes(xd);
          return (
            <g key={xd}>
              <line x1={x(xd)} y1={top + 3} x2={x(xd)} y2={PANEL_Y} stroke="#0d0a16" strokeWidth={thick ? 5 : 3.4} />
              <line x1={x(xd) + 0.9} y1={top + 3} x2={x(xd) + 0.9} y2={PANEL_Y} stroke="#c99a3b" strokeOpacity={0.4} strokeWidth={0.8} />
              {!thick && (
                <polygon
                  points={`${x(xd) - 3.4},${top + 7} ${x(xd)},${top - 10} ${x(xd) + 3.4},${top + 7}`}
                  fill="#0d0a16"
                  stroke="#c99a3b"
                  strokeOpacity={0.55}
                  strokeWidth={0.7}
                />
              )}
            </g>
          );
        })}

        {/* Rails */}
        <line x1={0} y1={300} x2={HALF} y2={300} stroke="#0d0a16" strokeWidth={4.5} />
        <line x1={0} y1={300} x2={HALF} y2={300} stroke="#c99a3b" strokeOpacity={0.35} strokeWidth={0.8} transform="translate(0 -1)" />

        {/* Ornamental rings between the bars */}
        {BARS.slice(0, -1).map((xd) => (
          <circle key={xd} cx={x(xd + 13)} cy={336} r={8.5} fill="none" stroke="#8a6420" strokeWidth={1.6} />
        ))}
      </g>

      {/* Solid lower panel with the sigil */}
      <rect x={0} y={PANEL_Y} width={HALF} height={DOOR_H - PANEL_Y} fill={`url(#${gradId})`} stroke="#8a6420" strokeWidth={2.5} />
      <rect x={8} y={PANEL_Y + 10} width={HALF - 16} height={DOOR_H - PANEL_Y - 20} fill="none" stroke="#c99a3b" strokeOpacity={0.3} strokeWidth={1} />

      <g fill="none" stroke="#f6dc8e">
        <circle cx={seamX} cy={sigilY} r={74} strokeOpacity={0.7} strokeWidth={1.6} />
        <circle cx={seamX} cy={sigilY} r={56} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 5" />
        <circle cx={seamX} cy={sigilY} r={26} strokeOpacity={0.6} strokeWidth={1.2} />
        {angles.map((a) => {
          const from = polar(a + 15, 26);
          const to = polar(a + 15, 56);
          return <line key={a} x1={from.px} y1={from.py} x2={to.px} y2={to.py} strokeOpacity={0.4} strokeWidth={0.9} />;
        })}
        {angles.map((a, i) => {
          const { px, py } = polar(a, ring);
          return (
            <Rune
              key={a}
              name={RUNE_NAMES[(i * 2 + (side === "left" ? 0 : 1)) % RUNE_NAMES.length]}
              x={px}
              y={py}
              size={0.5}
              rotate={90 - a}
              className="ig-rune"
              style={{ animationDelay: `${(i * 0.45 + (side === "left" ? 0 : 0.2)).toFixed(2)}s` }}
            />
          );
        })}
      </g>

      {/* Door outline and arched rim */}
      <path d={doorOutline()} fill="none" stroke="#8a6420" strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The world seen through the bars                                      */
/* ------------------------------------------------------------------ */

const rand = mulberry32(31);
const stars = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  x: OPEN_X + 10 + rand() * (OPEN_W - 20),
  y: APEX_Y + 20 + rand() * 300,
  r: 0.5 + rand() * 0.9,
  o: 0.4 + rand() * 0.6,
}));

const HORIZON = 506;
const towers = [
  { x: 176, w: 17, h: 66, roof: 26 },
  { x: 204, w: 22, h: 108, roof: 34 },
  { x: 244, w: 30, h: 150, roof: 48 },
  { x: 288, w: 26, h: 122, roof: 40 },
  { x: 328, w: 20, h: 92, roof: 30 },
  { x: 358, w: 16, h: 62, roof: 22 },
];
const castlePath =
  `M168 ${HORIZON} V${HORIZON - 44} H392 V${HORIZON} Z ` +
  towers
    .map(
      (t) =>
        `M${t.x} ${HORIZON} V${HORIZON - t.h} L${t.x + t.w / 2} ${HORIZON - t.h - t.roof} L${t.x + t.w} ${HORIZON - t.h} V${HORIZON} Z`,
    )
    .join(" ");
const castleWindows = [
  [213, 398], [253, 360], [262, 384], [300, 392], [334, 418], [212, 428], [270, 440], [184, 456], [364, 462], [300, 430],
] as const;

function BeyondScene() {
  return (
    <svg viewBox={`0 0 ${GATE_W} ${GATE_H}`} aria-hidden className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="ig-beyond-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070612" />
          <stop offset="0.45" stopColor="#171030" />
          <stop offset="0.78" stopColor="#47284a" />
          <stop offset="1" stopColor="#7a4a52" />
        </linearGradient>
        <linearGradient id="ig-beyond-road" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#6d5a5f" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3a2c4c" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="ig-beyond-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8bde8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c8bde8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#c8bde8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ig-beyond-glow" cx="280" cy="506" r="340" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff1c2" stopOpacity="1" />
          <stop offset="0.3" stopColor="#ffd27a" stopOpacity="0.85" />
          <stop offset="0.65" stopColor="#d9863f" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8a3d3d" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x={OPEN_X} y={APEX_Y} width={OPEN_W} height={GROUND_Y - APEX_Y} fill="url(#ig-beyond-sky)" />
      {stars.map((s) => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="#f3ead3" opacity={s.o} />
      ))}

      {/* Distant hills, castle and the road leading to it */}
      <path d={`M${OPEN_X} 520 C150 486 220 506 280 500 C340 494 420 484 ${OPEN_X + OPEN_W} 514 V${GROUND_Y} H${OPEN_X} Z`} fill="#0f0b1b" />
      <path d={castlePath} fill="#0a0813" />
      <g fill="#ffd27a">
        {castleWindows.map(([wx, wy], i) => (
          <rect key={i} x={wx} y={wy} width={3} height={5} className="ig-window" style={{ animationDelay: `${(i * 0.37).toFixed(2)}s` }} />
        ))}
      </g>
      <polygon points={`244,${GROUND_Y} 316,${GROUND_Y} 287,${HORIZON} 273,${HORIZON}`} fill="url(#ig-beyond-road)" />
      <rect x={OPEN_X} y={456} width={OPEN_W} height={110} fill="url(#ig-beyond-mist)" />

      {/* Light that floods through when the gate opens */}
      <motion.rect
        variants={lightVariants}
        x={OPEN_X}
        y={APEX_Y}
        width={OPEN_W}
        height={GROUND_Y - APEX_Y}
        fill="url(#ig-beyond-glow)"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Stone frame, lanterns and the inscription                           */
/* ------------------------------------------------------------------ */

// The inscription follows the arch, a little outside the opening.
const INSCRIPTION_R = 244;
const inscription = [
  ...[172, 162, 152, 142, 132, 122, 112, 102].map((phi, i) => ({
    cx: OPEN_X + 230,
    phi,
    i,
  })),
  ...[78, 68, 58, 48, 38, 28, 18, 8].map((phi, i) => ({
    cx: OPEN_X + OPEN_W - 230,
    phi,
    i: 8 + i,
  })),
].map(({ cx, phi, i }) => ({
  id: i,
  x: cx + INSCRIPTION_R * Math.cos((phi * Math.PI) / 180),
  y: SPRING_Y - INSCRIPTION_R * Math.sin((phi * Math.PI) / 180),
  rotate: 90 - phi,
  name: RUNE_NAMES[i % RUNE_NAMES.length],
}));

function Lantern({ cx, delay }: { cx: number; delay: number }) {
  return (
    <g>
      <g className="ig-flicker" style={{ animationDelay: `${delay}s` }}>
        <circle cx={cx} cy={366} r={160} fill="url(#ig-torch-glow)" />
      </g>
      <path d={`M${cx - 14} 400 H${cx + 14} V406 H${cx - 14} Z`} fill="#0d0a16" stroke="#8a6420" strokeWidth={1} />
      <path d={`M${cx - 9} 400 L${cx - 7} 352 H${cx + 7} L${cx + 9} 400 Z`} fill="#1a1426" stroke="#8a6420" strokeWidth={1.2} />
      <path d={`M${cx - 9} 352 L${cx} 340 L${cx + 9} 352 Z`} fill="#0d0a16" stroke="#8a6420" strokeWidth={1.2} />
      <rect x={cx - 3.2} y={380} width={6.4} height={20} rx={1} fill="#f3ead3" opacity={0.85} />
      <path
        className="ig-flame"
        d={`M${cx} 361 C${cx + 4.5} 368 ${cx + 4.5} 376 ${cx} 382 C${cx - 4.5} 376 ${cx - 4.5} 368 ${cx} 361 Z`}
        fill="url(#ig-flame)"
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  );
}

function GateFrame() {
  const merlons = Array.from({ length: 7 }, (_, i) => 14 + i * 80);
  const wall = `M0 24 H${GATE_W} V${GATE_H} H0 Z ${openingPath()}`;

  return (
    <svg viewBox={`0 0 ${GATE_W} ${GATE_H}`} aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible">
      <defs>
        <linearGradient id="ig-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2440" />
          <stop offset="1" stopColor="#120f1c" />
        </linearGradient>
        <linearGradient id="ig-pillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1529" />
          <stop offset="0.55" stopColor="#2e2745" />
          <stop offset="1" stopColor="#171224" />
        </linearGradient>
        <pattern id="ig-stone" width="56" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 0.5H56M0 14.5H56M0.5 0V14M28.5 14V28" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1" fill="none" />
        </pattern>
        <radialGradient id="ig-torch-glow">
          <stop offset="0" stopColor="#ffc864" stopOpacity="0.5" />
          <stop offset="0.4" stopColor="#ffb450" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffb450" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ig-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f0a030" />
          <stop offset="0.55" stopColor="#ffd877" />
          <stop offset="1" stopColor="#fff6d6" />
        </linearGradient>
      </defs>

      {/* Crenellations, wall and stone texture (evenodd cuts the opening out of the wall) */}
      {merlons.map((mx) => (
        <rect key={mx} x={mx} y={4} width={52} height={22} fill="#1d1830" />
      ))}
      <path d={wall} fill="url(#ig-wall)" fillRule="evenodd" />
      <path d={wall} fill="url(#ig-stone)" fillRule="evenodd" />

      {/* Pillars */}
      {[0, GATE_W - 62].map((px) => (
        <g key={px}>
          <rect x={px} y={24} width={62} height={GATE_H - 24} fill="url(#ig-pillar)" />
          <rect x={px - 5} y={20} width={72} height={9} fill="#2e2745" stroke="#8a6420" strokeOpacity={0.6} strokeWidth={1} />
          <rect x={px - 5} y={GATE_H - 52} width={72} height={52} fill="#171224" stroke="#8a6420" strokeOpacity={0.25} strokeWidth={1} />
        </g>
      ))}

      {/* Threshold */}
      <rect x={60} y={GROUND_Y} width={GATE_W - 120} height={GATE_H - GROUND_Y} fill="#0b0912" />
      <path d={`M60 ${GROUND_Y + 8}H${GATE_W - 60}M60 ${GROUND_Y + 16}H${GATE_W - 60}`} stroke="#ffffff" strokeOpacity={0.06} />

      {/* Trim around the opening */}
      <path d={`${archLine().replace(/^M/, `M${OPEN_X} ${GROUND_Y} L`)} L${OPEN_X + OPEN_W} ${GROUND_Y}`} fill="none" stroke="#8a6420" strokeWidth={4} strokeLinejoin="round" />
      <path d={`${archLine().replace(/^M/, `M${OPEN_X} ${GROUND_Y} L`)} L${OPEN_X + OPEN_W} ${GROUND_Y}`} fill="none" stroke="#f6dc8e" strokeOpacity={0.35} strokeWidth={1} transform="translate(0 -4)" />

      {/* Rune inscription along the arch */}
      {inscription.map((r) => (
        <Rune
          key={r.id}
          name={r.name}
          x={r.x}
          y={r.y}
          size={0.62}
          rotate={r.rotate}
          className="ig-rune"
          style={{ animationDelay: `${(r.id * 0.32).toFixed(2)}s` }}
        />
      ))}

      <Lantern cx={31} delay={0} />
      <Lantern cx={GATE_W - 31} delay={1.1} />
    </svg>
  );
}


/* ------------------------------------------------------------------ */
/* The lock: it visibly unlocks (shackle lifts and swings, keyhole glows) */
/* ------------------------------------------------------------------ */

const LOCK_X = OPEN_X + HALF; // on the seam between the two leaves
const LOCK_Y = 468;
const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  const r = 46 + (i % 3) * 22;
  return { i, dx: Math.cos(a) * r, dy: Math.sin(a) * r - 12 };
});

function GateLock() {
  return (
    <svg viewBox={`0 0 ${GATE_W} ${GATE_H}`} aria-hidden className="ig-lock pointer-events-none absolute inset-0 z-[15] size-full overflow-visible">
      <defs>
        <radialGradient id="ig-lock-glow">
          <stop offset="0" stopColor="#fff1c2" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#ffd27a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ig-lock-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6bd5f" />
          <stop offset="0.5" stopColor="#a87a28" />
          <stop offset="1" stopColor="#6a4a14" />
        </linearGradient>
      </defs>

      <circle className="ig-lock-halo" cx={LOCK_X} cy={LOCK_Y} r="78" fill="url(#ig-lock-glow)" />

      <g className="ig-lock-body">
        {/* Shackle: lifts and swings open on its left foot */}
        <g className="ig-shackle" style={{ transformOrigin: `${LOCK_X - 17}px ${LOCK_Y - 14}px`, transformBox: "view-box" }}>
          <path d={`M${LOCK_X - 17} ${LOCK_Y - 12} V${LOCK_Y - 32} a17 17 0 0 1 34 0 V${LOCK_Y - 12}`} fill="none" stroke="#2a1b0c" strokeWidth="11" strokeLinecap="round" />
          <path d={`M${LOCK_X - 17} ${LOCK_Y - 12} V${LOCK_Y - 32} a17 17 0 0 1 34 0 V${LOCK_Y - 12}`} fill="none" stroke="url(#ig-lock-brass)" strokeWidth="7" strokeLinecap="round" />
        </g>
        {/* Body with an ornate plate */}
        <rect x={LOCK_X - 30} y={LOCK_Y - 16} width="60" height="52" rx="7" fill="url(#ig-lock-brass)" stroke="#2a1b0c" strokeWidth="2.5" />
        <rect x={LOCK_X - 24} y={LOCK_Y - 10} width="48" height="40" rx="4" fill="none" stroke="#f6dc8e" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx={LOCK_X - 20} cy={LOCK_Y - 6} r="1.8" fill="#2a1b0c" />
        <circle cx={LOCK_X + 20} cy={LOCK_Y - 6} r="1.8" fill="#2a1b0c" />
        <circle cx={LOCK_X - 20} cy={LOCK_Y + 26} r="1.8" fill="#2a1b0c" />
        <circle cx={LOCK_X + 20} cy={LOCK_Y + 26} r="1.8" fill="#2a1b0c" />
        {/* Keyhole: dark while locked, glows when the spell lands */}
        <circle className="ig-keyhole-glow" cx={LOCK_X} cy={LOCK_Y + 4} r="11" fill="#fff1c2" />
        <circle cx={LOCK_X} cy={LOCK_Y + 4} r="5.2" fill="#140d06" />
        <path d={`M${LOCK_X - 3} ${LOCK_Y + 6} L${LOCK_X - 5} ${LOCK_Y + 20} H${LOCK_X + 5} L${LOCK_X + 3} ${LOCK_Y + 6} Z`} fill="#140d06" />
      </g>

      {/* A wand-like spark travels to the lock, then magic escapes from it */}
      <g className="ig-wand">
        <path d="M0 0 L34 -34" stroke="#2a1b0c" strokeWidth="5" strokeLinecap="round" />
        <path d="M0 0 L34 -34" stroke="#9a6532" strokeWidth="2.4" strokeLinecap="round" />
        <circle r="6" fill="#fff6d6" />
        <circle r="14" fill="url(#ig-lock-glow)" />
      </g>
      {SPARKS.map((p) => (
        <circle
          key={p.i}
          className="ig-lock-spark"
          cx={LOCK_X}
          cy={LOCK_Y + 4}
          r={1.6 + (p.i % 3) * 0.7}
          fill="#ffe9a0"
          style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, animationDelay: `${(2.35 + (p.i % 4) * 0.04).toFixed(2)}s` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Composition                                                          */
/* ------------------------------------------------------------------ */

const doorBox = (left: number) => ({
  left: pct(left, GATE_W),
  top: pct(APEX_Y, GATE_H),
  width: pct(HALF, GATE_W),
  height: pct(DOOR_H, GATE_H),
});

export function GateStage() {
  return (
    <motion.div
      variants={stageVariants}
      className={`relative ig-gateIn`}
      style={{
        width: `min(100cqw, calc(100cqh * ${GATE_W / GATE_H}))`,
        aspectRatio: `${GATE_W} / ${GATE_H}`,
        originX: 0.5,
        originY: FOCAL_Y_PCT / 100,
      }}
    >
      <BeyondScene />

      {/* A plain wrapper owns the CSS perspective; the doors swing in 3D inside it. */}
      <div className="absolute inset-0 z-10" style={{ perspective: "1400px" }}>
        <motion.div variants={leftDoorVariants} className="absolute" style={{ ...doorBox(OPEN_X), originX: 0, originY: 0.5 }}>
          <DoorArt side="left" />
        </motion.div>
        <motion.div variants={rightDoorVariants} className="absolute" style={{ ...doorBox(OPEN_X + HALF), originX: 1, originY: 0.5 }}>
          <DoorArt side="right" />
        </motion.div>
      </div>

      <GateLock />
      <GateFrame />
      {/* The incantation, letter by letter, over the lock */}
      <p aria-hidden className="ig-spell" style={{ top: pct(LOCK_Y - 150, GATE_H) }}>
        {"ALOHOMORA".split("").map((ch, i) => (
          <span key={i} style={{ "--ld": `${(0.95 + i * 0.1).toFixed(2)}s` } as React.CSSProperties}>
            {ch}
          </span>
        ))}
      </p>
    </motion.div>
  );
}

