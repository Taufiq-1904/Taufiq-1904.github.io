"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getMagic, getMagicServer, subscribeMagic } from "@/lib/magic/magicState";
import { wandCursorUri } from "@/lib/magic/wands";
import { getWand, getWandServer, subscribeWand } from "@/lib/wandPref";

/**
 * The wand cursor is the browser's own cursor, drawn as an image whose hotspot is the wand tip. That keeps it
 * glued to the real pointer (no lagging copy that could miss a click) and it can never block a link, button or
 * field: those keep their normal pointer and text cursors (see magic.css). It only exists for fine pointers;
 * touch screens get a tap spark from the magic layer instead. Turning the sparkles off also restores the arrow.
 */
export function MagicalCursor() {
  const { wand } = useSyncExternalStore(subscribeMagic, getMagic, getMagicServer);
  const sparkles = useSyncExternalStore(subscribeWand, getWand, getWandServer);

  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");

    const apply = () => {
      if (wand && sparkles && fine.matches) {
        root.style.setProperty("--wand-cursor", wandCursorUri(wand));
        root.setAttribute("data-wand-cursor", wand);
      } else {
        root.style.removeProperty("--wand-cursor");
        root.removeAttribute("data-wand-cursor");
      }
    };
    apply();
    fine.addEventListener("change", apply);
    return () => {
      fine.removeEventListener("change", apply);
      root.style.removeProperty("--wand-cursor");
      root.removeAttribute("data-wand-cursor");
    };
  }, [wand, sparkles]);

  return null;
}
