/**
 * Session bookkeeping for the wizarding-gate intro.
 * The intro plays once per browser session (sessionStorage), and never when the
 * visitor arrives on a deep link such as /#projects.
 */
export const INTRO_SEEN_KEY = "cloudexe:intro-seen";
/** Fired by the toolbar to play the gate again on purpose. */
export const REPLAY_INTRO_EVENT = "cloudexe:replay-intro";

// Fallback for browsers where storage throws (private mode, blocked cookies).
let seenInMemory = false;

export function hasSeenIntro(): boolean {
  if (seenInMemory) return true;
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  seenInMemory = true;
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the in-memory flag still covers this page load */
  }
}

/** Lets the visitor replay the gate on purpose (toolbar). */
export function clearIntroSeen(): void {
  seenInMemory = false;
  try {
    window.sessionStorage.removeItem(INTRO_SEEN_KEY);
  } catch {
    /* ignore */
  }
}

export function shouldShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.hash.length > 1) return false;
  return !hasSeenIntro();
}

/**
 * Runs in <head> before first paint. If the intro is going to play it flags <html>,
 * which lets a plain dark cover hide the homepage until React takes over, so
 * first-time visitors never see a flash of the page underneath.
 */
export const INTRO_BOOT_SCRIPT = `try{if(!sessionStorage.getItem(${JSON.stringify(
  INTRO_SEEN_KEY,
)})&&location.hash.length<2){document.documentElement.setAttribute("data-intro","pending")}}catch(e){}`;
