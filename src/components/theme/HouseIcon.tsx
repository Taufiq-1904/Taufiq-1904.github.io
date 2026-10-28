import type { House } from "@/lib/theme/houses";

/** Simple original emblems (flame, serpent, wing, badger stripes), not the film crests. */
export function HouseIcon({ house, className = "size-5" }: { house: House; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (house) {
    case "gryffindor":
      // A flame
      return (
        <svg {...common}>
          <path d="M12 3c.5 3-3.5 4.6-3.5 8.6A3.5 3.5 0 0 0 12 15" />
          <path d="M12 3c3.5 2.6 6 5.2 6 9.2a6 6 0 0 1-12 0c0-1.6.6-2.8 1.4-3.8" />
          <path d="M12 21a2.8 2.8 0 0 1-2.8-2.8c0-1.9 2.8-3.4 2.8-5.4 0 2 2.8 3.4 2.8 5.4A2.8 2.8 0 0 1 12 21Z" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      );
    case "slytherin":
      // A serpent
      return (
        <svg {...common}>
          <path d="M17.5 5.5c-1.2-1.3-3.4-1.6-4.9-.5-1.8 1.4-1.6 3.7.3 4.8l2.4 1.4c2.1 1.2 2.4 3.6.6 5.1-1.7 1.4-4.2 1.2-5.7-.3" />
          <path d="M9.3 15.9 7 19.5l3.4-.9" />
          <circle cx="16" cy="5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "ravenclaw":
      // A wing
      return (
        <svg {...common}>
          <path d="M3.5 18c4.5.5 9-1.2 11.6-5.3 1.4-2.2 2-4.6 1.8-7.2C19.6 6.7 21 9 20.9 11.7c-.2 4.3-3.6 7.6-8.6 8.6" />
          <path d="M8 16.2c2.6-.3 4.8-1.8 6.2-4" />
          <path d="M11.6 19.6c2.2-.6 3.9-1.9 4.9-3.7" />
        </svg>
      );
    case "hufflepuff":
      // Badger stripes inside a rounded shield
      return (
        <svg {...common}>
          <path d="M5 4h14v8.5c0 4-3.2 6.7-7 8-3.8-1.3-7-4-7-8Z" />
          <path d="M9.5 4v15M14.5 4v15" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
  }
}
