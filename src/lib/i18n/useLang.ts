"use client";

import { useCallback, useSyncExternalStore } from "react";
import { dictionaries } from "./dictionary";
import { getLang, getLangServer, setLang, subscribeLang } from "./langStore";
import type { Lang, Localized } from "./locales";

/** Current language, the UI dictionary for it, and `t` to pick a value out of a Localized pair. */
export function useLang() {
  const lang = useSyncExternalStore(subscribeLang, getLang, getLangServer);
  const t = useCallback(<T,>(value: Localized<T>): T => value[lang], [lang]);
  return { lang, d: dictionaries[lang], t, setLang: setLang as (next: Lang) => void };
}
