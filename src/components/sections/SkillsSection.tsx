"use client";

import { SectionShell } from "@/components/ui/SectionShell";
import { Spellbook } from "@/components/skills/Spellbook";
import { BookTrigger, HalfBloodPrinceBook } from "@/components/skills/HalfBloodPrinceBook";
import { openBook } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";

export function SkillsSection() {
  const { d } = useLang();
  return (
    <SectionShell
      id="skills"
      chapter={d.sections.skills.chapter}
      title={d.sections.skills.title}
      subtitle={d.sections.skills.subtitle}
    >
      <BookTrigger onOpen={openBook} />
      <Spellbook />
      <HalfBloodPrinceBook />
    </SectionShell>
  );
}
