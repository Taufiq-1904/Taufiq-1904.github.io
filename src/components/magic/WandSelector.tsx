"use client";

import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emitMagic } from "@/lib/magicBus";
import { chooseWand, closeWandPanel, resetWand, getMagic, getMagicServer, subscribeMagic } from "@/lib/magic/magicState";
import { WAND_IDS, wandInfo, type WandId } from "@/lib/magic/wands";
import { isDeliberateEscape } from "@/lib/magic/escapeGuard";
import { setWand } from "@/lib/wandPref";
import { useLang } from "@/lib/i18n/useLang";
import { WandArt } from "./WandArt";

/**
 * "Choose your wand": a compact floating panel, never a modal. The page behind stays readable and clickable,
 * Escape or the close button dismisses it, and the toolbar can reopen it at any time.
 */
export function WandSelector() {
  const { d, t } = useLang();
  const { wand, wandPanel } = useSyncExternalStore(subscribeMagic, getMagic, getMagicServer);
  const reduceMotion = useReducedMotion();
  const optionRefs = useRef<Partial<Record<WandId, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (!wandPanel) return;
    const openedAt = performance.now();
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (isDeliberateEscape(event, openedAt)) closeWandPanel();
    };
    window.addEventListener("keydown", onKey);
    optionRefs.current[wand ?? WAND_IDS[0]]?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
    // Focus only when the panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wandPanel]);

  function pick(id: WandId, node: HTMLElement) {
    const box = node.getBoundingClientRect();
    emitMagic({ type: "burst", x: box.left + box.width / 2, y: box.top + box.height / 2, size: "large" });
    setWand(true); // choosing a wand turns the sparkle effects on
    chooseWand(id);
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    optionRefs.current[WAND_IDS[(index + step + WAND_IDS.length) % WAND_IDS.length]]?.focus();
  }

  return (
    <AnimatePresence>
      {wandPanel ? (
        <motion.section
          key="wand-panel"
          data-no-magic
          aria-label={d.magic.wands.title}
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="magic-panel fixed inset-x-3 bottom-20 z-[70] max-w-[34rem] sm:inset-x-auto sm:left-4 border border-gold-500/45 bg-void-900/92 p-4 shadow-[0_24px_70px_rgb(0_0_0/0.65),0_0_40px_rgb(var(--accent-rgb)/0.16)] backdrop-blur-md sm:bottom-24"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-sm uppercase tracking-[0.28em] text-gold-300">{d.magic.wands.title}</h2>
              <p className="mt-1.5 text-base leading-snug text-parchment-300/90">{d.magic.wands.hint}</p>
            </div>
            <button
              type="button"
              onClick={closeWandPanel}
              aria-label={d.magic.wands.close}
              className="inline-flex size-11 shrink-0 items-center justify-center border border-gold-500/30 text-parchment-300 transition hover:border-gold-400 hover:text-gold-300"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div role="radiogroup" aria-label={d.magic.wands.title} className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {WAND_IDS.map((id, index) => {
              const info = wandInfo[id];
              const selected = wand === id;
              const name = t(info.name);
              return (
                <button
                  key={id}
                  ref={(node) => {
                    optionRefs.current[id] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={selected ? d.magic.wands.selected(name) : d.magic.wands.choose(name)}
                  onClick={(event) => pick(id, event.currentTarget)}
                  onKeyDown={(event) => onKey(event, index)}
                  style={{ "--wc": info.mid.split(" ").join(" ") } as React.CSSProperties}
                  className={`wand-option group relative flex min-h-[7.5rem] flex-col items-center justify-between gap-2 border px-2 pb-2.5 pt-3 text-center transition duration-300 ${
                    selected ? "border-gold-400 bg-gold-400/12" : "border-gold-500/25 hover:border-gold-400/70 hover:bg-gold-400/6"
                  }`}
                >
                  <span className="wand-art relative block w-full">
                    <WandArt id={id} className="h-7 w-full -rotate-[8deg]" />
                  </span>
                  <span className="block">
                    <span className="block font-display text-xs uppercase tracking-[0.16em] text-parchment-100">{name}</span>
                    <span className="mt-1 block text-[0.82rem] leading-tight text-parchment-300/80">{t(info.blurb)}</span>
                  </span>
                  {selected ? (
                    <span aria-hidden className="absolute right-1.5 top-1.5 inline-flex size-5 items-center justify-center rounded-full bg-gold-400 text-void-950">
                      <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-sm italic leading-snug text-parchment-500">{d.magic.wands.touchNote}</p>
            <button
              type="button"
              onClick={resetWand}
              disabled={!wand}
              className="min-h-11 border border-gold-500/30 px-3 font-display text-xs uppercase tracking-[0.16em] text-parchment-300 transition hover:border-gold-400 hover:text-gold-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {d.magic.wands.reset}
            </button>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
