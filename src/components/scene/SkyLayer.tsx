import { mulberry32 } from "@/lib/random";

const rand = mulberry32(7);

const stars = Array.from({ length: 140 }, (_, i) => ({
  id: i,
  x: rand() * 1440,
  y: rand() * 520,
  r: 0.4 + rand() * 0.9,
  opacity: 0.35 + rand() * 0.65,
  twinkle: rand() < 0.3,
  delay: rand() * 5,
}));

export function SkyLayer() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="size-full">
      <defs>
        <radialGradient id="sky-moon-halo">
          <stop offset="0" stopColor="#d3dafc" stopOpacity="0.32" />
          <stop offset="0.45" stopColor="#8f9be0" stopOpacity="0.1" />
          <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sky-moon-disc" cx="0.38" cy="0.36" r="0.8">
          <stop offset="0" stopColor="#fbf8ec" />
          <stop offset="1" stopColor="#c5cbe8" />
        </radialGradient>
        <radialGradient id="sky-cloud">
          <stop offset="0" stopColor="#2d2655" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#2d2655" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2d2655" stopOpacity="0" />
        </radialGradient>
      </defs>

      {stars.map((s) => (
        <circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#f3ead3"
          opacity={s.opacity}
          className={s.twinkle ? "animate-twinkle" : undefined}
          style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined}
        />
      ))}

      <circle cx="1090" cy="210" r="240" fill="url(#sky-moon-halo)" />
      <circle cx="1090" cy="210" r="54" fill="url(#sky-moon-disc)" />
      <g fill="#8f9ac4" opacity="0.18">
        <circle cx="1074" cy="196" r="9" />
        <circle cx="1108" cy="224" r="12" />
        <circle cx="1094" cy="180" r="5" />
      </g>

      {/* Soft edges come from the gradient itself: a blur filter would be recomputed every frame of the drift */}
      <g fill="url(#sky-cloud)" opacity="0.7" className="animate-drift">
        <ellipse cx="900" cy="250" rx="300" ry="52" />
        <ellipse cx="1250" cy="330" rx="260" ry="46" />
        <ellipse cx="420" cy="360" rx="340" ry="56" />
      </g>
    </svg>
  );
}
