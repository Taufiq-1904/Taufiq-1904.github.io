import { mulberry32 } from "@/lib/random";

const rand = mulberry32(99);

function pine(x: number, base: number, h: number) {
  const w = h * 0.36;
  const tier = (top: number, bottom: number, half: number) =>
    `M${x.toFixed(1)} ${top.toFixed(1)} L${(x + half).toFixed(1)} ${bottom.toFixed(1)} L${(x - half).toFixed(1)} ${bottom.toFixed(1)} Z`;
  return [
    tier(base - h, base - h * 0.55, w * 0.5),
    tier(base - h * 0.8, base - h * 0.3, w * 0.72),
    tier(base - h * 0.55, base, w),
  ].join(" ");
}

function forest(edgeXs: number[], direction: 1 | -1) {
  return edgeXs
    .map((dist) => {
      const x = direction === 1 ? dist : 1440 - dist;
      const base = 815 + dist * 0.1 + rand() * 14;
      const height = 120 + rand() * 120;
      return pine(x, base, height);
    })
    .join(" ");
}

const leftTrees = forest([30, 95, 160, 235, 320], 1);
const rightTrees = forest([20, 85, 150, 230, 310], -1);

export function ForegroundLayer() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="size-full">
      <g fill="#04030a">
        <path d="M0 900 L0 790 C120 770 260 800 420 850 L520 900 Z" />
        <path d="M1440 900 L1440 780 C1300 770 1180 810 1030 850 L940 900 Z" />
        <path d="M0 900 L0 866 C300 846 560 884 720 876 C900 868 1150 844 1440 866 L1440 900 Z" />
        <path d={leftTrees} />
        <path d={rightTrees} />
      </g>
    </svg>
  );
}
