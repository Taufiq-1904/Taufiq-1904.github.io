import { clearHatSkipped, hasChosenHouse } from "@/lib/theme/houseStore";
import { isWandId, type WandId } from "./wands";

/**
 * One small store for the magical interface: which wand is chosen, which panels are open, which spell is
 * active, and the order of the post-intro "ceremony" (Sorting Hat, then wand, then the letter).
 *
 * House and language keep their own stores; this one never duplicates them. Transient animation state stays
 * local to each component. Everything here is plain data, so it is safe to read through useSyncExternalStore.
 */
export type SpellId = "lumos" | "nox" | "alohomora" | "leviosa" | "revelio";

export type MagicState = {
  wand: WandId | null;
  wandPanel: boolean;
  sorting: boolean;
  letter: boolean;
  toolbar: boolean;
  /** The spell currently showing its effect (Lumos stays until Nox). */
  spell: SpellId | null;
  /** True while a timed spell is playing, so two effects never overlap. */
  cooling: boolean;
};

const WAND_KEY = "cloudexe:wand-style";
const WAND_DISMISSED_KEY = "cloudexe:wand-dismissed";
const LETTER_SEEN_KEY = "cloudexe:letter-seen";

const SERVER_STATE: MagicState = {
  wand: null,
  wandPanel: false,
  sorting: false,
  letter: false,
  toolbar: false,
  spell: null,
  cooling: false,
};

let state: MagicState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function readSession(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
function writeSession(key: string) {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

function removeSession(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** "Start over" for the welcome sequence only: the chosen house and wand are preferences and stay. */
export function resetOnboarding() {
  removeSession(WAND_DISMISSED_KEY);
  removeSession(LETTER_SEEN_KEY);
  clearHatSkipped();
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = window.localStorage.getItem(WAND_KEY);
    if (isWandId(saved)) state = { ...state, wand: saved };
    else if (saved !== null) window.localStorage.removeItem(WAND_KEY); // an old or invalid value must not linger
  } catch {
    /* storage blocked: no saved wand */
  }
}

function patch(next: Partial<MagicState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

// Another tab changing the wand updates this one, so two open tabs never disagree about the saved choice.
function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== WAND_KEY) return;
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(WAND_KEY);
  } catch {
    return;
  }
  const next = isWandId(saved) ? saved : null;
  if (next !== state.wand) patch({ wand: next });
}

export function subscribeMagic(callback: () => void) {
  if (listeners.size === 0 && typeof window !== "undefined") window.addEventListener("storage", onStorage);
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}
export function getMagic(): MagicState {
  load();
  return state;
}
export function getMagicServer(): MagicState {
  return SERVER_STATE;
}

/* ---------------- Wand ---------------- */

export function chooseWand(id: WandId) {
  load();
  try {
    window.localStorage.setItem(WAND_KEY, id);
  } catch {
    /* ignore */
  }
  patch({ wand: id, wandPanel: false });
  advance();
}
/** Back to the default: no remembered wand, so the first wand style applies again. */
export function resetWand() {
  try {
    window.localStorage.removeItem(WAND_KEY);
  } catch {
    /* storage blocked */
  }
  patch({ wand: null });
}

export function openWandPanel() {
  load();
  patch({ wandPanel: true });
}
export function closeWandPanel() {
  writeSession(WAND_DISMISSED_KEY);
  patch({ wandPanel: false });
  advance();
}

/* ---------------- Sorting Hat ---------------- */

export function openSorting() {
  patch({ sorting: true, wandPanel: false });
}
export function closeSorting() {
  patch({ sorting: false });
  advance();
}

/* ---------------- Letter ---------------- */

export function openLetter() {
  patch({ letter: true });
}
export function closeLetter() {
  writeSession(LETTER_SEEN_KEY);
  patch({ letter: false });
}

/* ---------------- Toolbar and spells ---------------- */

/**
 * The toolbar grows upward from the bottom-left corner and the wand panel sits right above it, so the two would
 * cover each other and the panel (the higher layer) would swallow clicks meant for toolbar buttons. Only one is
 * open at a time.
 */
export function setToolbar(open: boolean) {
  patch(open ? { toolbar: true, wandPanel: false } : { toolbar: false });
}
export function setSpell(spell: SpellId | null, cooling?: boolean) {
  patch({ spell, ...(cooling === undefined ? {} : { cooling }) });
}

/* ---------------- The ceremony after the gate ---------------- */

/**
 * After the gate opens: the Sorting Hat (only if no house was ever chosen), then the wand choice (only if none
 * is saved and it was not dismissed this session), then the letter (once per session). Each step is dismissible and
 * none of them blocks the page. `stage` remembers how far this visit has got so closing a panel never loops.
 */
let stage = 0;
let chainActive = false;

export function startCeremony() {
  load();
  stage = 0;
  chainActive = true;
  advance();
}

function advance() {
  if (!chainActive || typeof window === "undefined") return;
  if (stage < 1) {
    stage = 1;
    if (!hasChosenHouse()) {
      patch({ sorting: true });
      return;
    }
  }
  if (stage < 2) {
    stage = 2;
    if (!state.wand && !readSession(WAND_DISMISSED_KEY)) {
      patch({ wandPanel: true });
      return;
    }
  }
  if (stage < 3) {
    stage = 3;
    chainActive = false;
    if (!readSession(LETTER_SEEN_KEY)) {
      window.setTimeout(() => {
        if (!state.sorting && !state.wandPanel) patch({ letter: true });
      }, 1600);
    }
  }
}
