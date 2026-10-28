export const LANGS = ["en", "id"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

/** A value written once per language. Content files use this so components never hard-code copy. */
export type Localized<T = string> = { readonly en: T; readonly id: T };

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "id";
}

/** BCP 47 tag used for the <html lang> attribute and Intl formatting. */
export const htmlLang: Record<Lang, string> = { en: "en", id: "id" };
