import type { ReactNode } from "react";

type BookFrameProps = {
  left: ReactNode;
  right: ReactNode;
  /** Something that hangs off the top edge of the book, such as bookmark tabs. */
  top?: ReactNode;
  /** Drawn on top of both pages, positioned against the pages (a turning leaf, page corners). */
  overlay?: ReactNode;
  className?: string;
};

/**
 * A leather-bound book lying open: two parchment pages side by side on wide screens,
 * stacked on narrow ones. Content is supplied by the caller, so this holds no copy.
 */
export function BookFrame({ left, right, top, overlay, className = "" }: BookFrameProps) {
  return (
    <div className={className}>
      {top}
      <div className="bg-leather relative rounded-sm border border-gold-700/40 p-2 shadow-[0_30px_80px_rgb(0_0_0/0.55)] md:p-3">
        <div className="bg-parchment-page relative grid md:grid-cols-2">
          <div className="relative p-6 sm:p-8 md:p-10">{left}</div>
          <div className="relative border-t border-ink-900/15 p-6 sm:p-8 md:border-t-0 md:p-10">{right}</div>
          <span
            aria-hidden
            className="book-gutter pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 md:block"
          />
          {overlay}
        </div>
      </div>
    </div>
  );
}
