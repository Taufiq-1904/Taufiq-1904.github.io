"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { assets } from "@/lib/assets";
import { useAssetExists } from "@/lib/useAssetExists";
import { useLang } from "@/lib/i18n/useLang";
import { SHOW_PORTRAIT_PENDING_TAG, houseInfo, houseScenes } from "@/lib/theme/houses";
import { getHouse, getHouseServer, subscribeHouse } from "@/lib/theme/houseStore";
import { FrameParticles } from "./PortraitOrnaments";

/** One picture in the arch. `src: null` is the labelled empty frame (never a broken image). */
type Layer = { key: string; src: string | null; position: string; help: boolean; cutout: boolean };

const CHECKING: Layer = { key: "checking", src: null, position: "50% 18%", help: false, cutout: false };
const NO_PHOTO: Layer = { key: "no-photo", src: null, position: "50% 18%", help: true, cutout: false };

/** How long the outgoing portrait stays visible while the new one fades in (matches .is-out in houses.css). */
const SWAP_MS = 600;

/**
 * My portrait, standing inside the active house's room.
 *
 *  - The subject is a transparent cutout of the real photograph (public/images/portrait/cutout/<house>.webp,
 *    made by masking the background only; the face and clothing are untouched). It is placed in an arched
 *    window over a soft, blurred view of that house's room, lit with the house colour, with particles passing
 *    in front, so it reads as someone standing in the room rather than a photo pasted into a card.
 *  - Fallback chain per house, so nothing is ever broken: cutout, then the web crop (edges dissolve into the
 *    room with a mask), then the untouched original, then the profile photo, then a labelled placeholder.
 *  - Sources come from `houseScenes[house].portrait`, the single source of truth.
 */
export function ProfilePortrait({ className = "" }: { className?: string }) {
  const { d, t } = useLang();
  const reduceMotion = useReducedMotion();
  const house = useSyncExternalStore(subscribeHouse, getHouse, getHouseServer);
  const scene = houseScenes[house];
  const portrait = scene.portrait;
  const houseName = t(houseInfo[house].name);

  const cutout = useAssetExists(portrait.cutout);
  const web = useAssetExists(portrait.src);
  const original = useAssetExists(portrait.original);
  const profile = useAssetExists(assets.profilePhoto);

  const candidates: Array<[string, string, boolean, ReturnType<typeof useAssetExists>]> = [
    [portrait.cutout, portrait.position, true, cutout],
    [portrait.src, portrait.position, false, web],
    [portrait.original, portrait.position, false, original],
    [assets.profilePhoto, portrait.position, false, profile],
  ];
  let want: Layer | null = null;
  for (const [src, position, isCutout, state] of candidates) {
    if (state === "present") {
      want = { key: src, src, position, help: false, cutout: isCutout };
      break;
    }
    if (state === "checking") break; // keep what is showing until we know
    if (src === assets.profilePhoto) want = NO_PHOTO;
  }

  // State derived from a changing value, adjusted while rendering: the old layer stays for the length of the fade.
  const [shown, setShown] = useState<Layer>(CHECKING);
  const [leaving, setLeaving] = useState<Layer | null>(null);
  if (want && want.key !== shown.key) {
    setLeaving(shown);
    setShown(want);
  }

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setLeaving(null), SWAP_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  const pending = SHOW_PORTRAIT_PENDING_TAG && cutout === "missing" && shown.src !== null;

  return (
    <figure className={`mx-auto w-full max-w-[16rem] ${className}`}>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="relative"
      >
        <div className="portrait-arch relative">
          {/* The room: the house's own backdrop, softened, with light shafts in the house colour */}
          <div aria-hidden className="portrait-room">
            <Image
              src={scene.photo.srcSm}
              alt=""
              fill
              sizes="256px"
              className="object-cover"
              style={{ objectPosition: scene.photo.position }}
            />
            <span className="portrait-room-tint" />
            <span className="portrait-room-shafts" />
          </div>

          <div className="portrait-stage">
            {leaving ? <PortraitLayer layer={leaving} alt="" className="is-out" /> : null}
            <PortraitLayer
              key={shown.key}
              layer={shown}
              alt={d.portrait.altHouse(houseName)}
              className="is-in"
              help={shown.help ? { title: d.portrait.missingTitle, text: d.portrait.missingHelp } : undefined}
            />
            <div aria-hidden className="portrait-floor" />
            {pending ? (
              <p role="note" className="absolute inset-x-0 bottom-0 z-10 bg-void-950/85 px-2 py-1 text-center font-mono text-[0.6rem] leading-tight tracking-wide text-gold-300">
                Dev only: {houseName} cutout pending. Add {portrait.cutout.replace(/^\//, "public/")}
              </p>
            ) : null}
          </div>
          <span aria-hidden className="portrait-arch-edge" />
        </div>

        <FrameParticles />
      </motion.div>
      <figcaption className="mt-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.28em] text-gold-500">
        {d.portrait.caption}
      </figcaption>
    </figure>
  );
}

function PortraitLayer({
  layer,
  alt,
  className,
  help,
}: {
  layer: Layer;
  alt: string;
  className: string;
  help?: { title: string; text: string };
}) {
  return (
    <div className={`portrait-layer ${className}`} aria-hidden={alt === "" ? true : undefined}>
      {layer.src ? (
        <Image
          src={layer.src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 256px, 70vw"
          priority={false}
          className={layer.cutout ? "object-cover object-bottom portrait-subject" : "object-cover portrait-photo"}
          style={layer.cutout ? undefined : { objectPosition: layer.position }}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 p-5 text-center">
          <svg viewBox="0 0 24 24" aria-hidden className="size-12 text-gold-500/70" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
            <circle cx="12" cy="9" r="3.5" />
            <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
          </svg>
          {help ? (
            <>
              <p className="font-display text-sm tracking-wide text-parchment-100">{help.title}</p>
              <p className="text-sm leading-snug text-parchment-300/80">{help.text}</p>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
