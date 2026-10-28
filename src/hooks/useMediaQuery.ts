"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Server and first client render report `false`. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", notify);
      return () => mql.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True for phones and tablets driven by touch, where hover and cursor effects make no sense. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
