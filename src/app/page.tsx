import { site, getSiteUrl } from "@/lib/site";
import { SkipLink } from "@/components/ui/SkipLink";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DeathlyHallows } from "@/components/magic/DeathlyHallows";
import { QuidditchPitch } from "@/components/magic/QuidditchPitch";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Hero } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";

// Structured data for search engines: who this page is about. Only facts already shown on the page.
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: getSiteUrl(),
  description: site.description.en,
  affiliation: { "@type": "CollegeOrUniversity", name: site.school },
}).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      <SkipLink />
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <QuidditchPitch />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
        <DeathlyHallows />
      </main>
      <Footer />
    </>
  );
}
