"use client";

import { createContext, useContext, useId, type ReactNode } from "react";
import type { ProjectDiagram as DiagramId } from "@/lib/content/projects";
import type { Lang } from "@/lib/i18n/locales";
import { useLang } from "@/lib/i18n/useLang";

/**
 * Conceptual diagrams, drawn in SVG, that stand in until real screenshots exist.
 * They show how each project is put together using only facts from the project data, and they are
 * always labelled "conceptual illustration" next to them. They are not pictures of the real interface.
 * Colours come from the house tokens, so they follow the selected theme.
 */
const W = 400;
const H = 240;
const stroke = "var(--color-gold-500)";

type Pair = { en: string; id: string };

function Box({ x, y, w = 100, h = 44, label, sub, accent }: { x: number; y: number; w?: number; h?: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="var(--color-void-700)" stroke={accent ? "var(--color-gold-300)" : stroke} strokeWidth={accent ? 1.6 : 1.1} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 6)} textAnchor="middle" fontSize={sub ? 16 : 17} fill="var(--color-parchment-100)" fontFamily="var(--font-display)">
        {label}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize={12} fill="var(--color-parchment-300)" fontFamily="var(--font-mono)">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

// Each diagram gets its own arrow-head id, so several diagrams on one page never share an id.
const ArrowId = createContext("arrow");

function Link({ d, dashed }: { d: string; dashed?: boolean }) {
  const arrow = useContext(ArrowId);
  return <path d={d} fill="none" stroke={stroke} strokeWidth={1.4} strokeDasharray={dashed ? "4 4" : undefined} markerEnd={`url(#${arrow})`} />;
}

function Node({ cx, cy, r = 13, label }: { cx: number; cy: number; r?: number; label?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-void-700)" stroke={stroke} strokeWidth={1.1} />
      {label ? (
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill="var(--color-parchment-300)" fontFamily="var(--font-mono)">
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Frame({ children, title }: { children: ReactNode; title: string }) {
  const arrow = `arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <ArrowId.Provider value={arrow}>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="size-full">
      <title>{title}</title>
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1.5 8.5 5 1 8.5Z" fill={stroke} />
        </marker>
      </defs>
      {children}
    </svg>
    </ArrowId.Provider>
  );
}

function pick(lang: Lang, pair: Pair) {
  return pair[lang];
}

function ScopeApp({ title, lang }: { title: string; lang: Lang }) {
  return (
    <Frame title={title}>
      <rect x={136} y={14} width={256} height={212} rx={4} fill="none" stroke={stroke} strokeDasharray="5 5" opacity={0.6} />
      <text x={146} y={32} fontSize={12} fill="var(--color-gold-400)" fontFamily="var(--font-mono)">Docker</text>
      <Box x={12} y={98} w={96} label="Flutter" sub={pick(lang, { en: "mobile app", id: "app mobile" })} accent />
      <Box x={152} y={98} w={96} label="Node.js" sub="REST API" />
      <Box x={284} y={44} w={96} label="Prometheus" sub={pick(lang, { en: "metrics", id: "metrik" })} />
      <Box x={284} y={158} w={96} label="Grafana" sub={pick(lang, { en: "dashboards", id: "dasbor" })} />
      <Link d="M108 120 H152" />
      <Link d="M248 112 C268 112 268 70 284 70" />
      <Link d="M332 88 V158" />
      <text x={12} y={206} fontSize={12} fill="var(--color-parchment-300)" fontFamily="var(--font-mono)">
        {pick(lang, { en: "hospital network", id: "jaringan RS" })}
      </text>
      <Link d="M60 196 V146" dashed />
    </Frame>
  );
}

function Sdn({ title, lang }: { title: string; lang: Lang }) {
  return (
    <Frame title={title}>
      {/* Emulated topology */}
      <Link d="M44 52 L74 74" dashed />
      <Link d="M44 120 L74 98" dashed />
      <Link d="M158 52 L128 74" dashed />
      <Link d="M158 120 L128 98" dashed />
      <Node cx={32} cy={44} label="h1" />
      <Node cx={32} cy={128} label="h2" />
      <Node cx={170} cy={44} label="h3" />
      <Node cx={170} cy={128} label="h4" />
      <rect x={76} y={68} width={50} height={36} rx={3} fill="var(--color-void-700)" stroke="var(--color-gold-300)" strokeWidth={1.4} />
      <text x={101} y={91} textAnchor="middle" fontSize={14} fill="var(--color-parchment-100)" fontFamily="var(--font-mono)">SW</text>
      <Box x={256} y={64} w={104} label="Ryu" sub={pick(lang, { en: "controller", id: "kontroler" })} />
      <Link d="M126 86 H256" dashed />
      <text x={12} y={168} fontSize={12} fill="var(--color-parchment-300)" fontFamily="var(--font-mono)">Mininet</text>
      {/* Detection pipeline */}
      <Box x={8} y={184} w={104} h={44} label={pick(lang, { en: "19 features", id: "19 fitur" })} />
      <Box x={148} y={184} w={116} label="Random Forest" accent />
      <Box x={298} y={184} w={96} label="Streamlit" />
      <Link d="M112 206 H148" />
      <Link d="M264 206 H298" />
      <Link d="M60 150 V184" />
    </Frame>
  );
}

function UpCycleHub({ title, lang }: { title: string; lang: Lang }) {
  return (
    <Frame title={title}>
      <Box x={12} y={22} w={96} label={pick(lang, { en: "Seller", id: "Penjual" })} />
      <Box x={12} y={174} w={96} label={pick(lang, { en: "Buyer", id: "Pembeli" })} />
      <Box x={148} y={98} w={112} label="Flutter" sub="GetX" accent />
      <Box x={296} y={44} w={96} label="Firebase" />
      <Box x={296} y={152} w={96} label="Cloudinary" sub={pick(lang, { en: "images", id: "gambar" })} />
      <Link d="M60 66 C60 96 110 120 148 120" />
      <Link d="M60 174 C60 148 110 130 148 134" />
      <Link d="M260 110 C280 110 280 66 296 66" />
      <Link d="M260 134 C280 134 280 174 296 174" />
    </Frame>
  );
}

function Console({ title, lang }: { title: string; lang: Lang }) {
  return (
    <Frame title={title}>
      <Box x={140} y={20} w={120} label={pick(lang, { en: "Console", id: "Konsol" })} accent />
      {[0, 1, 2].map((i) => {
        const x = 12 + i * 132;
        return (
          <g key={i}>
            <Link d={`M200 64 C200 110 ${x + 52} 110 ${x + 52} 148`} />
            <Box x={x} y={150} w={104} h={56} label={`${pick(lang, { en: "Server", id: "Server" })} ${i + 1}`} />
            <circle cx={x + 16} cy={196} r={4} fill="var(--color-gold-300)" />
            <rect x={x + 28} y={193} width={58} height={6} rx={3} fill="var(--color-gold-700)" opacity={0.7} />
          </g>
        );
      })}
    </Frame>
  );
}

function Kripto({ title, lang }: { title: string; lang: Lang }) {
  const parts = [
    pick(lang, { en: "Classical cipher", id: "Sandi klasik" }),
    pick(lang, { en: "Biometric login", id: "Login biometrik" }),
    pick(lang, { en: "Steganography", id: "Steganografi" }),
  ];
  return (
    <Frame title={title}>
      <Box x={140} y={20} w={120} label="Python" sub={pick(lang, { en: "application", id: "aplikasi" })} accent />
      {parts.map((label, i) => {
        const x = 12 + i * 132;
        return (
          <g key={label}>
            <Link d={`M200 64 C200 100 ${x + 52} 100 ${x + 52} 128`} />
            <Box x={x} y={130} w={104} label={label} />
          </g>
        );
      })}
      <Box x={140} y={196} w={120} label="MySQL" sub={pick(lang, { en: "storage", id: "penyimpanan" })} />
      <Link d="M64 174 C64 190 150 196 150 212" dashed />
      <Link d="M336 174 C336 190 250 196 250 212" dashed />
    </Frame>
  );
}

export function ProjectDiagram({ diagram, name }: { diagram: DiagramId; name: string }) {
  const { lang, d } = useLang();
  const title = d.preview.diagramAlt(name);
  switch (diagram) {
    case "scopeapp":
      return <ScopeApp title={title} lang={lang} />;
    case "sdn":
      return <Sdn title={title} lang={lang} />;
    case "upcyclehub":
      return <UpCycleHub title={title} lang={lang} />;
    case "console":
      return <Console title={title} lang={lang} />;
    case "kripto":
      return <Kripto title={title} lang={lang} />;
  }
}
