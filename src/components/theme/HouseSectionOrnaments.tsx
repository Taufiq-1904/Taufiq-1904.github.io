import type { BackdropId } from "@/lib/assets";
import { AstroRing } from "./AstroRing";
import { RuneSeal } from "@/components/scene/house/SlytherinScene";

/**
 * Quiet decoration for the margins of each chapter, one family per house, so the rooms below the hero
 * keep the character of the hero. Every piece is original linework drawn in code, sits at low opacity
 * (.sec-orn in houses.css) and is hidden from assistive technology. Only the active house's set is
 * displayed: CSS (data-h) removes the others, and `display: none` stops their animations too.
 *
 * Chapters alternate sides so the page does not feel stamped.
 */
const side: Record<BackdropId, "left" | "right"> = {
  about: "right",
  projects: "left",
  experience: "right",
  skills: "left",
  contact: "right",
};

const RAYS = Array.from({ length: 24 }, (_, i) => {
  const a = (i * 15 * Math.PI) / 180;
  const r1 = 58;
  const r2 = i % 2 === 0 ? 96 : 78;
  return {
    key: i,
    x1: (100 + Math.cos(a) * r1).toFixed(2),
    y1: (100 + Math.sin(a) * r1).toFixed(2),
    x2: (100 + Math.cos(a) * r2).toFixed(2),
    y2: (100 + Math.sin(a) * r2).toFixed(2),
  };
});

/** Gryffindor: a mane-sunburst ring, drawn in gold line. */
function Sunburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className} fill="none" stroke="currentColor" strokeLinecap="round">
      <circle cx="100" cy="100" r="50" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="42" strokeWidth="0.7" strokeDasharray="2 5" />
      {RAYS.map((r) => (
        <line key={r.key} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} strokeWidth={Number(r.key) % 2 === 0 ? 1.8 : 1} />
      ))}
      <path d="M86 108V94l7 6 7-10 7 10 7-6v14Z" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/** Hufflepuff: a sprig of leaves along a curved stem. */
function Sprig({ className }: { className?: string }) {
  const leaves = [
    { x: 40, y: 150, r: -50 },
    { x: 70, y: 112, r: 20 },
    { x: 78, y: 82, r: -55 },
    { x: 104, y: 54, r: 15 },
    { x: 118, y: 30, r: -50 },
  ];
  return (
    <svg viewBox="0 0 160 200" aria-hidden className={className} fill="currentColor" stroke="none">
      <path d="M26 200C34 150 60 110 86 76s34-52 40-74" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <path key={i} d="M0 0C9-12 26-11 34 0C26 11 9 12 0 0Z" transform={`translate(${l.x} ${l.y}) rotate(${l.r})`} opacity={0.9 - i * 0.08} />
      ))}
      {leaves.map((l, i) => (
        <path key={`m${i}`} d="M0 0C9-12 26-11 34 0C26 11 9 12 0 0Z" transform={`translate(${l.x + 18} ${l.y + 2}) rotate(${l.r + 120}) scale(0.8)`} opacity={0.6} />
      ))}
    </svg>
  );
}

export function HouseSectionOrnaments({ id }: { id: BackdropId }) {
  const right = side[id] === "right";
  const pos = right ? "right-[-6%] md:right-[2%]" : "left-[-6%] md:left-[2%]";

  return (
    <>
      <div data-h="gryffindor" className="absolute inset-0">
        <div className="sec-fog-g absolute inset-0" />
        <Sunburst className={`sec-orn top-[6%] w-[clamp(140px,20vw,280px)] ${pos}`} />
      </div>

      <div data-h="slytherin" className="absolute inset-0">
        <RuneSeal className={`sec-orn sec-orn-b top-[4%] w-[clamp(220px,32vw,460px)] ${pos}`} />
        <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[rgb(142_217_178/0.45)] to-transparent" />
      </div>

      <div data-h="ravenclaw" className="absolute inset-0">
        <AstroRing className={`sec-orn sec-orn-b top-[2%] w-[clamp(240px,34vw,500px)] ${pos}`} />
      </div>

      <div data-h="hufflepuff" className="absolute inset-0">
        <Sprig className={`sec-orn sec-orn-b bottom-0 w-[clamp(110px,14vw,200px)] opacity-30 ${right ? "right-[1%]" : "left-[1%] -scale-x-100"}`} />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_224_150/0.12),transparent_70%)]" />
      </div>
    </>
  );
}
