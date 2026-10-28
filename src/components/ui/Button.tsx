import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  children: ReactNode;
  className?: string;
};

const base =
  "house-btn inline-flex items-center justify-center gap-2 px-7 py-3 font-display text-xs uppercase tracking-[0.22em] transition duration-300";

const variants = {
  primary:
    "bg-linear-to-b from-gold-300 to-gold-500 text-void-950 shadow-[0_0_28px_rgb(var(--accent-rgb)/0.25)] hover:shadow-[0_0_42px_rgb(var(--accent-rgb)/0.45)] hover:brightness-110",
  ghost:
    "border border-gold-500/40 text-gold-300 hover:border-gold-400 hover:bg-gold-400/10 hover:shadow-[0_0_28px_rgb(var(--accent-rgb)/0.18)]",
} as const;

export function Button({ href, variant = "primary", children, className = "" }: ButtonProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}
