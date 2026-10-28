"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";
import type { SectionId } from "@/lib/site";
import { SectionBackdrop } from "@/components/scene/SectionBackdrop";
import { GoldDivider } from "./GoldDivider";
import { Reveal } from "./Reveal";

type SectionShellProps = {
  id: SectionId;
  chapter: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function SectionShell({ id, chapter, title, subtitle, children }: SectionShellProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-veil relative isolate scroll-mt-16 overflow-hidden py-28 md:py-36">
      <SectionBackdrop id={id} />
      {/* A thread of light that draws itself across the top edge as the chapter arrives */}
      <motion.span
        aria-hidden
        className="absolute inset-x-6 top-0 mx-auto h-px max-w-6xl origin-left bg-linear-to-r from-transparent via-gold-500/50 to-transparent"
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ duration: 1.4, ease: easeOutExpo }}
      />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <header className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">{chapter}</p>
            <h2
              id={`${id}-title`}
              className="mt-4 font-display text-3xl font-semibold leading-tight text-parchment-100 md:text-5xl"
            >
              {title}
            </h2>
            <GoldDivider className="mt-6" />
            {subtitle ? (
              <p className="mt-6 text-xl italic text-parchment-300/90">{subtitle}</p>
            ) : null}
          </header>
        </Reveal>
        <Reveal delay={0.12} className="mt-14">
          {children}
        </Reveal>
      </div>
    </section>
  );
}
