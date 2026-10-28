"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { about } from "@/lib/content/about";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n/useLang";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Localized } from "@/lib/i18n/locales";
import { BookFrame } from "@/components/ui/BookFrame";

const heading = "font-display text-lg tracking-wide text-ink-900 md:text-xl";
const label = "font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-gold";
const body = "text-lg leading-relaxed text-ink-900 md:text-xl";

type Spread = {
  id: string;
  name: string;
  left: ReactNode;
  right: ReactNode;
};

function buildSpreads(d: Dictionary, t: <T>(value: Localized<T>) => T): readonly Spread[] {
  return [
    {
      id: "prologue",
      name: d.about.prologueLabel,
      left: (
        <>
          <p className={label}>{d.about.prologueLabel}</p>
          <h3 className={`${heading} mt-3`}>{d.about.prologueTitle}</h3>
          <div className="mt-5 space-y-4">
            {t(about.prologue).map((paragraph) => (
              <p key={paragraph} className={body}>
                {paragraph}
              </p>
            ))}
          </div>
        </>
      ),
      right: (
        <>
          <p className={label}>{d.about.studiesLabel}</p>
          <h3 className={`${heading} mt-3`}>{d.about.studiesTitle}</h3>
          <ul className="mt-5 divide-y divide-ink-900/15 border-y border-ink-900/15">
            {about.coursework.map((subject) => (
              <li key={subject.en} className="flex items-baseline gap-3 py-3">
                <span aria-hidden className="size-1.5 shrink-0 rotate-45 bg-ink-gold" />
                <span className={body}>{t(subject)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-xs tracking-wider text-ink-700">{site.school}</p>
        </>
      ),
    },
    {
      id: "direction",
      name: d.about.directionLabel,
      left: (
        <>
          <p className={label}>{d.about.directionLabel}</p>
          <h3 className={`${heading} mt-3`}>{d.about.directionTitle}</h3>
          <p className={`${body} mt-5`}>{t(about.direction)}</p>
        </>
      ),
      right: (
        <>
          <p className={label}>{d.about.fieldsLabel}</p>
          <h3 className={`${heading} mt-3`}>{d.about.fieldsTitle}</h3>
          <dl className="mt-5 space-y-4">
            {about.interests.map((interest) => (
              <div key={interest.name.en}>
                <dt className="font-display text-sm uppercase tracking-[0.18em] text-ink-gold">{t(interest.name)}</dt>
                <dd className="mt-1 text-lg leading-snug text-ink-900">{t(interest.line)}</dd>
              </div>
            ))}
          </dl>
        </>
      ),
    },
  ];
}

const pagerButton =
  "inline-flex min-h-11 items-center gap-2 border border-gold-500/40 px-4 font-display text-xs uppercase tracking-[0.2em] text-gold-300 transition duration-300 hover:border-gold-400 hover:bg-gold-400/10 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-gold-500/40 disabled:hover:bg-transparent";

const pagePadding = "p-6 sm:p-8 md:p-10";

type Flip = { from: number; to: number };

/** Page corners: a folded triangle that grows on hover. Mouse-only shortcuts for the pager buttons. */
function Corner({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  const right = side === "right";
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      aria-label={label}
      onClick={onClick}
      className={`group/corner absolute bottom-0 z-10 size-9 cursor-pointer transition-[width,height] duration-300 hover:size-16 focus-visible:size-16 ${
        right
          ? "right-0 bg-[linear-gradient(135deg,transparent_50%,#d9c995_50%,#f6edd2_100%)] [filter:drop-shadow(-3px_-3px_4px_rgb(60_38_12/0.3))]"
          : "left-0 bg-[linear-gradient(225deg,transparent_50%,#d9c995_50%,#f6edd2_100%)] [filter:drop-shadow(3px_-3px_4px_rgb(60_38_12/0.3))]"
      }`}
    />
  );
}

/** Wide screens: the right (or left) page lifts off, swings over the gutter and lands face-down. */
function FlippingBook({
  spreads,
  d,
  index,
  flip,
  onTurn,
  onFlipEnd,
}: {
  spreads: readonly Spread[];
  d: Dictionary;
  index: number;
  flip: Flip | null;
  onTurn: (next: number) => void;
  onFlipEnd: () => void;
}) {
  const forward = flip ? flip.to > flip.from : true;
  const current = spreads[index];

  // While a leaf is in the air the two pages underneath already show the spread it is turning toward.
  let leftContent = current.left;
  let rightContent = current.right;
  if (flip) {
    const from = spreads[flip.from];
    const to = spreads[flip.to];
    leftContent = forward ? from.left : to.left;
    rightContent = forward ? to.right : from.right;
  }

  const leaf = flip ? (
    <motion.div
      key={`${flip.from}-${flip.to}`}
      aria-hidden
      className={`absolute inset-y-0 z-20 w-1/2 [transform-style:preserve-3d] ${forward ? "right-0" : "left-0"}`}
      style={{ transformOrigin: forward ? "left center" : "right center", transformPerspective: 2400 }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: forward ? -180 : 180 }}
      transition={{ duration: 0.95, ease: [0.55, 0.05, 0.25, 1] }}
      onAnimationComplete={onFlipEnd}
    >
      <div
        className={`bg-parchment-page absolute inset-0 overflow-hidden [backface-visibility:hidden] ${pagePadding}`}
      >
        {forward ? spreads[flip.from].right : spreads[flip.from].left}
        <span className="leaf-shade-front pointer-events-none absolute inset-0" />
      </div>
      <div
        className={`bg-parchment-page absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] ${pagePadding}`}
      >
        {forward ? spreads[flip.to].left : spreads[flip.to].right}
      </div>
    </motion.div>
  ) : null;

  const corners = !flip ? (
    <>
      {index > 0 ? <Corner side="left" label={d.about.previousPage} onClick={() => onTurn(index - 1)} /> : null}
      {index < spreads.length - 1 ? <Corner side="right" label={d.about.nextPage} onClick={() => onTurn(index + 1)} /> : null}
    </>
  ) : null;

  return (
    <div className="grid">
      {/* Every spread, invisible and stacked, so the book keeps one height while pages change */}
      {spreads.map((spread) => (
        <div key={spread.id} aria-hidden inert className="invisible col-start-1 row-start-1">
          <BookFrame left={spread.left} right={spread.right} />
        </div>
      ))}
      <div className="col-start-1 row-start-1">
        <BookFrame left={leftContent} right={rightContent} overlay={<>{corners}{leaf}</>} />
      </div>
    </div>
  );
}

/** Narrow screens and reduced motion: the spread simply fades and slides. */
function FadingBook({
  spreads,
  index,
  direction,
  reduceMotion,
}: {
  spreads: readonly Spread[];
  index: number;
  direction: 1 | -1;
  reduceMotion: boolean;
}) {
  const spread = spreads[index];
  return (
    <div style={{ perspective: 1600 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={spread.id}
          initial={reduceMotion ? false : { opacity: 0, rotateY: direction * -10, x: direction * 24 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, rotateY: direction * 10, x: direction * -24 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <BookFrame left={spread.left} right={spread.right} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AboutBook() {
  const { d, t } = useLang();
  const spreads = buildSpreads(d, t);
  const reduceMotion = useReducedMotion() ?? false;
  const wide = useMediaQuery("(min-width: 768px)");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [flip, setFlip] = useState<Flip | null>(null);
  const spread = spreads[index];
  const canFlip = wide && !reduceMotion;
  const busy = canFlip && flip !== null;

  function turnTo(next: number) {
    if (busy || next < 0 || next >= spreads.length || next === index) return;
    setDirection(next > index ? 1 : -1);
    if (canFlip) setFlip({ from: index, to: next });
    else {
      setFlip(null);
      setIndex(next);
    }
  }

  function finishFlip() {
    if (!flip) return;
    setIndex(flip.to);
    setFlip(null);
  }

  // While the leaf is in the air, the visible spread is the one it is turning toward.
  const shown = busy && flip ? spreads[flip.to] : spread;
  const shownIndex = busy && flip ? flip.to : index;

  return (
    <div>
      {canFlip ? (
        <FlippingBook spreads={spreads} d={d} index={index} flip={flip} onTurn={turnTo} onFlipEnd={finishFlip} />
      ) : (
        <FadingBook spreads={spreads} index={index} direction={direction} reduceMotion={reduceMotion} />
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <button type="button" className={pagerButton} onClick={() => turnTo(index - 1)} disabled={index === 0 || busy}>
          <span aria-hidden>&larr;</span> {d.about.previous}
        </button>

        <p aria-live="polite" className="text-center font-mono text-xs tracking-wider text-parchment-500">
          {shown.name}
          <span aria-hidden className="mx-2 text-gold-500">/</span>
          {d.about.pageOf(shownIndex + 1, spreads.length)}
        </p>

        <button
          type="button"
          className={pagerButton}
          onClick={() => turnTo(index + 1)}
          disabled={index === spreads.length - 1 || busy}
        >
          {d.about.turnPage} <span aria-hidden>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
