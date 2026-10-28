"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { OPEN_PROJECT_EVENT } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";
import { projectCategories, projects, type ProjectCategory } from "@/lib/content/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";

type Filter = "All" | ProjectCategory;

const chipBase =
  "inline-flex min-h-11 items-center gap-2 border px-4 font-display text-xs uppercase tracking-[0.18em] transition duration-300";

export function ProjectBrowser() {
  const { d } = useLang();
  const [filter, setFilter] = useState<Filter>("All");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const reduceMotion = useReducedMotion();

  // The spellbook links to projects by name; it asks for them through this event.
  useEffect(() => {
    const onOpen = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (!projects.some((project) => project.slug === slug)) return;
      setFilter("All");
      setOrigin(null);
      setActiveSlug(slug);
    };
    window.addEventListener(OPEN_PROJECT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PROJECT_EVENT, onOpen);
  }, []);

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((project) => project.categories.includes(filter))),
    [filter],
  );

  const counts = useMemo(() => {
    const result = new Map<Filter, number>([["All", projects.length]]);
    for (const category of projectCategories) {
      result.set(category, projects.filter((project) => project.categories.includes(category)).length);
    }
    return result;
  }, []);

  const activeIndex = visible.findIndex((project) => project.slug === activeSlug);
  const active = activeIndex >= 0 ? visible[activeIndex] : null;

  return (
    <MotionConfig reducedMotion="user">
      <div role="group" aria-label={d.projects.filterLabel} className="flex flex-wrap gap-2">
        {(["All", ...projectCategories] as const).map((option) => {
          const selected = filter === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(option)}
              className={`${chipBase} ${
                selected
                  ? "border-gold-400 bg-gold-400/15 text-gold-300"
                  : "border-gold-500/25 text-parchment-300/80 hover:border-gold-400/60 hover:text-gold-300"
              }`}
            >
              {option === "All" ? d.projects.all : d.projects.categories[option]}
              <span className="font-mono text-[0.7rem] tracking-normal text-parchment-500">{counts.get(option)}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-5 font-mono text-xs tracking-wider text-parchment-500">
        {d.projects.showing(visible.length, projects.length)}
      </p>

      <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.li
              key={project.slug}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.09, ease: "easeOut" }}
            >
              <ProjectCard
                project={project}
                number={String(projects.indexOf(project) + 1).padStart(2, "0")}
                onOpen={(box) => {
                  setOrigin({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
                  setActiveSlug(project.slug);
                }}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ProjectDialog
        project={active}
        origin={origin}
        position={activeIndex + 1}
        total={visible.length}
        previous={activeIndex > 0 ? visible[activeIndex - 1] : null}
        next={activeIndex >= 0 && activeIndex < visible.length - 1 ? visible[activeIndex + 1] : null}
        onClose={() => setActiveSlug(null)}
        onSelect={setActiveSlug}
      />
    </MotionConfig>
  );
}
