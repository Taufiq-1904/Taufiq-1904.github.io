"use client";

import { motion, type Variants } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n/useLang";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/scene/HeroScene";
import { CvButton } from "@/components/media/CvButton";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: easeOutExpo } },
};

export function Hero() {
  const { d, t } = useLang();
  return (
    <section id="home" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <HeroScene />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-20 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-28 text-center md:pt-32"
      >
        <motion.p variants={item} className="font-mono text-xs tracking-[0.3em] text-gold-400/90 md:text-sm">
          {d.hero.prompt}
        </motion.p>

        <motion.h1
          variants={item}
          aria-label={site.name}
          className="mt-5 font-display font-bold uppercase leading-none drop-shadow-[0_0_40px_rgb(var(--accent-rgb)/0.35)]"
        >
          <span aria-hidden className="text-gold-gradient block text-6xl tracking-[0.06em] sm:text-7xl md:text-9xl">
            {site.name.split(" ")[0]}
          </span>
          <span aria-hidden className="text-gold-gradient mt-2 block text-2xl tracking-[0.14em] sm:text-3xl md:mt-3 md:text-5xl md:tracking-[0.18em]">
            {site.name.split(" ").slice(1).join(" ")}
          </span>
        </motion.h1>

        <motion.div variants={item} className="mt-6 flex items-center gap-4">
          <span aria-hidden className="h-px w-6 bg-gold-500/50 sm:w-10 md:w-16" />
          <p className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-parchment-100 sm:text-xs sm:tracking-[0.32em] md:text-sm">{site.school}</p>
          <span aria-hidden className="h-px w-6 bg-gold-500/50 sm:w-10 md:w-16" />
        </motion.div>

        <motion.p variants={item} className="mt-6 max-w-xl text-xl italic leading-snug text-parchment-300 md:text-2xl">
          {t(site.tagline)}
        </motion.p>

        <motion.ul variants={item} className="mt-7 flex flex-wrap justify-center gap-2">
          {site.interests.map((interest) => (
            <li
              key={interest.en}
              className="border border-gold-500/25 bg-void-950/40 px-3 py-1 font-mono text-[0.7rem] tracking-wider text-parchment-300 backdrop-blur-sm"
            >
              {t(interest)}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="#about">{d.hero.enter}</Button>
          <Button href="#contact" variant="ghost">
            {d.hero.owl}
          </Button>
        </motion.div>

        <motion.div variants={item} className="mt-5">
          <CvButton variant="primary" />
        </motion.div>
      </motion.div>

      <div aria-hidden className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-parchment-500">{d.hero.scroll}</span>
        <span className="h-10 w-px animate-scroll-cue bg-linear-to-b from-gold-400 to-transparent" />
      </div>
    </section>
  );
}
