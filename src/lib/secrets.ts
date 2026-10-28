/**
 * Hidden things visitors can discover. Progress is kept in localStorage (when allowed)
 * and mirrored in memory, so the counter still works in private windows.
 */
import { toast } from "@/lib/magicBus";
import type { Localized } from "@/lib/i18n/locales";

export type SecretId = "lumos" | "patronus" | "accio" | "levitate" | "map" | "owl";

export const secrets: readonly { id: SecretId; hint: Localized; found: Localized }[] = [
  {
    id: "lumos",
    hint: { en: "Light a wand with a whispered word.", id: "Nyalakan tongkat sihir dengan sepatah kata yang dibisikkan." },
    found: {
      en: "Lumos: the page lights up around the cursor.",
      id: "Lumos: halaman menyala di sekitar kursor.",
    },
  },
  {
    id: "patronus",
    hint: { en: "Some old arcade habits summon a guardian.", id: "Beberapa kebiasaan lama arkade memanggil seorang penjaga." },
    found: { en: "Expecto Patronum: a silver guardian.", id: "Expecto Patronum: seorang penjaga keperakan." },
  },
  {
    id: "accio",
    hint: { en: "Call the sparks to you.", id: "Panggil percikan itu agar datang kepadamu." },
    found: { en: "Accio: the sparks come when called.", id: "Accio: percikan datang saat dipanggil." },
  },
  {
    id: "levitate",
    hint: {
      en: "Make the artefacts float, if you know the charm.",
      id: "Buat artefak melayang, jika kamu tahu mantranya.",
    },
    found: { en: "Wingardium Leviosa: the enchanted ornaments float.", id: "Wingardium Leviosa: ornamen sihir melayang." },
  },
  {
    id: "map",
    hint: { en: "Mischief has a way of being managed.", id: "Kenakalan selalu ada cara untuk diakhiri." },
    found: { en: "The Marauder's Map.", id: "Peta Perampok." },
  },
  {
    id: "owl",
    hint: { en: "Click the mail carrier, slowly, three times.", id: "Klik si pengantar surat, pelan-pelan, tiga kali." },
    found: { en: "The owl dropped something.", id: "Burung hantu menjatuhkan sesuatu." },
  },
];

const KEY = "cloudexe:secrets";
let found = new Set<SecretId>();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      found = new Set(secrets.filter((s) => ids.includes(s.id)).map((s) => s.id));
    }
  } catch {
    /* storage blocked: keep the in-memory set */
  }
}

export function subscribeSecrets(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getSecretsCount(): number {
  load();
  return found.size;
}

export function getSecretsServerCount(): number {
  return 0;
}

export function hasSecret(id: SecretId): boolean {
  load();
  return found.has(id);
}

/** Records a discovery. Announces it only the first time. */
export function discover(id: SecretId) {
  load();
  if (found.has(id)) return;
  found.add(id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...found]));
  } catch {
    /* ignore */
  }
  const entry = secrets.find((s) => s.id === id);
  const count = `${found.size}/${secrets.length}`;
  toast({
    en: `Secret found (${count}): ${entry?.found.en ?? id}`,
    id: `Rahasia ditemukan (${count}): ${entry?.found.id ?? id}`,
  });
  listeners.forEach((l) => l());
}
