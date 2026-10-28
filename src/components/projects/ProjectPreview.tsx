"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/content/projects";
import { useExistingAssets } from "@/lib/useAssetExists";
import { useLang } from "@/lib/i18n/useLang";
import { ProjectDiagram } from "./ProjectDiagram";

type ProjectPreviewProps = {
  project: Project;
  /** "card" is the small thumbnail; "dialog" is the large preview with a screenshot switcher. */
  size: "card" | "dialog";
};

/** Gold corner ornaments, drawn once. Restrained on purpose so the project stays the focus. */
function Corners() {
  const corner = "pointer-events-none absolute size-3 border-gold-400/80";
  return (
    <>
      <span aria-hidden className={`${corner} left-1 top-1 border-l border-t`} />
      <span aria-hidden className={`${corner} right-1 top-1 border-r border-t`} />
      <span aria-hidden className={`${corner} bottom-1 left-1 border-b border-l`} />
      <span aria-hidden className={`${corner} bottom-1 right-1 border-b border-r`} />
    </>
  );
}

/**
 * A framed preview. Real screenshots (listed in the project's `screenshots`) are shown when their
 * files exist. Otherwise a conceptual diagram appears with an honest label, so no preview ever
 * pretends to be the real interface.
 */
export function ProjectPreview({ project, size }: ProjectPreviewProps) {
  const { d, t } = useLang();
  const [index, setIndex] = useState(0);
  const listed = project.screenshots;
  const present = useExistingAssets(listed.map((shot) => shot.src));
  const shots = present ? listed.filter((shot) => present.includes(shot.src)) : [];
  const checking = listed.length > 0 && present === null;
  const showShots = shots.length > 0;
  const current = shots[Math.min(index, Math.max(0, shots.length - 1))];
  const large = size === "dialog";

  return (
    <div>
      <div
        className={`relative aspect-[5/3] overflow-hidden border border-gold-500/50 bg-void-900 shadow-[inset_0_0_0_3px_var(--color-void-800),inset_0_0_0_4px_rgb(var(--accent-rgb)/0.25)] ${
          large ? "p-3 md:p-4" : "p-2.5"
        }`}
      >
        <Corners />
        {showShots && current ? (
          <div className="relative size-full overflow-hidden">
            <Image
              src={current.src}
              alt={current.alt ? t(current.alt) : d.preview.screenshotAlt(project.name, index + 1)}
              fill
              sizes={large ? "(min-width: 832px) 760px, 92vw" : "(min-width: 1280px) 280px, (min-width: 768px) 45vw, 90vw"}
              className="object-contain"
            />
          </div>
        ) : checking ? null : (
          <div className="size-full text-gold-300">
            <ProjectDiagram diagram={project.diagram} name={project.name} />
          </div>
        )}
        <span className="pointer-events-none absolute bottom-2 left-2 right-2 flex justify-start">
          <span className="border border-gold-500/40 bg-void-950/85 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-parchment-300">
            {showShots ? d.preview.screenshot : checking ? "" : d.preview.conceptual}
          </span>
        </span>
      </div>

      {large && shots.length > 1 ? (
        <div role="group" aria-label={current ? d.preview.screenshotOf(index + 1, shots.length) : undefined} className="mt-3 flex flex-wrap gap-2">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              aria-pressed={i === index}
              aria-label={d.preview.showScreenshot(i + 1)}
              onClick={() => setIndex(i)}
              className={`inline-flex size-11 items-center justify-center border font-mono text-xs transition ${
                i === index ? "border-gold-400 bg-gold-400/15 text-gold-300" : "border-gold-500/30 text-parchment-300 hover:border-gold-400/70"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      ) : null}

      {large && current?.caption ? <p className="mt-3 text-base italic text-parchment-300/90">{t(current.caption)}</p> : null}
      {large && !showShots && !checking ? <p className="mt-3 text-sm leading-snug text-parchment-500">{d.preview.addHelp}</p> : null}
    </div>
  );
}
