"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { REPLAY_INTRO_EVENT, clearIntroSeen } from "@/lib/introSession";
import {
  getMagic,
  getMagicServer,
  openLetter,
  openSorting,
  openWandPanel,
  resetOnboarding,
  setToolbar,
  subscribeMagic,
  type SpellId,
} from "@/lib/magic/magicState";
import { castSpell } from "@/lib/spells";
import { getWand, getWandServer, setWand, subscribeWand } from "@/lib/wandPref";
import { useLang } from "@/lib/i18n/useLang";

const icon = "size-5";
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const spellIcons: Record<SpellId, ReactNode> = {
  lumos: (
    <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
    </svg>
  ),
  nox: (
    <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
      <path d="M19.5 14.2A7.8 7.8 0 0 1 9.8 4.5a7.8 7.8 0 1 0 9.7 9.7Z" />
    </svg>
  ),
  alohomora: (
    <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
      <circle cx="8" cy="12" r="3.6" />
      <path d="M11.6 12H21M17.5 12v3M20.5 12v2.2" />
    </svg>
  ),
  leviosa: (
    <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
      <path d="M5 20c1-6 5-12 15-16-.6 7-5.4 12-13 13" />
      <path d="M5 20 13 12M9 15.6l4.2.6M11.4 12.6l3.6.4" />
    </svg>
  ),
  revelio: (
    <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
};

const SPELLS: readonly SpellId[] = ["lumos", "nox", "alohomora", "leviosa", "revelio"];

const toolButton =
  "magic-tool relative inline-flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 border px-1.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] transition duration-300 focus-visible:z-10";

function ToolbarButton({
  label,
  tip,
  pressed,
  busy,
  onClick,
  children,
}: {
  label: string;
  tip: string;
  pressed?: boolean;
  busy?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-no-magic
      aria-label={`${label}. ${tip}`}
      title={`${label}: ${tip}`}
      aria-pressed={pressed}
      aria-disabled={busy || undefined}
      onClick={() => {
        if (!busy) onClick();
      }}
      className={`${toolButton} ${
        pressed
          ? "border-gold-400 bg-gold-400/15 text-gold-300 shadow-[0_0_18px_rgb(var(--accent-rgb)/0.3)]"
          : "border-gold-500/25 text-parchment-300 hover:border-gold-400/70 hover:text-gold-300"
      } ${busy ? "cursor-wait opacity-55" : ""}`}
    >
      {children}
      <span aria-hidden>{label}</span>
    </button>
  );
}

/**
 * A compact, collapsible magic toolbar in the bottom-left corner: five ready-made spells (no typing), then the
 * wand, sparkle, letter, Sorting Hat and gate-replay controls. Collapsed it is a single 44px button, so it never
 * covers the portfolio. Every control is a real button with a label, a tooltip and a visible focus ring.
 */
export function SpellToolbar() {
  const { d } = useLang();
  const reduceMotion = useReducedMotion();
  const { toolbar, spell, cooling } = useSyncExternalStore(subscribeMagic, getMagic, getMagicServer);
  const sparkles = useSyncExternalStore(subscribeWand, getWand, getWandServer);
  const rootRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Escape closes the toolbar; a press outside it does too, so it never lingers over the page.
  useEffect(() => {
    if (!toolbar) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setToolbar(false);
    };
    const onDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setToolbar(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [toolbar]);

  if (!mounted) return null;

  const names = d.magic.spells;
  const activeName = spell ? names[spell].name : null;

  function replay() {
    clearIntroSeen();
    resetOnboarding();
    setToolbar(false);
    window.dispatchEvent(new Event(REPLAY_INTRO_EVENT));
  }

  return (
    <div ref={rootRef} data-no-magic className="fixed bottom-4 left-4 z-[56] flex max-w-[calc(100vw-2rem)] flex-col items-start gap-2">
      {toolbar ? (
        <div
          id="spell-toolbar"
          role="toolbar"
          aria-label={d.magic.label}
          className={`magic-panel border border-gold-500/40 bg-void-950/88 p-1.5 shadow-[0_18px_50px_rgb(0_0_0/0.6)] backdrop-blur-md ${reduceMotion ? "" : "animate-dialog-in"}`}
        >
          <div className="flex flex-wrap gap-1">
            {SPELLS.map((id) => (
              <ToolbarButton
                key={id}
                label={names[id].name}
                tip={names[id].tip}
                pressed={spell === id}
                busy={cooling && id !== "lumos" && id !== "nox" && spell !== id}
                onClick={() => castSpell(id)}
              >
                {spellIcons[id]}
              </ToolbarButton>
            ))}
          </div>

          <div className="mt-1 flex flex-wrap gap-1 border-t border-gold-500/15 pt-1">
            <ToolbarButton label={d.magic.tools.wand} tip={d.magic.tools.wandTip} onClick={() => { setToolbar(false); openWandPanel(); }}>
              <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
                <path d="m4 20 11-11" />
                <path d="m15 9 .6-1.9L17.5 6.5l-1.9-.6L15 4l-.6 1.9-1.9.6 1.9.6L15 9Z" fill="currentColor" stroke="none" />
                <path d="M19.5 12v3M18 13.5h3" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              label={d.magic.tools.sparkles}
              tip={sparkles ? d.magic.tools.sparklesOn : d.magic.tools.sparklesOff}
              pressed={sparkles}
              onClick={() => setWand(!sparkles)}
            >
              <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
                <path d="M12 3.5l1.6 4.9 4.9 1.6-4.9 1.6L12 16.5l-1.6-4.9L5.5 10l4.9-1.6L12 3.5ZM18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton label={d.magic.tools.letter} tip={d.magic.tools.letterTip} onClick={() => { setToolbar(false); openLetter(); }}>
              <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
                <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
                <path d="m3.5 7 8.5 6 8.5-6" />
              </svg>
            </ToolbarButton>
            <ToolbarButton label={d.magic.tools.hat} tip={d.magic.tools.hatTip} onClick={() => { setToolbar(false); openSorting(); }}>
              <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
                <path d="M12 3.2c-2 3.4-3.2 6-3.6 9.6M12 3.2c.8 1 1.6 2.2 2.2 3.4 1.2 2.3 1.8 4.4 1.9 6.2" />
                <path d="M3 17.6c3-1.6 6-2.3 9-2.3s6 .7 9 2.3c-2.8 2.4-5.8 3.4-9 3.4s-6.2-1-9-3.4Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton label={d.magic.tools.replay} tip={d.magic.tools.replayTip} onClick={replay}>
              <svg viewBox="0 0 24 24" aria-hidden className={icon} {...stroke}>
                <path d="M4 12a8 8 0 1 0 2.6-5.9M4 4.5V8h3.5" />
              </svg>
            </ToolbarButton>
          </div>

          <p role="status" aria-live="polite" className="px-1.5 pb-0.5 pt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment-500">
            {activeName ? d.magic.active(activeName) : cooling ? d.magic.busy : d.magic.ready}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        data-no-magic
        aria-expanded={toolbar}
        aria-controls="spell-toolbar"
        aria-label={toolbar ? d.magic.close : d.magic.open}
        title={toolbar ? d.magic.close : d.magic.open}
        onClick={() => setToolbar(!toolbar)}
        className={`relative inline-flex size-11 items-center justify-center border bg-void-950/75 backdrop-blur-sm transition duration-300 hover:border-gold-400 hover:text-gold-300 ${
          toolbar || spell ? "border-gold-400 text-gold-300" : "border-gold-500/40 text-parchment-300"
        }`}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="size-5" {...stroke}>
          <path d="m4 20 11-11" />
          <path d="m15 9 .6-1.9L17.5 6.5l-1.9-.6L15 4l-.6 1.9-1.9.6 1.9.6L15 9Z" fill="currentColor" stroke="none" />
          <path d="M19.5 12v3M18 13.5h3M7 4v2.5M5.75 5.25h2.5" />
        </svg>
        {spell ? <span aria-hidden className="absolute -right-1 -top-1 size-2.5 rounded-full bg-gold-300 shadow-[0_0_10px_rgb(var(--accent-rgb)/0.9)]" /> : null}
      </button>
    </div>
  );
}
