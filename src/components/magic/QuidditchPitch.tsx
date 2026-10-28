"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { emitMagic, toast } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";
import type { Localized } from "@/lib/i18n/locales";

const copy = {
  region: { en: "Quidditch pitch, decorative and optional", id: "Lapangan Quidditch, dekoratif dan opsional" },
  hint: { en: "Something golden sometimes flies past. Catch it if you can.", id: "Kadang ada yang keemasan melintas. Tangkap kalau bisa." },
  catch: { en: "Catch the Golden Snitch", id: "Tangkap Golden Snitch" },
  pause: { en: "Pause the pitch", id: "Jeda lapangan" },
  resume: { en: "Resume the pitch", id: "Lanjutkan lapangan" },
  captured: (n: number): Localized => ({
    en: n === 1 ? "Golden Snitch Captured!" : `Golden Snitch Captured! ${n} this visit.`,
    id: n === 1 ? "Golden Snitch Tertangkap!" : `Golden Snitch Tertangkap! ${n} kali pada kunjungan ini.`,
  }),
  caught: (n: number): Localized => ({ en: `Snitches caught: ${n}`, id: `Snitch tertangkap: ${n}` }),
};

/** Timings, in seconds. The Snitch is rare on purpose and slow enough to click comfortably. */
const FIRST_APPEARANCE = 4;
const FLIGHT = 16;
const COOLDOWN = 24;
const BOTTOM_RESERVE = 44; // keeps the balls clear of the caption line

type Body = {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  next: number;
  speed: number;
  size: number;
  phase: number;
  angle: number;
  spin: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Slow devices get the calm version: static objects, and the Snitch still turns up and can still be caught. */
function lowPower(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData === true;
}

/**
 * A designated band of the page for the Quidditch objects. The Quaffle and two Bludgers drift on slow curved
 * paths with gentle acceleration; the Golden Snitch turns up now and then, glides across, and can be caught.
 *
 * The band holds no content, so nothing here ever sits on top of text or controls. The loop runs only while
 * the band is on screen and the tab is visible, and every frame, observer and timer is cleaned up.
 */
export function QuidditchPitch() {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const bodyEls = useRef<(HTMLElement | null)[]>([]);
  const snitchEl = useRef<HTMLButtonElement>(null);
  const paused = useRef(false);
  const caughtCount = useRef(0);
  const catchHandler = useRef<() => void>(() => {});

  const [simple, setSimple] = useState(false);
  const [snitchVisible, setSnitchVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [count, setCount] = useState(0);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    // Decided once on the client; the server markup is identical for everyone.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSimple(Boolean(reduceMotion) || lowPower());
  }, [reduceMotion]);

  useEffect(() => {
    const host = root.current;
    if (!host) return;

    let width = host.clientWidth;
    let height = host.clientHeight;
    const bounds = () => ({ w: width, h: Math.max(60, height - BOTTOM_RESERVE) });

    // --- The Quaffle (index 0) and two Bludgers (1, 2) ---
    const bodies: Body[] = [];
    const specs = [
      { speed: 26, size: 34, spin: 0.35 },
      { speed: 40, size: 30, spin: 0.9 },
      { speed: 34, size: 30, spin: -0.7 },
    ];
    specs.forEach((spec, i) => {
      const el = bodyEls.current[i];
      if (!el) return;
      const { w, h } = bounds();
      bodies.push({
        el,
        x: rand(spec.size, Math.max(spec.size + 1, w - spec.size)),
        y: rand(spec.size, Math.max(spec.size + 1, h - spec.size)),
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
        next: 0,
        speed: spec.speed,
        size: spec.size,
        phase: rand(0, 6.28),
        angle: 0,
        spin: spec.spin,
      });
    });

    const place = (b: Body) => {
      b.el.style.transform = `translate3d(${(b.x - b.size / 2).toFixed(1)}px, ${(b.y - b.size / 2).toFixed(1)}px, 0) rotate(${b.angle.toFixed(1)}deg)`;
    };
    bodies.forEach(place);

    // --- Snitch bookkeeping: a clock that only advances while the band is active ---
    let clock = 0;
    let snitchAt = FIRST_APPEARANCE;
    let snitchUntil = 0;
    let flying = false;
    let direction = 1;
    let lane = 0.5;

    const placeSnitch = (elapsed: number) => {
      const node = snitchEl.current;
      if (!node) return;
      const { w, h } = bounds();
      const progress = Math.min(1, elapsed / FLIGHT);
      const along = direction > 0 ? progress : 1 - progress;
      const x = w * (0.08 + 0.84 * along);
      const y = h * lane + Math.sin(elapsed * 0.9) * h * 0.2;
      const fade = Math.min(1, elapsed / 0.8, (FLIGHT - elapsed) / 1.1);
      node.style.transform = `translate3d(${(x - 24).toFixed(1)}px, ${(y - 24).toFixed(1)}px, 0)`;
      node.style.opacity = String(Math.max(0, fade));
    };

    const startSnitch = () => {
      flying = true;
      direction = Math.random() < 0.5 ? 1 : -1;
      lane = rand(0.35, 0.6);
      snitchUntil = clock + FLIGHT;
      setSnitchVisible(true);
    };
    const endSnitch = (cooldown: number) => {
      flying = false;
      snitchAt = clock + cooldown;
      setSnitchVisible(false);
    };

    catchHandler.current = () => {
      const node = snitchEl.current;
      if (!node || !flying) return;
      const box = node.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      caughtCount.current += 1;
      setCount(caughtCount.current);
      setSparks({ id: caughtCount.current, x: cx - host.getBoundingClientRect().left, y: cy - host.getBoundingClientRect().top });
      emitMagic({ type: "burst", x: cx, y: cy, size: "large" });
      toast(copy.captured(caughtCount.current));
      endSnitch(COOLDOWN);
    };

    const tick = (dt: number, animate: boolean) => {
      clock += dt;

      if (animate && !paused.current) {
        const { w, h } = bounds();
        for (const b of bodies) {
          if (clock > b.next) {
            b.tx = rand(b.size, Math.max(b.size + 1, w - b.size));
            b.ty = rand(b.size, Math.max(b.size + 1, h - b.size));
            b.next = clock + rand(3.5, 7);
          }
          const dx = b.tx - b.x;
          const dy = b.ty - b.y;
          const dist = Math.hypot(dx, dy) || 1;
          // Ease out towards the target, plus a sideways sway so the path is a curve rather than a line.
          const cruise = b.speed * Math.min(1, dist / 90);
          const sway = Math.sin(clock * 0.8 + b.phase) * b.speed * 0.5;
          const wantX = (dx / dist) * cruise + (-dy / dist) * sway;
          const wantY = (dy / dist) * cruise + (dx / dist) * sway;
          const ease = 1 - Math.exp(-dt * 1.4);
          b.vx += (wantX - b.vx) * ease;
          b.vy += (wantY - b.vy) * ease;
        }
        // Keep the balls from sitting on top of each other.
        for (let i = 0; i < bodies.length; i += 1) {
          for (let j = i + 1; j < bodies.length; j += 1) {
            const a = bodies[i];
            const c = bodies[j];
            const ox = a.x - c.x;
            const oy = a.y - c.y;
            const gap = Math.hypot(ox, oy) || 1;
            const min = (a.size + c.size) / 2 + 28;
            if (gap < min) {
              const push = ((min - gap) / min) * 36;
              a.vx += (ox / gap) * push * dt;
              a.vy += (oy / gap) * push * dt;
              c.vx -= (ox / gap) * push * dt;
              c.vy -= (oy / gap) * push * dt;
            }
          }
        }
        for (const b of bodies) {
          b.x = Math.min(w - b.size / 2, Math.max(b.size / 2, b.x + b.vx * dt));
          b.y = Math.min(h - b.size / 2, Math.max(b.size / 2, b.y + b.vy * dt));
          b.angle += b.spin * 40 * dt;
          place(b);
        }
      }

      if (!flying && clock >= snitchAt) startSnitch();
      if (flying) {
        const elapsed = clock - (snitchUntil - FLIGHT);
        if (elapsed >= FLIGHT) endSnitch(COOLDOWN);
        else if (animate) {
          if (!paused.current) placeSnitch(elapsed);
        } else {
          // Simplified mode: the Snitch simply hovers in one place until its time is up.
          const node = snitchEl.current;
          if (node) {
            const { w, h } = bounds();
            node.style.transform = `translate3d(${(w * 0.5 - 24).toFixed(1)}px, ${(h * 0.45 - 24).toFixed(1)}px, 0)`;
            node.style.opacity = "1";
          }
        }
      }
    };

    // --- Drive the clock: rAF with motion, a slow interval without; only while visible ---
    let raf = 0;
    let interval = 0;
    let last = 0;
    let onScreen = false;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tick(dt, true);
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
      raf = 0;
      interval = 0;
    };
    const start = () => {
      stop();
      if (!onScreen || document.hidden) return;
      if (simple) {
        interval = window.setInterval(() => tick(0.5, false), 500);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        start();
      },
      { threshold: 0.05 },
    );
    io.observe(host);
    const ro = new ResizeObserver(() => {
      width = host.clientWidth;
      height = host.clientHeight;
    });
    ro.observe(host);
    document.addEventListener("visibilitychange", start);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
      catchHandler.current = () => {};
    };
  }, [simple]);

  const togglePause = () => {
    paused.current = !paused.current;
    setIsPaused(paused.current);
  };

  return (
    <section
      ref={root}
      aria-label={t(copy.region)}
      className="quidditch-pitch relative h-52 overflow-hidden border-y border-gold-500/15 bg-void-900/40 md:h-64"
    >
      <svg aria-hidden viewBox="0 0 600 200" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-0 size-full opacity-[0.16]">
        {[120, 300, 480].map((x, i) => {
          const high = i === 1 ? 62 : 82;
          return (
            <g key={x} stroke="rgb(var(--accent-rgb))" strokeWidth="2" fill="none">
              <path d={`M${x} 200 V${high + 26}`} />
              <ellipse cx={x} cy={high} rx="22" ry="26" />
            </g>
          );
        })}
      </svg>

      {/* Quaffle and two Bludgers */}
      <span ref={(node) => { bodyEls.current[0] = node; }} aria-hidden className="quaffle absolute left-0 top-0 block size-[34px] rounded-full will-change-transform" />
      <span ref={(node) => { bodyEls.current[1] = node; }} aria-hidden className="bludger absolute left-0 top-0 block size-[30px] rounded-full will-change-transform" />
      <span ref={(node) => { bodyEls.current[2] = node; }} aria-hidden className="bludger absolute left-0 top-0 block size-[30px] rounded-full will-change-transform" />

      {snitchVisible ? (
        <button
          ref={snitchEl}
          type="button"
          onClick={() => catchHandler.current()}
          aria-label={t(copy.catch)}
          className="snitch absolute left-0 top-0 flex size-12 items-center justify-center rounded-full will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
          style={{ opacity: 0 }}
        >
          <svg viewBox="0 0 48 48" aria-hidden className="size-12 overflow-visible">
            <g className="snitch-wing snitch-wing-l">
              <path d="M19 24 C12 14 4 14 1 17 C5 22 11 25 19 25 Z" fill="rgb(255 245 205 / 0.85)" stroke="rgb(214 168 70)" strokeWidth="0.6" />
            </g>
            <g className="snitch-wing snitch-wing-r">
              <path d="M29 24 C36 14 44 14 47 17 C43 22 37 25 29 25 Z" fill="rgb(255 245 205 / 0.85)" stroke="rgb(214 168 70)" strokeWidth="0.6" />
            </g>
            <circle cx="24" cy="24" r="6.5" fill="url(#snitch-gold)" stroke="rgb(138 98 30)" strokeWidth="0.6" />
            <defs>
              <radialGradient id="snitch-gold" cx="35%" cy="30%" r="75%">
                <stop offset="0" stopColor="#fff3b8" />
                <stop offset="0.6" stopColor="#e4b84d" />
                <stop offset="1" stopColor="#a4761f" />
              </radialGradient>
            </defs>
          </svg>
        </button>
      ) : null}

      {sparks ? (
        <span key={sparks.id} aria-hidden className="pointer-events-none absolute" style={{ left: sparks.x, top: sparks.y }}>
          {Array.from({ length: 14 }, (_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const reach = 34 + (i % 3) * 14;
            return (
              <i
                key={i}
                className="snitch-spark"
                style={{ "--dx": `${(Math.cos(angle) * reach).toFixed(1)}px`, "--dy": `${(Math.sin(angle) * reach).toFixed(1)}px` } as React.CSSProperties}
              />
            );
          })}
          <i className="snitch-wings-glow" />
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-2 pt-1 md:px-8">
        <p className="min-w-0 truncate font-mono text-[0.7rem] uppercase tracking-[0.18em] text-parchment-500">
          {t(copy.hint)}
          {count > 0 ? <span className="ml-3 text-gold-400">{t(copy.caught(count))}</span> : null}
        </p>
        {simple ? null : (
          <button
            type="button"
            onClick={togglePause}
            aria-pressed={isPaused}
            className="min-h-11 shrink-0 px-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-parchment-300 underline-offset-4 transition hover:text-gold-300 hover:underline"
          >
            {isPaused ? t(copy.resume) : t(copy.pause)}
          </button>
        )}
      </div>
    </section>
  );
}
