"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/content/projects";
import { CategoryGlyph } from "@/components/ui/CategoryGlyph";
import { categoryTint } from "./ProjectCard";
import { ProjectPreview } from "./ProjectPreview";
import { useLang } from "@/lib/i18n/useLang";

type ProjectDialogProps = {
  project: Project | null;
  /** Centre of the card that was clicked, in viewport pixels. The dialog grows out of it. */
  origin: { x: number; y: number } | null;
  position: number;
  total: number;
  previous: Project | null;
  next: Project | null;
  onClose: () => void;
  onSelect: (slug: string) => void;
};

const sectionLabel = "font-mono text-[0.7rem] uppercase tracking-[0.25em] text-gold-500";

/**
 * Uses the native <dialog> element: the browser supplies the focus trap, Escape to close,
 * and makes everything behind it inert. We only open and close it in step with `project`.
 */
export function ProjectDialog({ project, origin, position, total, previous, next, onClose, onSelect }: ProjectDialogProps) {
  const { d, t } = useLang();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const reduceMotion = useReducedMotion();
  // Which way the visitor is paging, so the new project can slide in from that side.
  const [direction, setDirection] = useState<0 | 1 | -1>(0);
  const slug = project?.slug;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (slug && !dialog.open) {
      // Start the grow-from-card animation at the card's position relative to the centre of the screen.
      // A closed dialog has no box yet, but it will open centred in the viewport.
      const fromX = origin ? origin.x - window.innerWidth / 2 : 0;
      const fromY = origin ? origin.y - window.innerHeight / 2 : 0;
      dialog.style.setProperty("--from-x", `${Math.round(fromX * 0.55)}px`);
      dialog.style.setProperty("--from-y", `${Math.round(fromY * 0.55)}px`);
      dialog.showModal();
    }
    if (!slug && dialog.open) dialog.close();
  }, [slug, origin]);

  // Fade out before really closing: Escape, the backdrop and the close button all come through here.
  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || closing.current) return;
    if (reduceMotion) {
      dialog.close();
      return;
    }
    closing.current = true;
    dialog.setAttribute("data-closing", "");
    window.setTimeout(() => {
      dialog.removeAttribute("data-closing");
      closing.current = false;
      dialog.close();
    }, 230);
  }, [reduceMotion]);

  function go(target: Project, step: 1 | -1) {
    setDirection(step);
    onSelect(target.slug);
  }

  // Moving between projects while the dialog stays open should start at the top again.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [slug]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        setDirection(0);
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className="dialog-card m-auto w-[min(100%-1.5rem,52rem)] bg-transparent p-0 text-parchment-300 backdrop:bg-void-950/85 backdrop:backdrop-blur-sm"
    >
      {project ? (
        <div
          ref={scrollRef}
          className="relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain border border-gold-500/40 bg-void-800 shadow-[0_30px_90px_rgb(0_0_0/0.7)]"
        >
          <button
            type="button"
            onClick={requestClose}
            aria-label={d.projects.close}
            className="absolute right-2 top-2 z-10 inline-flex size-11 items-center justify-center text-parchment-300 transition hover:text-gold-300"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>

          <header
            className="border-b border-gold-500/20 px-6 pb-6 pt-8 md:px-10 md:pt-10"
            style={{
              backgroundImage: `radial-gradient(ellipse at 0% 0%, rgb(${categoryTint[project.categories[0]]} / 0.2), transparent 65%)`,
            }}
          >
            <p className={sectionLabel}>
              {t(project.kind)}
              <span aria-hidden className="mx-2 text-gold-500">/</span>
              {d.projects.positionOf(position, total)}
            </p>
            <h3 id="project-dialog-title" className="mt-3 pr-10 font-display text-2xl leading-tight text-parchment-100 md:text-4xl">
              {project.name}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <li
                  key={category}
                  className="inline-flex items-center gap-1.5 border border-gold-500/30 px-2.5 py-1 font-mono text-xs tracking-wider text-parchment-300"
                  style={{ color: `rgb(${categoryTint[category]})` }}
                >
                  <CategoryGlyph category={category} className="size-3.5" />
                  <span className="text-parchment-300">{d.projects.categories[category]}</span>
                </li>
              ))}
            </ul>
          </header>

          <motion.div
            key={project.slug}
            initial={direction === 0 || reduceMotion ? false : { opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8 px-6 py-8 md:px-10"
          >
            <section aria-label={d.preview.enlarge}>
              <ProjectPreview project={project} size="dialog" />
            </section>

            <section aria-label={d.projects.overview}>
              <p className="text-xl leading-relaxed text-parchment-100">{t(project.summary)}</p>
              {project.details ? t(project.details).map((paragraph) => (
                <p key={paragraph} className="mt-4 text-lg leading-relaxed text-parchment-300/90">
                  {paragraph}
                </p>
              )) : null}
            </section>

            {project.stack.length > 0 ? (
              <section aria-labelledby="dialog-stack">
                <h4 id="dialog-stack" className={sectionLabel}>
                  {d.projects.technology}
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li key={item.name} className="border border-gold-500/30 bg-void-950/40 px-3 py-2">
                      <span className="font-mono text-sm text-parchment-100">{item.name}</span>
                      {item.role ? <span className="mt-0.5 block text-sm text-parchment-500">{t(item.role)}</span> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {t(project.contribution).length > 0 ? (
              <section aria-labelledby="dialog-contribution">
                <h4 id="dialog-contribution" className={sectionLabel}>
                  {d.projects.contribution}
                </h4>
                <ul className="mt-3 space-y-3">
                  {t(project.contribution).map((point) => (
                    <li key={point} className="flex gap-3 text-lg leading-snug text-parchment-300">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="dialog-links">
              <h4 id="dialog-links" className={sectionLabel}>
                {d.projects.links}
              </h4>
              {project.links.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 border border-gold-500/40 px-4 font-display text-xs uppercase tracking-[0.2em] text-gold-300 transition hover:border-gold-400 hover:bg-gold-400/10"
                      >
                        {t(link.label)} <span aria-hidden>&nearr;</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-lg italic text-parchment-500">{d.projects.noLinks}</p>
              )}
            </section>
          </motion.div>

          {previous || next ? (
            <nav aria-label={d.projects.others} className="grid grid-cols-2 border-t border-gold-500/20">
              {previous ? (
                <button
                  type="button"
                  onClick={() => go(previous, -1)}
                  className="col-start-1 min-h-16 px-6 py-4 text-left transition hover:bg-gold-400/5 md:px-10"
                >
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-parchment-500">
                    &larr; {d.projects.previous}
                  </span>
                  <span className="mt-1 block font-display text-sm text-gold-300">{previous.name}</span>
                </button>
              ) : null}
              {next ? (
                <button
                  type="button"
                  onClick={() => go(next, 1)}
                  className="col-start-2 min-h-16 px-6 py-4 text-right transition hover:bg-gold-400/5 md:px-10"
                >
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-parchment-500">
                    {d.projects.next} &rarr;
                  </span>
                  <span className="mt-1 block font-display text-sm text-gold-300">{next.name}</span>
                </button>
              ) : null}
            </nav>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
