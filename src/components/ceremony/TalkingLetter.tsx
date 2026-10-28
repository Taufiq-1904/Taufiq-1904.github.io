"use client";

import { isDeliberateEscape } from "@/lib/magic/escapeGuard";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { closeLetter, getMagic, getMagicServer, subscribeMagic } from "@/lib/magic/magicState";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n/useLang";
import { OwlArt } from "@/components/scene/FlyingOwl";
import { CvButton } from "@/components/media/CvButton";

/**
 * The owl brings a letter that "speaks" without any sound. Sequence (about 6 seconds, skippable at any moment):
 * owl glides in and lands, the sealed envelope drops and wiggles for attention, the seal cracks, the paper
 * unfolds, and the lines write themselves as if by an invisible quill while the paper flutters.
 * Reduced motion shows the finished letter straight away. Close it with the button or Escape; replay re-runs it.
 * Only real information is used: my name, my tagline and links to sections that exist on this page.
 */
type Phase = "flying" | "landed" | "wiggle" | "unfolding" | "writing" | "done";

const TIMELINE: ReadonlyArray<[Phase, number]> = [
  ["landed", 1700],
  ["wiggle", 2300],
  ["unfolding", 3500],
  ["writing", 4400],
];

export function TalkingLetter() {
  const { letter } = useSyncExternalStore(subscribeMagic, getMagic, getMagicServer);
  const { d, t } = useLang();
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("flying");
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const start = useCallback(() => {
    clear();
    if (reduceMotion) {
      timers.current.push(window.setTimeout(() => setPhase("done"), 0));
      return;
    }
    timers.current.push(window.setTimeout(() => setPhase("flying"), 0));
    TIMELINE.forEach(([next, at]) => timers.current.push(window.setTimeout(() => setPhase(next), at)));
    timers.current.push(window.setTimeout(() => setPhase("done"), 4400 + 3600));
  }, [clear, reduceMotion]);

  // (Re)start whenever the letter opens; Escape closes it. Timers are always cleaned up.
  useEffect(() => {
    if (!letter) return;
    start();
    const openedAt = performance.now();
    const onKey = (event: KeyboardEvent) => {
      if (isDeliberateEscape(event, openedAt)) closeLetter();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clear();
      setPhase("flying"); // ready for the next delivery
      window.removeEventListener("keydown", onKey);
    };
  }, [letter, run, start, clear]);

  const lines = d.magic.letter.lines(site.name, t(site.tagline));
  const open = phase === "unfolding" || phase === "writing" || phase === "done";
  const writing = phase === "writing" || phase === "done";
  const flying = phase === "flying";

  return (
    <AnimatePresence>
      {letter ? (
        <motion.section
          key="letter"
          data-no-magic
          aria-label={d.magic.letter.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9, transition: { duration: 0.5, ease: "easeIn" } }}
          className="fixed bottom-20 right-3 z-[60] w-[min(26rem,calc(100vw-1.5rem))] sm:bottom-24 sm:right-5"
        >
          {/* The owl: flies in from beyond the right edge, lands on the card's top edge, then settles */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-[4.6rem] right-6 z-10 w-24"
            initial={reduceMotion ? false : { x: 460, y: -150, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, y: flying ? [-150, -60, 0] : 0, opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.7, ease: [0.22, 1, 0.36, 1] }}
            key={`owl-${run}`}
          >
            <div className={flying ? "" : "letter-owl-settle"}>
              <OwlArt />
            </div>
          </motion.div>

          <div className="relative">
            {/* The sealed envelope, before it opens */}
            <AnimatePresence>
              {!open ? (
                <motion.div
                  key={`env-${run}`}
                  aria-hidden
                  className="letter-envelope absolute inset-x-6 top-2 z-20 h-32 origin-top"
                  initial={{ opacity: 0, y: -90, rotate: 8 }}
                  animate={
                    phase === "wiggle"
                      ? { opacity: 1, y: 0, rotate: [0, -5, 5, -4, 4, 0], scale: [1, 1.04, 1, 1.04, 1] }
                      : phase === "landed"
                        ? { opacity: 1, y: [-60, 4, 0], rotate: 0 }
                        : { opacity: flying ? 0 : 1, y: 0, rotate: 0 }
                  }
                  exit={{ opacity: 0, scaleY: 0.2, transition: { duration: 0.4 } }}
                  transition={{ duration: phase === "wiggle" ? 0.9 : 0.6, ease: "easeOut" }}
                >
                  <svg viewBox="0 0 200 120" className="size-full drop-shadow-[0_10px_20px_rgb(0_0_0/0.5)]">
                    <rect x="4" y="12" width="192" height="104" rx="3" fill="#f1e7cf" stroke="#b49b6a" />
                    <path d="M4 14 L100 74 L196 14" fill="none" stroke="#b49b6a" strokeWidth="1.4" />
                    <path d="M4 114 L78 62 M196 114 L122 62" fill="none" stroke="#c9b88a" strokeWidth="1" />
                    <g data-unlock-target className="letter-seal">
                      <circle cx="100" cy="70" r="14" fill="var(--color-crimson-500)" stroke="rgb(0 0 0 / 0.35)" />
                      <circle cx="100" cy="70" r="9" fill="none" stroke="rgb(255 255 255 / 0.28)" />
                      <path className="letter-crack" d="M92 66 L99 71 L96 78 M108 64 L102 72" fill="none" stroke="rgb(0 0 0 / 0.5)" strokeWidth="1.4" strokeLinecap="round" />
                    </g>
                  </svg>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* The paper: unfolds from the envelope, flutters gently, writes itself */}
            <motion.article
              key={`paper-${run}`}
              className="letter-paper bg-parchment-page relative overflow-hidden border border-gold-700/50 p-5 pb-4 text-ink-900 shadow-[0_26px_70px_rgb(0_0_0/0.6)]"
              style={{ transformOrigin: "50% 0%", transformPerspective: 900 }}
              initial={false}
              animate={
                open
                  ? { opacity: 1, scaleY: 1, rotateX: 0, y: 0 }
                  : { opacity: 0, scaleY: 0.12, rotateX: -70, y: -6 }
              }
              transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={open && !reduceMotion ? { rotate: [0, -0.35, 0.3, 0], skewX: [0, 0.4, -0.3, 0] } : { rotate: 0, skewX: 0 }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-ink-gold">{d.magic.letter.eyebrow}</p>
                  <div className="-mr-2 -mt-2 flex">
                    <button
                      type="button"
                      onClick={() => setRun((n) => n + 1)}
                      aria-label={d.magic.letter.replay}
                      title={d.magic.letter.replay}
                      className="inline-flex size-11 items-center justify-center text-ink-700 transition hover:text-ink-900"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12a8 8 0 1 0 2.6-5.9M4 4.5V8h3.5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={closeLetter}
                      aria-label={d.magic.letter.close}
                      className="inline-flex size-11 items-center justify-center text-ink-700 transition hover:text-ink-900"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                        <path d="m6 6 12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Real text is always in the DOM for screen readers; the quill effect is purely visual. */}
                <div className="mt-1 text-[1.12rem] leading-snug">
                  <p className="font-display text-xl text-ink-900">
                    <span className={`letter-write ${reduceMotion ? "" : writing ? "is-writing" : "is-pending"}`} style={{ "--i": 0 } as React.CSSProperties}>
                      {d.magic.letter.greeting}
                    </span>
                  </p>
                  {lines.map((line, index) => (
                    <p key={index} className="mt-2.5 text-ink-700">
                      <span className={`letter-write ${reduceMotion ? "" : writing ? "is-writing" : "is-pending"}`} style={{ "--i": index + 1 } as React.CSSProperties}>
                        {line}
                      </span>
                    </p>
                  ))}
                  <p className="mt-3 font-display text-ink-900">
                    <span className={`letter-write ${reduceMotion ? "" : writing ? "is-writing" : "is-pending"}`} style={{ "--i": lines.length + 1 } as React.CSSProperties}>
                      {d.magic.letter.signoff(site.name)}
                    </span>
                  </p>
                </div>

                <div className={`mt-4 flex flex-wrap items-center gap-2 transition-opacity duration-500 ${phase === "done" ? "opacity-100" : "opacity-0"}`} aria-hidden={phase !== "done"}>
                  <a
                    href="#projects"
                    onClick={closeLetter}
                    tabIndex={phase === "done" ? 0 : -1}
                    className="inline-flex min-h-11 items-center border border-ink-900/35 px-4 font-display text-[0.68rem] uppercase tracking-[0.18em] text-ink-900 transition hover:border-ink-gold hover:bg-ink-900/5"
                  >
                    {d.magic.letter.projects}
                  </a>
                  <a
                    href="#contact"
                    onClick={closeLetter}
                    tabIndex={phase === "done" ? 0 : -1}
                    className="inline-flex min-h-11 items-center border border-ink-900/35 px-4 font-display text-[0.68rem] uppercase tracking-[0.18em] text-ink-900 transition hover:border-ink-gold hover:bg-ink-900/5"
                  >
                    {d.magic.letter.contact}
                  </a>
                </div>
                <div className={`mt-2 transition-opacity duration-500 ${phase === "done" ? "opacity-100" : "opacity-0"}`}>
                  <CvButton variant="secondary" className="letter-cv !border-ink-900/35 !text-ink-900 hover:!bg-ink-900/5" />
                </div>
              </motion.div>
            </motion.article>
          </div>

          <p role="status" className="sr-only">
            {phase === "done" ? d.magic.letter.delivered : ""}
          </p>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
