"use client";

import { site } from "@/lib/site";
import { openMap } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";
import { GoldDivider } from "@/components/ui/GoldDivider";

export function Footer() {
  const { d } = useLang();
  return (
    <footer className="section-veil border-t border-gold-500/10 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-center">
        <GoldDivider />
        {/* Looks like a sign-off. Tap it and the castle's old map unfolds. */}
        <button
          type="button"
          onClick={openMap}
          aria-haspopup="dialog"
          className="min-h-11 px-4 font-display text-sm tracking-[0.3em] text-gold-300 transition duration-500 hover:text-gold-300 hover:[text-shadow:0_0_14px_rgb(var(--accent-rgb)/0.7)]"
        >
          {d.footer.signOff}
        </button>
        <p className="font-mono text-xs text-parchment-500">
          {d.footer.rights(site.year, site.name)}
        </p>
      </div>
    </footer>
  );
}
