"use client";

import { useLang } from "@/lib/i18n/useLang";

/** First tab stop on the page: jumps past the navigation. Only visible while focused. */
export function SkipLink() {
  const { d } = useLang();
  return (
    <a
      href="#about"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-void-950 focus:px-4 focus:py-2 focus:text-gold-300"
    >
      {d.skipToContent}
    </a>
  );
}
