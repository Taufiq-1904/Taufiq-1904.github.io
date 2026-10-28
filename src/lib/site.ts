import type { Localized } from "@/lib/i18n/locales";

// Everything that describes the person lives here so copy can change without touching components.
export const site = {
  name: "Taufiq Candra Kurniawan",
  /** Used in the browser title, the manifest and link previews: "<name> | Portfolio". */
  titleSuffix: "Portfolio",
  school: "UPN “Veteran” Yogyakarta",
  tagline: {
    en: "Informatics student conjuring mobile apps, resilient networks, and secure infrastructure.",
    id: "Mahasiswa Informatika yang merapal aplikasi mobile, jaringan tangguh, dan infrastruktur yang aman.",
  } satisfies Localized,
  /** Used for <meta name="description"> and social previews. Search engines read the English copy. */
  description: {
    en: "Portfolio of Taufiq Candra Kurniawan, an Informatics student at UPN “Veteran” Yogyakarta. Mobile development, networking, cybersecurity and infrastructure.",
    id: "Portofolio Taufiq Candra Kurniawan, mahasiswa Informatika di UPN “Veteran” Yogyakarta. Pengembangan mobile, jaringan, keamanan siber, dan infrastruktur.",
  } satisfies Localized,
  interests: [
    { en: "Mobile Development", id: "Pengembangan Mobile" },
    { en: "Networking", id: "Jaringan" },
    { en: "Cybersecurity", id: "Keamanan Siber" },
    { en: "Infrastructure", id: "Infrastruktur" },
  ] satisfies readonly Localized[],
  year: 2026,
} as const;

/**
 * Public address of the deployed site, used for canonical URLs and social previews.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (Settings → Environment Variables) once you have a domain.
 * Without it the build falls back to Vercel's own production URL, then to localhost.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "https://taufiq-1904.github.io";
}

// Labels are looked up in the dictionary (`nav.<id>`), so this list only decides order and anchors.
export const navItems = [
  { id: "about" },
  { id: "projects" },
  { id: "experience" },
  { id: "skills" },
  { id: "contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

// "home" is the hero, which has no nav link but still needs to be tracked.
export const trackedSectionIds: readonly string[] = ["home", ...navItems.map((item) => item.id)];

/**
 * Where visitors can reach me. Every field is optional and nothing is shown for an empty one,
 * so no placeholder address ever reaches the page. The CV is configured in src/lib/assets.ts.
 * Fill these in with real values:
 *   email:    "name@example.com"
 *   github:   "https://github.com/<username>"
 *   linkedin: "https://www.linkedin.com/in/<handle>"
 *   instagram: "https://www.instagram.com/<handle>"
 */
export type ContactChannels = {
  email?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
};

// Email comes from the mailto link in my CV; the GitHub profile is the owner of the three repositories the
// CV links to. LinkedIn and Instagram have no verified address yet, so they stay empty and nothing is shown.
export const contact: ContactChannels = {
  email: "candra.kurniawan157t@gmail.com",
  github: "https://github.com/Taufiq-1904",
};
