/**
 * Shared geometry for the gate, in a 560 x 640 coordinate space.
 * Doors, frame and the scene behind them all derive from these numbers so they line up.
 */
export const GATE_W = 560;
export const GATE_H = 640;

export const OPEN_X = 80; // left edge of the opening
export const OPEN_W = 400;
export const HALF = OPEN_W / 2; // one door leaf
export const ARCH_R = 230; // radius of each arc of the pointed arch
export const APEX_Y = 60;
export const GROUND_Y = 616;

export const RISE = Math.sqrt(ARCH_R * ARCH_R - (ARCH_R - HALF) ** 2);
export const SPRING_Y = APEX_Y + RISE;
export const DOOR_H = GROUND_Y - APEX_Y;

/** Height of the arch above a door-local point `xd` units from the hinge, measured from the apex line. */
export function archY(xd: number): number {
  return RISE - Math.sqrt(Math.max(0, ARCH_R * ARCH_R - (xd - ARCH_R) ** 2));
}

const f = (n: number) => n.toFixed(1);

/** Points along the top of the opening in gate coordinates, left spring to right spring. */
export function archPoints(step = 4): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let xd = 0; xd <= HALF; xd += step) pts.push([OPEN_X + xd, APEX_Y + archY(xd)]);
  for (let xd = HALF - step; xd >= 0; xd -= step) pts.push([OPEN_X + OPEN_W - xd, APEX_Y + archY(xd)]);
  return pts;
}

export function archLine(): string {
  return archPoints()
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${f(x)} ${f(y)}`)
    .join(" ");
}

/** Closed outline of the whole opening, used to cut a hole in the stone wall. */
export function openingPath(): string {
  return `M${OPEN_X} ${GROUND_Y} ${archLine().replace(/^M/, "L")} L${OPEN_X + OPEN_W} ${GROUND_Y} Z`;
}

/** Closed outline of a door leaf in door-local coordinates (hinge at x = 0). */
export function doorOutline(): string {
  const pts: string[] = [];
  for (let xd = 0; xd <= HALF; xd += 4) pts.push(`L${f(xd)} ${f(archY(xd))}`);
  return `M0 ${DOOR_H} ${pts.join(" ")} L${HALF} ${DOOR_H} Z`;
}

export const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/** Vertical centre of the opening as a percentage, used as the camera's focal point. */
export const FOCAL_Y_PCT = ((APEX_Y + GROUND_Y) / 2 / GATE_H) * 100 + 3;
