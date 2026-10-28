"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { skillChapters } from "@/lib/content/skills";
import { projects } from "@/lib/content/projects";
import { openProject } from "@/lib/magicBus";
import { BookFrame } from "@/components/ui/BookFrame";
import { useLang } from "@/lib/i18n/useLang";
import type { Localized } from "@/lib/i18n/locales";

// Entries in "Used in" that match a project open that project's dialog.
const projectSlugByName = new Map(projects.map((project) => [project.name, project.slug]));

export function Spellbook() {
  const { d, t } = useLang();
  const text = (value: string | Localized) => (typeof value === "string" ? value : t(value));
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(skillChapters[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const chapter = skillChapters.find((item) => item.id === activeId) ?? skillChapters[0];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = skillChapters.findIndex((item) => item.id === activeId);
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % skillChapters.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + skillChapters.length) % skillChapters.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = skillChapters.length - 1;
    else return;
    event.preventDefault();
    const id = skillChapters[next].id;
    setActiveId(id);
    tabRefs.current[id]?.focus();
  }

  const tabs = (
    <div
      role="tablist"
      aria-label={d.skills.tabsLabel}
      onKeyDown={onKeyDown}
      className="-mb-px flex gap-1 overflow-x-auto px-2 pb-px md:px-3"
    >
      {skillChapters.map((item, index) => {
        const selected = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(node) => {
              tabRefs.current[item.id] = node;
            }}
            role="tab"
            id={`spell-tab-${item.id}`}
            type="button"
            aria-selected={selected}
            aria-controls="spell-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => setActiveId(item.id)}
            className={`relative min-h-11 shrink-0 rounded-t-sm border border-b-0 px-4 font-display text-[0.7rem] uppercase tracking-[0.16em] transition duration-300 ${
              selected
                ? "border-gold-500/50 bg-leather-700 text-gold-300"
                : "border-gold-500/15 bg-void-800 text-parchment-500 hover:text-gold-300"
            }`}
          >
            <span className="mr-2 font-mono text-[0.65rem] tracking-normal text-gold-500">{index + 1}</span>
            {t(item.title)}
          </button>
        );
      })}
    </div>
  );

  return (
    <BookFrame
      top={tabs}
      left={
        <div role="tabpanel" id="spell-panel" aria-labelledby={`spell-tab-${chapter.id}`} tabIndex={0}>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-gold">
            {d.skills.chapterOf(skillChapters.indexOf(chapter) + 1, skillChapters.length)}
          </p>
          <h3 className="mt-3 font-display text-2xl leading-tight text-ink-900 md:text-3xl">{t(chapter.title)}</h3>
          <p className="mt-5 text-lg italic leading-relaxed text-ink-700 md:text-xl">{t(chapter.blurb)}</p>
          <p className="mt-8 font-mono text-xs tracking-wider text-ink-700">
            {d.skills.entries(chapter.skills.length)}
          </p>
        </div>
      }
      right={
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={chapter.id}
            aria-label={d.skills.listLabel(t(chapter.title))}
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="-my-4 divide-y divide-ink-900/15"
          >
            {chapter.skills.map((skill) => (
              <li
                key={text(skill.name)}
                className="group relative -mx-3 px-3 py-4 transition-colors duration-300 hover:bg-ink-900/[0.05] focus-within:bg-ink-900/[0.05]"
              >
                {/* A gold bookmark ribbon that unrolls on hover */}
                <span
                  aria-hidden
                  className="absolute inset-y-3 left-0 w-0.5 origin-top scale-y-0 bg-ink-gold transition-transform duration-300 group-hover:scale-y-100 group-focus-within:scale-y-100"
                />
                <h4 className="font-display text-base tracking-wide text-ink-900 transition-colors duration-300 group-hover:text-ink-gold md:text-lg">
                  {text(skill.name)}
                </h4>
                <p className="mt-1 text-lg leading-snug text-ink-900">{t(skill.note)}</p>
                {skill.usedIn.length > 0 ? (
                <p className="mt-2 flex flex-wrap items-baseline gap-x-1 gap-y-1 font-mono text-xs leading-relaxed tracking-wide text-ink-gold">
                  <span>{d.skills.usedIn}</span>
                  {skill.usedIn.map((entry, index) => {
                    const name = text(entry);
                    const slug = projectSlugByName.get(name);
                    const separator = index < skill.usedIn.length - 1 ? "," : "";
                    return slug ? (
                      <span key={name}>
                        <button
                          type="button"
                          onClick={() => openProject(slug)}
                          aria-haspopup="dialog"
                          title={d.skills.openProject(name)}
                          className="min-h-6 underline decoration-ink-gold/40 underline-offset-4 transition hover:text-ink-900 hover:decoration-ink-900"
                        >
                          {name}
                        </button>
                        {separator}
                      </span>
                    ) : (
                      <span key={name}>
                        {name}
                        {separator}
                      </span>
                    );
                  })}
                </p>
                ) : null}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      }
    />
  );
}
