"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { readSparkColors, rgba, watchHouse } from "@/lib/theme/sparkColors";

type Mote = {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
};

type MagicParticlesProps = {
  count?: number;
  className?: string;
};

/** Golden motes drifting upward, drawn on a canvas so dozens of them stay cheap. */
export function MagicParticles({ count = 70, className }: MagicParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Pre-rendered soft glow, stamped for every mote.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d");
    if (!sctx) return;
    const paintSprite = () => {
      const { core, mid } = readSparkColors();
      sctx.clearRect(0, 0, 64, 64);
      const glow = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      glow.addColorStop(0, rgba(core, 1));
      glow.addColorStop(0.25, rgba(mid, 0.55));
      glow.addColorStop(1, rgba(mid, 0));
      sctx.fillStyle = glow;
      sctx.fillRect(0, 0, 64, 64);
    };
    paintSprite();
    // The sprite is re-painted when the visitor switches house, so the motes change colour too.
    const stopWatching = watchHouse(paintSprite);

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let last = 0;

    const spawn = (anywhere: boolean): Mote => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 12,
      r: 0.6 + Math.random() * 1.8,
      speed: 8 + Math.random() * 22,
      sway: 10 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.6,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        m.y -= m.speed * dt;
        m.phase += dt * 0.8;
        if (m.y < -20) Object.assign(m, spawn(false));
        const twinkle = 0.6 + 0.4 * Math.sin(m.phase * 2.3);
        const size = m.r * 9;
        ctx.globalAlpha = m.alpha * twinkle;
        ctx.drawImage(sprite, m.x + Math.sin(m.phase) * m.sway - size / 2, m.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    resizeObserver.observe(canvas);

    if (reduceMotion) {
      draw(0);
      // Still frame: repaint once more when the house changes so the colour follows.
      const stopStill = watchHouse(() => draw(0));
      return () => {
        stopStill();
        stopWatching();
        resizeObserver.disconnect();
      };
    }

    // Only animate while the hero is actually on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    visibility.observe(canvas);

    return () => {
      stop();
      stopWatching();
      visibility.disconnect();
      resizeObserver.disconnect();
    };
  }, [count, reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className={`size-full ${className ?? ""}`} />;
}
