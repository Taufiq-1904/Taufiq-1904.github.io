import { houseInfo, type House } from "@/lib/theme/houses";
import { HouseIcon } from "./HouseIcon";

/** A small shield in the house colours with its emblem on top. Original design, not the film crests. */
export function HouseCrest({ house, className = "size-9" }: { house: House; className?: string }) {
  const info = houseInfo[house];
  const [fill, edge] = info.swatch;
  return (
    <span aria-hidden className={`relative inline-flex shrink-0 ${className}`}>
      <svg viewBox="0 0 32 38" className="absolute inset-0 size-full drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)]">
        <path d="M2 3h28v17c0 9-7 14-14 17C9 34 2 29 2 20Z" fill={fill} stroke={edge} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5.5 6h21v14c0 6.6-5 10.4-10.5 12.8C10.5 30.4 5.5 26.6 5.5 20Z" fill="none" stroke={edge} strokeWidth="0.7" opacity="0.55" />
      </svg>
      <span className="relative flex size-full items-center justify-center pb-[8%]" style={{ color: info.ink }}>
        <HouseIcon house={house} className="size-[58%]" />
      </span>
    </span>
  );
}
