import type { CSSProperties } from "react";
import { HOUSES, type House } from "@/lib/theme/houses";

/**
 * Decoration for the portrait frame: a corner piece per house (gold brackets, silver curls, star-chart arcs,
 * leaf sprigs) and a few particles that behave like the house they belong to. Corner shapes are drawn once
 * for the top-left and rotated into the other three corners.
 */
const corners: Record<House, React.ReactNode> = {
  gryffindor: (
    <>
      <path d="M2 22V5c0-1.7 1.3-3 3-3h17" stroke="#d8b15c" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 5.5l3.5 3.5L9 12.5 5.5 9Z" fill="#d8b15c" />
      <path d="M15 2v5M2 15h5" stroke="#e87942" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  slytherin: (
    <>
      <path d="M2 24V8c0-3.3 2.7-6 6-6h16" stroke="#c3d0cb" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 2c0 6 6 6 6 11" stroke="#c3d0cb" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <circle cx="9.5" cy="9.5" r="2.2" fill="#8ed9b2" />
      <circle cx="9.5" cy="9.5" r="4.5" fill="#8ed9b2" opacity="0.2" />
    </>
  ),
  ravenclaw: (
    <>
      <path d="M2 22V6a4 4 0 0 1 4-4h16" stroke="#b68a55" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 14A12 12 0 0 1 14 2" stroke="#dce7f7" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M10 4.5L11.2 8.8 15.5 10 11.2 11.2 10 15.5 8.8 11.2 4.5 10 8.8 8.8Z" fill="#dce7f7" />
    </>
  ),
  hufflepuff: (
    <>
      <path d="M2 24V9c0-3.9 3.1-7 7-7h15" stroke="#d5a928" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 7c6-3 10 0 11 5-6 3-10 0-11-5Z" fill="#65744a" />
      <path d="M6 7c4 1 7 3 11 5" stroke="#2c3520" strokeWidth="0.7" opacity="0.6" />
      <circle cx="20" cy="5" r="1.8" fill="#ffe5a1" />
    </>
  ),
};

function Corner({ house, className }: { house: House; className: string }) {
  return (
    <svg viewBox="0 0 26 26" aria-hidden className={`pointer-events-none absolute size-8 ${className}`} fill="none">
      {corners[house]}
    </svg>
  );
}

type Spot = { left: string; top: string; d: string; x?: string };
const spots: Record<House, Spot[]> = {
  gryffindor: [
    { left: "12%", top: "96%", d: "0s", x: "-6px" },
    { left: "30%", top: "100%", d: "1.4s", x: "8px" },
    { left: "58%", top: "98%", d: "2.6s", x: "-10px" },
    { left: "78%", top: "100%", d: "0.8s", x: "6px" },
    { left: "94%", top: "94%", d: "3.4s", x: "-4px" },
  ],
  slytherin: [
    { left: "-3%", top: "22%", d: "0s" },
    { left: "102%", top: "40%", d: "1.6s" },
    { left: "-4%", top: "70%", d: "3s" },
    { left: "101%", top: "88%", d: "0.9s" },
    { left: "60%", top: "-3%", d: "2.2s" },
  ],
  ravenclaw: [
    { left: "-4%", top: "12%", d: "0s" },
    { left: "103%", top: "26%", d: "1.2s" },
    { left: "-5%", top: "62%", d: "2.1s" },
    { left: "102%", top: "84%", d: "0.5s" },
    { left: "72%", top: "-4%", d: "1.8s" },
  ],
  hufflepuff: [
    { left: "-3%", top: "30%", d: "0s" },
    { left: "102%", top: "52%", d: "2.4s" },
    { left: "-2%", top: "84%", d: "4.2s" },
    { left: "98%", top: "10%", d: "1.2s" },
  ],
};
const particleClass: Record<House, string> = {
  gryffindor: "pp-ember",
  slytherin: "pp-silver",
  ravenclaw: "pp-star",
  hufflepuff: "pp-pollen",
};

function Particle({ house, spot }: { house: House; spot: Spot }) {
  const style = { left: spot.left, top: spot.top, "--d": spot.d, "--x": spot.x ?? "0px" } as CSSProperties;
  if (house === "ravenclaw") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={`pp ${particleClass[house]}`} style={style} fill="currentColor">
        <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4Z" />
      </svg>
    );
  }
  return <span aria-hidden className={`pp ${particleClass[house]}`} style={style} />;
}

/** Corners for all four houses; CSS shows only the active house's set. */
export function FrameCorners() {
  return (
    <>
      {HOUSES.map((house) => (
        <span key={house} data-h={house} className="contents">
          <Corner house={house} className="-left-2 -top-2" />
          <Corner house={house} className="-right-2 -top-2 rotate-90" />
          <Corner house={house} className="-bottom-2 -right-2 rotate-180" />
          <Corner house={house} className="-bottom-2 -left-2 -rotate-90" />
        </span>
      ))}
    </>
  );
}

/** Particles for all four houses, skipped entirely for visitors who prefer reduced motion (CSS hides .pp). */
export function FrameParticles() {
  return (
    <>
      {HOUSES.map((house) => (
        <span key={house} data-h={house} className="contents">
          {spots[house].map((spot) => (
            <Particle key={`${spot.left}-${spot.top}`} house={house} spot={spot} />
          ))}
        </span>
      ))}
    </>
  );
}
