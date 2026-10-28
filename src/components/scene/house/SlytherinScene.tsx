import { mulberry32 } from "@/lib/random";

/**
 * Slytherin's hero: silver serpents framing the room, green glass lamps, drifting orbs and a slowly
 * turning rune seal. Cool, symmetrical, restrained.
 */

const RUNES = [
  "M3 0V10M3 2L8 5L3 8",
  "M2 0L8 5L2 10M8 0V10",
  "M5 0V10M1 3L5 5L9 3",
  "M1 0L9 10M9 0L1 10",
  "M2 0V10M2 5H8M8 2V8",
  "M5 0L9 5L5 10L1 5Z",
  "M1 2L5 0L9 2M5 0V10M2 8H8",
  "M2 10L5 0L8 10M3.5 6H6.5",
];

const SEAL_RUNES = Array.from({ length: 16 }, (_, i) => ({
  key: i,
  d: RUNES[i % RUNES.length],
  angle: (i * 360) / 16,
}));

export function RuneSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="200" cy="200" r="190" strokeWidth="1.4" />
      <circle cx="200" cy="200" r="150" strokeWidth="0.8" />
      <circle cx="200" cy="200" r="96" strokeWidth="0.8" strokeDasharray="3 7" />
      <path d="M200 110L270 230H130Z" strokeWidth="1" />
      <path d="M200 290L130 170H270Z" strokeWidth="1" opacity="0.7" />
      {SEAL_RUNES.map((r) => (
        <path key={r.key} d={r.d} strokeWidth="1.6" transform={`rotate(${r.angle} 200 200) translate(195 28)`} />
      ))}
    </svg>
  );
}

function Serpent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 470" aria-hidden className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* body */}
      <path d="M64 468C8 408 116 352 66 290S12 168 62 116C92 86 100 56 74 40" stroke="url(#sl-silver)" strokeWidth="13" />
      <path d="M64 468C8 408 116 352 66 290S12 168 62 116C92 86 100 56 74 40" stroke="#06100c" strokeWidth="4" strokeDasharray="2 8" opacity="0.7" />
      <path d="M64 468C8 408 116 352 66 290S12 168 62 116C92 86 100 56 74 40" stroke="#e6f1ec" strokeWidth="1" opacity="0.5" transform="translate(-3 -2)" />
      {/* head */}
      <path d="M62 38c0-14 16-24 32-18l20 8-18 10c-8 6-20 6-34 0Z" fill="url(#sl-silver)" />
      <circle cx="84" cy="27" r="3.2" fill="#8ed9b2" />
      <circle cx="84" cy="27" r="7" fill="url(#sl-eye)" />
      <path d="M114 28l12-3M114 28l11 6" stroke="#8ed9b2" strokeWidth="1.4" />
    </svg>
  );
}

function Lamp({ className, delay }: { className?: string; delay?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 60 150" aria-hidden className="w-full overflow-visible">
        <path d="M30 0V50" stroke="#9fb3aa" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="30" cy="92" r="52" fill="url(#sl-eye)" className="lamp-glow" style={{ animationDelay: delay }} />
        <path d="M18 54h24l8 12v36l-8 12H18l-8-12V66Z" fill="#0d3a2a" fillOpacity="0.72" stroke="#c3d0cb" strokeWidth="1.6" />
        <path d="M22 66h16l4 8v22l-4 8H22l-4-8V74Z" fill="#8ed9b2" fillOpacity="0.55" />
        <path d="M24 54l6-8 6 8" fill="none" stroke="#c3d0cb" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function SlytherinArchitecture() {
  return (
    <div className="absolute inset-0">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="sl-silver" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9f2ee" />
            <stop offset="0.5" stopColor="#9db2a9" />
            <stop offset="1" stopColor="#52685f" />
          </linearGradient>
          <radialGradient id="sl-eye">
            <stop offset="0" stopColor="#8ed9b2" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#2fa273" stopOpacity="0.28" />
            <stop offset="1" stopColor="#176b4d" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <RuneSeal className="absolute left-1/2 top-[44%] w-[min(86vmin,760px)] -translate-x-1/2 -translate-y-1/2 text-[#8ed9b2] opacity-[0.1] [animation:slow-spin_180s_linear_infinite]" />
      <Serpent className="absolute -left-2 top-[14%] hidden h-[62%] drop-shadow-[0_0_18px_rgb(23_107_77/0.45)] md:block" />
      <Serpent className="absolute -right-2 top-[14%] hidden h-[62%] -scale-x-100 drop-shadow-[0_0_18px_rgb(23_107_77/0.45)] md:block" />
      <Lamp className="sway absolute left-[22%] top-0 hidden w-[clamp(34px,3.6vw,56px)] md:block" />
      <Lamp className="sway-slow absolute right-[22%] top-0 hidden w-[clamp(34px,3.6vw,56px)] md:block" delay="-2.4s" />
    </div>
  );
}

const rand = mulberry32(57);
const ORBS = Array.from({ length: 7 }, (_, i) => ({
  key: i,
  left: `${8 + rand() * 84}%`,
  top: `${14 + rand() * 62}%`,
  size: 10 + Math.round(rand() * 16),
  cls: i % 3 === 0 ? "bob" : i % 3 === 1 ? "bob-b" : "bob-c",
  hideOnMobile: i > 3,
}));

export function SlytherinFloaters() {
  return (
    <div className="absolute inset-0">
      {ORBS.map((o) => (
        <span
          key={o.key}
          className={`${o.cls} absolute rounded-full ${o.hideOnMobile ? "hidden md:block" : ""}`}
          style={{
            left: o.left,
            top: o.top,
            width: o.size,
            height: o.size,
            background: "radial-gradient(circle at 35% 35%, #eafff4, #8ed9b2 38%, rgb(23 107 77 / 0) 72%)",
            boxShadow: "0 0 22px 6px rgb(142 217 178 / 0.35)",
          }}
        />
      ))}
      {/* a thin silver ring turning in the air */}
      <svg viewBox="0 0 120 120" aria-hidden className="bob-b absolute right-[12%] top-[58%] hidden w-24 text-[#c3d0cb] opacity-50 md:block" fill="none" stroke="currentColor">
        <ellipse cx="60" cy="60" rx="52" ry="18" strokeWidth="1.4" transform="rotate(-24 60 60)" />
        <ellipse cx="60" cy="60" rx="52" ry="18" strokeWidth="0.8" transform="rotate(36 60 60)" opacity="0.6" />
      </svg>
    </div>
  );
}

export function SlytherinForeground() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden className="size-full">
      <defs>
        <linearGradient id="sl-stone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#030706" />
          <stop offset="1" stopColor="#0b1814" />
        </linearGradient>
      </defs>
      {/* Two dark columns closing in the frame */}
      <g fill="url(#sl-stone)">
        <path d="M0 0H86V900H0Z" />
        <path d="M1440 0H1354V900H1440Z" />
      </g>
      <g stroke="#c3d0cb" strokeOpacity="0.2" strokeWidth="1.5" fill="none">
        <path d="M86 0V900" />
        <path d="M1354 0V900" />
        <path d="M70 70H102M70 90H102" />
        <path d="M1338 70H1370M1338 90H1370" />
      </g>
      <path d="M0 872C180 856 340 880 520 874C700 868 900 884 1100 872C1240 864 1340 870 1440 876V900H0Z" fill="#030706" />
    </svg>
  );
}
