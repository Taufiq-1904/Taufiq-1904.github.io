"use client";

import { assets } from "@/lib/assets";
import { useAssetExists } from "@/lib/useAssetExists";
import { useLang } from "@/lib/i18n/useLang";

type CvButtonProps = {
  /** "primary" is the large parchment scroll for the hero; "secondary" is a quieter outline. */
  variant?: "primary" | "secondary";
  className?: string;
};

function ScrollIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v10m0 0-3.8-3.8M12 14l3.8-3.8" />
      <path d="M5 16.5v1.2A2.3 2.3 0 0 0 7.3 20h9.4a2.3 2.3 0 0 0 2.3-2.3v-1.2" />
    </svg>
  );
}

/**
 * Downloads public/files/cv.pdf directly (the `download` attribute names the saved file).
 * If the PDF has not been added yet the button turns into a clear, non-clickable note that says
 * where to put the file, instead of linking to a missing page.
 */
export function CvButton({ variant = "primary", className = "" }: CvButtonProps) {
  const { d } = useLang();
  const file = useAssetExists(assets.cv.path);
  const primary = variant === "primary";

  const shape = primary
    ? "bg-parchment-page border border-gold-700/60 px-6 py-3 text-ink-900 shadow-[0_10px_30px_rgb(0_0_0/0.45),0_0_26px_rgb(var(--accent-rgb)/0.2)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgb(0_0_0/0.5),0_0_36px_rgb(var(--accent-rgb)/0.4)]"
    : "border border-gold-500/40 px-5 py-2.5 text-gold-300 hover:border-gold-400 hover:bg-gold-400/10";

  if (file === "missing") {
    return (
      <div className={`flex max-w-xs flex-col items-start gap-1.5 ${className}`}>
        <span
          role="note"
          aria-label={`${d.cv.missingTitle}. ${d.cv.missingHelp}`}
          className="inline-flex min-h-12 items-center gap-3 border border-dashed border-gold-500/40 px-5 py-2.5 font-display text-xs uppercase tracking-[0.2em] text-parchment-300/80"
        >
          <ScrollIcon />
          {d.cv.missingTitle}
        </span>
        <span className="text-sm leading-snug text-parchment-500">{d.cv.missingHelp}</span>
      </div>
    );
  }

  return (
    <a
      href={assets.cv.path}
      download={assets.cv.downloadName}
      type="application/pdf"
      aria-label={d.cv.downloadAria}
      className={`group relative inline-flex min-h-12 items-center gap-3 font-display text-xs uppercase tracking-[0.2em] transition duration-300 ${shape} ${className}`}
    >
      {primary ? (
        // A wax seal, as if the scroll were sealed for the journey
        <span
          aria-hidden
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-crimson-500 to-void-700 text-parchment-100 shadow-[inset_0_-2px_4px_rgb(0_0_0/0.4)] transition duration-300 group-hover:scale-110"
        >
          <ScrollIcon className="size-4" />
        </span>
      ) : (
        <ScrollIcon />
      )}
      <span className="flex flex-col items-start leading-tight">
        <span>{d.cv.download}</span>
        <span className={`mt-0.5 font-mono text-[0.6rem] normal-case tracking-wider ${primary ? "text-ink-700" : "text-parchment-500"}`}>
          {d.cv.pdfHint}
        </span>
      </span>
      {primary ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 size-4 bg-[linear-gradient(225deg,var(--color-void-950)_50%,#cdbb85_50%)] opacity-70"
        />
      ) : null}
    </a>
  );
}
