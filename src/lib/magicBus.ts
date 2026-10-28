import type { Localized } from "@/lib/i18n/locales";

/**
 * A tiny event bus so any component can ask the magic canvas for an effect
 * without importing it. Nothing here touches the DOM until `window` exists.
 */
export type MagicEffect =
  | { type: "burst"; x: number; y: number; size?: "small" | "large" }
  | { type: "patronus" }
  | { type: "accio"; x: number; y: number }
  | { type: "rain" };

const EVENT = "cloudexe:magic";

export function emitMagic(effect: MagicEffect) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<MagicEffect>(EVENT, { detail: effect }));
}

export function onMagic(handler: (effect: MagicEffect) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<MagicEffect>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/** Opens a project dialog from anywhere (used by the spellbook cross-links). */
export const OPEN_PROJECT_EVENT = "cloudexe:open-project";

export function openProject(slug: string) {
  window.dispatchEvent(new CustomEvent<string>(OPEN_PROJECT_EVENT, { detail: slug }));
}

/** Opens the Marauder's Map. */
export const OPEN_MAP_EVENT = "cloudexe:open-map";

export function openMap() {
  window.dispatchEvent(new Event(OPEN_MAP_EVENT));
}

/** Opens the Half-Blood Prince's potions book (the skills and projects book). */
export const OPEN_BOOK_EVENT = "cloudexe:open-book";

export function openBook() {
  window.dispatchEvent(new Event(OPEN_BOOK_EVENT));
}

/** Shows a short message in the toast region. */
export const TOAST_EVENT = "cloudexe:toast";

export type ToastMessage = string | Localized;

/** A plain string is shown as is (spell names); a Localized pair is resolved in the visitor's language. */
export function toast(message: ToastMessage) {
  window.dispatchEvent(new CustomEvent<ToastMessage>(TOAST_EVENT, { detail: message }));
}
