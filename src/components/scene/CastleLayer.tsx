import { mulberry32 } from "@/lib/random";

const GROUND = 800;
const SILHOUETTE = "#090711";

type Tower = { x: number; w: number; h: number; roof: number };

const towers: Tower[] = [
  { x: 520, w: 34, h: 170, roof: 62 },
  { x: 575, w: 46, h: 215, roof: 80 },
  { x: 650, w: 56, h: 250, roof: 92 },
  { x: 730, w: 38, h: 190, roof: 70 },
  { x: 790, w: 62, h: 235, roof: 88 },
  { x: 875, w: 40, h: 175, roof: 64 },
  { x: 930, w: 30, h: 140, roof: 54 },
];

// Windows are placed once at module load so server and client render the same thing.
const rand = mulberry32(21);

const towerWindows = towers.flatMap((tower, i) => {
  const rows = Math.floor(tower.h / 52);
  const columns = tower.w >= 56 ? [0.3, 0.62] : [0.5];
  return Array.from({ length: rows }, (_, row) =>
    columns.map((col, c) => ({
      key: `t${i}-${row}-${c}`,
      x: tower.x + tower.w * col - 3,
      y: GROUND - tower.h + 30 + row * 48,
      lit: rand() < 0.72,
      delay: rand() * 4,
    })),
  )
    .flat()
    .filter((w) => w.lit);
});

const hallWindows = Array.from({ length: 8 }, (_, i) => ({
  key: `h${i}`,
  x: 528 + i * 58,
  delay: rand() * 4,
}));

const viaductColumns = [330, 378, 426, 474];

export function CastleLayer() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="size-full">
      <defs>
        <filter id="castle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="castle-mist">
          <stop offset="0" stopColor="#9aa4d8" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="#9aa4d8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#9aa4d8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Distant ridges */}
      <path
        d="M0 640 L110 570 L220 612 L350 530 L470 600 L590 560 L700 610 L840 540 L960 600 L1080 548 L1210 612 L1330 566 L1440 610 L1440 900 L0 900 Z"
        fill="#161128"
      />
      <path
        d="M0 700 L90 650 L200 690 L320 628 L430 684 L1010 690 L1120 630 L1240 686 L1350 640 L1440 682 L1440 900 L0 900 Z"
        fill="#0f0b1c"
      />

      {/* Rock the castle sits on */}
      <path
        d="M360 900 L410 848 L452 826 L488 800 L990 800 L1022 828 L1064 850 L1110 900 Z"
        fill="#07050d"
      />

      {/* Viaduct on the left */}
      <g fill={SILHOUETTE}>
        <rect x="318" y="738" width="204" height="12" />
        {viaductColumns.map((x) => (
          <rect key={x} x={x} y="750" width="12" height="52" />
        ))}
      </g>

      {/* Main body and hall */}
      <g fill={SILHOUETTE}>
        <rect x="500" y={GROUND - 120} width="480" height="120" />
        {towers.map((t, i) => {
          const top = GROUND - t.h;
          const cx = t.x + t.w / 2;
          return (
            <g key={i}>
              <rect x={t.x} y={top} width={t.w} height={t.h} />
              <rect x={t.x - 3} y={top - 2} width={t.w + 6} height="7" />
              <polygon points={`${t.x - 4},${top - 2} ${cx},${top - t.roof} ${t.x + t.w + 4},${top - 2}`} />
              <rect x={cx - 1} y={top - t.roof - 16} width="2" height="18" />
            </g>
          );
        })}
      </g>

      {/* Moonlit right-hand edges */}
      <g fill="#d3dafc" opacity="0.14">
        {towers.map((t, i) => (
          <rect key={i} x={t.x + t.w - 2} y={GROUND - t.h} width="2" height={t.h} />
        ))}
      </g>

      {/* Lit windows. The glow is a static blurred copy (cached by the browser); only the crisp
          windows on top flicker, so no filter has to be recomputed while they animate. */}
      <g fill="#f6c968" filter="url(#castle-glow)" opacity="0.55" aria-hidden>
        {towerWindows.map((w) => (
          <rect key={`g-${w.key}`} x={w.x} y={w.y} width="6" height="12" rx="3" />
        ))}
        {hallWindows.map((w) => (
          <rect key={`g-${w.key}`} x={w.x} y={GROUND - 96} width="8" height="28" rx="4" />
        ))}
      </g>
      <g fill="#f6c968">
        {towerWindows.map((w) => (
          <rect
            key={w.key}
            x={w.x}
            y={w.y}
            width="6"
            height="12"
            rx="3"
            className="animate-flicker"
            style={{ animationDelay: `${w.delay}s` }}
          />
        ))}
        {hallWindows.map((w) => (
          <rect
            key={w.key}
            x={w.x}
            y={GROUND - 96}
            width="8"
            height="28"
            rx="4"
            opacity="0.85"
            className="animate-flicker"
            style={{ animationDelay: `${w.delay}s` }}
          />
        ))}
      </g>

      {/* Mist hugging the base: soft edges from gradients, so the drifting part needs no blur filter */}
      <ellipse cx="720" cy="812" rx="560" ry="46" fill="url(#castle-mist)" />
      <ellipse cx="520" cy="840" rx="340" ry="34" fill="url(#castle-mist)" className="animate-drift" />
    </svg>
  );
}
