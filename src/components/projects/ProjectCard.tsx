"use client";

import { useReducedMotion } from "framer-motion";
import type { PointerEvent } from "react";
import type { Project, ProjectCategory } from "@/lib/content/projects";
import { ProjectPreview } from "./ProjectPreview";
import { useLang } from "@/lib/i18n/useLang";

// One tint per category, so a card's colour tells you what kind of work it holds.
export const categoryTint: Record<ProjectCategory, string> = {
  Mobile: "130 140 225",
  Networking: "120 190 210",
  Security: "205 90 80",
  Infrastructure: "230 189 95",
};

type ProjectCardProps = {
  project: Project;
  number: string;
  /** Receives the card's box, so the dialog can grow out of it. */
  onOpen: (origin: DOMRect) => void;
};

export function ProjectCard({ project, number, onOpen }: ProjectCardProps) {
  const { d, t } = useLang();
  const reduceMotion = useReducedMotion();
  const primary = project.categories[0];
  const tint = categoryTint[primary];

  // Tilt and the cursor-following glow are written straight to CSS variables: no re-render per move.
  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--rx", `${((0.5 - py) * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 8).toFixed(2)}deg`);
  }

  function onPointerLeave(event: PointerEvent<HTMLButtonElement>) {
    const el = event.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget.getBoundingClientRect())}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-haspopup="dialog"
      style={{ "--tint": tint } as React.CSSProperties}
      className="house-card group relative flex h-full w-full flex-col overflow-hidden border border-gold-500/30 bg-void-800 text-left transition duration-300 [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:-translate-y-1.5 hover:border-gold-400/70 hover:shadow-[0_18px_50px_rgb(0_0_0/0.5),0_0_36px_rgb(var(--accent-rgb)/0.14)] focus-visible:-translate-y-1.5 focus-visible:border-gold-400/70"
    >
      {/* A pool of light under the cursor, tinted by the project's category */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_220px_at_var(--mx,50%)_var(--my,40%),rgb(var(--tint)/0.16),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div
        className="relative border-b border-gold-500/20 p-3 transition duration-500 group-hover:brightness-110"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 120%, rgb(var(--tint) / 0.3), transparent 70%), linear-gradient(to bottom, var(--color-void-700), var(--color-void-900))",
        }}
      >
        <span aria-hidden className="absolute left-4 top-4 z-10 font-mono text-[0.65rem] tracking-[0.25em] text-parchment-500">
          {d.projects.cardNumber(number)}
        </span>
        <div className="transition duration-500 group-hover:-translate-y-0.5 group-hover:scale-[1.015]">
          <ProjectPreview project={project} size="card" />
        </div>
        {/* A band of light that crosses the card on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[420%] group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-gold-500">{t(project.kind)}</p>
        <h3 className="mt-2 font-display text-lg leading-snug text-parchment-100 transition-colors duration-300 group-hover:text-gold-300">
          {project.name}
        </h3>
        <p className="mt-3 line-clamp-4 text-base leading-snug text-parchment-300/85">{t(project.summary)}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.categories.map((category) => (
            <li
              key={category}
              className="border border-gold-500/25 px-2 py-0.5 font-mono text-[0.65rem] tracking-wider text-parchment-500 transition-colors duration-300 group-hover:border-gold-500/45"
            >
              {d.projects.categories[category]}
            </li>
          ))}
        </ul>

        <span className="mt-auto pt-5 font-display text-[0.7rem] uppercase tracking-[0.22em] text-gold-300">
          {d.projects.inspect} <span aria-hidden className="inline-block transition group-hover:translate-x-1">&rarr;</span>
        </span>
      </div>
    </button>
  );
}
