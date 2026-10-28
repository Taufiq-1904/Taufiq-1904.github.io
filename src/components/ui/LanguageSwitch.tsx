"use client";

import { LANGS, type Lang } from "@/lib/i18n/locales";
import { useLang } from "@/lib/i18n/useLang";

const labels: Record<Lang, string> = { en: "EN", id: "ID" };

/**
 * EN / ID toggle. Two real buttons in a labelled group: keyboard users Tab to each one,
 * screen readers hear which is pressed, and each button names its language in that language.
 */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { lang, d, setLang } = useLang();
  const names: Record<Lang, string> = { en: d.language.english, id: d.language.indonesian };

  return (
    <div role="group" aria-label={d.language.label} className={`inline-flex items-center border border-gold-500/35 ${className}`}>
      {LANGS.map((code, index) => {
        const selected = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={selected}
            aria-label={names[code]}
            title={names[code]}
            onClick={() => setLang(code)}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center px-3 font-mono text-[0.7rem] font-medium tracking-[0.18em] transition duration-300 ${
              index > 0 ? "border-l border-gold-500/35" : ""
            } ${
              selected
                ? "bg-gold-400/15 text-gold-300"
                : "text-parchment-300 hover:bg-gold-400/10 hover:text-gold-300"
            }`}
          >
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
