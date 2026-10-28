import type { House } from "@/lib/theme/houses";

/**
 * Small original illustrations for the environment layer. Each one is a few SVG shapes with CSS-driven
 * motion (see magic.css), so there is no animation library and no per-frame React work.
 */

export function Serpent() {
  return (
    <svg viewBox="0 0 160 260" aria-hidden className="env-serpent h-full w-auto overflow-visible">
      <defs>
        <linearGradient id="sp-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0f4a34" />
          <stop offset="0.5" stopColor="#1f8a60" />
          <stop offset="1" stopColor="#0b3a29" />
        </linearGradient>
      </defs>
      {/* Body: an S-curve rising from behind the pillar on the left */}
      <path className="sp-trunk" d="M-10 250 C 40 240, 96 214, 92 176 C 88 140, 30 138, 44 100 C 56 68, 112 74, 108 40" fill="none" stroke="url(#sp-body)" strokeWidth="17" strokeLinecap="round" />
      <path className="sp-trunk" d="M-10 250 C 40 240, 96 214, 92 176 C 88 140, 30 138, 44 100 C 56 68, 112 74, 108 40" fill="none" stroke="#9fd8bd" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" transform="translate(0 -4)" />
      {/* Head */}
      <g className="sp-head">
        <path d="M96 40 C 96 24, 118 14, 128 24 C 134 32, 126 44, 112 48 C 104 50, 98 48, 96 40 Z" fill="#17694a" stroke="#0b3a29" strokeWidth="1.5" />
        <circle className="sp-eye" cx="118" cy="29" r="2.4" fill="#d6fff0" />
        <path className="sp-tongue" d="M128 31 l11 -3 m-11 3 l10 5" stroke="#c43b4b" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function Raven() {
  return (
    <svg viewBox="0 0 120 70" aria-hidden className="env-raven w-full overflow-visible">
      <g className="rv-star-trail" fill="#dce7ff">
        <circle cx="116" cy="40" r="1.6" />
        <circle cx="128" cy="34" r="1.2" />
        <circle cx="140" cy="44" r="1" />
        <circle cx="150" cy="36" r="0.8" />
      </g>
      <path className="rv-wing-l" d="M52 34 C 36 14, 12 12, 2 26 C 14 24, 22 30, 26 36 C 32 32, 40 34, 44 40 Z" fill="#141a2e" stroke="#4a5f9c" strokeWidth="0.8" />
      <path className="rv-wing-r" d="M66 34 C 82 14, 106 12, 116 26 C 104 24, 96 30, 92 36 C 86 32, 78 34, 74 40 Z" fill="#141a2e" stroke="#4a5f9c" strokeWidth="0.8" />
      <ellipse cx="60" cy="42" rx="11" ry="17" fill="#0f1426" stroke="#4a5f9c" strokeWidth="0.8" />
      <circle cx="60" cy="24" r="9" fill="#0f1426" stroke="#4a5f9c" strokeWidth="0.8" />
      <path d="M52 25 L40 28 L52 31 Z" fill="#2a3552" />
      <circle cx="56" cy="22" r="1.4" fill="#cfe0ff" />
      <path d="M56 58 L60 68 L64 58 Z" fill="#0f1426" />
    </svg>
  );
}

export function Badger() {
  return (
    <svg viewBox="0 0 120 70" aria-hidden className="env-badger w-full overflow-visible">
      {/* Legs sit under the body and swing as it walks */}
      <g fill="#2a1d12">
        <rect className="bd-leg bd-leg-a" x="28" y="46" width="7" height="16" rx="3" />
        <rect className="bd-leg bd-leg-b" x="42" y="46" width="7" height="16" rx="3" />
        <rect className="bd-leg bd-leg-b" x="74" y="46" width="7" height="16" rx="3" />
        <rect className="bd-leg bd-leg-a" x="88" y="46" width="7" height="16" rx="3" />
      </g>
      <path d="M16 44 C 18 24, 44 16, 66 18 C 90 18, 104 28, 104 44 C 104 54, 90 58, 60 58 C 34 58, 14 56, 16 44 Z" fill="#6b6359" />
      <path d="M22 40 C 30 28, 56 24, 78 28" fill="none" stroke="#9a9084" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M12 46 l-10 4 l10 -10 Z" fill="#8a7f72" />
      {/* Head with the badger's two white stripes */}
      <g className="bd-head">
        <path d="M92 32 C 94 20, 112 18, 118 28 C 122 36, 116 46, 104 48 C 96 48, 91 42, 92 32 Z" fill="#1d160f" />
        <path d="M98 20 C 100 28, 104 36, 110 46 M108 19 C 110 27, 114 32, 118 34" fill="none" stroke="#f1ece2" strokeWidth="5" strokeLinecap="round" />
        <circle cx="106" cy="33" r="1.5" fill="#f6dc8e" />
        <circle cx="118" cy="35" r="2.2" fill="#0d0905" />
        <circle cx="96" cy="21" r="3.2" fill="#1d160f" />
      </g>
    </svg>
  );
}

export function Broomstick() {
  return (
    <svg viewBox="0 0 140 40" aria-hidden className="env-broom w-full overflow-visible">
      <g className="bm-trail" fill="rgb(var(--spark-core))">
        <circle cx="-6" cy="22" r="1.8" />
        <circle cx="-20" cy="26" r="1.4" />
        <circle cx="-34" cy="21" r="1.1" />
        <circle cx="-48" cy="25" r="0.9" />
      </g>
      {/* Bristles, binding and handle (a lone broom; the point is the small silhouette against the sky) */}
      <path d="M2 22 L38 18 L38 28 Z" fill="#3a2812" />
      <path d="M2 22 L38 20" stroke="#8a6a3a" strokeWidth="0.9" />
      <rect x="36" y="17" width="5" height="12" rx="1.5" fill="#9a7a42" />
      <path d="M40 22.5 L136 18" stroke="#2a1b0c" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 21.4 L130 18" stroke="#6a4c26" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function Dragon() {
  return (
    <svg viewBox="0 0 300 140" aria-hidden className="env-dragon w-full overflow-visible">
      <defs>
        <radialGradient id="dr-mouth" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff7a3a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="dr-glow" cx="270" cy="62" r="16" fill="url(#dr-mouth)" />
      <g fill="#0a0810" stroke="rgb(var(--accent-rgb))" strokeOpacity="0.25" strokeWidth="1">
        {/* Far and near wings beat slowly */}
        <path className="dr-wing dr-wing-far" d="M150 62 C 130 20, 100 -2, 70 6 C 92 16, 100 34, 112 54 C 124 40, 138 46, 150 62 Z" />
        <path d="M30 76 C 70 74, 120 70, 176 66 C 206 64, 232 60, 256 58 C 268 56, 282 58, 292 64 C 280 68, 270 72, 258 74 C 232 82, 200 84, 170 82 C 120 80, 70 84, 30 76 Z" />
        <path d="M30 76 C 16 78, 4 86, -4 98 C 10 94, 22 90, 40 86 Z" />
        <path className="dr-wing dr-wing-near" d="M176 68 C 160 26, 124 2, 92 8 C 116 20, 122 42, 132 64 C 148 52, 164 56, 176 68 Z" />
        <path d="M210 82 L206 96 L216 84 Z M238 80 L236 92 L244 82 Z" />
      </g>
    </svg>
  );
}

/** A distant hippogriff-inspired silhouette: eagle head and wings on a horse's body. Original drawing. */
export function Hippogriff() {
  return (
    <svg viewBox="0 0 200 150" aria-hidden className="env-hippo w-full overflow-visible">
      <g fill="#14101c" stroke="rgb(var(--accent-rgb))" strokeOpacity="0.28" strokeWidth="1" strokeLinejoin="round">
        <path className="hp-wing" d="M92 66 C 80 36, 54 20, 30 24 C 46 32, 54 46, 60 62 C 70 54, 82 56, 92 66 Z" />
        <path d="M46 78 C 46 64, 80 58, 112 62 C 138 64, 152 72, 150 90 C 148 104, 128 108, 110 106 L108 138 L98 138 L96 108 L64 106 L62 138 L52 138 L50 104 C 46 98, 46 88, 46 78 Z" />
        <path d="M148 80 C 164 82, 176 96, 172 120 C 168 106, 160 98, 148 96 Z" />
        <g className="hp-head">
          <path d="M60 70 C 52 52, 52 34, 66 28 C 78 24, 90 30, 92 40 L106 44 L90 48 C 88 58, 84 66, 78 74 Z" />
          <circle cx="76" cy="38" r="2" fill="#f6dc8e" stroke="none" />
        </g>
      </g>
    </svg>
  );
}

/** The signature creature for each house, for the labels and the event table. */
export const HOUSE_CREATURE: Record<House, "owl" | "serpent" | "raven" | "badger"> = {
  gryffindor: "owl",
  slytherin: "serpent",
  ravenclaw: "raven",
  hufflepuff: "badger",
};

export function Phoenix() {
  return (
    <svg viewBox="0 0 150 96" aria-hidden className="env-phoenix w-full overflow-visible">
      <defs>
        <radialGradient id="ph-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ph-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7b733" />
          <stop offset="1" stopColor="#c8321a" />
        </linearGradient>
        <linearGradient id="ph-tail" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#e8532a" />
          <stop offset="1" stopColor="#f7b733" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="78" cy="46" r="46" fill="url(#ph-glow)" />
      {/* Tail feathers trail behind, to the left */}
      <g fill="none" stroke="url(#ph-tail)" strokeWidth="5" strokeLinecap="round">
        <path className="ph-tail-a" d="M64 52 C 44 58, 24 74, 2 84" />
        <path className="ph-tail-b" d="M64 50 C 42 50, 22 56, 0 60" />
        <path className="ph-tail-c" d="M64 48 C 46 42, 28 40, 6 32" />
      </g>
      <path className="ph-wing-b" d="M76 42 C 70 22, 52 8, 30 6 C 40 16, 46 26, 52 38 Z" fill="#d9481f" stroke="#ffcf6b" strokeWidth="0.8" />
      <ellipse cx="78" cy="48" rx="17" ry="11" fill="url(#ph-body)" />
      <path className="ph-wing-a" d="M84 44 C 92 20, 112 6, 138 6 C 126 18, 118 28, 108 40 Z" fill="#f08a2a" stroke="#ffe29a" strokeWidth="0.8" />
      <circle cx="96" cy="40" r="8" fill="#f7b733" />
      <path d="M95 33 C 93 26, 97 22, 100 20 C 100 26, 102 29, 101 33 Z" fill="#e8532a" />
      <path d="M103 40 L113 43 L103 45 Z" fill="#ffd36b" />
      <circle cx="98" cy="38.5" r="1.4" fill="#2a1306" />
      <g fill="#ffb347">
        <circle className="ph-ember ph-ember-a" cx="60" cy="58" r="1.6" />
        <circle className="ph-ember ph-ember-b" cx="48" cy="64" r="1.2" />
        <circle className="ph-ember ph-ember-c" cx="70" cy="62" r="1.3" />
      </g>
    </svg>
  );
}

export function Troll() {
  return (
    <svg viewBox="0 0 120 150" aria-hidden className="env-troll w-full overflow-visible">
      <defs>
        <clipPath id="tr-door">
          <path d="M14 150 V54 A46 46 0 0 1 106 54 V150 Z" />
        </clipPath>
      </defs>
      <path d="M14 150 V54 A46 46 0 0 1 106 54 V150 Z" fill="#06050a" />
      <g clipPath="url(#tr-door)">
        <g className="tr-figure">
          {/* A hunched silhouette with a club: head low between broad shoulders */}
          <path d="M20 150 C 20 112, 30 92, 48 86 C 52 74, 66 70, 74 78 C 90 82, 100 104, 100 150 Z" fill="#151219" stroke="#2c2735" strokeWidth="1" />
          <path className="tr-club" d="M96 96 L110 64 L118 68 L104 102 Z" fill="#1d1812" stroke="#3a3126" strokeWidth="1" />
          <circle cx="58" cy="82" r="1.6" fill="#c9d6a0" className="tr-eye" />
          <circle cx="68" cy="82" r="1.6" fill="#c9d6a0" className="tr-eye" />
        </g>
      </g>
      <path d="M14 150 V54 A46 46 0 0 1 106 54 V150" fill="none" stroke="#4b4558" strokeWidth="5" />
      <path d="M8 150 V54 A52 52 0 0 1 112 54 V150" fill="none" stroke="#2c2735" strokeWidth="3" />
    </svg>
  );
}
