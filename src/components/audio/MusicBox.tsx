"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { assets } from "@/lib/assets";
import { useAssetExists } from "@/lib/useAssetExists";
import { useLang } from "@/lib/i18n/useLang";
import { getMusic, getMusicServer, setMuted, setVolume, subscribeMusic, toggle } from "@/lib/music";

const iconProps = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function NoteIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg {...iconProps} className="size-5" fill="currentColor" stroke="none">
      <path d="M8 5.5v13l11-6.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg {...iconProps} className="size-5" fill="currentColor" stroke="none">
      <rect x="6.5" y="5" width="4" height="14" rx="0.8" />
      <rect x="13.5" y="5" width="4" height="14" rx="0.8" />
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg {...iconProps} className="size-5">
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5Z" />
      {muted ? <path d="m16 9.5 5 5m0-5-5 5" /> : <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
    </svg>
  );
}

const control =
  "inline-flex size-11 shrink-0 items-center justify-center border border-gold-500/40 text-gold-300 transition duration-300 hover:border-gold-400 hover:bg-gold-400/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gold-500/40 disabled:hover:bg-transparent";

/**
 * An enchanted music box fixed to the corner. The <audio> element itself lives in lib/music.ts, so
 * this component can mount, unmount or re-render without ever restarting the track.
 */
export function MusicBox() {
  const { d } = useLang();
  const music = useSyncExternalStore(subscribeMusic, getMusic, getMusicServer);
  const file = useAssetExists(assets.music);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const unavailable = music.unavailable || file === "missing";
  const audible = music.playing && !music.muted && !unavailable;
  const status = unavailable
    ? d.music.statusUnavailable
    : music.playing
      ? music.muted
        ? d.music.statusMuted
        : d.music.statusPlaying
      : d.music.statusPaused;

  return (
    <section
      aria-label={d.music.region}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[56] flex flex-col items-end gap-2"
    >
      {open ? (
        <div
          id={panelId}
          className="w-[min(17rem,calc(100vw-2rem))] border border-gold-500/40 bg-void-900/95 p-4 shadow-[0_20px_60px_rgb(0_0_0/0.6)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-sm tracking-[0.18em] text-gold-300">{d.music.title}</p>
            {/* A small lamp: lit only while sound is actually coming out */}
            <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-parchment-300">
              <span
                aria-hidden
                className={`size-2.5 rounded-full ${audible ? "animate-flicker bg-gold-300 shadow-[0_0_10px_rgb(var(--accent-rgb)/0.9)]" : "bg-parchment-500/50"}`}
              />
              {audible ? d.intro.on : d.intro.off}
            </span>
          </div>

          <p role="status" className="mt-3 text-base leading-snug text-parchment-100">
            {status}
          </p>
          {unavailable ? <p className="mt-2 text-sm leading-snug text-parchment-300/85">{d.music.unavailableHelp}</p> : null}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              disabled={unavailable}
              aria-pressed={music.playing}
              aria-label={music.playing ? d.music.pause : d.music.play}
              className={control}
            >
              {music.playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              onClick={() => setMuted(!music.muted)}
              aria-pressed={music.muted}
              aria-label={music.muted ? d.music.unmute : d.music.mute}
              className={control}
            >
              <SpeakerIcon muted={music.muted} />
            </button>
            <label className="flex min-w-0 flex-1 items-center">
              <span className="sr-only">{d.music.volume}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(music.volume * 100)}
                onChange={(event) => setVolume(Number(event.currentTarget.value) / 100)}
                disabled={unavailable}
                aria-valuetext={`${Math.round(music.volume * 100)}%`}
                className="h-11 w-full min-w-0 accent-[var(--color-gold-400)] disabled:opacity-40"
              />
            </label>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={`${open ? d.music.collapse : d.music.expand}. ${status}`}
        className={`relative inline-flex size-12 items-center justify-center rounded-full border bg-void-950/80 text-gold-300 backdrop-blur-sm transition duration-300 hover:border-gold-400 hover:bg-gold-400/10 ${
          audible
            ? "border-gold-400 shadow-[0_0_22px_rgb(var(--accent-rgb)/0.55)]"
            : "border-gold-500/40"
        }`}
      >
        <NoteIcon />
        {audible ? (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-gold-400/40 [animation-duration:2.4s]" />
        ) : null}
        {/* A slash across the note while silent, so the state reads without colour */}
        {!audible ? (
          <span aria-hidden className="absolute h-px w-6 -rotate-45 bg-gold-300/80" />
        ) : null}
      </button>
    </section>
  );
}
