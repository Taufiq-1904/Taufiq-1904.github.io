"use client";

import { SectionShell } from "@/components/ui/SectionShell";
import { OwlPost } from "@/components/contact/OwlPost";
import { useLang } from "@/lib/i18n/useLang";

export function ContactSection() {
  const { d } = useLang();
  return (
    <SectionShell
      id="contact"
      chapter={d.sections.contact.chapter}
      title={d.sections.contact.title}
      subtitle={d.sections.contact.subtitle}
    >
      <OwlPost />
    </SectionShell>
  );
}
