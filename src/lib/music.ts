import { assets } from "@/lib/assets";

/**
 * One shared <audio> element for the whole site, created on first use and kept at module level, so
 * moving between sections never restarts or duplicates the music. Nothing plays until the visitor
 * presses play (browsers require a gesture, and sound should never start by itself).
 */
const PREF_KEY = "cloudexe:music";
export const DEFAULT_VOLUME = 0.2; // low on purpose
const FADE_MS = 1200;

export type MusicState = {
  /** The visitor wants music and it is (or is about to be) audible. */
  playing: boolean;
  muted: boolean;
  volume: number;
  /** The file failed to load, so the player explains how to add one. */
  unavailable: boolean;
  /** Left on last visit; resumes on the first tap or key press, never by itself. */
  resumeOnGesture: boolean;
};

type Saved = { on: boolean; volume: number; muted: boolean };

let state: MusicState = { playing: false, muted: false, volume: DEFAULT_VOLUME, unavailable: false, resumeOnGesture: false };
let audio: HTMLAudioElement | null = null;
let loaded = false;
let fadeFrame = 0;
let pending: (() => void) | null = null;
const listeners = new Set<() => void>();

function emit(patch: Partial<MusicState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function save() {
  try {
    const value: Saved = { on: state.playing, volume: state.volume, muted: state.muted };
    window.localStorage.setItem(PREF_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable: preferences last for this visit only */
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<Saved>;
    const volume = typeof saved.volume === "number" ? Math.min(1, Math.max(0, saved.volume)) : DEFAULT_VOLUME;
    state = { ...state, volume, muted: saved.muted === true, resumeOnGesture: saved.on === true };
  } catch {
    /* corrupt value: keep defaults */
  }
  if (state.resumeOnGesture) armGestureResume();
}

function armGestureResume() {
  if (pending) return;
  const run = () => {
    disarm();
    if (state.resumeOnGesture && !state.playing) void play();
  };
  const disarm = () => {
    window.removeEventListener("pointerdown", run);
    window.removeEventListener("keydown", run);
    pending = null;
  };
  pending = disarm;
  window.addEventListener("pointerdown", run, { once: true });
  window.addEventListener("keydown", run, { once: true });
}

function ensureAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (audio) return audio;
  const element = new Audio();
  element.preload = "none";
  element.loop = true;
  setElementVolume(element, 0);
  element.muted = state.muted;
  element.addEventListener("error", () => {
    emit({ unavailable: true, playing: false, resumeOnGesture: false });
  });
  element.src = assets.music;
  audio = element;
  return element;
}

/** HTMLMediaElement.volume throws outside 0..1, and fade maths can overshoot by a hair, so every write goes through here. */
function setElementVolume(element: HTMLAudioElement, value: number) {
  element.volume = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function fadeTo(target: number, done?: () => void) {
  const element = audio;
  if (!element) return;
  window.cancelAnimationFrame(fadeFrame);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const from = element.volume;
  if (reduce || Math.abs(from - target) < 0.01) {
    setElementVolume(element, target);
    done?.();
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / FADE_MS);
    setElementVolume(element, from + (target - from) * progress);
    if (progress < 1) fadeFrame = window.requestAnimationFrame(step);
    else done?.();
  };
  fadeFrame = window.requestAnimationFrame(step);
}

export function subscribeMusic(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getMusic(): MusicState {
  load();
  return state;
}

const serverState: MusicState = { playing: false, muted: false, volume: DEFAULT_VOLUME, unavailable: false, resumeOnGesture: false };
export function getMusicServer(): MusicState {
  return serverState;
}

export async function play(): Promise<void> {
  load();
  const element = ensureAudio();
  if (!element) return;
  try {
    await element.play();
    emit({ playing: true, unavailable: false, resumeOnGesture: false });
    fadeTo(state.volume);
    save();
  } catch {
    // Either the file is missing (the error listener reports it) or the browser blocked playback.
    emit({ playing: false });
  }
}

export function pause() {
  const element = audio;
  emit({ playing: false, resumeOnGesture: false });
  save();
  if (!element) return;
  fadeTo(0, () => element.pause());
}

export function toggle() {
  if (state.playing) pause();
  else void play();
}

export function setVolume(volume: number) {
  const next = Math.min(1, Math.max(0, volume));
  emit({ volume: next });
  if (audio && state.playing) {
    window.cancelAnimationFrame(fadeFrame);
    setElementVolume(audio, next);
  }
  save();
}

export function setMuted(muted: boolean) {
  emit({ muted });
  if (audio) audio.muted = muted;
  save();
}
