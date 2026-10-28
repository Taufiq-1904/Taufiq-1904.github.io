"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getHouse, getHouseServer, subscribeHouse } from "@/lib/theme/houseStore";
import type { House } from "@/lib/theme/houses";
import { OwlArt } from "@/components/scene/FlyingOwl";
import { creatureDuration, houseMagic, largeScreenOnly, type CreatureKind } from "@/lib/theme/houseMagic";
import { Badger, Broomstick, Dragon, Hippogriff, Phoenix, Raven, Serpent, Troll } from "./creatures";

/**
 * The environmental event manager. One timer chain per visit decides, now and then, what happens in the
 * background: the house's own creature passes by, a broomstick crosses the sky, rarely a dragon glides over or a
 * hippogriff-inspired silhouette stands in the distance. Rules:
 *   - at most one event at a time, never the same one twice in a row;
 *   - long, jittered gaps (and longer on phones), paused while the tab is hidden;
 *   - dragon and hippogriff only on large screens, never with reduced motion;
 *   - all motion is CSS (transform/opacity); React only mounts and unmounts the element;
 *   - the layer sits BEHIND the page content and ignores the pointer.
 */
type Kind = CreatureKind;

type ActiveEvent = { kind: Kind; house: House; key: number; entrance: boolean };

function choose(house: House, last: Kind | null, large: boolean): Kind {
  const table = (Object.entries(houseMagic[house].events) as Array<[Kind, number]>).filter(([kind]) => large || !largeScreenOnly.includes(kind));
  const pool = table.filter(([kind]) => kind !== last);
  const total = pool.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [kind, weight] of pool) {
    roll -= weight;
    if (roll <= 0) return kind;
  }
  return pool[0][0];
}

export function MagicalEnvironment() {
  const house = useSyncExternalStore(subscribeHouse, getHouse, getHouseServer);
  const reduceMotion = useReducedMotion();
  const large = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const compact = useMediaQuery("(max-width: 767px)");
  const [event, setEvent] = useState<ActiveEvent | null>(null);

  // The house that was showing on the previous run, so a switch (not the first load) can trigger an entrance.
  const previousHouse = useRef<House | null>(null);

  useEffect(() => {
    const switched = previousHouse.current !== null && previousHouse.current !== house;
    previousHouse.current = house;
    if (reduceMotion) return;
    let wait = 0;
    let play = 0;
    let counter = 0;
    let last: Kind | null = null;

    const schedule = (first: boolean, entrance = false) => {
      if (entrance) {
        // Let the theme wash finish first, then the house's own creature makes its entrance.
        wait = window.setTimeout(() => run(true), 900);
        return;
      }
      const base = first ? 6000 : compact ? 28000 : 17000;
      wait = window.setTimeout(run, base + Math.random() * (first ? 5000 : 16000));
    };

    function run(entrance = false) {
      if (document.hidden || document.documentElement.hasAttribute("data-intro")) {
        schedule(false);
        return;
      }
      // The Sorting Hat, the wand panel and the letter are "events" of their own: stay quiet behind them.
      if (document.querySelector("[data-intro-root], .sorting-root")) {
        schedule(false);
        return;
      }
      const kind = entrance ? houseMagic[house].entrance : choose(house, last, large);
      last = kind;
      counter += 1;
      setEvent({ kind, house, key: counter, entrance });
      play = window.setTimeout(() => {
        setEvent(null);
        schedule(false);
      }, creatureDuration[kind]);
    }

    schedule(true, switched);
    return () => {
      window.clearTimeout(wait);
      window.clearTimeout(play);
    };
  }, [house, reduceMotion, large, compact]);

  if (reduceMotion || !event || event.house !== house) {
    return <div aria-hidden className="env-layer" />;
  }

  return (
    <div aria-hidden className="env-layer">
      <Scene key={event.key} kind={event.kind} entrance={event.entrance} />
    </div>
  );
}

function Scene({ kind, entrance }: { kind: Kind; entrance: boolean }) {
  switch (kind) {
    case "phoenix":
      return (
        <div className="env-ev env-phoenix-wrap">
          <Phoenix />
        </div>
      );
    case "troll":
      return (
        <div className="env-ev env-troll-wrap">
          <Troll />
        </div>
      );
    case "owl":
      return (
        <div className="env-ev env-owl">
          <OwlArt />
        </div>
      );
    case "serpent":
      return (
        <div className={`env-ev env-serpent-wrap${entrance ? " env-entrance" : ""}`}>
          <i className="env-serpent-pillar" />
          <Serpent />
        </div>
      );
    case "raven":
      return (
        <div className="env-ev env-raven-wrap">
          <Raven />
        </div>
      );
    case "badger":
      return (
        <>
          <div className="env-ev env-badger-wrap">
            <Badger />
          </div>
          <svg viewBox="0 0 120 80" className="env-ev env-fern" aria-hidden>
            <g fill="#4d6b35">
              <path d="M60 80 C 40 50, 20 36, 2 34 C 24 30, 44 40, 60 62 Z" />
              <path d="M60 80 C 70 40, 84 20, 108 10 C 90 34, 82 54, 66 80 Z" />
              <path d="M60 80 C 56 44, 58 22, 66 2 C 70 28, 72 52, 66 80 Z" fill="#5f8244" />
            </g>
          </svg>
        </>
      );
    case "broom":
      return (
        <div className="env-ev env-broom-wrap">
          <Broomstick />
        </div>
      );
    case "dragon":
      return (
        <>
          <div className="env-ev env-dragon-shadow" />
          <div className="env-ev env-dragon-wrap">
            <Dragon />
          </div>
        </>
      );
    case "hippo":
      return (
        <div className="env-ev env-hippo-wrap">
          <Hippogriff />
        </div>
      );
  }
}
