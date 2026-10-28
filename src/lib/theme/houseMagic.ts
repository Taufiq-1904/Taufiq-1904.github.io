import type { House } from "./houses";

/**
 * Per-house magic, as data. The environment manager reads this table, so giving a house a different creature
 * or changing how often something appears means editing one entry, not a component.
 *
 *  - `signature`: the creature that belongs to the house.
 *  - `entrance`: what appears right after the visitor switches to this house.
 *  - `events`: relative weights for the occasional background events. Creatures that need a big screen are
 *    filtered out on phones and tablets (see `largeScreenOnly`).
 */
export type CreatureKind = "phoenix" | "owl" | "serpent" | "raven" | "badger" | "broom" | "dragon" | "hippo" | "troll";

export type HouseMagic = {
  signature: CreatureKind;
  entrance: CreatureKind;
  events: Partial<Record<CreatureKind, number>>;
};

export const houseMagic: Record<House, HouseMagic> = {
  gryffindor: { signature: "phoenix", entrance: "phoenix", events: { phoenix: 46, broom: 30, owl: 10, hippo: 12, dragon: 7, troll: 4 } },
  slytherin: { signature: "serpent", entrance: "serpent", events: { serpent: 46, broom: 20, owl: 8, hippo: 12, dragon: 6, troll: 5 } },
  ravenclaw: { signature: "raven", entrance: "raven", events: { raven: 46, broom: 20, owl: 10, hippo: 12, dragon: 6, troll: 3 } },
  hufflepuff: { signature: "badger", entrance: "badger", events: { badger: 46, broom: 20, owl: 10, hippo: 12, dragon: 6, troll: 4 } },
};

/** How long each event plays, in milliseconds. Must match the CSS animation length in magic.css. */
export const creatureDuration: Record<CreatureKind, number> = {
  phoenix: 12000,
  owl: 17000,
  serpent: 12000,
  raven: 15000,
  badger: 15000,
  broom: 9500,
  dragon: 17000,
  hippo: 17000,
  troll: 11000,
};

export const largeScreenOnly: readonly CreatureKind[] = ["hippo", "dragon", "troll"];
