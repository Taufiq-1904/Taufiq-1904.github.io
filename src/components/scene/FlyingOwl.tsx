"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { emitMagic } from "@/lib/magicBus";
import { discover } from "@/lib/secrets";

const wingBase = "[transform-box:view-box] [transform-origin:52px_36px]";

export function OwlArt() {
  return (
    <svg viewBox="0 0 120 80" className="w-full drop-shadow-[0_0_14px_rgb(211_218_252/0.35)]">
      {/* Wings flap with CSS keyframes pivoting at the shoulders */}
      <path
        className={`${wingBase} animate-wing-left`}
        d="M52 34 C36 18 14 16 2 30 C12 28 20 32 24 38 C30 34 38 36 42 42 C46 40 50 42 54 48 Z"
        fill="#ece6d6"
      />
      <path
        className={`${wingBase} animate-wing-right`}
        style={{ transformOrigin: "68px 36px" }}
        d="M68 34 C84 18 106 16 118 30 C108 28 100 32 96 38 C90 34 82 36 78 42 C74 40 70 42 66 48 Z"
        fill="#ece6d6"
      />
      <ellipse cx="60" cy="46" rx="12" ry="19" fill="#f4efe2" />
      <circle cx="60" cy="26" r="11" fill="#f4efe2" />
      <path d="M50 20 L50 9 L58 16 Z M70 20 L70 9 L62 16 Z" fill="#ece6d6" />
      <circle cx="55" cy="26" r="3" fill="#e8a82a" />
      <circle cx="65" cy="26" r="3" fill="#e8a82a" />
      <circle cx="55" cy="26" r="1.2" fill="#1a1208" />
      <circle cx="65" cy="26" r="1.2" fill="#1a1208" />
      <path d="M58.5 29 L60 34 L61.5 29 Z" fill="#c58a2a" />

      {/* The letter it carries */}
      <rect x="51" y="62" width="18" height="12" rx="1" fill="#f1e7cf" />
      <path d="M51 62 L60 69 L69 62" fill="none" stroke="#b49b6a" strokeWidth="0.8" />
      <circle cx="60" cy="69" r="2" fill="#a3342f" />
    </svg>
  );
}

export function FlyingOwl() {
  // Hidden with CSS (not by returning null) when motion is reduced, so the server and client markup match.
  const clicks = useRef<number[]>([]);

  // Three quick clicks make the owl drop its letter in a shower of gold.
  function onClick() {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 4000), now];
    if (clicks.current.length >= 3) {
      clicks.current = [];
      emitMagic({ type: "rain" });
      discover("owl");
    }
  }

  return (
    <motion.div
      aria-hidden
      onClick={onClick}
      className="absolute left-0 top-[16%] hidden w-32 cursor-pointer pointer-events-auto md:block motion-reduce:md:hidden"
      initial={{ x: "-35vw" }}
      animate={{ x: "135vw", y: [0, -26, 6, -18, 0] }}
      transition={{
        x: { duration: 34, delay: 4, ease: "linear", repeat: Infinity, repeatDelay: 14 },
        y: { duration: 7, ease: "easeInOut", repeat: Infinity },
      }}
    >
      <OwlArt />
    </motion.div>
  );
}
