/**
 * Small potion-making illustrations, drawn in SVG so they stay crisp and weigh almost nothing.
 * They are decoration only (aria-hidden) and sit beside the skills content, never over it.
 */

export function Cauldron({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={`potion-cauldron ${className}`} fill="none">
      <path d="M12 26 C8 40 14 54 32 54 C50 54 56 40 52 26 Z" fill="#17120d" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="32" cy="26" rx="20" ry="5" fill="#0c0a07" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="32" cy="26" rx="17" ry="3.4" fill="rgb(var(--accent-rgb) / 0.55)" />
      <path d="M18 54 L15 60 M46 54 L49 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle className="potion-bubble potion-bubble-a" cx="26" cy="22" r="2.2" fill="rgb(var(--accent-rgb))" />
      <circle className="potion-bubble potion-bubble-b" cx="35" cy="22" r="1.7" fill="rgb(var(--accent-rgb))" />
      <circle className="potion-bubble potion-bubble-c" cx="31" cy="22" r="1.2" fill="rgb(var(--accent-rgb))" />
    </svg>
  );
}

function Flask() {
  return (
    <svg viewBox="0 0 24 32" aria-hidden className="h-8 w-6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M9 3 H15 M10 3 V12 L3 26 C2 29 4 30 6 30 H18 C20 30 22 29 21 26 L14 12 V3" />
      <path d="M6 22 H18 L20.4 26.5 C21 28 19.6 29 18 29 H6 C4.4 29 3 28 3.6 26.5 Z" fill="rgb(var(--accent-rgb) / 0.4)" stroke="none" />
    </svg>
  );
}

function Leaf() {
  return (
    <svg viewBox="0 0 24 32" aria-hidden className="h-8 w-6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 30 V12 M12 12 C4 10 3 4 4 2 C10 2 14 6 12 12 M12 18 C18 16 21 11 20 8 C15 8 11 12 12 18" />
    </svg>
  );
}

function Mortar() {
  return (
    <svg viewBox="0 0 32 28" aria-hidden className="h-7 w-8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12 H29 C29 21 24 26 16 26 C8 26 3 21 3 12 Z" />
      <path d="M18 12 L26 3" />
    </svg>
  );
}

/** A short strip of ingredient icons, used as a quiet header ornament on the pages of the book. */
export function IngredientRow({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-end gap-4 text-ink-gold/70 ${className}`}>
      <Flask />
      <Leaf />
      <Mortar />
      <Leaf />
    </div>
  );
}
