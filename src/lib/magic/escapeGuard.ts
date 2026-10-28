/**
 * Escape handling for the onboarding chain (gate, Sorting Hat, wand panel, letter).
 *
 * These layers open one after another, and each one closes on Escape. Without a guard, a held key (auto-repeat)
 * or a quick double press that skips the gate also lands on the next layer the moment it appears, so the Sorting
 * Hat and the wand panel were dismissed unseen and their "skipped" state was even remembered. A press only counts
 * when it is a fresh key press and the layer has been on screen for a moment.
 */
export const ESCAPE_GRACE_MS = 500;

export function isDeliberateEscape(event: KeyboardEvent, openedAt: number): boolean {
  return event.key === "Escape" && !event.repeat && performance.now() - openedAt >= ESCAPE_GRACE_MS;
}
