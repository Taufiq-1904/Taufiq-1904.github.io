"use client";

import { useEffect } from "react";
import { discover } from "@/lib/secrets";
import { castSpell, pointer, typedSpells } from "@/lib/spells";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

/**
 * Listens for hidden spells typed anywhere on the page, tracks the pointer for Lumos and Accio,
 * and leaves a hint in the console for the curious. Renders only the Lumos light.
 */
export function SpellListener() {
  useEffect(() => {
    let buffer = "";
    let konamiIndex = 0;
    let bufferTimer = 0;

    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;

      // Konami code
      const expected = KONAMI[konamiIndex];
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === expected) {
        konamiIndex += 1;
        if (konamiIndex === KONAMI.length) {
          konamiIndex = 0;
          castSpell("patronus");
          discover("patronus");
        }
      } else {
        konamiIndex = key === KONAMI[0] ? 1 : 0;
      }

      // Words
      if (/^[a-z]$/i.test(event.key)) {
        buffer = (buffer + event.key.toLowerCase()).slice(-20);
        window.clearTimeout(bufferTimer);
        bufferTimer = window.setTimeout(() => {
          buffer = "";
        }, 2500);
        const hit = typedSpells.find((spell) => buffer.endsWith(spell));
        if (hit) {
          buffer = "";
          castSpell(hit);
        }
      }
    };

    let raf = 0;
    const light = document.getElementById("lumos-light");
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.known = true;
      if (raf || !light || document.documentElement.getAttribute("data-lumos") !== "on") return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        light.style.setProperty("--lx", `${pointer.x}px`);
        light.style.setProperty("--ly", `${pointer.y}px`);
      });
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });

    // A wink for anyone who opens the console.
    console.info(
      "%cTaufiq Candra Kurniawan%c  There are hidden things here. Try typing a spell, or listen to the footer.",
      "color:#e6bd5f;font-weight:bold",
      "color:inherit",
    );

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bufferTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return <div id="lumos-light" aria-hidden className="lumos-light" />;
}
