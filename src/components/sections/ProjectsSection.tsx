"use client";

import { SectionShell } from "@/components/ui/SectionShell";
import { ProjectBrowser } from "@/components/projects/ProjectBrowser";
import { useLang } from "@/lib/i18n/useLang";

export function ProjectsSection() {
  const { d } = useLang();
  return (
    <SectionShell
      id="projects"
      chapter={d.sections.projects.chapter}
      title={d.sections.projects.title}
      subtitle={d.sections.projects.subtitle}
    >
      <ProjectBrowser />
    </SectionShell>
  );
}
