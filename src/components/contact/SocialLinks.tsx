"use client";

import { useRef, type ReactNode } from "react";
import { contact, type ContactChannels } from "@/lib/site";
import { emitMagic } from "@/lib/magicBus";
import { useLang } from "@/lib/i18n/useLang";

type ChannelId = keyof ContactChannels;

const icons: Record<ChannelId, ReactNode> = {
  email: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.2a2.8 2.8 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.600 11.600 0 0 0-6 0C6.500 3.400 5.500 3.700 5.500 3.700a4.300 4.300 0 0 0-.1 3.200A4.600 4.600 0 0 0 4 10.100c0 4.700 2.800 5.700 5.500 6a2.800 2.800 0 0 0-.8 2.200V21" />
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M8 10.500V16M8 7.700v.1M12 16v-5.500m0 2.300c0-1.500 1-2.400 2.300-2.400s2.200.9 2.200 2.600V16" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M17 7v.01" />
    </>
  ),
};

type Link = { id: ChannelId; label: string; href: string };

/**
 * The professional connection area. A channel only renders when `contact` in src/lib/site.ts has a value for it,
 * so there is never an icon that leads nowhere. Activating a link releases a few sparks from the icon.
 */
export function SocialLinks({ className = "" }: { className?: string }) {
  const { d } = useLang();
  const labels = d.contact.channels;
  const refs = useRef(new Map<ChannelId, HTMLAnchorElement>());

  const links: Link[] = (
    [
      contact.email ? { id: "email", label: labels.email, href: `mailto:${contact.email}` } : null,
      contact.github ? { id: "github", label: labels.github, href: contact.github } : null,
      contact.linkedin ? { id: "linkedin", label: labels.linkedin, href: contact.linkedin } : null,
      contact.instagram ? { id: "instagram", label: labels.instagram, href: contact.instagram } : null,
    ] satisfies Array<Link | null>
  ).filter((link): link is Link => link !== null);

  if (links.length === 0) return null;

  const spark = (id: ChannelId) => {
    const box = refs.current.get(id)?.getBoundingClientRect();
    if (box) emitMagic({ type: "burst", x: box.left + box.width / 2, y: box.top + box.height / 2 });
  };

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {links.map((link, index) => (
        <li key={link.id} className="social-float" style={{ animationDelay: `${index * 0.6}s` }}>
          <a
            ref={(node) => {
              if (node) refs.current.set(link.id, node);
              else refs.current.delete(link.id);
            }}
            href={link.href}
            onClick={() => spark(link.id)}
            {...(link.id === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="social-link inline-flex min-h-11 items-center gap-2.5 border border-gold-500/40 px-4 font-display text-xs uppercase tracking-[0.2em] text-gold-300 transition duration-300 hover:border-gold-400 hover:bg-gold-400/10 hover:shadow-[0_0_22px_rgb(var(--accent-rgb)/0.35)]"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              {icons[link.id]}
            </svg>
            {link.label}
            {link.id !== "email" ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
