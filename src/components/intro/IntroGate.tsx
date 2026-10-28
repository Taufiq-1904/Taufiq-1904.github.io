"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { createIntroAudio, type IntroAudio } from "@/lib/introAudio";
import { REPLAY_INTRO_EVENT, markIntroSeen, shouldShowIntro } from "@/lib/introSession";
import { startCeremony } from "@/lib/magic/magicState";
import { useLang } from "@/lib/i18n/useLang";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import "./intro.css";
import { GateStage } from "./GateStage";
import { IntroAtmosphere } from "./IntroAtmosphere";

type Phase = "idle" | "opening" | "skipping";
type Decision = "pending" | "show" | "skip";

/* ---------------- Motion ---------------- */

// The overlay itself dissolves at the very end, once the camera has passed through the gate.
const rootVariants: Variants = {
  idle: { opacity: 1 },
  opening: { opacity: 0, transition: { delay: 5.2, duration: 0.85, ease: "easeInOut" } },
  skipping: { opacity: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const copyVariants: Variants = {
  idle: { opacity: 1, y: 0 },
  opening: { opacity: 0, y: -14, transition: { duration: 0.5, ease: "easeIn" } },
};

// Golden light that swallows the screen while the camera is inside the gate.
const flashVariants: Variants = {
  idle: { opacity: 0 },
  opening: { opacity: 1, transition: { delay: 4.4, duration: 0.8, ease: "easeIn" } },
};

/* ---------------- External store: "has this session seen the intro?" ---------------- */

const subscribe = () => () => {};
const getSnapshot = (): Decision => (shouldShowIntro() ? "show" : "skip");
const getServerSnapshot = (): Decision => "pending";

/* ---------------- Small icons ---------------- */

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
      {on ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="m16 9.5 5 5m0-5-5 5" />}
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 6 6 6-6 6M12 6l6 6-6 6" />
    </svg>
  );
}

const controlClass =
  "inline-flex min-h-11 items-center gap-2 border border-gold-500/35 bg-void-950/55 px-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-parchment-300 backdrop-blur-sm transition duration-300 hover:border-gold-400 hover:text-gold-300 hover:shadow-[0_0_24px_rgb(230_189_95/0.18)]";

/* ---------------- Overlay ---------------- */

function IntroOverlay({ onFinish }: { onFinish: () => void }) {
  const { d } = useLang();
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("idle");
  const [soundOn, setSoundOn] = useState(false);
  const [soundUnavailable, setSoundUnavailable] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<IntroAudio | null>(null);
  const finishedRef = useRef(false);
  const timerRef = useRef(0);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.clearTimeout(timerRef.current);
    audioRef.current?.dispose();
    audioRef.current = null;
    onFinish();
  }, [onFinish]);

  const skip = useCallback(() => {
    if (finishedRef.current) return;
    setPhase((current) => (current === "skipping" ? current : "skipping"));
    // Skip is the escape hatch, so it must complete even if an animation callback never fires.
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(finish, 1200);
  }, [finish]);

  const enter = useCallback(() => {
    if (phase !== "idle") return;
    audioRef.current?.playOpen();
    if (reduceMotion) {
      // No gate swing or camera move: a short, calm dissolve instead.
      skip();
      return;
    }
    setPhase("opening");
    timerRef.current = window.setTimeout(finish, 8500);
  }, [phase, reduceMotion, skip, finish]);

  const toggleSound = useCallback(() => {
    if (soundOn) {
      audioRef.current?.setEnabled(false);
      setSoundOn(false);
      return;
    }
    // Created on the click, so the browser allows audio to start.
    audioRef.current ??= createIntroAudio();
    if (!audioRef.current) {
      setSoundUnavailable(true);
      return;
    }
    audioRef.current.setEnabled(true);
    setSoundOn(true);
  }, [soundOn]);

  // While the intro is up: lock page scroll, keep keyboard focus inside the dialog, focus the button.
  // Focus is trapped rather than marking the page `inert`: touching the page's DOM before React
  // has finished hydrating it would cause a hydration mismatch.
  useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? []).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const onFocusIn = (event: FocusEvent) => {
      if (root && event.target instanceof Node && !root.contains(event.target)) focusables()[0]?.focus({ preventScroll: true });
    };
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !root?.contains(current))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (current === last || !root?.contains(current))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onTab);

    enterRef.current?.focus({ preventScroll: true });

    return () => {
      html.style.overflow = previousOverflow;
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onTab);
    };
  }, []);

  // Escape always works.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.repeat) skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
      audioRef.current?.dispose();
      audioRef.current = null;
    },
    [],
  );

  return (
    <motion.div
      ref={rootRef}
      data-intro-root
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      variants={rootVariants}
      initial={false}
      animate={phase}
      onAnimationComplete={() => {
        if (phase !== "idle") finish();
      }}
      onClick={(event) => {
        // Anywhere on the scene starts it; the sound, skip and language controls keep their own jobs.
        if ((event.target as HTMLElement).closest("button, a, [data-no-intro-click]")) return;
        enter();
      }}
      className={`ig-root bg-night-sky fixed inset-0 z-[90] overflow-hidden`}
    >
      <IntroAtmosphere />
      <div aria-hidden className="ig-dim" />

      {/* Controls stay available the whole time */}
      <div className="absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-6">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          disabled={soundUnavailable}
          title={soundUnavailable ? d.intro.audioUnavailable : undefined}
          className={`${controlClass} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <SpeakerIcon on={soundOn} />
          <span>{d.intro.sound}</span>
          <span aria-hidden className="text-gold-400">
            {soundUnavailable ? d.intro.notAvailable : soundOn ? d.intro.on : d.intro.off}
          </span>
        </button>
        <button type="button" onClick={skip} className={controlClass}>
          <span>{d.intro.skip}</span>
          <SkipIcon />
        </button>
      </div>

      <div className="relative flex h-full flex-col items-center">
        <motion.div
          variants={copyVariants}
          className="relative z-30 shrink-0 px-6 pt-[max(4.75rem,calc(env(safe-area-inset-top)+3.75rem))] text-center md:pt-12"
        >
          <p
            className={`ig-fadeUp font-mono text-[0.68rem] tracking-[0.3em] text-gold-400/90 md:text-xs [@media(max-height:520px)]:hidden`}
            style={{ "--d": "0.3s" } as CSSProperties}
          >
            {d.intro.prompt}
          </p>
          <h1
            id="intro-title"
            className="mt-3 font-display text-[clamp(2rem,7vw,4.25rem)] font-bold leading-none tracking-[0.05em] drop-shadow-[0_0_36px_rgb(230_189_95/0.4)] [@media(max-height:520px)]:mt-0 [@media(max-height:520px)]:text-3xl"
          >
            <span className={`ig-titleWord text-gold-gradient`} style={{ "--d": "0.5s" } as CSSProperties}>
              {d.intro.welcome}
            </span>{" "}
            <span className={`ig-titleWord text-gold-gradient`} style={{ "--d": "0.9s" } as CSSProperties}>
              {d.intro.traveller}
            </span>
          </h1>
        </motion.div>

        {/* The gate fills whatever room is left; container units keep it fully visible at any size */}
        <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center [container-type:size]">
          <GateStage />
        </div>

        <motion.div
          variants={copyVariants}
          className="relative z-30 shrink-0 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 text-center"
        >
          <div className="ig-fadeUp" style={{ "--d": "1.3s" } as CSSProperties}>
          <div className="mb-4">
            <LanguageSwitch />
          </div>
          <p className="ig-hint mb-3 font-display text-[0.7rem] uppercase tracking-[0.34em] text-gold-300 md:text-sm [@media(max-height:560px)]:hidden">
            {d.intro.clickAnywhere}
          </p>
          <div>
          <button
            ref={enterRef}
            type="button"
            onClick={enter}
            disabled={phase !== "idle"}
            className={`ig-enter inline-flex min-h-12 items-center justify-center bg-linear-to-b from-gold-300 to-gold-500 px-7 py-3 font-display text-xs uppercase tracking-[0.2em] text-void-950 transition duration-300 hover:brightness-110 md:px-9 md:text-sm`}
          >
            {d.intro.enter}
          </button>
          </div>
          </div>
          <p className="mt-3 hidden font-mono text-[0.62rem] uppercase tracking-[0.28em] text-parchment-500 md:block [@media(max-height:620px)]:hidden">
            {d.intro.escHint}
          </p>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        variants={flashVariants}
        className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle_at_50%_54%,#fff6d6_0%,#f6dc8e_38%,#c99a3b_100%)]"
      />

      <p role="status" className="sr-only">
        {phase === "opening" ? d.intro.unlocking : ""}
      </p>
    </motion.div>
  );
}

/* ---------------- Public component ---------------- */

/**
 * Plays once per session, on top of the homepage. The homepage is already rendered underneath,
 * so finishing (or skipping) simply reveals it, and nothing about the page itself changes.
 */
export function IntroGate() {
  const decision = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [finished, setFinished] = useState(false);
  const [replay, setReplay] = useState(false);

  const handleFinish = useCallback(() => {
    markIntroSeen();
    setFinished(true);
    setReplay(false);
    // The Sorting Hat, wand choice and letter follow, each one dismissible.
    startCeremony();
  }, []);

  // The toolbar can replay the gate on purpose.
  useEffect(() => {
    const onReplay = () => {
      setFinished(false);
      setReplay(true);
    };
    window.addEventListener(REPLAY_INTRO_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_INTRO_EVENT, onReplay);
  }, []);

  const active = replay || (decision === "show" && !finished);

  // Once React owns the intro (or there is none), the pre-paint cover flag is no longer needed.
  useEffect(() => {
    if (decision !== "pending") document.documentElement.removeAttribute("data-intro");
  }, [decision]);

  // No gate this visit (already seen, or a deep link): there is no ceremony to wait for, but a first-time
  // visitor with no house yet still gets offered the Sorting Hat.
  useEffect(() => {
    if (decision === "skip" && !replay) {
      const id = window.setTimeout(() => {
        if (!document.documentElement.getAttribute("data-ceremony-done")) {
          document.documentElement.setAttribute("data-ceremony-done", "1");
          startCeremony();
        }
      }, 1200);
      return () => window.clearTimeout(id);
    }
  }, [decision, replay]);

  if (decision === "pending" && !replay) return <div aria-hidden data-intro-cover className="ig-cover" />;
  if (!active) return null;
  return <IntroOverlay onFinish={handleFinish} />;
}
