/**
 * Ravenclaw's hero: a constellation that draws itself, drifting books and a quill, and a raven crossing
 * the tower. Midnight blue, bronze, starlight.
 */

// Stars of the constellation (viewBox 0 0 400 260) and the lines that join them, in drawing order.
const STARS = [
  { x: 28, y: 204, s: 3.2 },
  { x: 92, y: 152, s: 2.4 },
  { x: 162, y: 172, s: 3.6 },
  { x: 218, y: 112, s: 2.8 },
  { x: 292, y: 128, s: 3.4 },
  { x: 348, y: 62, s: 4 },
  { x: 244, y: 220, s: 2.6 },
] as const;
const LINES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 6],
];

function Sparkle({ x, y, s, delay }: { x: number; y: number; s: number; delay: string }) {
  const long = s * 3.4;
  const short = s * 0.7;
  return (
    <g className="const-star" style={{ animationDelay: delay }} fill="#e9f0ff">
      <circle cx={x} cy={y} r={s * 0.85} />
      <path d={`M${x} ${y - long}L${x + short} ${y}L${x} ${y + long}L${x - short} ${y}Z`} opacity="0.75" />
      <path d={`M${x - long} ${y}L${x} ${y + short}L${x + long} ${y}L${x} ${y - short}Z`} opacity="0.55" />
    </g>
  );
}

function Constellation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" aria-hidden className={className}>
      <g fill="none" stroke="#b9ccf2" strokeWidth="1.1" strokeLinecap="round" opacity="0.6">
        {LINES.map(([a, b], i) => (
          <path
            key={`${a}-${b}`}
            d={`M${STARS[a].x} ${STARS[a].y}L${STARS[b].x} ${STARS[b].y}`}
            pathLength={1}
            className="const-line"
            style={{ animationDelay: `${0.3 + i * 0.55}s` }}
          />
        ))}
      </g>
      {STARS.map((s, i) => (
        <Sparkle key={i} x={s.x} y={s.y} s={s.s} delay={`${-i * 0.7}s`} />
      ))}
    </svg>
  );
}

function Raven({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 44" aria-hidden className={className} fill="#050914">
      <path d="M45 22c-5-1-9-5-12-10C25 6 14 3 2 6c10 3 16 8 20 14 3 4 7 8 14 10l4 6 1-8 4 8 1-9c6-1 11-5 15-10 3-4 8-8 16-11-10-1-20 2-27 8-3 2-5 5-5 7Z" />
      <path d="M45 22c1-5 5-9 11-10l7 3-8 3c-4 1-7 2-10 4Z" />
      <circle cx="61" cy="14" r="1" fill="#b9ccf2" />
    </svg>
  );
}

function Book({ className, cover, band }: { className?: string; cover: string; band: string }) {
  return (
    <svg viewBox="0 0 70 92" aria-hidden className={className}>
      <rect x="6" y="6" width="58" height="80" rx="3" fill={cover} />
      <rect x="6" y="6" width="9" height="80" rx="2" fill="#000" opacity="0.28" />
      <rect x="58" y="10" width="3" height="72" fill="#efe6cf" opacity="0.85" />
      <rect x="20" y="22" width="34" height="3" fill={band} />
      <rect x="20" y="30" width="26" height="2" fill={band} opacity="0.7" />
      <circle cx="37" cy="62" r="9" fill="none" stroke={band} strokeWidth="1.4" />
      <path d="M37 53v18M28 62h18" stroke={band} strokeWidth="1" />
    </svg>
  );
}

function OpenBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" aria-hidden className={className}>
      <path d="M60 14C46 4 22 4 6 12v46c16-8 40-8 54 2Z" fill="#e9dfc4" />
      <path d="M60 14C74 4 98 4 114 12v46c-16-8-40-8-54 2Z" fill="#f3ead3" />
      <path d="M60 14v46" stroke="#8a6a3a" strokeWidth="2" />
      <g stroke="#8c7a55" strokeWidth="1" opacity="0.6" strokeLinecap="round">
        <path d="M14 22c14-4 30-3 40 1M14 30c14-4 30-3 40 1M14 38c14-4 30-3 40 1" />
        <path d="M66 23c10-4 26-5 40-1M66 31c10-4 26-5 40-1M66 39c10-4 26-5 40-1" />
      </g>
      <circle cx="88" cy="46" r="7" fill="none" stroke="#b68a55" strokeWidth="1.2" opacity="0.8" />
    </svg>
  );
}

function Feather({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 120" aria-hidden className={className}>
      <path d="M20 2C38 24 40 62 20 108C0 62 2 24 20 2Z" fill="url(#rv-feather)" />
      <path d="M20 4V116" stroke="#e9f0ff" strokeWidth="1.3" opacity="0.8" />
      <path d="M20 30L34 46M20 48L35 64M20 66L33 80M20 30L6 46M20 48L5 64M20 66L7 80" stroke="#0e1530" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function RavenclawArchitecture() {
  return (
    <div className="absolute inset-0">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="rv-feather" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dfe9ff" />
            <stop offset="0.55" stopColor="#7f9be0" />
            <stop offset="1" stopColor="#2b4aa8" />
          </linearGradient>
        </defs>
      </svg>
      <Constellation className="absolute left-[4%] top-[14%] hidden w-[clamp(220px,26vw,420px)] sm:block" />
      <Constellation className="absolute bottom-[26%] right-[5%] hidden w-[clamp(160px,18vw,300px)] -scale-x-100 opacity-60 lg:block" />
      <Raven className="raven-fly" />
    </div>
  );
}

export function RavenclawFloaters() {
  return (
    <div className="absolute inset-0">
      <Book className="bob absolute left-[10%] top-[56%] hidden w-[clamp(36px,4vw,64px)] -rotate-12 drop-shadow-[0_8px_14px_rgb(0_0_0/0.5)] md:block" cover="#1d2c63" band="#d3a66a" />
      <OpenBook className="bob-b absolute right-[14%] top-[22%] w-[clamp(64px,8vw,120px)] drop-shadow-[0_10px_16px_rgb(0_0_0/0.5)]" />
      <Book className="bob-c absolute right-[27%] top-[62%] hidden w-[clamp(32px,3.4vw,54px)] rotate-12 drop-shadow-[0_8px_14px_rgb(0_0_0/0.5)] md:block" cover="#2b4aa8" band="#e9dcc0" />
      <Book className="bob-b absolute left-[27%] top-[26%] hidden w-[clamp(30px,3vw,48px)] rotate-[18deg] opacity-80 lg:block" cover="#3a2a1a" band="#b68a55" />
      <Feather className="bob-c absolute left-[41%] top-[10%] hidden w-[clamp(18px,1.8vw,28px)] rotate-[24deg] opacity-90 drop-shadow-[0_0_14px_rgb(150_180_255/0.6)] sm:block" />
    </div>
  );
}

export function RavenclawForeground() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden className="size-full">
      <defs>
        <linearGradient id="rv-shelf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101a3a" />
          <stop offset="1" stopColor="#04060f" />
        </linearGradient>
      </defs>
      <path d="M0 876C220 860 420 884 700 878C980 872 1200 862 1440 878V900H0Z" fill="#04060f" />
      {/* a stack of old volumes, bottom left */}
      <g>
        <rect x="70" y="838" width="190" height="34" fill="url(#rv-shelf)" />
        <rect x="86" y="808" width="160" height="30" fill="#0c1430" />
        <rect x="98" y="782" width="132" height="26" fill="#131f48" />
        <g fill="#b68a55" opacity="0.5">
          <rect x="70" y="850" width="190" height="2" />
          <rect x="86" y="820" width="160" height="2" />
          <rect x="98" y="794" width="132" height="2" />
        </g>
      </g>
      {/* a brass telescope on its tripod, bottom right */}
      <g stroke="#b68a55" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M1196 884L1244 780M1292 884L1244 780M1244 884V780" />
      </g>
      <g transform="rotate(-32 1244 780)" fill="#0a1128" stroke="#b68a55" strokeOpacity="0.6" strokeWidth="2">
        <rect x="1128" y="766" width="190" height="26" rx="4" />
        <rect x="1128" y="762" width="24" height="34" rx="3" />
        <rect x="1214" y="762" width="6" height="34" />
      </g>
    </svg>
  );
}
