"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { onMagic } from "@/lib/magicBus";
import { readSparkColors, rgba, watchHouse } from "@/lib/theme/sparkColors";
import { getMagic, subscribeMagic } from "@/lib/magic/magicState";
import { wandInfo } from "@/lib/magic/wands";
import { getWand, getWandServer, subscribeWand } from "@/lib/wandPref";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: 0 | 1; // 0 gold, 1 silver
  gravity: number;
  drag: number;
  /** Accio: pulled toward this point. */
  tx?: number;
  ty?: number;
};

const MAX_SPARKS = 360;

function paintSprite(c: HTMLCanvasElement, inner: string, mid: string, outer: string) {
  const g = c.getContext("2d");
  if (!g) return;
  g.clearRect(0, 0, 48, 48);
  const grad = g.createRadialGradient(24, 24, 0, 24, 24, 24);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.3, mid);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 48, 48);
}

function makeSprite(inner: string, mid: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 48;
  paintSprite(c, inner, mid, outer);
  return c;
}

/**
 * One fixed canvas for every spark on the page: wand bursts, the cursor trail and the spells.
 * The animation loop only runs while there is something alive on screen.
 */
export function MagicLayer() {
  const reduceMotion = useReducedMotion();
  const wandOn = useSyncExternalStore(subscribeWand, getWand, getWandServer);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wandRef = useRef(wandOn);

  useEffect(() => {
    wandRef.current = wandOn;
  }, [wandOn]);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Sprite 0 is the house colour; sprite 1 stays a cool silver. Sprite 0 is repainted when the house changes.
    const warm = document.createElement("canvas");
    warm.width = warm.height = 48;
    const paintWarm = () => {
      // A chosen wand colours its own sparks; otherwise they follow the house.
      const chosen = getMagic().wand;
      const { core, mid } = chosen ? wandInfo[chosen] : readSparkColors();
      paintSprite(warm, rgba(core, 1), rgba(mid, 0.55), rgba(mid, 0));
    };
    paintWarm();
    const stopWatching = watchHouse(paintWarm);
    const stopWand = subscribeMagic(paintWarm);
    const sprites = [
      warm,
      makeSprite("rgba(240,248,255,1)", "rgba(170,200,255,0.5)", "rgba(170,200,255,0)"),
    ];

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    const sparks: Spark[] = [];
    let patronus: { t: number } | null = null;
    let rainUntil = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const push = (s: Spark) => {
      if (sparks.length >= MAX_SPARKS) sparks.shift();
      sparks.push(s);
    };

    const burst = (x: number, y: number, large: boolean) => {
      const n = coarse ? (large ? 14 : 8) : large ? 24 : 12;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = (large ? 90 : 55) + Math.random() * (large ? 160 : 90);
        push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 20,
          life: 0,
          max: 0.45 + Math.random() * 0.5,
          size: 3 + Math.random() * 5,
          hue: 0,
          gravity: 140,
          drag: 2.4,
        });
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Emitters
      if (patronus) {
        patronus.t += dt;
        const p = patronus.t / 3.2;
        if (p >= 1) patronus = null;
        else {
          const hx = -40 + (width + 80) * p;
          const hy = height * (0.62 - 0.3 * Math.sin(p * Math.PI)) + Math.sin(p * 14) * 14;
          for (let i = 0; i < 4; i++) {
            push({
              x: hx + (Math.random() - 0.5) * 18,
              y: hy + (Math.random() - 0.5) * 18,
              vx: -30 - Math.random() * 40,
              vy: (Math.random() - 0.5) * 40,
              life: 0,
              max: 0.8 + Math.random() * 0.7,
              size: 5 + Math.random() * 9,
              hue: 1,
              gravity: -10,
              drag: 1.2,
            });
          }
        }
      }
      if (now < rainUntil) {
        for (let i = 0; i < 2; i++) {
          push({
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 30,
            vy: 120 + Math.random() * 120,
            life: 0,
            max: 1.4 + Math.random() * 0.8,
            size: 3 + Math.random() * 4,
            hue: 0,
            gravity: 60,
            drag: 0.2,
          });
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max) {
          sparks.splice(i, 1);
          continue;
        }
        if (s.tx !== undefined && s.ty !== undefined) {
          const dx = s.tx - s.x;
          const dy = s.ty - s.y;
          const d = Math.hypot(dx, dy);
          if (d < 14) {
            sparks.splice(i, 1);
            continue;
          }
          s.vx += (dx / d) * 1400 * dt;
          s.vy += (dy / d) * 1400 * dt;
        }
        s.vy += s.gravity * dt;
        const damp = Math.max(0, 1 - s.drag * dt);
        s.vx *= damp;
        s.vy *= damp;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const k = 1 - s.life / s.max;
        const size = s.size * (0.4 + 0.6 * k) * 2.6;
        ctx.globalAlpha = Math.min(1, k * 1.4);
        ctx.drawImage(sprites[s.hue], s.x - size / 2, s.y - size / 2, size, size);
      }
      if (patronus) {
        const p = patronus.t / 3.2;
        const hx = -40 + (width + 80) * p;
        const hy = height * (0.62 - 0.3 * Math.sin(p * Math.PI)) + Math.sin(p * 14) * 14;
        ctx.globalAlpha = 0.95;
        ctx.drawImage(sprites[1], hx - 60, hy - 60, 120, 120);
      }
      ctx.globalAlpha = 1;

      if (sparks.length > 0 || patronus || now < rainUntil) raf = requestAnimationFrame(loop);
      else {
        raf = 0;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const introActive = () => document.querySelector("[data-intro-root]") !== null;

    // Mouse: a burst on press. Touch: only on a real tap, so scrolling with a finger stays quiet.
    const taps = new Map<number, { x: number; y: number }>();
    const allowed = (event: PointerEvent) => {
      if (!wandRef.current || introActive() || event.button > 0) return false;
      const target = event.target as HTMLElement | null;
      return !target?.closest("input, textarea, select, dialog, [data-no-magic]");
    };
    const onDown = (event: PointerEvent) => {
      if (!allowed(event)) return;
      if (event.pointerType === "mouse") {
        burst(event.clientX, event.clientY, false);
        wake();
      } else {
        taps.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
    };
    const onUp = (event: PointerEvent) => {
      const start = taps.get(event.pointerId);
      taps.delete(event.pointerId);
      if (!start || !allowed(event)) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) return;
      burst(event.clientX, event.clientY, false);
      wake();
    };
    const onCancel = (event: PointerEvent) => {
      taps.delete(event.pointerId);
    };

    let lastX = -999;
    let lastY = -999;
    let lastT = 0;
    const onMove = (event: PointerEvent) => {
      if (!wandRef.current || event.pointerType !== "mouse" || introActive()) return;
      const now = performance.now();
      if (now - lastT < 32) return;
      if (Math.hypot(event.clientX - lastX, event.clientY - lastY) < 26) return;
      lastX = event.clientX;
      lastY = event.clientY;
      lastT = now;
      const trail = getMagic().wand ? wandInfo[getMagic().wand!].trail : "spark";
      const base = { x: event.clientX, y: event.clientY, life: 0, hue: 0 as const };
      if (trail === "ember") {
        // Warm embers that rise
        push({ ...base, vx: (Math.random() - 0.5) * 20, vy: -20 - Math.random() * 25, max: 0.7 + Math.random() * 0.3, size: 2 + Math.random() * 3, gravity: -30, drag: 1.2 });
      } else if (trail === "rune") {
        // Few, slow, larger motes that linger
        push({ ...base, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, max: 0.95 + Math.random() * 0.3, size: 3 + Math.random() * 2.5, gravity: 0, drag: 2.2 });
      } else if (trail === "star") {
        // Starlight: silver-blue twinkles drifting down
        push({ ...base, hue: 1, vx: (Math.random() - 0.5) * 30, vy: 8 + Math.random() * 14, max: 0.6 + Math.random() * 0.35, size: 1.6 + Math.random() * 2.4, gravity: 18, drag: 1.1 });
      } else {
        push({ ...base, vx: (Math.random() - 0.5) * 24, vy: 10 + Math.random() * 20, max: 0.5 + Math.random() * 0.25, size: 2 + Math.random() * 2.5, gravity: 40, drag: 1.5 });
      }
      wake();
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onCancel, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    const off = onMagic((effect) => {
      if (effect.type === "burst") burst(effect.x, effect.y, effect.size === "large");
      else if (effect.type === "patronus") patronus = { t: 0 };
      else if (effect.type === "rain") rainUntil = performance.now() + 1600;
      else if (effect.type === "accio") {
        const n = coarse ? 30 : 60;
        for (let i = 0; i < n; i++) {
          const edge = Math.random();
          const x = edge < 0.5 ? Math.random() * width : Math.random() < 0.5 ? -10 : width + 10;
          const y = edge < 0.5 ? (Math.random() < 0.5 ? -10 : height + 10) : Math.random() * height;
          push({
            x, y, vx: 0, vy: 0,
            life: 0,
            max: 2.2,
            size: 3 + Math.random() * 4,
            hue: 0,
            gravity: 0,
            drag: 0.8,
            tx: effect.x,
            ty: effect.y,
          });
        }
      }
      wake();
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      stopWatching();
      stopWand();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("pointermove", onMove);
      off();
    };
  }, [reduceMotion]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[55]" />
    </>
  );
}
