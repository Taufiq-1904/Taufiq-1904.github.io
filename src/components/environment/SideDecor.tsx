import type { ReactNode } from "react";
import type { House } from "@/lib/theme/houses";
import { HOUSES } from "@/lib/theme/houses";
import { HouseIcon } from "@/components/theme/HouseIcon";

/**
 * Left and right margin pieces for wide screens only (CSS hides them below 1280px, so tablets and phones keep
 * the content area clear). Each house gets different pieces and a different left/right balance, in three
 * depths: a distant banner, middle-ground floaters, and a faint rune that only Revelio shows.
 * Server component: no state, all motion is CSS and stops with the house's `display: none`.
 */

function Banner({ house, tail }: { house: House; tail: "swallow" | "point" | "round" }) {
  const shape = {
    swallow: "M4 0H76V132L40 112L4 132Z",
    point: "M4 0H76V104L40 136L4 104Z",
    round: "M4 0H76V104C76 126 58 138 40 138C22 138 4 126 4 104Z",
  }[tail];
  return (
    <div className="deco-banner" data-levitate-item>
      <svg viewBox="0 0 80 150" aria-hidden className="w-full">
        <rect x="0" y="0" width="80" height="5" rx="2" fill="#2a1b0c" />
        <path d={shape} transform="translate(0 4)" fill="var(--color-crimson-500)" stroke="var(--color-gold-500)" strokeWidth="1.6" />
        <path d={shape} transform="translate(0 4) scale(0.86 0.9) translate(6.5 6)" fill="none" stroke="var(--color-gold-300)" strokeOpacity="0.5" strokeWidth="0.8" />
      </svg>
      <span className="deco-banner-emblem" style={{ color: "var(--color-gold-300)" }}>
        <HouseIcon house={house} className="size-full" />
      </span>
    </div>
  );
}

function Candles({ tint = "gold" }: { tint?: "gold" | "green" }) {
  const lengths = [34, 52, 40];
  return (
    <div className={`deco-candles deco-candles-${tint}`}>
      {lengths.map((h, i) => (
        <div key={i} className="deco-candle" data-levitate-item style={{ "--d": `${i * 1.3}s`, "--h": `${h}px` } as React.CSSProperties}>
          <i className="deco-flame" />
          <b />
        </div>
      ))}
    </div>
  );
}

function Books() {
  return (
    <div className="deco-books">
      {[
        { c: "#2b4aa8", r: -8, d: "0s" },
        { c: "#7a5630", r: 6, d: "1.6s" },
      ].map((b, i) => (
        <svg key={i} viewBox="0 0 70 54" aria-hidden className="deco-book" data-levitate-item style={{ "--r": `${b.r}deg`, "--d": b.d } as React.CSSProperties}>
          <path d="M6 10 C 22 4, 30 8, 35 14 C 40 8, 48 4, 64 10 V44 C 48 38, 40 42, 35 48 C 30 42, 22 38, 6 44 Z" fill={b.c} stroke="var(--color-gold-400)" strokeWidth="1.2" />
          <path d="M35 14 V48" stroke="var(--color-gold-300)" strokeOpacity="0.6" />
          <path d="M12 18 C 22 15, 28 17, 31 21 M12 25 C 22 22, 28 24, 31 28 M39 21 C 42 17, 48 15, 58 18 M39 28 C 42 24, 48 22, 58 25" fill="none" stroke="var(--color-parchment-100)" strokeOpacity="0.5" strokeWidth="0.9" />
        </svg>
      ))}
      <svg viewBox="0 0 40 70" aria-hidden className="deco-feather" data-levitate-item>
        <path d="M30 4 C 12 14, 6 40, 12 66 C 22 54, 34 34, 30 4 Z" fill="var(--color-parchment-300)" fillOpacity="0.8" />
        <path d="M30 4 C 24 26, 16 46, 12 66" fill="none" stroke="var(--color-gold-500)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function Lantern() {
  return (
    <div className="deco-lantern" data-levitate-item>
      <svg viewBox="0 0 50 90" aria-hidden className="w-full">
        <path d="M25 0 V14" stroke="#4a3a1c" strokeWidth="2" />
        <path d="M14 20 H36 L40 30 H10 Z" fill="#3a2a10" />
        <rect x="12" y="30" width="26" height="36" rx="3" fill="rgb(255 217 120 / 0.28)" stroke="#8f6a0e" strokeWidth="2" />
        <circle className="deco-lantern-flame" cx="25" cy="50" r="6" fill="#ffd877" />
        <path d="M10 66 H40 L36 74 H14 Z" fill="#3a2a10" />
      </svg>
    </div>
  );
}

function Vine() {
  return (
    <svg viewBox="0 0 70 220" aria-hidden className="deco-vine w-full" fill="currentColor">
      <path d="M35 0 C 20 40, 52 70, 34 110 C 22 140, 44 170, 30 214" fill="none" stroke="#4d6b35" strokeWidth="3" strokeLinecap="round" />
      {[
        [26, 26, -35],
        [44, 62, 30],
        [28, 96, -40],
        [44, 130, 25],
        [30, 168, -30],
      ].map(([x, y, r], i) => (
        <path key={i} d="M0 0C8-11 24-10 32 0C24 10 8 11 0 0Z" transform={`translate(${x} ${y}) rotate(${r})`} fill="#5f8244" opacity={0.9 - i * 0.08} />
      ))}
    </svg>
  );
}

function Orbs() {
  return (
    <div className="deco-orbs">
      {[0, 1, 2].map((i) => (
        <i key={i} data-levitate-item style={{ "--d": `${i * 1.7}s`, "--s": `${10 + i * 5}px` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Pillar() {
  return (
    <div className="deco-pillar" aria-hidden>
      <i />
    </div>
  );
}

/** A faint sigil that only Revelio brings out. Purely decorative: no words, no information. */
function Sigil() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className="deco-sigil" data-revelio-hidden fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="30" cy="30" r="22" />
      <path d="M30 12 V48 M14 30 H46 M18 18 L42 42 M42 18 L18 42" opacity="0.7" />
      <circle cx="30" cy="30" r="5" />
    </svg>
  );
}

const left: Record<House, ReactNode> = {
  gryffindor: <Banner house="gryffindor" tail="swallow" />,
  slytherin: <Pillar />,
  ravenclaw: <Banner house="ravenclaw" tail="point" />,
  hufflepuff: <Vine />,
};
const right: Record<House, ReactNode> = {
  gryffindor: <Candles />,
  slytherin: (
    <>
      <Banner house="slytherin" tail="round" />
      <Orbs />
    </>
  ),
  ravenclaw: <Books />,
  hufflepuff: (
    <>
      <Lantern />
      <Banner house="hufflepuff" tail="round" />
    </>
  ),
};

export function HouseSideDecor() {
  return (
    <div aria-hidden className="side-decor pointer-events-none fixed inset-x-0 bottom-0 top-16 z-0 hidden overflow-hidden xl:block">
      {HOUSES.map((house) => (
        <div key={house} data-h={house} className="absolute inset-0">
          <div className="side-col side-left">
            {left[house]}
            <Sigil />
          </div>
          <div className="side-col side-right">
            {right[house]}
            <Sigil />
          </div>
        </div>
      ))}
    </div>
  );
}
