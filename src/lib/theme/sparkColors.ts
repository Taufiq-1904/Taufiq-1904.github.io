/**
 * Canvas effects cannot read CSS colours directly, so they ask here. The values come from
 * --spark-core / --spark-mid (space separated "r g b") defined per house in globals.css.
 */
export type SparkColors = { core: string; mid: string };

const fallback: SparkColors = { core: "255 233 160", mid: "240 192 90" };

export function readSparkColors(): SparkColors {
  if (typeof window === "undefined") return fallback;
  const style = window.getComputedStyle(document.documentElement);
  const core = style.getPropertyValue("--spark-core").trim();
  const mid = style.getPropertyValue("--spark-mid").trim();
  return { core: core || fallback.core, mid: mid || fallback.mid };
}

/** Calls back whenever the house attribute on <html> changes. Returns an unsubscribe function. */
export function watchHouse(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-house"] });
  return () => observer.disconnect();
}

export function rgba(triplet: string, alpha: number): string {
  return `rgba(${triplet.split(/\s+/).join(",")},${alpha})`;
}
