import type { Localized } from "@/lib/i18n/locales";

/**
 * The wand styles. These are visual styles only (silhouette, glow colour and the kind of trail they leave),
 * not claims about any official wand specification.
 */
export const WAND_IDS = ["classic", "pale", "gilded", "dark", "rune", "celestial"] as const;
export type WandId = (typeof WAND_IDS)[number];

export function isWandId(value: unknown): value is WandId {
  return typeof value === "string" && (WAND_IDS as readonly string[]).includes(value);
}

export type WandTrail = "spark" | "ember" | "rune" | "star";

export type WandInfo = {
  name: Localized;
  blurb: Localized;
  /** Space separated "r g b" triplets, the format the canvas sprites already use. */
  core: string;
  mid: string;
  trail: WandTrail;
};

export const wandInfo: Record<WandId, WandInfo> = {
  classic: {
    name: { en: "Classic", id: "Klasik" },
    blurb: { en: "Polished wood, warm golden sparks.", id: "Kayu mengilap, percikan emas hangat." },
    core: "255 233 160",
    mid: "240 192 90",
    trail: "ember",
  },
  pale: {
    name: { en: "Pale", id: "Pucat" },
    blurb: { en: "Pale, smooth wood, soft silver-white sparks.", id: "Kayu pucat yang halus, percikan putih keperakan." },
    core: "255 255 255",
    mid: "205 214 232",
    trail: "spark",
  },
  gilded: {
    name: { en: "Gilded", id: "Berlapis emas" },
    blurb: { en: "Aged wood with gold bands, slow golden motes.", id: "Kayu tua dengan pita emas, butiran emas yang pelan." },
    core: "255 240 188",
    mid: "214 168 70",
    trail: "rune",
  },
  dark: {
    name: { en: "Enchanted", id: "Terpesona" },
    blurb: { en: "Night-black grain, violet embers.", id: "Serat hitam malam, bara ungu." },
    core: "232 214 255",
    mid: "150 96 230",
    trail: "spark",
  },
  rune: {
    name: { en: "Rune", id: "Rune" },
    blurb: { en: "Carved with glowing marks, teal light.", id: "Berukir tanda bercahaya, cahaya hijau kebiruan." },
    core: "200 255 236",
    mid: "64 200 168",
    trail: "rune",
  },
  celestial: {
    name: { en: "Celestial", id: "Surgawi" },
    blurb: { en: "Slender silver, drifting starlight.", id: "Perak ramping, cahaya bintang melayang." },
    core: "232 240 255",
    mid: "130 164 244",
    trail: "star",
  },
};

/**
 * Wand artwork, drawn once, horizontally, in a 120 x 20 box with the TIP at the left (2, 10).
 * The toolbar draws it as is; the page cursor rotates it so the tip sits exactly on the pointer hotspot.
 * Static markup written here, never user input.
 */
export const wandMarkup: Record<WandId, string> = {
  classic:
    '<path d="M3 10 L98 7 L98 13 Z" fill="#9a6532"/><path d="M6 9.4 L96 7.6" stroke="#d9a064" stroke-width="1" stroke-linecap="round"/>' +
    '<rect x="94" y="6" width="5" height="8" rx="1.5" fill="#d6a94a"/><rect x="98" y="5" width="21" height="10" rx="5" fill="#5a3716"/>' +
    '<path d="M104 5.6 V14.4 M110 5.6 V14.4" stroke="#8a5a2b" stroke-width="1"/><circle cx="3" cy="10" r="2" fill="#ffe9a0"/>',
  pale:
    '<path d="M3 10 L98 7.4 L98 12.6 Z" fill="#e8dcc2"/><path d="M6 9.5 L96 8" stroke="#fffaf0" stroke-width="1" stroke-linecap="round"/><path d="M30 9.2 C34 10.6 38 9.4 42 10.4" stroke="#c9b98f" stroke-width="0.7" fill="none"/>' +
    '<rect x="94" y="6" width="5" height="8" rx="1.5" fill="#c3cad8"/><rect x="98" y="5" width="21" height="10" rx="5" fill="#d3c29a"/><path d="M104 5.6 V14.4 M110 5.6 V14.4" stroke="#b7a57a" stroke-width="1"/><circle cx="3" cy="10" r="2" fill="#ffffff"/>',
  gilded:
    '<path d="M3 10 L98 6.8 L98 13.2 Z" fill="#6b4a24"/><path d="M6 9.4 L96 7.4" stroke="#a87c43" stroke-width="1" stroke-linecap="round"/>' +
    '<g fill="#d6a94a"><rect x="30" y="7.9" width="3" height="4.2" rx="0.8"/><rect x="56" y="7.3" width="3" height="5.4" rx="0.8"/><rect x="80" y="6.8" width="3" height="6.4" rx="0.8"/></g>' +
    '<rect x="94" y="5.6" width="5" height="8.8" rx="1.5" fill="#d6a94a"/><rect x="98" y="4.6" width="21" height="10.8" rx="5" fill="#3e2a12" stroke="#d6a94a" stroke-width="1"/><circle cx="113" cy="10" r="2.4" fill="#f4d98a"/><circle cx="3" cy="10" r="2" fill="#fff0bc"/>',
  dark:
    '<path d="M3 10 C18 5 28 15 44 9 S72 14 98 8 L98 12.5 C72 15 56 9 44 12.5 S18 15 3 10 Z" fill="#1d1628" stroke="#7a58b8" stroke-width="1"/>' +
    '<rect x="94" y="6" width="5" height="8" rx="1.5" fill="#b9bfd0"/><rect x="98" y="5" width="21" height="10" rx="5" fill="#0f0b16" stroke="#7a58b8" stroke-width="1"/>' +
    '<circle cx="109" cy="10" r="2.6" fill="#a06af0"/><circle cx="3" cy="10" r="2" fill="#e8d6ff"/>',
  rune:
    '<path d="M3 10 L98 6.6 L98 13.4 Z" fill="#8a846f"/><path d="M6 9.2 L96 7" stroke="#bdb79f" stroke-width="1" stroke-linecap="round"/>' +
    '<g stroke="#46e0b8" stroke-width="1.3" stroke-linecap="round" fill="none"><path d="M24 8.6 V11.4 M24 10 L27 8.6"/><path d="M42 8.2 L45 11.6 M45 8.2 L42 11.6"/><path d="M62 8 V12 M59.6 9.4 L62 8 L64.4 9.4"/><path d="M80 8.4 L83 10 L80 11.6"/></g>' +
    '<rect x="98" y="5" width="21" height="10" rx="4" fill="#4d4a3e"/><path d="M103 5 L106 15 M109 5 L112 15 M115 5 L118 15" stroke="#6e6a58" stroke-width="1"/><circle cx="3" cy="10" r="2" fill="#c8ffec"/>',
  celestial:
    '<path d="M3 10 L98 8.2 L98 11.8 Z" fill="#d6d3ea"/><path d="M6 9.6 L96 8.6" stroke="#ffffff" stroke-width="0.9" stroke-linecap="round"/>' +
    '<rect x="94" y="7" width="4" height="6" rx="1.2" fill="#e0bd6c"/><rect x="98" y="6.4" width="18" height="7.2" rx="3.6" fill="#35406e"/>' +
    '<path d="M117 10 l1.6 -4 1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 Z" fill="#f3e2a2" transform="translate(-4 -2) scale(0.8)"/>' +
    '<circle cx="3" cy="10" r="2" fill="#e8f0ff"/>',
};

/** An SVG data URI for the page cursor. The wand points up-left; hotspot is the tip at (3, 3). */
export function wandCursorUri(id: WandId): string {
  const info = wandInfo[id];
  const glow = `rgb(${info.mid.split(" ").join(",")})`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">` +
    `<circle cx="4" cy="4" r="3.4" fill="${glow}" opacity="0.35"/>` +
    `<g transform="translate(4 4) rotate(45) scale(0.3) translate(-3 -10)">${wandMarkup[id]}</g></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 4 4`;
}
