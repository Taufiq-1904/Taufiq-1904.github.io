import type { CSSProperties } from "react";
import { FloatingCandles } from "@/components/scene/FloatingCandles";

/**
 * Gryffindor's hero: crimson banners with a gold mane-sunburst device, wand sparks, floating candles and a
 * dark oak mantel along the bottom. All artwork is original and drawn in code.
 */

const RAYS = Array.from({ length: 16 }, (_, i) => {
  const a = (i * 22.5 * Math.PI) / 180;
  const tip = i % 2 === 0 ? 47 : 40;
  const half = (7 * Math.PI) / 180;
  const p = (r: number, ang: number) => `${(Math.cos(ang) * r).toFixed(2)},${(Math.sin(ang) * r).toFixed(2)}`;
  return `${p(28, a - half)} ${p(tip, a)} ${p(28, a + half)}`;
});

function Banner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 330" aria-hidden className={className}>
      <rect x="2" y="0" width="116" height="9" rx="2" fill="#241509" />
      <circle cx="3" cy="4.5" r="5" fill="#d8b15c" />
      <circle cx="117" cy="4.5" r="5" fill="#d8b15c" />
      <path d="M10 9H110V276L60 314L10 276Z" fill="url(#gf-cloth)" />
      <path d="M10 9H110V276L60 314L10 276Z" fill="url(#gf-fold)" />
      <path d="M17 16H103V271L60 303L17 271Z" fill="none" stroke="#d8b15c" strokeWidth="1.6" opacity="0.85" />
      <g transform="translate(60 118)">
        {RAYS.map((points, i) => (
          <polygon key={i} points={points} fill="#d8b15c" opacity={i % 2 === 0 ? 0.95 : 0.75} />
        ))}
        <circle r="28" fill="#4d0b1b" stroke="#d8b15c" strokeWidth="2.2" />
        <circle r="22" fill="none" stroke="#d8b15c" strokeWidth="0.8" opacity="0.6" />
        {/* a crown over a rising flame */}
        <path d="M-13 3L-13 -7L-6.5 -1L0 -10L6.5 -1L13 -7L13 3Z" fill="#d8b15c" />
        <rect x="-13" y="3" width="26" height="3.2" fill="#d8b15c" />
        <path d="M0 8c3 3 4 6 0 11c-4-5-3-8 0-11Z" fill="#e87942" />
      </g>
      <path d="M30 206L60 226L90 206" fill="none" stroke="#d8b15c" strokeWidth="1.4" opacity="0.8" />
      <path d="M30 220L60 240L90 220" fill="none" stroke="#d8b15c" strokeWidth="1.4" opacity="0.6" />
      <path d="M30 234L60 254L90 234" fill="none" stroke="#d8b15c" strokeWidth="1.4" opacity="0.4" />
      <path d="M60 314v14" stroke="#d8b15c" strokeWidth="2" />
      <circle cx="60" cy="329" r="3" fill="#d8b15c" />
    </svg>
  );
}

function Sparks() {
  const sparks = [
    { left: "18%", top: "62%", r: "-32deg", dx: "240px", dy: "-170px", delay: "1.5s" },
    { left: "74%", top: "70%", r: "-148deg", dx: "-230px", dy: "-150px", delay: "5.2s" },
    { left: "46%", top: "78%", r: "-60deg", dx: "120px", dy: "-210px", delay: "8.4s" },
  ];
  return (
    <>
      {sparks.map((s) => (
        <span
          key={s.left}
          className="wand-spark hidden md:block"
          style={{ left: s.left, top: s.top, animationDelay: s.delay, "--r": s.r, "--dx": s.dx, "--dy": s.dy } as CSSProperties}
        />
      ))}
    </>
  );
}

export function GryffindorArchitecture() {
  return (
    <div className="absolute inset-0">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="gf-cloth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8f1832" />
            <stop offset="1" stopColor="#3a0a16" />
          </linearGradient>
          <linearGradient id="gf-fold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.38" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="0.04" />
            <stop offset="1" stopColor="#000" stopOpacity="0.42" />
          </linearGradient>
        </defs>
      </svg>
      <div className="sway absolute -top-1 left-[2.5%] hidden w-[clamp(64px,7.5vw,128px)] drop-shadow-[0_14px_22px_rgb(0_0_0/0.55)] sm:block">
        <Banner />
      </div>
      <div className="sway-slow absolute -top-1 right-[2.5%] hidden w-[clamp(64px,7.5vw,128px)] drop-shadow-[0_14px_22px_rgb(0_0_0/0.55)] sm:block">
        <Banner />
      </div>
      <Sparks />
    </div>
  );
}

export function GryffindorFloaters() {
  return (
    <div className="absolute inset-0">
      <FloatingCandles />
    </div>
  );
}

export function GryffindorForeground() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden className="size-full">
      <defs>
        <linearGradient id="gf-oak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a140c" />
          <stop offset="1" stopColor="#0d0605" />
        </linearGradient>
        <radialGradient id="gf-flame-glow">
          <stop offset="0" stopColor="#ffd998" stopOpacity="0.7" />
          <stop offset="1" stopColor="#e87942" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* The mantel beam */}
      <rect x="0" y="838" width="1440" height="62" fill="url(#gf-oak)" />
      <rect x="0" y="838" width="1440" height="2" fill="#d8b15c" opacity="0.28" />
      <g fill="#0a0504">
        {/* a stack of books */}
        <rect x="116" y="806" width="116" height="32" />
        <rect x="128" y="780" width="96" height="26" />
        <rect x="120" y="758" width="104" height="22" />
        {/* a goblet */}
        <path d="M1150 838V800h-16c-4-18 2-36 10-48h44c8 12 14 30 10 48h-16v38Z" />
        <rect x="1128" y="832" width="82" height="8" />
      </g>
      <rect x="128" y="806" width="96" height="2" fill="#d8b15c" opacity="0.4" />
      <rect x="136" y="780" width="80" height="2" fill="#d8b15c" opacity="0.35" />
      {/* a candlestick with a small flame */}
      <g>
        <circle cx="1010" cy="762" r="46" fill="url(#gf-flame-glow)" className="glow-pulse" />
        <rect x="1005" y="772" width="10" height="66" fill="#0a0504" />
        <rect x="992" y="832" width="36" height="8" fill="#0a0504" />
        <path d="M1010 742c5 8 6 15 0 24c-6-9-5-16 0-24Z" fill="#ffd27a" className="flame-flick" />
      </g>
    </svg>
  );
}
