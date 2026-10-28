"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import { HOUSES, houseInfo, houseScenes, type House } from "@/lib/theme/houses";
import { getHouse, getHouseServer, setHouse, subscribeHouse } from "@/lib/theme/houseStore";
import { openSorting } from "@/lib/magic/magicState";
import { useLang } from "@/lib/i18n/useLang";
import { HouseCrest } from "./HouseCrest";
import { HouseIcon } from "./HouseIcon";

/**
 * A button showing the current house; it opens a panel of four room cards, each with a preview of its
 * photograph, its crest, its name and a line about its atmosphere. Choosing one changes the whole world
 * (backdrop, portrait, ornaments, effects) and never blocks the page.
 *
 * Keyboard: Tab to the button, Enter or Space opens it and puts focus on the current house; arrow keys move
 * between houses, Enter or Space chooses, Escape closes (focus returns to the button). Pointer events
 * outside the panel close it. On narrow screens the panel is pinned to the screen edges so it never overflows.
 */
export function HouseSwitcher() {
  const { d, t } = useLang();
  const house = useSyncExternalStore(subscribeHouse, getHouse, getHouseServer);
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState<House | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Partial<Record<House, HTMLButtonElement | null>>>({});
  const panelId = useId();
  const noteId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    // Land on the current house so the choice is one keystroke away.
    optionRefs.current[house]?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
    // Only when the panel opens: choosing a house must not yank focus around.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the browser's address-bar colour in step with the house.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", houseInfo[house].chrome);
  }, [house]);

  function choose(next: House, event: MouseEvent<HTMLButtonElement>) {
    // The spell starts where the visitor clicked.
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((box.left + box.width / 2) / window.innerWidth) * 100;
    const y = ((box.top + box.height / 2) / window.innerHeight) * 100;
    setHouse(next, { x, y });
  }

  function onOptionKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const target = HOUSES[(index + step + HOUSES.length) % HOUSES.length];
    optionRefs.current[target]?.focus();
  }

  const currentName = t(houseInfo[house].name);
  const described = peek ?? house;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${d.theme.label}: ${currentName}`}
        title={`${d.theme.label}: ${currentName}`}
        onClick={() => setOpen((value) => !value)}
        className={`house-btn inline-flex min-h-11 min-w-11 items-center justify-center border text-gold-300 transition duration-300 hover:bg-gold-400/10 ${
          open ? "border-gold-400 bg-gold-400/15" : "border-gold-500/35"
        }`}
      >
        <HouseIcon house={house} />
      </button>

      {open ? (
        <div
          id={panelId}
          role="group"
          aria-label={d.theme.legend}
          aria-describedby={noteId}
          className="fixed inset-x-4 top-[4.5rem] z-50 border border-gold-500/40 bg-void-900/95 p-3 shadow-[0_20px_60px_rgb(0_0_0/0.6)] backdrop-blur-md sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[25rem]"
        >
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-gold-500">{d.theme.legend}</p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {HOUSES.map((option, index) => {
              const info = houseInfo[option];
              const selected = option === house;
              const name = t(info.name);
              return (
                <li key={option}>
                  <button
                    ref={(node) => {
                      optionRefs.current[option] = node;
                    }}
                    type="button"
                    aria-pressed={selected}
                    aria-label={selected ? d.theme.active(name) : d.theme.choose(name)}
                    onClick={(event) => choose(option, event)}
                    onKeyDown={(event) => onOptionKey(event, index)}
                    onPointerEnter={() => setPeek(option)}
                    onPointerLeave={() => setPeek(null)}
                    onFocus={() => setPeek(option)}
                    onBlur={() => setPeek(null)}
                    className={`house-option block w-full border text-left ${
                      selected ? "border-gold-400 bg-gold-400/10" : "border-gold-500/25 hover:border-gold-400/60"
                    }`}
                  >
                    <span className="relative block aspect-video overflow-hidden bg-void-950">
                      <Image
                        src={houseScenes[option].thumb}
                        alt=""
                        width={320}
                        height={180}
                        sizes="(min-width: 640px) 12rem, 45vw"
                        className="thumb size-full object-cover"
                      />
                      <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                      <span aria-hidden className="absolute bottom-1.5 left-1.5">
                        <HouseCrest house={option} className="size-8" />
                      </span>
                      {selected ? (
                        <span aria-hidden className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-gold-400 text-void-950 shadow-[0_0_14px_rgb(var(--accent-rgb)/0.7)]">
                          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                      ) : null}
                    </span>
                    <span className="block px-2.5 py-2">
                      <span className="block font-display text-sm tracking-wide text-parchment-100">{name}</span>
                      <span className="mt-0.5 block text-sm leading-tight text-parchment-300/80">{t(info.mood)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p aria-live="polite" className="mt-3 min-h-[3.25rem] text-base leading-snug text-parchment-300">
            {t(houseInfo[described].atmosphere)}
          </p>
          <p id={noteId} className="mt-2 text-sm italic leading-snug text-parchment-500">
            {d.theme.note}
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openSorting();
            }}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-gold-500/35 px-4 font-display text-[0.7rem] uppercase tracking-[0.2em] text-gold-300 transition hover:border-gold-400 hover:bg-gold-400/10"
          >
            {d.theme.hat}
          </button>
        </div>
      ) : null}
    </div>
  );
}
