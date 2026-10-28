"use client";

import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cauldron, IngredientRow } from "@/components/skills/PotionDecorations";
import { OPEN_BOOK_EVENT, openProject } from "@/lib/magicBus";
import { about } from "@/lib/content/about";
import { projects, type Project } from "@/lib/content/projects";
import { skillChapters, type Skill } from "@/lib/content/skills";
import { timeline } from "@/lib/content/timeline";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n/useLang";
import type { Localized } from "@/lib/i18n/locales";

type PageId = "profile" | "development" | "security" | "infrastructure" | "projects";

type PageDef = {
  id: PageId;
  title: Localized;
  /** Skill chapters from src/lib/content/skills.ts shown on this page. */
  chapters?: readonly string[];
  /** A handwritten line in the margin. These describe the page itself and make no claims about skill level. */
  margin: Localized;
};

const pages: readonly PageDef[] = [
  {
    id: "profile",
    title: { en: "Developer Profile", id: "Profil Pengembang" },
    margin: { en: "Read the margins. The useful notes are in pencil.", id: "Baca bagian tepinya. Catatan yang berguna ada di tulisan pensil." },
  },
  {
    id: "development",
    title: { en: "Programming and Development", id: "Pemrograman dan Pengembangan" },
    chapters: ["mobile", "web", "backend"],
    margin: { en: "Every entry names the work it was used in.", id: "Setiap entri menyebut pekerjaan tempat ia dipakai." },
  },
  {
    id: "security",
    title: { en: "Cybersecurity and Networking", id: "Keamanan Siber dan Jaringan" },
    chapters: ["networking"],
    margin: { en: "Aiming at Security Engineer, starting from the network up.", id: "Menuju Security Engineer, dimulai dari jaringan." },
  },
  {
    id: "infrastructure",
    title: { en: "Infrastructure and DevOps", id: "Infrastruktur dan DevOps" },
    chapters: ["infrastructure"],
    margin: { en: "Containers, metrics and dashboards: the parts that keep things alive.", id: "Kontainer, metrik, dan dasbor: bagian yang menjaga semuanya tetap hidup." },
  },
  {
    id: "projects",
    title: { en: "Projects and Practical Experience", id: "Proyek dan Pengalaman Praktik" },
    margin: { en: "What I built, and what I actually did. No invented results.", id: "Apa yang saya bangun, dan apa yang benar-benar saya kerjakan. Tanpa hasil karangan." },
  },
];

const copy = {
  open: { en: "Open the Half-Blood Prince's book", id: "Buka buku Pangeran Berdarah Campuran" },
  openHint: { en: "Skills and projects as an annotated textbook.", id: "Keahlian dan proyek sebagai buku teks beranotasi." },
  bookTitle: { en: "The Half-Blood Prince's Book", id: "Buku Pangeran Berdarah Campuran" },
  bookSub: { en: "Skills and technologies, annotated", id: "Keahlian dan teknologi, dengan anotasi" },
  contents: { en: "Contents", id: "Daftar isi" },
  close: { en: "Close the book and return to the portfolio", id: "Tutup buku dan kembali ke portofolio" },
  closeShort: { en: "Close the book", id: "Tutup buku" },
  previous: { en: "Previous page", id: "Halaman sebelumnya" },
  next: { en: "Next page", id: "Halaman berikutnya" },
  pageOf: (n: number, total: number): Localized => ({ en: `Page ${n} of ${total}`, id: `Halaman ${n} dari ${total}` }),
  academic: { en: "Academic status", id: "Status akademik" },
  careers: { en: "Career interests", id: "Minat karier" },
  coursework: { en: "Coursework", id: "Mata kuliah" },
  usedIn: { en: "Used in", id: "Dipakai di" },
  notUsed: { en: "No project of mine is built around it yet.", id: "Belum ada proyek saya yang berpusat padanya." },
  role: { en: "What I did", id: "Peran saya" },
  stack: { en: "Technologies", id: "Teknologi" },
  experience: { en: "Practical experience", id: "Pengalaman praktik" },
  details: { en: "Open full project details", id: "Buka detail proyek lengkap" },
  study: { en: "Informatics student", id: "Mahasiswa Informatika" },
  swipeHint: { en: "Swipe or use the arrow keys to turn the page.", id: "Geser atau pakai tombol panah untuk membalik halaman." },
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** One skill entry: the name and a pencilled note on hover, with the details behind a disclosure button. */
function SkillEntry({ skill }: { skill: Skill }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const text = (value: string | Localized) => (typeof value === "string" ? value : t(value));
  const name = text(skill.name);

  return (
    <li className="hbp-entry border-b border-ink-700/15 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left text-ink-900 transition hover:text-ink-gold"
      >
        <span className="font-display text-[0.95rem] tracking-wide">{name}</span>
        <Chevron open={open} />
      </button>
      {!open ? <p className="hbp-note -mt-1 pb-2 font-hand text-xl leading-tight text-ink-700">{t(skill.note)}</p> : null}
      <div id={panelId} hidden={!open} className="pb-3">
        <p className="text-lg leading-snug text-ink-900">{t(skill.note)}</p>
        <p className="mt-1.5 font-mono text-xs leading-relaxed text-ink-gold">
          {skill.usedIn.length > 0 ? `${t(copy.usedIn)}: ${skill.usedIn.map(text).join(", ")}` : t(copy.notUsed)}
        </p>
      </div>
    </li>
  );
}

function ProjectEntry({ project, onOpenDetails }: { project: Project; onOpenDetails: (slug: string) => void }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const bullets = t(project.contribution);

  return (
    <li className="hbp-entry border-b border-ink-700/15 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left text-ink-900 transition hover:text-ink-gold"
      >
        <span>
          <span className="block font-display text-[0.95rem] tracking-wide">{project.name}</span>
          <span className="block text-base italic text-ink-700">{t(project.kind)}</span>
        </span>
        <Chevron open={open} />
      </button>
      <div id={panelId} hidden={!open} className="pb-3">
        <p className="text-lg leading-snug text-ink-900">{t(project.summary)}</p>
        {project.stack.length > 0 ? (
          <p className="mt-2 font-mono text-xs leading-relaxed text-ink-gold">
            {t(copy.stack)}: {project.stack.map((item) => item.name).join(", ")}
          </p>
        ) : null}
        {bullets.length > 0 ? (
          <div className="mt-2">
            <p className="font-hand text-xl text-ink-700">{t(copy.role)}</p>
            <ul className="mt-0.5 space-y-1.5">
              {bullets.map((line) => (
                <li key={line} className="flex gap-2 text-lg leading-snug text-ink-900">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-ink-gold" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <button
            type="button"
            onClick={() => onOpenDetails(project.slug)}
            className="min-h-11 font-mono text-xs uppercase tracking-[0.16em] text-ink-gold underline underline-offset-4 hover:text-ink-900"
          >
            {t(copy.details)}
          </button>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.16em] text-ink-gold underline underline-offset-4 hover:text-ink-900"
            >
              {t(link.label)}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </li>
  );
}

function PageBody({ page, onOpenDetails }: { page: PageDef; onOpenDetails: (slug: string) => void }) {
  const { t } = useLang();
  const heading = "font-display text-xs uppercase tracking-[0.24em] text-ink-gold";

  if (page.id === "profile") {
    return (
      <div className="space-y-6">
        <p className="text-xl leading-relaxed text-ink-900">{t({ en: about.prologue.en[0], id: about.prologue.id[0] })}</p>
        <section>
          <h4 className={heading}>{t(copy.academic)}</h4>
          <p className="mt-2 text-lg leading-snug text-ink-900">
            {t(copy.study)}, {site.school}
          </p>
          <p className="mt-3 font-hand text-xl text-ink-700">{t(copy.coursework)}</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-lg text-ink-900">
            {about.coursework.map((item) => (
              <li key={item.en} className="after:ml-4 after:text-ink-gold/60 after:content-['/'] last:after:content-none">
                {t(item)}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className={heading}>{t(copy.careers)}</h4>
          <p className="mt-2 text-lg leading-snug text-ink-900">{t(about.direction)}</p>
          <ul className="mt-3 space-y-2">
            {about.interests.map((item) => (
              <li key={item.name.en} className="hbp-entry text-lg leading-snug text-ink-900">
                <span className="font-display text-[0.9rem] tracking-wide">{t(item.name)}</span>
                <span className="text-ink-700">: {t(item.line)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  if (page.id === "projects") {
    const practical = timeline.filter((entry) => entry.kind === "Work" || entry.kind === "Practicum");
    return (
      <div className="space-y-6">
        <ul>
          {projects.map((project) => (
            <ProjectEntry key={project.slug} project={project} onOpenDetails={onOpenDetails} />
          ))}
        </ul>
        <section>
          <h4 className={heading}>{t(copy.experience)}</h4>
          <ul className="mt-2 space-y-2.5">
            {practical.map((entry) => (
              <li key={entry.id} className="text-lg leading-snug text-ink-900">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-gold">{t(entry.when)}</span>
                <span className="block font-display text-[0.9rem] tracking-wide">{t(entry.title)}</span>
                <span className="block italic text-ink-700">{t(entry.place)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const chapters = skillChapters.filter((chapter) => page.chapters?.includes(chapter.id));
  return (
    <div className="space-y-6">
      {chapters.map((chapter) => (
        <section key={chapter.id}>
          <h4 className={heading}>{t(chapter.title)}</h4>
          <p className="mt-1 text-base italic text-ink-700">{t(chapter.blurb)}</p>
          <ul className="mt-1">
            {chapter.skills.map((skill) => (
              <SkillEntry key={typeof skill.name === "string" ? skill.name : skill.name.en} skill={skill} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** The button that opens the book. It lives in the Skills section; the book itself is mounted once below it. */
export function BookTrigger({ onOpen }: { onOpen: () => void }) {
  const { t } = useLang();
  return (
    <div className="mb-8 flex flex-wrap items-center gap-5 border border-gold-500/25 bg-void-800/60 p-4 md:p-5">
      <Cauldron className="size-14 shrink-0 text-gold-500" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-gold-300">{t(copy.bookTitle)}</p>
        <p className="mt-1 text-lg leading-snug text-parchment-300">{t(copy.openHint)}</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="min-h-11 border border-gold-500/50 px-5 font-display text-xs uppercase tracking-[0.2em] text-gold-300 transition hover:border-gold-400 hover:bg-gold-400/10"
      >
        {t(copy.open)}
      </button>
    </div>
  );
}

/**
 * The Half-Blood Prince's book: an annotated textbook whose "recipes" are my real skills and projects.
 * All content is read from src/lib/content, so nothing here is invented. Built on the native <dialog>, which gives
 * the focus trap, Escape and an inert page behind it. Pages turn with the buttons, the arrow keys, Home/End, the
 * table of contents, or a swipe on touch screens.
 */
export function HalfBloodPrinceBook() {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [visited, setVisited] = useState<ReadonlySet<number>>(new Set([0]));
  const [sheen, setSheen] = useState(0);
  const titleId = useId();

  const page = pages[index];

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_BOOK_EVENT, show);
    return () => window.removeEventListener(OPEN_BOOK_EVENT, show);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
  }, [open]);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || closing.current) return;
    if (reduceMotion) {
      dialog.close();
      return;
    }
    closing.current = true;
    dialog.setAttribute("data-closing", "");
    window.setTimeout(() => {
      dialog.removeAttribute("data-closing");
      closing.current = false;
      dialog.close();
    }, 230);
  }, [reduceMotion]);

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= pages.length || target === index) return;
      setDirection(target > index ? 1 : -1);
      setIndex(target);
      scrollRef.current?.scrollTo({ top: 0 });
      if (!visited.has(target)) {
        setVisited((prev) => new Set(prev).add(target));
        setSheen((n) => n + 1);
      }
    },
    [index, visited],
  );

  function openDetails(slug: string) {
    requestClose();
    window.setTimeout(() => openProject(slug), reduceMotion ? 0 : 260);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") goTo(index + 1);
    else if (event.key === "ArrowLeft") goTo(index - 1);
    else if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(pages.length - 1);
    else return;
    event.preventDefault();
  }

  function onPointerDown(event: ReactPointerEvent) {
    touch.current = event.pointerType === "mouse" ? null : { x: event.clientX, y: event.clientY };
  }
  function onPointerUp(event: ReactPointerEvent) {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(index + (dx < 0 ? 1 : -1));
  }

  const flip = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, rotateY: direction * 38 },
        animate: { opacity: 1, rotateY: 0 },
        exit: { opacity: 0, rotateY: direction * -20 },
      };

  const turnButton = "inline-flex min-h-11 min-w-11 items-center justify-center border border-ink-700/35 px-3 font-display text-xs uppercase tracking-[0.18em] text-ink-900 transition hover:border-ink-gold hover:text-ink-gold disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => setOpen(false)}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className="dialog-card m-auto max-h-none w-[min(100%-1rem,64rem)] overflow-visible bg-transparent p-0 text-ink-900 backdrop:bg-void-950/85 backdrop:backdrop-blur-sm"
    >
      {open ? (
        <div className="relative border-[6px] border-leather-700 bg-leather-900 p-1.5 shadow-[0_30px_90px_rgb(0_0_0/0.75)] md:p-2.5">
          <div className="grid max-h-[calc(100dvh-5.5rem)] min-h-[min(34rem,calc(100dvh-5.5rem))] grid-rows-[auto_1fr_auto] bg-parchment-page lg:grid-cols-[17rem_1fr] lg:grid-rows-1">
            {/* Left page: title, table of contents, decoration */}
            <div className="flex flex-col gap-3 border-b border-ink-700/25 p-4 lg:gap-6 lg:border-b-0 lg:border-r lg:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id={titleId} className="font-display text-base leading-snug tracking-[0.12em] text-ink-900 lg:text-lg">
                    {t(copy.bookTitle)}
                  </h2>
                  <p className="mt-1 hidden font-hand text-xl leading-tight text-ink-700 lg:block">{t(copy.bookSub)}</p>
                </div>
                <button
                  type="button"
                  onClick={requestClose}
                  aria-label={t(copy.close)}
                  className="inline-flex size-11 shrink-0 items-center justify-center border border-ink-700/35 text-ink-900 transition hover:border-ink-gold hover:text-ink-gold lg:hidden"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <nav aria-label={t(copy.contents)}>
                <p className="mb-2 hidden font-display text-xs uppercase tracking-[0.24em] text-ink-gold lg:block">{t(copy.contents)}</p>
                <ol className="flex gap-1.5 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
                  {pages.map((item, i) => {
                    const current = i === index;
                    return (
                      <li key={item.id} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          aria-current={current ? "page" : undefined}
                          aria-label={`${i + 1}. ${t(item.title)}`}
                          className={`flex min-h-11 w-full items-center gap-3 px-3 text-left transition lg:border-b lg:border-ink-700/15 lg:px-1 ${
                            current ? "bg-ink-gold/15 text-ink-900 lg:bg-transparent" : "text-ink-700 hover:text-ink-gold"
                          }`}
                        >
                          <span className={`font-display text-sm ${current ? "text-ink-gold" : ""}`}>{i + 1}</span>
                          <span className={`hidden font-display text-[0.78rem] leading-tight tracking-wide lg:block ${current ? "underline decoration-ink-gold/60 underline-offset-4" : ""}`}>
                            {t(item.title)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="mt-auto hidden items-end justify-between lg:flex">
                <Cauldron className="size-14 text-ink-gold" />
                <IngredientRow />
              </div>
              <button
                type="button"
                onClick={requestClose}
                className="hidden min-h-11 border border-ink-700/35 px-3 font-display text-xs uppercase tracking-[0.18em] text-ink-900 transition hover:border-ink-gold hover:text-ink-gold lg:block"
              >
                {t(copy.closeShort)}
              </button>
            </div>

            {/* Right page: the current page, turned with a small 3D flip */}
            <div className="flex min-h-0 flex-col" style={{ perspective: 1800 }}>
              <div ref={scrollRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp} className="relative min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain p-5 md:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={page.id}
                    {...flip}
                    transition={{ duration: reduceMotion ? 0.15 : 0.34, ease: "easeOut" }}
                    style={{ transformOrigin: "left center" }}
                    aria-labelledby={`${titleId}-page`}
                  >
                    <header className="mb-5 border-b border-ink-700/25 pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-gold">{t(copy.pageOf(index + 1, pages.length))}</p>
                        <IngredientRow className="scale-75" />
                      </div>
                      <h3 id={`${titleId}-page`} className="mt-1 font-display text-xl leading-snug tracking-wide text-ink-900 md:text-2xl">
                        {t(page.title)}
                      </h3>
                      <p className="hbp-glow mt-1 font-hand text-2xl leading-tight text-ink-gold">{t(page.margin)}</p>
                    </header>
                    <PageBody page={page} onOpenDetails={openDetails} />
                  </motion.article>
                </AnimatePresence>
                {sheen > 0 ? <span key={sheen} aria-hidden className="hbp-sheen" /> : null}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-ink-700/25 px-4 py-2.5 md:px-8">
                <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label={t(copy.previous)} className={turnButton}>
                  <span aria-hidden>&larr;</span>
                  <span className="ml-2 hidden sm:inline">{t(copy.previous)}</span>
                </button>
                <p className="hidden text-center font-hand text-lg leading-tight text-ink-700 md:block">{t(copy.swipeHint)}</p>
                <button type="button" onClick={() => goTo(index + 1)} disabled={index === pages.length - 1} aria-label={t(copy.next)} className={turnButton}>
                  <span className="mr-2 hidden sm:inline">{t(copy.next)}</span>
                  <span aria-hidden>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label={t(copy.close)}
            className="absolute right-3 top-3 hidden size-11 items-center justify-center bg-parchment-100/90 text-ink-900 transition hover:text-ink-gold lg:inline-flex"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
