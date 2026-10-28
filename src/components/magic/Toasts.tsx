"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TOAST_EVENT, type ToastMessage } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";

type Item = { id: number; message: ToastMessage };

/** One short, polite message at a time. Used for spell and secret feedback. */
export function Toasts() {
  const { t } = useLang();
  const [item, setItem] = useState<Item | null>(null);
  const timer = useRef(0);
  const counter = useRef(0);

  useEffect(() => {
    const onToast = (event: Event) => {
      const message = (event as CustomEvent<ToastMessage>).detail;
      counter.current += 1;
      setItem({ id: counter.current, message });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setItem(null), 3800);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[57] flex justify-center px-4 md:bottom-6"
    >
      <AnimatePresence>
        {item ? (
          <motion.p
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className="max-w-md border border-gold-500/40 bg-void-950/90 px-5 py-3 text-center font-display text-xs uppercase leading-relaxed tracking-[0.16em] text-gold-300 shadow-[0_10px_40px_rgb(0_0_0/0.5)] backdrop-blur-md"
          >
            {typeof item.message === "string" ? item.message : t(item.message)}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
