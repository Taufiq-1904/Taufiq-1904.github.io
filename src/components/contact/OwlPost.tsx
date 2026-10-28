"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { contact } from "@/lib/site";
import { OwlArt } from "@/components/scene/FlyingOwl";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { CvButton } from "@/components/media/CvButton";
import { useLang } from "@/lib/i18n/useLang";

type Phase = "idle" | "flying" | "sent" | "no-address";

const field =
  "mt-2 block w-full border border-ink-900/25 bg-white/40 px-3 py-2.5 text-lg text-ink-900 placeholder:text-ink-700/60 focus:border-ink-gold focus:bg-white/60 focus:outline-none";
const labelClass = "font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-gold";

export function OwlPost() {
  const { d } = useLang();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "flying") return;
    if (!contact.email) {
      setPhase("no-address");
      return;
    }

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = d.contact.mailSubject(name);
    const body = `${message}\n\n${name}`;
    const href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const deliver = () => {
      window.location.assign(href);
      setPhase("sent");
    };

    if (reduceMotion) {
      deliver();
      return;
    }
    setPhase("flying");
    timer.current = window.setTimeout(deliver, 1300);
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.25fr] md:gap-14">
      <div className="flex flex-col items-start">
        <div className="relative w-full max-w-[16rem]">
          <motion.div
            aria-hidden
            animate={
              phase === "flying"
                ? { x: 220, y: -130, scale: 0.55, opacity: 0 }
                : { x: 0, y: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: phase === "flying" ? 1.3 : 0.6, ease: "easeInOut" }}
          >
            <OwlArt />
          </motion.div>
          {/* The perch */}
          <span aria-hidden className="mt-1 block h-1.5 w-full rounded-full bg-linear-to-r from-leather-700 via-gold-700/70 to-leather-700" />
        </div>

        <p className="mt-8 max-w-sm text-xl leading-snug text-parchment-300">
          {d.contact.intro}
        </p>

        <CvButton variant="secondary" className="mt-8" />

        <SocialLinks className="mt-4" />
      </div>

      <motion.form
        onSubmit={onSubmit}
        // Once sealed, the letter folds shut and fades while the owl takes it; it unfolds again afterwards.
        animate={
          phase === "flying"
            ? { scaleY: 0.22, scaleX: 0.9, opacity: 0.15, y: -30, rotateX: 40 }
            : { scaleY: 1, scaleX: 1, opacity: 1, y: 0, rotateX: 0 }
        }
        transition={{ duration: phase === "flying" ? 0.6 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200, transformOrigin: "50% 40%" }}
        className="bg-parchment-page relative border border-gold-700/40 p-6 shadow-[0_24px_70px_rgb(0_0_0/0.5)] sm:p-8"
      >
        <label className="block">
          <span className={labelClass}>{d.contact.name}</span>
          <input name="name" type="text" required maxLength={80} autoComplete="name" className={field} />
        </label>

        <label className="mt-5 block">
          <span className={labelClass}>{d.contact.message}</span>
          <textarea name="message" required rows={6} maxLength={2000} className={`${field} resize-y`} />
        </label>

        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={phase === "flying"}
            className="btn-themed house-btn inline-flex min-h-12 items-center gap-3 px-6 font-display text-xs uppercase tracking-[0.22em]"
          >
            <span aria-hidden className="size-2 rounded-full bg-current opacity-70" />
            {phase === "flying" ? d.contact.flying : d.contact.send}
          </button>

          <p role="status" className="text-base leading-snug text-ink-700">
            {phase === "sent" ? d.contact.sent : null}
            {phase === "no-address" ? d.contact.noAddress : null}
          </p>
        </div>
      </motion.form>
    </div>
  );
}
