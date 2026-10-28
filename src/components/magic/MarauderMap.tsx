"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { OPEN_MAP_EVENT, toast } from "@/lib/magicBus";
import { discover, getSecretsCount, getSecretsServerCount, hasSecret, secrets, subscribeSecrets } from "@/lib/secrets";
import { navItems } from "@/lib/site";
import { castSpell } from "@/lib/spells";
import { useLang } from "@/lib/i18n/useLang";

function Footprints() {
  // Six prints that appear one after another, like someone walking across the parchment.
  return (
    <svg viewBox="0 0 240 40" aria-hidden className="mm-prints h-8 w-48 text-ink-700">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} style={{ animationDelay: `${0.6 + i * 0.35}s` }} className="mm-print" transform={`translate(${12 + i * 38} ${i % 2 ? 24 : 10})`}>
          <ellipse cx="0" cy="0" rx="4" ry="7" fill="currentColor" />
          <ellipse cx="0" cy="12" rx="3" ry="3.4" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

/**
 * The Marauder's Map: a hidden dialog, opened from the footer or by a spell.
 * It doubles as a working site map and shows which secrets have been found.
 */
export function MarauderMap() {
  const { d, t } = useLang();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [whisper, setWhisper] = useState("");
  const [miss, setMiss] = useState(false);
  const count = useSyncExternalStore(subscribeSecrets, getSecretsCount, getSecretsServerCount);

  useEffect(() => {
    const onOpen = () => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      setOpen(true);
      discover("map");
    };
    window.addEventListener(OPEN_MAP_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_MAP_EVENT, onOpen);
  }, []);

  function close() {
    dialogRef.current?.close();
  }

  function goTo(id: string) {
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function onWhisper(event: FormEvent) {
    event.preventDefault();
    const word = whisper.trim();
    if (!word) return;
    const cast = castSpell(word);
    setMiss(!cast);
    if (cast) {
      setWhisper("");
      // Spells that need the page (Lumos, Patronus, the cards) should be visible straight away.
      close();
    } else {
      toast(d.map.nothing);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="map-title"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto w-[min(100%-1.5rem,40rem)] bg-transparent p-0 text-ink-900 open:animate-dialog-in backdrop:bg-void-950/85 backdrop:backdrop-blur-sm"
    >
      {open ? (
        <div className="bg-parchment-page relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain border border-gold-700/50 p-6 shadow-[0_30px_90px_rgb(0_0_0/0.7)] sm:p-9">
          <button
            type="button"
            onClick={close}
            aria-label={d.map.close}
            className="absolute right-2 top-2 inline-flex size-11 items-center justify-center text-ink-700 transition hover:text-ink-900"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>

          <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-gold">{d.map.authors}</p>
          <h3 id="map-title" className="mm-ink mt-3 pr-8 font-display text-2xl leading-tight text-ink-900 md:text-3xl">
            {d.map.oath}
          </h3>
          <div className="mt-3">
            <Footprints />
          </div>

          <nav aria-label={d.map.navLabel} className="mt-6">
            <ul className="grid gap-2 sm:grid-cols-2">
              {navItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(item.id)}
                    className="group flex min-h-12 w-full items-center gap-3 border border-ink-900/25 px-4 text-left font-display text-sm uppercase tracking-[0.16em] text-ink-900 transition hover:border-ink-gold hover:bg-ink-900/5"
                  >
                    <span className="font-mono text-xs tracking-normal text-ink-gold">{index + 1}</span>
                    {d.nav[item.id]}
                    <span aria-hidden className="ml-auto transition group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="map-secrets" className="mt-8 border-t border-ink-900/20 pt-6">
            <h4 id="map-secrets" className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-gold">
              {d.map.secretsFound(count, secrets.length)}
            </h4>
            <ul className="mt-3 space-y-2">
              {secrets.map((secret) => {
                const known = hasSecret(secret.id);
                return (
                  <li key={secret.id} className="flex gap-3 text-lg leading-snug">
                    <span aria-hidden className={`mt-2.5 size-1.5 shrink-0 rotate-45 ${known ? "bg-ink-gold" : "border border-ink-700"}`} />
                    <span className={known ? "text-ink-900" : "italic text-ink-700"}>
                      {known ? t(secret.found) : t(secret.hint)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <form onSubmit={onWhisper} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">{d.map.whisperLabel}</span>
                <input
                  value={whisper}
                  onChange={(event) => {
                    setWhisper(event.target.value);
                    setMiss(false);
                  }}
                  maxLength={32}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={d.map.whisperPlaceholder}
                  aria-invalid={miss}
                  className="block min-h-11 w-full border border-ink-900/30 bg-white/40 px-3 text-lg text-ink-900 placeholder:text-ink-700/60 focus:border-ink-gold focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="min-h-11 border border-ink-900/50 px-5 font-display text-xs uppercase tracking-[0.2em] text-ink-900 transition hover:bg-ink-900 hover:text-parchment-100"
              >
                {d.map.cast}
              </button>
            </form>
          </section>

          <button
            type="button"
            onClick={close}
            className="mt-8 font-display text-xs uppercase tracking-[0.3em] text-ink-gold transition hover:text-ink-900"
          >
            {d.map.signOff}
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
