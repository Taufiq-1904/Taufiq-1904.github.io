"use client";

import type { JSX } from "react";
import Image from "next/image";
import { assets, type BackdropId } from "@/lib/assets";
import { useAssetExists } from "@/lib/useAssetExists";
import { HouseSectionOrnaments } from "@/components/theme/HouseSectionOrnaments";

/**
 * Each chapter gets its own original, code-drawn setting behind the content, all tinted by the house
 * palette: candlelit hall (about), library shelves (projects), arched corridor (experience),
 * tower window under the moon (skills) and a forest edge (contact). It is original artwork, not film
 * imagery. If a licensed photo is set in `assets.backdrops`, it is laid underneath instead.
 */
const stone = "var(--color-void-600)";

function Candles() {
  const spots = [8, 19, 33, 47, 61, 74, 88];
  return (
    <>
      {spots.map((left, i) => (
        <span
          key={left}
          className="absolute animate-flicker rounded-full"
          style={{
            left: `${left}%`,
            top: `${6 + ((i * 7) % 15)}%`,
            width: 90,
            height: 90,
            marginLeft: -45,
            background: "radial-gradient(circle, rgb(var(--accent-rgb) / 0.22), transparent 65%)",
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      {spots.map((left, i) => (
        <span
          key={`c${left}`}
          className="absolute w-1 bg-parchment-300/40"
          style={{ left: `${left}%`, top: `${6 + ((i * 7) % 15)}%`, height: 14 }}
        />
      ))}
    </>
  );
}

function Shelves() {
  return (
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage: [
          "linear-gradient(to bottom, transparent 0 calc(100% - 6px), rgb(var(--accent-rgb) / 0.18) calc(100% - 6px))",
          "repeating-linear-gradient(90deg, rgb(var(--accent-rgb) / 0.06) 0 7px, transparent 7px 15px, rgb(255 255 255 / 0.03) 15px 18px, transparent 18px 31px)",
        ].join(","),
        backgroundSize: "100% 150px, auto",
      }}
    />
  );
}

function Arches() {
  return (
    <svg aria-hidden className="absolute inset-x-0 top-0 h-full w-full opacity-50" preserveAspectRatio="xMidYMin slice" viewBox="0 0 1200 600">
      <defs>
        <pattern id="arch-pattern" width="300" height="600" patternUnits="userSpaceOnUse">
          <path d="M30 600V250a120 120 0 0 1 240 0v350" fill="none" stroke={stone} strokeWidth="10" />
          <path d="M60 600V258a90 90 0 0 1 180 0v342" fill="none" stroke="rgb(var(--accent-rgb) / 0.2)" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="1200" height="600" fill="url(#arch-pattern)" />
    </svg>
  );
}

function TowerWindow() {
  return (
    <>
      <span
        className="absolute right-[8%] top-[10%] size-40 rounded-full"
        style={{ background: "radial-gradient(circle, rgb(var(--spark-core) / 0.35), rgb(var(--spark-mid) / 0.1) 55%, transparent 72%)" }}
      />
      <svg aria-hidden className="absolute right-[6%] top-[6%] h-[70%] w-[24%] min-w-40 opacity-50" viewBox="0 0 160 300" preserveAspectRatio="xMaxYMin meet">
        <path d="M10 300V110a70 70 0 0 1 140 0v190Z" fill="none" stroke={stone} strokeWidth="8" />
        <path d="M80 40v260M10 150h140" stroke={stone} strokeWidth="4" />
      </svg>
    </>
  );
}

function Forest() {
  return (
    <svg aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] w-full opacity-70" viewBox="0 0 1200 300" preserveAspectRatio="none">
      <path
        d="M0 300V190l30-60 25 70 35-120 30 110 30-80 28 100 32-150 34 140 30-90 28 110 36-140 30 120 28-70 32 100 34-130 28 110 30-90 30 120 32-150 34 140 28-100 30 110 34-140 30 130 28-80 32 110 30-90 36 130 30-110 28 90 34-130 30 110 28-70 32 100 34-120 28 110 30-90 30 120 32-140 34 130 28-90 30 100 34-120 30 110 28-70V300Z"
        fill="var(--color-void-950)"
      />
    </svg>
  );
}

const scenes: Record<BackdropId, () => JSX.Element> = {
  about: () => <Candles />,
  projects: () => <Shelves />,
  experience: () => <Arches />,
  skills: () => <TowerWindow />,
  contact: () => <Forest />,
};

export function SectionBackdrop({ id }: { id: BackdropId }) {
  const photoPath = assets.backdrops[id];
  const photo = useAssetExists(photoPath);
  const Scene = scenes[id];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {photoPath && photo === "present" ? (
        <Image src={photoPath} alt="" fill sizes="100vw" className="object-cover opacity-30" />
      ) : null}
      <Scene />
      <HouseSectionOrnaments id={id} />
      {/* Fog drifting slowly through the scene */}
      <div className="absolute inset-x-[-10%] bottom-0 h-1/2 animate-drift bg-[radial-gradient(ellipse_at_50%_100%,rgb(var(--house-fog)/0.14),transparent_70%)]" />
    </div>
  );
}
