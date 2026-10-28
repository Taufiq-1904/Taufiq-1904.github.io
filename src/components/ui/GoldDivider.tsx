import { HOUSES } from "@/lib/theme/houses";
import { HouseIcon } from "@/components/theme/HouseIcon";

/** A rule with the active house's emblem in the middle (flame, serpent, wing, badger shield). */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold-500/70" />
      {HOUSES.map((house) => (
        <span key={house} data-h={house} className="text-gold-400 drop-shadow-[0_0_8px_rgb(var(--accent-rgb)/0.7)]">
          <HouseIcon house={house} className="size-4" />
        </span>
      ))}
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold-500/70" />
    </div>
  );
}
