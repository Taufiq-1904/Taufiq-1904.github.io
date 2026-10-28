"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { isDeliberateEscape } from "@/lib/magic/escapeGuard";
import { closeSorting, getMagic, getMagicServer, subscribeMagic } from "@/lib/magic/magicState";
import { HOUSES, houseInfo, houseScenes, type House } from "@/lib/theme/houses";
import { getHouse, getHouseServer, markHatSkipped, setHouse, subscribeHouse } from "@/lib/theme/houseStore";
import { useLang } from "@/lib/i18n/useLang";
import { HouseCrest } from "@/components/theme/HouseCrest";

type Mood = "idle" | "ponder" | "cry";

/** The hat: original artwork drawn in code (not a film prop). Its mouth and brow are driven by data-mood. */
function HatArt({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 240 250" aria-hidden data-mood={mood} className="hat-art h-full w-auto overflow-visible">
      <defs>
        <linearGradient id="hat-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6238" />
          <stop offset="0.55" stopColor="#5a3d20" />
          <stop offset="1" stopColor="#36240f" />
        </linearGradient>
        <linearGradient id="hat-brim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e4a27" />
          <stop offset="1" stopColor="#2c1b0a" />
        </linearGradient>
        <radialGradient id="hat-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgb(var(--accent-rgb))" stopOpacity="0.55" />
          <stop offset="1" stopColor="rgb(var(--accent-rgb))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse className="hat-aura" cx="120" cy="150" rx="118" ry="112" fill="url(#hat-glow)" />
      <ellipse cx="120" cy="238" rx="86" ry="7" fill="#000" opacity="0.35" />

      <g className="hat-sway">
        {/* Brim, then the floppy cone with its bent tip */}
        <path d="M14 196 C 40 180, 200 180, 226 196 C 214 222, 168 236, 120 236 C 72 236, 26 222, 14 196 Z" fill="url(#hat-brim)" stroke="#2a1a09" strokeWidth="2" />
        <path className="hat-cone" d="M44 198 C 50 140, 76 84, 108 50 C 126 30, 150 14, 172 6 C 188 2, 204 8, 210 20 C 196 16, 178 24, 168 42 C 156 66, 176 124, 198 198 C 160 186, 80 186, 44 198 Z" fill="url(#hat-body)" stroke="#2a1a09" strokeWidth="2" strokeLinejoin="round" />
        <path d="M60 190 C 68 140, 90 96, 116 64" fill="none" stroke="#a37a4a" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
        {/* Patched seam */}
        <path d="M150 186 C 146 150, 140 120, 150 92" fill="none" stroke="#d6b883" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="4 5" strokeLinecap="round" />
        <path d="M84 150 l14 -6 M88 164 l15 -5" stroke="#2a1a09" strokeOpacity="0.6" strokeWidth="1.3" strokeLinecap="round" />

        {/* Brow folds and eyes */}
        <g className="hat-brow">
          <path d="M70 128 C 80 118, 94 118, 102 126" fill="none" stroke="#25160a" strokeWidth="3" strokeLinecap="round" />
          <path d="M122 124 C 132 114, 148 116, 154 126" fill="none" stroke="#25160a" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="hat-eyes">
          <ellipse cx="86" cy="138" rx="5" ry="3.4" fill="#25160a" />
          <ellipse cx="139" cy="136" rx="5" ry="3.4" fill="#25160a" />
        </g>
        {/* Mouth: a long fold that opens when the hat speaks */}
        <g className="hat-mouth">
          <path className="hat-mouth-open" d="M70 166 C 92 190, 138 192, 160 164 C 140 176, 92 178, 70 166 Z" fill="#150b04" />
          <path d="M66 166 C 90 182, 140 184, 164 164" fill="none" stroke="#25160a" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

/**
 * The Sorting Hat ceremony. It does not replace the house store: it only calls setHouse(), so the existing
 * palette, backdrop, portrait, ornaments and spell wash all happen exactly as they do from the navbar switcher.
 * It is dismissible (Skip, Escape), keyboard operable, and never reloads the page.
 */
export function SortingHat() {
  const { sorting } = useSyncExternalStore(subscribeMagic, getMagic, getMagicServer);
  const current = useSyncExternalStore(subscribeHouse, getHouse, getHouseServer);
  const { d, t } = useLang();
  const reduceMotion = useReducedMotion();
  const [mood, setMood] = useState<Mood>("idle");
  const [pondered, setPondered] = useState(false);
  const [chosen, setChosen] = useState<House | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hatRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);
  const chosenRef = useRef<House | null>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const finish = useCallback(
    (skipped: boolean) => {
      chosenRef.current = null;
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
      if (skipped) markHatSkipped();
      setMood("idle");
      setPondered(false);
      setChosen(null);
      closeSorting();
      returnFocus.current?.focus?.({ preventScroll: true });
    },
    [],
  );

  // Open: remember where focus was, lock page scroll, trap focus, Escape skips.
  useEffect(() => {
    if (!sorting) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const openedAt = performance.now();
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    hatRef.current?.focus({ preventScroll: true });

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        // Ignore key auto-repeat and presses meant for the layer that just closed (see escapeGuard).
        if (isDeliberateEscape(event, openedAt)) finish(chosenRef.current === null);
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? []);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  function ponder() {
    if (chosen || mood === "ponder") return;
    setMood("ponder");
    later(() => {
      setPondered(true);
      setMood((value) => (value === "ponder" ? "idle" : value));
    }, reduceMotion ? 300 : 1700);
  }

  function pick(house: House, event: MouseEvent<HTMLButtonElement>) {
    if (chosen) return;
    const box = event.currentTarget.getBoundingClientRect();
    const origin = { x: ((box.left + box.width / 2) / window.innerWidth) * 100, y: ((box.top + box.height / 2) / window.innerHeight) * 100 };
    setChosen(house);
    chosenRef.current = house;
    setPondered(true);
    setMood("cry");
    setHouse(house, origin);
    later(() => finish(false), reduceMotion ? 700 : 1500);
  }

  function onCardKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-house-card]");
    buttons?.[(index + step + HOUSES.length) % HOUSES.length]?.focus();
  }

  const line = chosen ? d.magic.sorting.cry(t(houseInfo[chosen].name)) : mood === "ponder" ? d.magic.sorting.pondering : d.magic.sorting.title;

  return (
    <AnimatePresence>
      {sorting ? (
        <motion.div
          key="sorting"
          ref={rootRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sorting-eyebrow"
          data-no-magic
          data-mood={mood}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.5 }}
          className="sorting-root fixed inset-0 z-[80] overflow-y-auto bg-void-950/86 backdrop-blur-[3px]"
        >
          <div aria-hidden className="sorting-spot" />
          <button
            type="button"
            onClick={() => finish(chosen === null)}
            className="absolute right-3 top-3 z-10 inline-flex min-h-11 items-center gap-2 border border-gold-500/35 bg-void-950/60 px-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-parchment-300 backdrop-blur-sm transition hover:border-gold-400 hover:text-gold-300 sm:right-6 sm:top-6"
          >
            {d.magic.sorting.skip}
          </button>

          <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 pb-10 pt-16 sm:pt-12">
            <p id="sorting-eyebrow" className="font-display text-xs uppercase tracking-[0.34em] text-gold-400 sm:text-sm">
              {d.magic.sorting.eyebrow}
            </p>

            <button
              ref={hatRef}
              type="button"
              onClick={ponder}
              aria-label={d.magic.sorting.hatLabel}
              className="sorting-hat group relative mt-3 h-40 outline-offset-8 sm:h-52"
            >
              <HatArt mood={mood} />
            </button>

            <h2 aria-live="polite" className="mt-3 text-center font-display text-xl font-semibold text-parchment-100 sm:text-3xl">
              {line}
            </h2>
            <p className="mt-2 text-center text-lg italic text-parchment-300/85">
              {chosen ? d.magic.sorting.welcome(t(houseInfo[chosen].name)) : pondered ? d.magic.sorting.pick : d.magic.sorting.touch}
            </p>

            <ul className={`sorting-cards mt-7 grid w-full grid-cols-2 gap-3 lg:grid-cols-4 ${pondered || chosen ? "is-ready" : ""}`}>
              {HOUSES.map((house, index) => {
                const info = houseInfo[house];
                const name = t(info.name);
                const isCurrent = current === house && !chosen;
                return (
                  <li key={house}>
                    <button
                      type="button"
                      data-house-card
                      data-house={house}
                      disabled={chosen !== null && chosen !== house}
                      aria-label={d.magic.sorting.choose(name, t(info.trait))}
                      onClick={(event) => pick(house, event)}
                      onKeyDown={(event) => onCardKey(event, index)}
                      style={{ "--c1": info.swatch[0], "--c2": info.swatch[1] } as CSSProperties}
                      className={`sorting-card group relative block w-full overflow-hidden border text-left ${
                        chosen === house ? "is-chosen" : ""
                      } ${isCurrent ? "border-gold-400/70" : "border-gold-500/25"}`}
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden bg-void-950">
                        <Image
                          src={houseScenes[house].thumb}
                          alt=""
                          width={320}
                          height={180}
                          sizes="(min-width: 1024px) 14rem, 45vw"
                          className="sorting-thumb size-full object-cover"
                        />
                        <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                        <span aria-hidden className="sorting-sheen absolute inset-0" />
                        <span aria-hidden className="absolute bottom-2 left-2">
                          <HouseCrest house={house} className="size-9 sm:size-10" />
                        </span>
                      </span>
                      <span className="block px-3 pb-3 pt-2.5">
                        <span className="block font-display text-base tracking-wide text-parchment-100 sm:text-lg">{name}</span>
                        <span className="mt-1 block text-[0.95rem] leading-snug text-parchment-300/85">{t(info.trait)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-5 max-w-xl text-center text-sm italic leading-snug text-parchment-500">{d.theme.note}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
