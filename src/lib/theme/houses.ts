import type { Localized } from "@/lib/i18n/locales";

/**
 * The four house worlds, described in ONE place.
 *
 * Colours live in globals.css (html[data-house="..."]) and the room-specific styling in houses.css.
 * This file holds everything else a component or the store needs to know about a house: its name and
 * mood, the backdrop photograph, the portrait of me in that house's styling, and the selector thumbnail.
 * Components never hard-code an image path; they read it from here.
 *
 * A house is a visual preference, not a claim about which house I belong to.
 */
export const HOUSES = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"] as const;
export type House = (typeof HOUSES)[number];

/** The most balanced and readable palette. Visitors never have to choose. */
export const DEFAULT_HOUSE: House = "gryffindor";

export function isHouse(value: unknown): value is House {
  return typeof value === "string" && (HOUSES as readonly string[]).includes(value);
}

export type HouseInfo = {
  name: Localized;
  /** One line shown under the name in the selector. */
  mood: Localized;
  /** A little longer, used as the selector card's tooltip and accessible description. */
  atmosphere: Localized;
  /** A short personality line for the Sorting Hat ceremony. Flavour text only. */
  trait: Localized;
  /** Two swatch colours shown in the selector, mirroring the palette in globals.css. */
  swatch: readonly [string, string];
  /** Colour of the emblem drawn on top of the crest's first swatch colour. */
  ink: string;
  /** themeColor for the browser UI. */
  chrome: string;
};

export const houseInfo: Record<House, HouseInfo> = {
  gryffindor: {
    name: { en: "Gryffindor", id: "Gryffindor" },
    mood: { en: "Crimson and gold, firelight", id: "Merah tua dan emas, cahaya api" },
    atmosphere: {
      en: "A warm tower bedroom: crimson banners, a crackling hearth and candlelight on dark oak.",
      id: "Kamar menara yang hangat: spanduk merah tua, perapian menyala, dan cahaya lilin di kayu ek gelap.",
    },
    trait: { en: "Brave, bold and quick to act.", id: "Berani, tegas, dan sigap bertindak." },
    swatch: ["#a3342f", "#e6bd5f"],
    ink: "#f6dc8e",
    chrome: "#0b0507",
  },
  slytherin: {
    name: { en: "Slytherin", id: "Slytherin" },
    mood: { en: "Emerald and silver, under the lake", id: "Zamrud dan perak, di bawah danau" },
    atmosphere: {
      en: "A vaulted chamber beneath the lake: green lamplight, dark stone and slow underwater shimmer.",
      id: "Ruang berkubah di bawah danau: lampu hijau, batu gelap, dan kilau air yang bergerak pelan.",
    },
    trait: { en: "Ambitious, resourceful and calm under pressure.", id: "Ambisius, cerdik, dan tenang di bawah tekanan." },
    swatch: ["#1f7a55", "#b9c9c2"],
    ink: "#e3ece8",
    chrome: "#030807",
  },
  ravenclaw: {
    name: { en: "Ravenclaw", id: "Ravenclaw" },
    mood: { en: "Midnight blue and bronze, starlight", id: "Biru tengah malam dan perunggu, cahaya bintang" },
    atmosphere: {
      en: "A tall library under a night sky: bronze chandeliers, star charts and cool moonlight.",
      id: "Perpustakaan tinggi di bawah langit malam: lampu gantung perunggu, peta bintang, dan cahaya bulan sejuk.",
    },
    trait: { en: "Curious, precise and always learning.", id: "Penasaran, teliti, dan selalu belajar." },
    swatch: ["#2b4aa8", "#cfa56e"],
    ink: "#ecd2a8",
    chrome: "#04060f",
  },
  hufflepuff: {
    name: { en: "Hufflepuff", id: "Hufflepuff" },
    mood: { en: "Golden yellow and green, soft sunlight", id: "Kuning keemasan dan hijau, sinar matahari lembut" },
    atmosphere: {
      en: "A sunlit greenhouse room: leather sofas, ivy and pumpkins, with drifting leaves and honey light.",
      id: "Ruang rumah kaca yang diterangi matahari: sofa kulit, tanaman rambat, dan labu, dengan daun melayang dan cahaya madu.",
    },
    trait: { en: "Loyal, patient and quietly hard-working.", id: "Setia, sabar, dan tekun tanpa banyak bicara." },
    swatch: ["#f5c93a", "#3f2d16"],
    ink: "#3f2d16",
    chrome: "#0c0904",
  },
};

export type HousePhoto = {
  /** Desktop backdrop. */
  src: string;
  /** Smaller file for phones (below 768 px). */
  srcSm: string;
  /** CSS background-position, so the interesting part of the room stays in view when cropped. */
  position: string;
};

export type HousePortrait = {
  /**
   * Transparent cutout of the same photograph (public/images/portrait/cutout/<house>.webp). When present the
   * portrait is composed INTO the room: the subject stands in an arched window of the house scene.
   */
  cutout: string;
  /** Web-sized 4:5 crop of the original photograph (public/images/portrait/web/<house>.webp), opaque background. */
  src: string;
  /** The untouched original supplied for this house (public/images/portrait/<house>.webp). Last resort before the profile photo. */
  original: string;
  /** CSS object-position inside the 4:5 frame, so the face stays in view whatever the source ratio. */
  position: string;
};

export type HouseScene = {
  photo: HousePhoto;
  /** Small preview shown in the selector. */
  thumb: string;
  portrait: HousePortrait;
};

const base = "/images/houses";
const portraits = "/images/portrait";

export const houseScenes: Record<House, HouseScene> = {
  gryffindor: {
    photo: { src: `${base}/gryffindor/bg.webp`, srcSm: `${base}/gryffindor/bg-sm.webp`, position: "50% 58%" },
    thumb: `${base}/gryffindor/thumb.webp`,
    portrait: { cutout: `${portraits}/cutout/gryffindor.webp`, src: `${portraits}/web/gryffindor.webp`, original: `${portraits}/gryffindor.webp`, position: "50% 18%" },
  },
  slytherin: {
    photo: { src: `${base}/slytherin/bg.webp`, srcSm: `${base}/slytherin/bg-sm.webp`, position: "50% 50%" },
    thumb: `${base}/slytherin/thumb.webp`,
    portrait: { cutout: `${portraits}/cutout/slytherin.webp`, src: `${portraits}/web/slytherin.webp`, original: `${portraits}/slytherin.webp`, position: "50% 18%" },
  },
  ravenclaw: {
    photo: { src: `${base}/ravenclaw/bg.webp`, srcSm: `${base}/ravenclaw/bg-sm.webp`, position: "50% 50%" },
    thumb: `${base}/ravenclaw/thumb.webp`,
    portrait: { cutout: `${portraits}/cutout/ravenclaw.webp`, src: `${portraits}/web/ravenclaw.webp`, original: `${portraits}/ravenclaw.webp`, position: "50% 18%" },
  },
  hufflepuff: {
    photo: { src: `${base}/hufflepuff/bg.webp`, srcSm: `${base}/hufflepuff/bg-sm.webp`, position: "50% 60%" },
    thumb: `${base}/hufflepuff/thumb.webp`,
    portrait: { cutout: `${portraits}/cutout/hufflepuff.webp`, src: `${portraits}/web/hufflepuff.webp`, original: `${portraits}/hufflepuff.webp`, position: "50% 18%" },
  },
};

/**
 * Show a small "house portrait pending" tag on the portrait while a house has no portrait file yet.
 * It appears only in development, so a real visitor never sees it; the report lists what is still missing.
 */
export const SHOW_PORTRAIT_PENDING_TAG = process.env.NODE_ENV !== "production";
