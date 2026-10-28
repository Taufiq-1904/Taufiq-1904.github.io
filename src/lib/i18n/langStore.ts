import { DEFAULT_LANG, htmlLang, isLang, type Lang } from "./locales";

/**
 * The chosen language lives in a tiny external store (read with useSyncExternalStore), so the
 * server and the first client render both use the default and React swaps in the real value
 * right after hydration without a mismatch.
 *
 * Order of preference: saved choice, then the browser language, then English.
 */
const KEY = "cloudexe:lang";

let current: Lang = DEFAULT_LANG;
let loaded = false;
const listeners = new Set<() => void>();

function detect(): Lang {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage blocked: fall through to the browser language */
  }
  const preferred = typeof navigator !== "undefined" ? navigator.languages?.[0] ?? navigator.language : "";
  return preferred?.toLowerCase().startsWith("id") ? "id" : DEFAULT_LANG;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  current = detect();
}

export function subscribeLang(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getLang(): Lang {
  load();
  return current;
}

export function getLangServer(): Lang {
  return DEFAULT_LANG;
}

export function setLang(next: Lang) {
  load();
  if (next === current) return;
  current = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    /* ignore: the in-memory value still applies for this visit */
  }
  document.documentElement.lang = htmlLang[next];
  listeners.forEach((listener) => listener());
}
