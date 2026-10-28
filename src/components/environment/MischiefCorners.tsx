"use client";

import { openMap } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";

/**
 * The Marauder's Map as part of the room instead of a block at the bottom of the page.
 *  - Upper-left: a folded parchment fragment with a small clasp. Clicking it opens the existing map dialog
 *    (a working section index). Alohomora unlatches the clasp and shows a short line.
 *  - Lower-right: footprints that walk across a torn parchment edge, now and then.
 * Both live in the side margins of wide screens only (xl and up), so they can never cover content.
 */
export function MischiefCorners() {
  const { d } = useLang();
  return (
    <>
      <div className="mischief-fragment pointer-events-none fixed left-2 top-[4.75rem] z-[41] hidden xl:block">
        <button
          type="button"
          data-no-magic
          onClick={openMap}
          aria-label={d.magic.mischief.open}
          title={d.magic.mischief.open}
          className="pointer-events-auto relative block outline-offset-4"
        >
          <svg viewBox="0 0 90 96" aria-hidden className="mischief-svg w-full drop-shadow-[0_8px_14px_rgb(0_0_0/0.5)]">
            <path d="M4 6 L74 2 L86 64 L12 92 Z" fill="#e9dcb6" stroke="#8a6a3a" strokeWidth="1.4" />
            <path d="M4 6 L74 2 L40 40 Z" fill="#cdb98a" stroke="#8a6a3a" strokeWidth="1" />
            <path d="M14 56 q8 -6 16 0 t16 0 t16 0" fill="none" stroke="#6e4f16" strokeOpacity="0.5" strokeWidth="1" />
            <g className="mischief-prints" fill="#4d3c25">
              {[0, 1, 2, 3].map((i) => (
                <ellipse key={i} className="mischief-print" style={{ animationDelay: `${i * 0.7}s` }} cx={22 + i * 15} cy={i % 2 ? 72 : 66} rx="2.4" ry="3.6" />
              ))}
            </g>
            <g data-unlock-target className="mischief-clasp">
              <path className="mischief-shackle" d="M37 20 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#b08a3c" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="33" y="19" width="20" height="14" rx="2.5" fill="#c99a3b" stroke="#6e4f16" strokeWidth="1" />
              <circle cx="43" cy="26" r="2" fill="#4a3210" />
            </g>
          </svg>
          <span className="mischief-note" aria-hidden>
            {d.magic.mischief.line}
          </span>
        </button>
      </div>

      <div aria-hidden className="mischief-trail pointer-events-none fixed bottom-4 right-3 z-0 hidden xl:block">
        <svg viewBox="0 0 120 60" className="w-full">
          <path d="M2 56 C 30 52, 70 56, 118 48" fill="none" stroke="#d9c79a" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 4" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} className="mischief-step" style={{ animationDelay: `${i * 0.9}s` }} transform={`translate(${14 + i * 18} ${i % 2 ? 44 : 36}) rotate(${-10 + i * 3})`}>
              <ellipse cx="0" cy="0" rx="2.6" ry="4.2" fill="#e9dcb6" />
              <ellipse cx="0" cy="7" rx="2" ry="2.4" fill="#e9dcb6" />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
