"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emitMagic } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";
import type { Localized } from "@/lib/i18n/locales";

type Relic = "wand" | "stone" | "cloak";

const copy = {
  region: { en: "The three Deathly Hallows, decorative and optional", id: "Tiga Relikui Kematian, dekoratif dan opsional" },
  title: { en: "The Three Hallows", id: "Tiga Relikui" },
  hint: {
    en: "Touch each one. They answer, and when all three have, something happens.",
    id: "Sentuh satu per satu. Masing-masing menjawab, dan saat ketiganya sudah, sesuatu terjadi.",
  },
  names: {
    wand: { en: "Elder Wand", id: "Tongkat Elder" },
    stone: { en: "Resurrection Stone", id: "Batu Kebangkitan" },
    cloak: { en: "Cloak of Invisibility", id: "Jubah Gaib" },
  } satisfies Record<Relic, Localized>,
  action: {
    wand: { en: "Cast a spark with the Elder Wand", id: "Pancarkan percikan dengan Tongkat Elder" },
    stone: { en: "Turn the Resurrection Stone", id: "Putar Batu Kebangkitan" },
    cloak: { en: "Draw the Cloak of Invisibility", id: "Tarik Jubah Gaib" },
  } satisfies Record<Relic, Localized>,
  progress: (n: number): Localized => ({ en: `Hallows awakened: ${n} of 3`, id: `Relikui terbangun: ${n} dari 3` }),
  cloakNote: {
    en: "The cloak hides the decorations for a moment. The page itself stays as it is.",
    id: "Jubah menyembunyikan dekorasi sesaat. Halaman itu sendiri tetap seperti biasa.",
  },
  finaleTitle: { en: "The three Hallows are united.", id: "Ketiga Relikui telah bersatu." },
  finaleBody: { en: "Master of Death is a grand title. I will settle for being a good engineer.", id: "Penguasa Kematian itu gelar yang megah. Saya cukup menjadi engineer yang baik." },
  skip: { en: "Skip", id: "Lewati" },
};

const CLOAK_MS = 5000;
const FINALE_MS = 9000;

/** Small helper: a one-shot effect that clears itself, so repeated clicks restart it cleanly. */
function useBurst(duration: number) {
  const [stamp, setStamp] = useState(0);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const fire = useCallback(() => {
    window.clearTimeout(timer.current);
    setStamp((n) => n + 1);
    timer.current = window.setTimeout(() => setStamp(0), duration);
  }, [duration]);
  return [stamp, fire] as const;
}

function WandSvg() {
  return (
    <svg viewBox="0 0 200 28" aria-hidden className="h-8 w-full">
      <defs>
        <linearGradient id="hw-wand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f4efe2" />
          <stop offset="1" stopColor="#bfb49a" />
        </linearGradient>
      </defs>
      <path d="M6 14 L170 11 L170 17 Z" fill="url(#hw-wand)" />
      {[34, 58, 82, 106, 130].map((x) => (
        <path key={x} d={`M${x} ${12.4 - (x / 170) * 1.2} q3 1.6 0 3.6 q-3 1.6 0 3.2`} stroke="#8d8368" strokeWidth="1" fill="none" strokeLinecap="round" />
      ))}
      <rect x="166" y="9" width="6" height="10" rx="2" fill="#d6c79a" />
      <rect x="171" y="7.6" width="26" height="12.8" rx="6.4" fill="#e9e1cd" stroke="#bfb49a" strokeWidth="1" />
      <path d="M178 8 V20 M185 8 V20 M192 8 V20" stroke="#bfb49a" strokeWidth="1" />
      <circle cx="6" cy="14" r="2.4" fill="#ffffff" />
    </svg>
  );
}

function StoneSvg() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="size-full">
      <defs>
        <radialGradient id="hw-stone" cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#4a4a52" />
          <stop offset="0.65" stopColor="#1b1b20" />
          <stop offset="1" stopColor="#09090b" />
        </radialGradient>
      </defs>
      <path d="M12 38 C8 22 22 8 36 10 C52 12 58 28 52 42 C46 56 20 56 12 38 Z" fill="url(#hw-stone)" stroke="#5b5b66" strokeWidth="1" />
      <g className="hw-rune" stroke="rgb(var(--accent-rgb))" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M32 18 L44 40 H20 Z" />
        <path d="M32 18 V40" />
        <circle cx="32" cy="34" r="5" />
      </g>
    </svg>
  );
}

function CloakSvg() {
  return (
    <svg viewBox="0 0 64 72" aria-hidden className="size-full">
      <defs>
        <linearGradient id="hw-cloak" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="rgb(190 210 235 / 0.5)" />
          <stop offset="1" stopColor="rgb(120 150 190 / 0.14)" />
        </linearGradient>
        <filter id="hw-ripple" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="1" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
        </filter>
      </defs>
      <g filter="url(#hw-ripple)" className="hw-cloak-shimmer">
        <path d="M32 4 C22 4 14 10 12 20 C10 34 6 52 4 66 C14 62 22 68 32 66 C42 68 50 62 60 66 C58 52 54 34 52 20 C50 10 42 4 32 4 Z" fill="url(#hw-cloak)" stroke="rgb(200 220 245 / 0.55)" strokeWidth="1" />
        <path d="M32 6 V64 M22 14 C20 34 16 52 12 64 M42 14 C44 34 48 52 52 64" stroke="rgb(200 220 245 / 0.28)" strokeWidth="0.8" fill="none" />
      </g>
    </svg>
  );
}

function HallowsSymbol({ animate }: { animate: boolean }) {
  const draw = () => (animate ? { pathLength: [0, 1], opacity: [0, 1] } : { pathLength: 1, opacity: 1 });
  const transition = (delay: number) => ({ duration: 1.5, delay, ease: "easeInOut" as const });
  return (
    <svg viewBox="0 0 120 130" aria-hidden className="mx-auto h-40 w-auto overflow-visible">
      <g fill="none" stroke="rgb(var(--accent-rgb))" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M60 8 L112 112 H8 Z" animate={draw()} transition={transition(0.2)} />
        <motion.circle cx="60" cy="82" r="28" animate={draw()} transition={transition(1.5)} />
        <motion.path d="M60 8 V112" animate={draw()} transition={transition(3)} />
      </g>
    </svg>
  );
}

type RelicButtonProps = {
  label: string;
  name: string;
  awake: boolean;
  wide?: boolean;
  onActivate: (el: HTMLElement) => void;
  onHover?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  extra?: ReactNode;
  children: ReactNode;
};

function RelicButton({ label, name, awake, wide = false, onActivate, onHover, extra, children }: RelicButtonProps) {
  return (
    <li className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={(event) => onActivate(event.currentTarget)}
        onPointerEnter={onHover}
        aria-label={label}
        className={`hw-relic relative flex items-center justify-center border border-transparent p-2 transition hover:border-gold-500/30 hover:bg-gold-400/5 focus-visible:border-gold-400 ${wide ? "h-20 w-52" : "size-20"} ${awake ? "hw-awake" : ""}`}
      >
        {children}
        {extra}
      </button>
      <span className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-parchment-300">{name}</span>
    </li>
  );
}

/**
 * A small shelf of the three Deathly Hallows near the end of the page. Each relic has its own animation and effect.
 * Awakening all three in one visit plays a short, restrained finale that can be skipped at any time. Everything is a
 * real button, so keyboard, mouse and touch all work, and none of the effects touch the portfolio text.
 */
export function DeathlyHallows() {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const [awake, setAwake] = useState<ReadonlySet<Relic>>(new Set());
  const [finale, setFinale] = useState(false);
  const [cloakOn, setCloakOn] = useState(false);
  const [wandStamp, fireWand] = useBurst(1100);
  const [stoneStamp, fireStone] = useBurst(2200);
  const [cloakStamp, fireCloak] = useBurst(1400);
  const cloakTimer = useRef(0);
  const shown = useRef(false);

  const burstAt = (el: HTMLElement, size: "small" | "large" = "small") => {
    const box = el.getBoundingClientRect();
    emitMagic({ type: "burst", x: box.left + box.width / 2, y: box.top + box.height / 2, size });
  };

  const mark = (relic: Relic) => {
    setAwake((prev) => {
      if (prev.has(relic)) return prev;
      const next = new Set(prev);
      next.add(relic);
      if (next.size === 3 && !shown.current) {
        shown.current = true;
        window.setTimeout(() => setFinale(true), 900);
      }
      return next;
    });
  };

  const castWand = (el: HTMLElement) => {
    fireWand();
    const box = el.getBoundingClientRect();
    emitMagic({ type: "burst", x: box.left + 18, y: box.top + box.height / 2 });
    mark("wand");
  };
  const turnStone = (el: HTMLElement) => {
    fireStone();
    burstAt(el);
    mark("stone");
  };
  const drawCloak = () => {
    fireCloak();
    setCloakOn(true);
    document.documentElement.dataset.cloak = "on";
    window.clearTimeout(cloakTimer.current);
    cloakTimer.current = window.setTimeout(() => {
      setCloakOn(false);
      delete document.documentElement.dataset.cloak;
    }, CLOAK_MS);
    mark("cloak");
  };

  useEffect(
    () => () => {
      window.clearTimeout(cloakTimer.current);
      delete document.documentElement.dataset.cloak;
    },
    [],
  );

  useEffect(() => {
    if (!finale) return;
    const close = window.setTimeout(() => setFinale(false), FINALE_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFinale(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(close);
      window.removeEventListener("keydown", onKey);
    };
  }, [finale]);

  return (
    <section aria-label={t(copy.region)} className="relative border-t border-gold-500/15 bg-void-900/30 px-4 py-10 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-sm uppercase tracking-[0.3em] text-gold-300">{t(copy.title)}</h2>
        <p className="mx-auto mt-2 max-w-lg text-base leading-snug text-parchment-300/85">{t(copy.hint)}</p>

        <ul className="mt-6 flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
          <RelicButton
            wide
            label={t(copy.action.wand)}
            name={t(copy.names.wand)}
            awake={awake.has("wand")}
            onActivate={castWand}
            onHover={(event) => {
              if (event.pointerType === "mouse" && wandStamp === 0) fireWand();
            }}
            extra={
              wandStamp ? (
                <span key={wandStamp} aria-hidden className="hw-wand-fx pointer-events-none absolute left-1 top-1/2">
                  <i className="hw-wand-line" />
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} className="hw-spark" style={{ "--dx": `${-(18 + i * 9)}px`, "--dy": `${((i % 3) - 1) * (8 + i * 2) - 14}px`, animationDelay: `${i * 35}ms` } as React.CSSProperties} />
                  ))}
                </span>
              ) : null
            }
          >
            <div className="w-full -rotate-6">
              <WandSvg />
            </div>
          </RelicButton>
          <RelicButton
            label={t(copy.action.stone)}
            name={t(copy.names.stone)}
            awake={awake.has("stone")}
            onActivate={turnStone}
            extra={
              stoneStamp ? (
                <span key={stoneStamp} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {[0, 1, 2].map((i) => (
                    <i key={i} className="hw-ring" style={{ animationDelay: `${i * 260}ms` }} />
                  ))}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <i key={`r${i}`} className="hw-float-rune" style={{ "--x": `${(i - 2) * 14}px`, animationDelay: `${i * 160}ms` } as React.CSSProperties} />
                  ))}
                </span>
              ) : null
            }
          >
            <div className="hw-stone size-14">
              <StoneSvg />
            </div>
          </RelicButton>
          <RelicButton
            label={t(copy.action.cloak)}
            name={t(copy.names.cloak)}
            awake={awake.has("cloak")}
            onActivate={drawCloak}
            extra={cloakStamp ? <span key={cloakStamp} aria-hidden className="hw-cloak-flash pointer-events-none absolute inset-0" /> : null}
          >
            <div className="h-16 w-14">
              <CloakSvg />
            </div>
          </RelicButton>
        </ul>

        <p role="status" aria-live="polite" className="mt-6 min-h-[1.5rem] font-mono text-[0.72rem] uppercase tracking-[0.18em] text-parchment-500">
          {cloakOn ? t(copy.cloakNote) : t(copy.progress(awake.size))}
        </p>
      </div>

      <AnimatePresence>
        {finale ? (
          <motion.div
            key="finale"
            role="dialog"
            aria-label={t(copy.finaleTitle)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setFinale(false)}
            data-no-magic
            className="fixed inset-0 z-[80] flex items-center justify-center bg-void-950/80 px-6 backdrop-blur-sm"
          >
            <div className="text-center" onClick={(event) => event.stopPropagation()}>
              <HallowsSymbol animate={!reduceMotion} />
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 4.6, duration: 0.9 }}
                className="mt-6 font-display text-xl tracking-[0.12em] text-gold-300 md:text-2xl"
              >
                {t(copy.finaleTitle)}
              </motion.p>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 5.4, duration: 0.9 }}
                className="mx-auto mt-3 max-w-sm text-lg italic leading-snug text-parchment-300"
              >
                {t(copy.finaleBody)}
              </motion.p>
              <button
                type="button"
                autoFocus
                onClick={() => setFinale(false)}
                className="mt-8 min-h-11 border border-gold-500/40 px-6 font-display text-xs uppercase tracking-[0.22em] text-gold-300 transition hover:border-gold-400 hover:bg-gold-400/10"
              >
                {t(copy.skip)}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
