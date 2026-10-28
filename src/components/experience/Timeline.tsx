"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";
import { timeline } from "@/lib/content/timeline";
import { useLang } from "@/lib/i18n/useLang";

export function Timeline() {
  const { d, t } = useLang();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <ol ref={listRef} className="relative">
      {/* The thread: a faint track, with a gold line that follows the reader down the page */}
      <span aria-hidden className="absolute bottom-2 left-[0.45rem] top-2 w-px bg-gold-500/15 md:left-[11rem]" />
      <motion.span
        aria-hidden
        className="absolute bottom-2 left-[0.45rem] top-2 w-px origin-top bg-linear-to-b from-gold-300 to-gold-500 shadow-[0_0_10px_rgb(var(--accent-rgb)/0.7)] md:left-[11rem]"
        style={{ scaleY: reduceMotion ? 1 : progress }}
      />

      {timeline.map((entry) => (
        <motion.li
          key={entry.id}
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="group relative pb-12 pl-9 last:pb-0 md:grid md:grid-cols-[10rem_2rem_1fr] md:pl-0"
        >
          <motion.span
            aria-hidden
            initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.5, delay: 0.25, ease: "backOut" }}
            className="absolute left-[0.45rem] top-2 size-2.5 -translate-x-1/2 rotate-45 bg-gold-400 shadow-[0_0_12px_rgb(var(--accent-rgb)/0.9)] md:left-[11rem]"
          />

          <div className="md:pr-6 md:pt-0.5 md:text-right">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">{t(entry.when)}</p>
            <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-parchment-500">
              {d.experience.kinds[entry.kind]}
            </p>
          </div>

          <article className="house-card relative mt-3 border border-gold-500/20 bg-void-800/70 p-6 transition duration-500 hover:border-gold-400/45 hover:bg-void-800/90 hover:shadow-[0_14px_44px_rgb(0_0_0/0.4)] md:col-start-3 md:mt-0 md:p-8">
            <h3 className="font-display text-xl leading-snug text-parchment-100 md:text-2xl">{t(entry.title)}</h3>
            <p className="mt-1 text-lg italic text-gold-300/90">{t(entry.place)}</p>
            <p className="mt-4 text-lg leading-relaxed text-parchment-300">{t(entry.summary)}</p>

            <ul className="mt-5 space-y-3 border-t border-gold-500/15 pt-5">
              {t(entry.highlights).map((point) => (
                <li key={point} className="flex gap-3 text-lg leading-snug text-parchment-300/90">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <ul aria-label={d.experience.topics} className="mt-6 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <li key={tag} className="border border-gold-500/25 px-2.5 py-1 font-mono text-xs tracking-wider text-parchment-500">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        </motion.li>
      ))}
    </ol>
  );
}
