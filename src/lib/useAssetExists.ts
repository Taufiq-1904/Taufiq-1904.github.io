"use client";

import { useEffect, useState } from "react";

export type AssetState = "checking" | "present" | "missing";

const cache = new Map<string, AssetState>();

/**
 * Asks the server whether a public file exists, so the UI can show a graceful fallback instead of a
 * broken image or a dead download. Results are cached per path for the visit.
 */
export function useAssetExists(path: string): AssetState {
  // Results arrive asynchronously, so they are stored per path and read back during render.
  const [results, setResults] = useState<Record<string, AssetState>>({});

  useEffect(() => {
    if (!path || cache.has(path)) return;
    const controller = new AbortController();
    fetch(path, { method: "HEAD", signal: controller.signal })
      .then((response) => {
        const next: AssetState = response.ok ? "present" : "missing";
        cache.set(path, next);
        setResults((previous) => ({ ...previous, [path]: next }));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        cache.set(path, "missing");
        setResults((previous) => ({ ...previous, [path]: "missing" }));
      });
    return () => controller.abort();
  }, [path]);

  if (!path) return "missing";
  return cache.get(path) ?? results[path] ?? "checking";
}

/**
 * Checks several files at once and returns only the ones that exist, in order.
 * Returns `null` while checking, so callers can avoid flashing a fallback first.
 */
export function useExistingAssets(paths: readonly string[]): readonly string[] | null {
  const key = paths.join("|");
  const [result, setResult] = useState<{ key: string; present: readonly string[] } | null>(null);

  useEffect(() => {
    if (paths.length === 0) return;
    let cancelled = false;
    Promise.all(
      paths.map((path) =>
        fetch(path, { method: "HEAD" })
          .then((response) => (response.ok ? path : null))
          .catch(() => null),
      ),
    ).then((list) => {
      if (!cancelled) setResult({ key, present: list.filter((path): path is string => path !== null) });
    });
    return () => {
      cancelled = true;
    };
    // `key` stands in for the contents of `paths`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (paths.length === 0) return [];
  return result && result.key === key ? result.present : null;
}
