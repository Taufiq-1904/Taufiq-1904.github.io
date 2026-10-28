"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useCoarsePointer } from "@/hooks/useMediaQuery";
import type { ReactNode } from "react";
import { HOUSES, type House } from "@/lib/theme/houses";
import { FlyingOwl } from "./FlyingOwl";
import { MagicParticles } from "./MagicParticles";
import { ParallaxLayer } from "./ParallaxLayer";
import { GryffindorArchitecture, GryffindorFloaters, GryffindorForeground } from "./house/GryffindorScene";
import { HufflepuffArchitecture, HufflepuffFloaters, HufflepuffForeground } from "./house/HufflepuffScene";
import { RavenclawArchitecture, RavenclawFloaters, RavenclawForeground } from "./house/RavenclawScene";
import { SlytherinArchitecture, SlytherinFloaters, SlytherinForeground } from "./house/SlytherinScene";

/**
 * What stands in front of each room's photograph, in three depths: architecture (banners, serpents,
 * constellations, ivy), things floating in the air, and the foreground edge. The photograph itself is the
 * fixed page backdrop (HouseBackdrop); this scene adds depth on top of it and moves with the pointer.
 */
const layers: Record<House, { architecture: ReactNode; floaters: ReactNode; foreground: ReactNode }> = {
  gryffindor: { architecture: <GryffindorArchitecture />, floaters: <GryffindorFloaters />, foreground: <GryffindorForeground /> },
  slytherin: { architecture: <SlytherinArchitecture />, floaters: <SlytherinFloaters />, foreground: <SlytherinForeground /> },
  ravenclaw: { architecture: <RavenclawArchitecture />, floaters: <RavenclawFloaters />, foreground: <RavenclawForeground /> },
  hufflepuff: { architecture: <HufflepuffArchitecture />, floaters: <HufflepuffFloaters />, foreground: <HufflepuffForeground /> },
};

/** Four copies of a layer; CSS (data-h) keeps only the active house's copy on screen and animating. */
function PerHouse({ layer }: { layer: keyof (typeof layers)[House] }) {
  return (
    <>
      {HOUSES.map((house) => (
        <div key={house} data-h={house} className="absolute inset-0">
          {layers[house][layer]}
        </div>
      ))}
    </>
  );
}

const spring = { stiffness: 50, damping: 18, mass: 0.7 };

/**
 * The cinematic backdrop for the hero. Two kinds of parallax stack here:
 * the pointer shifts each layer sideways by depth, and scrolling slides far layers slower than near ones.
 */
export function HeroScene() {
  const reduceMotion = useReducedMotion();
  const coarse = useCoarsePointer();
  const sceneRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, spring);
  const pointerY = useSpring(rawY, spring);

  // Progress of the hero leaving the screen, 0 at the top of the page and 1 once it is gone.
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end start"] });
  const scroll = reduceMotion ? undefined : scrollYProgress;
  // Half the travel on phones: still a sense of depth, a lot less to repaint.
  const travel = coarse ? 0.5 : 1;

  useEffect(() => {
    if (reduceMotion || coarse) return;
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, coarse, rawX, rawY]);

  return (
    <div ref={sceneRef} aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Light that belongs to the room, and a soft veil so the title never fights the photograph */}
      <div className="hero-light" />
      <div className="hero-veil" />
      {/* The owl is Gryffindor's creature; the other houses have their own (serpent, raven, badger) */}
      <div data-h="gryffindor" className="pointer-events-none absolute inset-0">
        <FlyingOwl />
      </div>
      <ParallaxLayer pointerX={pointerX} pointerY={pointerY} depth={-14} scrollProgress={scroll} scrollTravel={105 * travel}>
        <PerHouse layer="architecture" />
      </ParallaxLayer>
      <ParallaxLayer pointerX={pointerX} pointerY={pointerY} depth={-24} scrollProgress={scroll} scrollTravel={60 * travel}>
        <PerHouse layer="floaters" />
      </ParallaxLayer>
      <ParallaxLayer pointerX={pointerX} pointerY={pointerY} depth={-34} scrollProgress={scroll} scrollTravel={15 * travel}>
        <PerHouse layer="foreground" />
      </ParallaxLayer>

      <div className="pointer-events-none absolute inset-0">
        <MagicParticles count={coarse ? 22 : 56} />
      </div>

      {/* Fades keep the nav readable and blend the hero into the next section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-void-950/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-void-950/80 to-transparent" />
    </div>
  );
}
