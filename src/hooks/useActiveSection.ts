"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section the reader is in: the last one whose top has passed a reading
 * line near the upper-middle of the viewport. At the very bottom of the page the last section
 * wins, so a short final section can still be reached. Work is throttled to one pass per frame.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let raf = 0;

    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = elements[0].id;
      if (atBottom) {
        current = elements[elements.length - 1].id;
      } else {
        for (const el of elements) {
          if (el.getBoundingClientRect().top <= line) current = el.id;
        }
      }
      setActive((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return active;
}
