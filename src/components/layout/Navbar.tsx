"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { FlyingBroomProgress } from "@/components/layout/FlyingBroomProgress";
import { navItems, site, trackedSectionIds } from "@/lib/site";
import { useLang } from "@/lib/i18n/useLang";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { openMap } from "@/lib/magicBus";
import { HouseSwitcher } from "@/components/theme/HouseSwitcher";

export function Navbar() {
  const { d } = useLang();
  const active = useActiveSection(trackedSectionIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`house-nav fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "border-b border-gold-500/15 bg-void-950/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#home"
          aria-label={d.nav.home}
          className="font-display text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.08em] text-gold-300 sm:text-sm sm:tracking-[0.2em]"
        >
          <span className="block sm:inline">{site.name.split(" ")[0]}</span>
          <span className="block whitespace-nowrap sm:ml-[0.4em] sm:inline">{site.name.split(" ").slice(1).join(" ")}</span>
        </a>

        <nav aria-label={d.nav.primary} className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  className={`relative py-2 font-display text-xs uppercase tracking-[0.22em] transition-colors hover:text-gold-300 ${
                    active === item.id ? "text-gold-300" : "text-parchment-300/80"
                  }`}
                >
                  {d.nav[item.id]}
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-px h-px bg-gold-400 shadow-[0_0_8px_rgb(var(--accent-rgb)/0.9)]"
                    />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openMap}
          aria-label={d.magic.mischief.open}
          title={d.magic.mischief.open}
          className="house-btn hidden min-h-11 min-w-11 items-center justify-center border border-gold-500/35 text-gold-300 transition duration-300 hover:border-gold-400 hover:bg-gold-400/10 sm:inline-flex xl:hidden"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 6.5 9 4.5l6 2 5.5-2v13l-5.5 2-6-2-5.5 2Z" />
            <path d="M9 4.5v13M15 6.5v13" />
          </svg>
        </button>
        <HouseSwitcher />
        <LanguageSwitch />
        <button
          type="button"
          aria-label={menuOpen ? d.nav.closeMenu : d.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative size-11 lg:hidden"
        >
          <span
            className={`absolute left-3 top-[17px] h-px w-5 bg-gold-300 transition duration-300 ${
              menuOpen ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-3 top-[27px] h-px w-5 bg-gold-300 transition duration-300 ${
              menuOpen ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
        </div>
      </div>

      <FlyingBroomProgress />

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="mobile-menu"
            aria-label={d.nav.mobileSections}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col px-6 pb-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className={`block border-t border-gold-500/10 py-4 font-display text-sm uppercase tracking-[0.25em] ${
                      active === item.id ? "text-gold-300" : "text-parchment-300"
                    }`}
                  >
                    {d.nav[item.id]}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
