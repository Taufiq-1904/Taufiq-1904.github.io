import type { Metadata, Viewport } from "next";
import "@fontsource-variable/caveat";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import "./houses.css";
import "./magic.css";
import { getSiteUrl, site } from "@/lib/site";
import { INTRO_BOOT_SCRIPT } from "@/lib/introSession";
import { HOUSE_BOOT_SCRIPT } from "@/lib/theme/houseStore";
import { MusicBox } from "@/components/audio/MusicBox";
import { IntroGate } from "@/components/intro/IntroGate";
import { LangSync } from "@/components/LangSync";
import { MagicRoot } from "@/components/magic/MagicRoot";
import { HouseBackdrop } from "@/components/theme/HouseBackdrop";
import { SortingHat } from "@/components/ceremony/SortingHat";
import { TalkingLetter } from "@/components/ceremony/TalkingLetter";
import { HouseSideDecor } from "@/components/environment/SideDecor";
import { MagicalEnvironment } from "@/components/environment/MagicalEnvironment";
import { MischiefCorners } from "@/components/environment/MischiefCorners";
import { MagicalCursor } from "@/components/magic/MagicalCursor";
import { SpellToolbar } from "@/components/magic/SpellToolbar";
import { WandSelector } from "@/components/magic/WandSelector";

const title = `${site.name} | ${site.titleSuffix}`;

// The page is a single URL whose language switches in the browser, so crawlers and link previews
// read the English copy. Visitors get English or Bahasa Indonesia (saved choice, then browser language).
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description: site.description.en,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Taufiq Candra Kurniawan",
    "portfolio",
    "Informatics",
    "Flutter",
    "mobile development",
    "networking",
    "cybersecurity",
    "infrastructure",
    "UPN Veteran Yogyakarta",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description.en,
    locale: "en_US",
    alternateLocale: ["id_ID"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description.en,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0507",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: HOUSE_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <HouseBackdrop />
        <MagicalEnvironment />
        <HouseSideDecor />
        <LangSync />
        {children}
        <IntroGate />
        <MagicRoot />
        <MagicalCursor />
        <MischiefCorners />
        <SpellToolbar />
        <WandSelector />
        <SortingHat />
        <TalkingLetter />
        <MusicBox />
        <div aria-hidden className="house-atmosphere" />
        <div aria-hidden className="house-wash" />
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
