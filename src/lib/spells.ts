import { emitMagic, openMap, toast } from "@/lib/magicBus";
import { discover } from "@/lib/secrets";
import { getMagic, setSpell, type SpellId } from "@/lib/magic/magicState";

/** Last known pointer position, so spells like Lumos and Accio know where to act. */
export const pointer = { x: 0, y: 0, known: false };

/**
 * Transient spells play for a fixed time and then clear, so effects never pile up. While one is playing the
 * others politely wait (the toolbar shows the button as busy). Lumos is a toggle and ends with Nox.
 */
const DURATIONS: Partial<Record<SpellId, number>> = {
  alohomora: 3200,
  leviosa: 6500,
  revelio: 4200,
};

let timer = 0;

function root() {
  return document.documentElement;
}

function setLumos(on: boolean) {
  if (on) root().setAttribute("data-lumos", "on");
  else root().removeAttribute("data-lumos");
}

function centre() {
  return {
    x: pointer.known ? pointer.x : window.innerWidth / 2,
    y: pointer.known ? pointer.y : window.innerHeight / 2,
  };
}

/** Plays a timed decorative spell by switching one attribute on <html>, which houses.css / magic.css react to. */
function timed(id: SpellId, attribute: string): boolean {
  if (getMagic().cooling) return false;
  window.clearTimeout(timer);
  root().setAttribute(attribute, "on");
  setSpell(id, true);
  timer = window.setTimeout(() => {
    root().removeAttribute(attribute);
    const lit = root().getAttribute("data-lumos") === "on";
    setSpell(lit ? "lumos" : null, false);
  }, DURATIONS[id] ?? 3000);
  return true;
}

/**
 * Casts a spell by id (toolbar buttons) or word (typed anywhere, or whispered to the map). Returns true when
 * the word was a spell, so callers can react to a miss. Nothing here is needed to read the portfolio.
 */
export function castSpell(raw: string): boolean {
  const word = raw.toLowerCase().replace(/[^a-z]/g, "");
  const at = centre();

  switch (word) {
    case "lumos":
      setLumos(true);
      setSpell("lumos");
      emitMagic({ type: "burst", ...at, size: "small" });
      discover("lumos");
      toast("Lumos.");
      return true;
    case "nox":
      setLumos(false);
      setSpell(getMagic().cooling ? getMagic().spell : null);
      toast("Nox.");
      return true;
    case "alohomora":
      if (!timed("alohomora", "data-alohomora")) return true;
      emitMagic({ type: "burst", ...at, size: "small" });
      toast("Alohomora.");
      return true;
    case "revelio":
      if (!timed("revelio", "data-revelio")) return true;
      emitMagic({ type: "burst", ...at, size: "small" });
      toast("Revelio.");
      return true;
    case "leviosa":
    case "wingardiumleviosa":
      if (!timed("leviosa", "data-levitate")) return true;
      discover("levitate");
      toast("Wingardium Leviosa.");
      return true;
    case "accio":
      emitMagic({ type: "accio", ...at });
      discover("accio");
      return true;
    case "patronus":
    case "expectopatronum":
      emitMagic({ type: "patronus" });
      discover("patronus");
      toast("Expecto Patronum!");
      return true;
    case "hedwig":
      emitMagic({ type: "rain" });
      discover("owl");
      return true;
    case "mischief":
    case "mischiefmanaged":
      openMap();
      return true;
    default:
      return false;
  }
}

/** Known words that can be typed anywhere on the page. Longest matches are checked first. */
export const typedSpells = [
  "wingardiumleviosa",
  "expectopatronum",
  "mischief",
  "alohomora",
  "leviosa",
  "patronus",
  "revelio",
  "hedwig",
  "accio",
  "lumos",
  "nox",
];
