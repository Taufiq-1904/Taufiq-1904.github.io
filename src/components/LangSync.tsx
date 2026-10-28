"use client";

import { useEffect } from "react";
import { htmlLang } from "@/lib/i18n/locales";
import { useLang } from "@/lib/i18n/useLang";

/** Keeps <html lang> in step with the chosen language (screen readers and browsers use it to pick a voice). */
export function LangSync() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = htmlLang[lang];
  }, [lang]);
  return null;
}
