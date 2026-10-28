import { DEFAULT_HOUSE, HOUSES, houseScenes, isHouse, type House } from "./houses";

/**
 * The chosen house, kept in a tiny external store (read with useSyncExternalStore) like the language.
 *
 * Three attributes on <html> restyle the page, all set by the boot script below before first paint, so a
 * returning visitor never sees the default room flash and nothing depends on hydration:
 *
 *  - data-house : palette, ornaments, shapes and typography (instant).
 *  - data-bg    : which photograph is showing. On a switch it follows data-house only once the new photo
 *                 has decoded, so the cross-fade never shows an empty room.
 *  - data-bg-prev / data-wash : present for about a second while the old room fades and the spell plays.
 */
export const HOUSE_KEY = "cloudexe:house";
const HAT_SKIPPED_KEY = "cloudexe:hat-skipped";

// Remembered for this page load even when storage is blocked, so the Sorting Hat is neither skipped for
// visitors whose browser refuses storage nor offered again right after they have used it.
let chosenThisVisit = false;
let skippedThisVisit = false;

let current: House = DEFAULT_HOUSE;
let loaded = false;
const listeners = new Set<() => void>();

let swapToken = 0;
let prevTimer: ReturnType<typeof setTimeout> | undefined;
let washTimer: ReturnType<typeof setTimeout> | undefined;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = window.localStorage.getItem(HOUSE_KEY);
    if (isHouse(saved)) current = saved;
  } catch {
    /* storage blocked: the default applies */
  }
}

/** True once the visitor has picked a house (here or in an earlier visit). The Sorting Hat ceremony only auto-opens before that. */
export function hasChosenHouse(): boolean {
  if (typeof window === "undefined") return true;
  if (chosenThisVisit || skippedThisVisit) return true;
  try {
    return isHouse(window.localStorage.getItem(HOUSE_KEY)) || window.localStorage.getItem(HAT_SKIPPED_KEY) === "1";
  } catch {
    return false; // storage blocked: nothing is remembered, so offer it once per visit like the gate itself
  }
}

/** The visitor closed the Sorting Hat without choosing: remember it, so the ceremony never nags again. */
export function markHatSkipped() {
  skippedThisVisit = true;
  try {
    window.localStorage.setItem(HAT_SKIPPED_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Part of "start over": the Sorting Hat may open by itself again for a visitor who has no house. */
export function clearHatSkipped() {
  skippedThisVisit = false;
  try {
    window.localStorage.removeItem(HAT_SKIPPED_KEY);
  } catch {
    /* ignore */
  }
}

export function subscribeHouse(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getHouse(): House {
  load();
  return current;
}

export function getHouseServer(): House {
  return DEFAULT_HOUSE;
}

/** Resolves once the image is decoded (or failed, or took too long): the swap must never wait on a bad file. */
function preload(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    const timeout = setTimeout(resolve, 1800);
    const done = () => {
      clearTimeout(timeout);
      resolve();
    };
    image.onerror = done;
    image.src = src;
    if (typeof image.decode === "function") image.decode().then(done, done);
    else image.onload = done;
  });
}

/** Where the spell starts: the point on screen the visitor clicked, as percentages of the viewport. */
export type SpellOrigin = { x: number; y: number };

export function setHouse(next: House, origin?: SpellOrigin) {
  load();
  chosenThisVisit = true;
  const root = document.documentElement;
  const unchanged = next === current && root.getAttribute("data-house") === next;
  current = next;
  root.setAttribute("data-house", next);
  try {
    window.localStorage.setItem(HOUSE_KEY, next);
  } catch {
    /* ignore: the choice still applies for this visit */
  }
  listeners.forEach((listener) => listener());
  if (unchanged) return;

  // The spell: a short, house-specific wash from the point that was clicked.
  if (origin) {
    root.style.setProperty("--wx", `${origin.x.toFixed(1)}%`);
    root.style.setProperty("--wy", `${origin.y.toFixed(1)}%`);
  }
  root.removeAttribute("data-wash");
  void root.offsetWidth; // restart the animation if a previous spell was still playing
  root.setAttribute("data-wash", next);
  clearTimeout(washTimer);
  washTimer = setTimeout(() => root.removeAttribute("data-wash"), 1100);

  // The room: cross-fade to the new photograph once it is ready.
  const token = ++swapToken;
  const photo = houseScenes[next].photo;
  const small = window.matchMedia("(max-width: 767px)").matches;
  void preload(small ? photo.srcSm : photo.src).then(() => {
    if (token !== swapToken) return; // a newer choice has taken over
    const shown = root.getAttribute("data-bg");
    if (shown && shown !== next) root.setAttribute("data-bg-prev", shown);
    root.setAttribute("data-bg", next);
    clearTimeout(prevTimer);
    prevTimer = setTimeout(() => root.removeAttribute("data-bg-prev"), 1000);
  });
}

/** Runs in <head> before first paint. */
export const HOUSE_BOOT_SCRIPT = `try{var h=localStorage.getItem(${JSON.stringify(
  HOUSE_KEY,
)});if(${JSON.stringify(HOUSES)}.indexOf(h)<0)h=${JSON.stringify(
  DEFAULT_HOUSE,
)};var r=document.documentElement;r.setAttribute("data-house",h);r.setAttribute("data-bg",h)}catch(e){var q=document.documentElement;q.setAttribute("data-house",${JSON.stringify(
  DEFAULT_HOUSE,
)});q.setAttribute("data-bg",${JSON.stringify(DEFAULT_HOUSE)})}`;
