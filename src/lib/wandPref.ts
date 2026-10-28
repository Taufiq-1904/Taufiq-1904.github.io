// Whether the wand sparkle effects are on. Remembered in localStorage when allowed.
const KEY = "cloudexe:wand";
let enabled = true;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    if (window.localStorage.getItem(KEY) === "off") enabled = false;
  } catch {
    /* ignore */
  }
}

export function subscribeWand(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getWand(): boolean {
  load();
  return enabled;
}

export function getWandServer(): boolean {
  return true;
}

export function setWand(next: boolean) {
  load();
  enabled = next;
  try {
    window.localStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
