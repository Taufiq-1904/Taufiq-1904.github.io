"use client";

import { SectionShell } from "@/components/ui/SectionShell";
import { Timeline } from "@/components/experience/Timeline";
import { useLang } from "@/lib/i18n/useLang";

export function ExperienceSection() {
  const { d } = useLang();
  return (
    <SectionShell
      id="experience"
      chapter={d.sections.experience.chapter}
      title={d.sections.experience.title}
      subtitle={d.sections.experience.subtitle}
    >
      <Timeline />
    </SectionShell>
  );
}
