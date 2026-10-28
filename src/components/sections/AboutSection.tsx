"use client";

import { SectionShell } from "@/components/ui/SectionShell";
import { AboutBook } from "@/components/about/AboutBook";
import { CvButton } from "@/components/media/CvButton";
import { ProfilePortrait } from "@/components/media/ProfilePortrait";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n/useLang";

export function AboutSection() {
  const { d } = useLang();
  return (
    <SectionShell
      id="about"
      chapter={d.sections.about.chapter}
      title={d.sections.about.title}
      subtitle={d.sections.about.subtitle(site.name, site.school)}
    >
      <div className="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-6">
          <ProfilePortrait />
          <CvButton variant="secondary" />
        </div>
        <AboutBook />
      </div>
    </SectionShell>
  );
}
