# Taufiq Candra Kurniawan | Portfolio

Personal portfolio of Taufiq Candra Kurniawan. Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion, themed as a dark-fantasy castle library. Available in English and Bahasa Indonesia (EN / ID button).

## Requirements

- Node.js (a current LTS release; the project was prepared with Node 22) and npm 10 or newer.
- No API keys or database. Fonts are self-hosted through Fontsource, so builds do not need access to Google Fonts.

## Install and run

```bash
npm install          # or `npm ci` for an exact install from package-lock.json
npm run dev          # http://localhost:3000
```

## Checks and production build

```bash
npm run lint         # ESLint (eslint-config-next, core-web-vitals + TypeScript rules)
npm run typecheck    # `next typegen` then `tsc --noEmit` (route types must be generated first)
npm run build        # production build
npm run start        # serve the production build locally
npm run check        # lint, typecheck and build in one go
```

Run `npm run check` before every deploy.

## Languages (EN / ID)

- The EN / ID button sits in the navigation bar (and on the intro screen). The choice is saved in `localStorage`; on a first visit the browser language is used (Indonesian browsers get Bahasa Indonesia, everything else English). `<html lang>` follows the choice.
- Fixed interface copy (buttons, labels, dialog text, toasts, the Marauder's Map) is in `src/lib/i18n/dictionary.ts`. The `id` object must have the same shape as `en`, so TypeScript reports any missing translation.
- Longer content (`src/lib/content/*`, `src/lib/site.ts`) is written as `{ en: "...", id: "..." }` pairs. Add both languages when you add or edit a project, timeline entry or skill.
- The language switches in the browser on one URL. Search engines and link previews read the English text. If you later want separate indexed pages per language, move to locale routes (`/en`, `/id`) with `hreflang`.

## Things to fill in

Nothing below is shown on the page until it has a real value.

| What | Where |
| --- | --- |
| Email, GitHub, LinkedIn | `contact` in `src/lib/site.ts` |
| CV | put your PDF at `public/files/cv.pdf`; download name in `src/lib/assets.ts` |
| Profile photo | `public/images/portrait/profile.jpg`, or change `assets.profilePhoto` in `src/lib/assets.ts` |
| Ambient music | a licensed track at `public/audio/wizarding-ambience.mp3` (see `public/audio/README.md`) |
| Project screenshots | `public/images/projects/README.md` |
| Section photo backdrops (optional) | `public/images/backgrounds/README.md` |
| Demo, repository or report links per project | `links` of each project in `src/lib/content/projects.ts` |
| Project contribution and stack for ScopeApp and Server Management Console | same file (empty lists are hidden) |
| Production URL | `NEXT_PUBLIC_SITE_URL` (see `.env.example`) |

Until `contact.email` is set, the contact form shows a short "no address yet" message instead of opening a mail app.

## SEO and metadata

- Title, description, Open Graph and Twitter tags: `src/app/layout.tsx`. Canonical URL, `robots.txt`, `sitemap.xml` and the web manifest come from `src/app/robots.ts`, `sitemap.ts` and `manifest.ts`.
- Icons: `src/app/icon.svg`, `favicon.ico` and `apple-icon.png`. Share images: `opengraph-image.png` and `twitter-image.png` (1200x630) with alt text in the matching `.alt.txt` files. Replace them with your own artwork if you like; keep the file names.
- A `Person` JSON-LD block is added in `src/app/page.tsx`.

## Accessibility and motion

- Skip link, visible gold focus ring, native `<dialog>` for the project dialog and the map (focus trap and Escape), keyboard-operable tabs, book pager and filters, 44 px minimum touch targets.
- `prefers-reduced-motion` is respected: CSS animations and transitions are cut to near-zero, Framer Motion reveals are disabled, the book turns by fading, and the wand canvas and flying owl are not mounted.
- Decorative layers are `aria-hidden`; live regions announce filter counts, page turns and toasts.

## Deploy to Vercel

1. Push the project to GitHub, GitLab or Bitbucket (`.env*` files are ignored, `.env.example` is kept).
2. In Vercel choose **Add New > Project** and import the repository. The framework is detected as Next.js; keep the default install and build commands (`npm install`, `npm run build`) and leave the output directory empty.
3. Under **Environment Variables** add `NEXT_PUBLIC_SITE_URL` with your final address (for example `https://cloud-exe.vercel.app` or your own domain), for Production.
4. Deploy. After the first deploy, open `/robots.txt`, `/sitemap.xml` and the page's share preview to confirm they use the right domain, then redeploy if you changed the variable.
5. Optional: add a custom domain under **Settings > Domains**, then update `NEXT_PUBLIC_SITE_URL` to match.

Command-line alternative: `npx vercel` (preview) and `npx vercel --prod` (production).

## Structure

- `src/lib/site.ts` holds identity, navigation, the site URL helper and the `contact` channels.
- `src/lib/i18n/` holds the language store, the `useLang` hook and the interface dictionary.
- `src/lib/content/` holds the chapter content: `about`, `projects`, `timeline` and `skills`. Components only render them.
- `src/app/globals.css` holds the design tokens (colours, fonts, keyframes) and a few utilities.
- `src/components/scene` is the hero backdrop: sky, castle, candles, owl, particles and pointer parallax.
- `src/components/ui` holds reusable pieces (`SectionShell`, `BookFrame`, `CategoryGlyph`, `Button`, `Reveal`, `LanguageSwitch`, `SkipLink`).
- `src/components/sections` has one thin file per chapter. The interactive parts live beside them: `about` (book), `projects` (filterable cards and detail dialog), `experience` (timeline), `skills` (spellbook), `contact` (owl post).

## Interactivity and motion

Everything decorative respects `prefers-reduced-motion` (effects are removed or become instant) and is simplified on touch devices.

- **Intro**: a gate that opens once per browser session (never on deep links such as `/#projects`). Skip with the button or Esc; sound is off until you turn it on.
- **Scroll**: sections, cards and timeline entries reveal once as they enter view; the hero castle layers parallax with the pointer and scroll; the navbar tracks the section being read and shows reading progress (`hooks/useActiveSection.ts`).
- **Wand** (`components/magic/MagicLayer.tsx`): one fixed canvas draws every spark. Clicks (taps on touch) burst, the mouse leaves a short trail, and the loop stops when nothing is alive. The wand button, bottom left, turns it off and the choice is remembered.
- **Hover**: project cards tilt toward the cursor with a tinted light; spellbook entries unroll a bookmark, and each "Used in" project opens its dialog.
- **Book and letter**: the About book turns real pages on wide screens (click the page corners or use the buttons); the contact letter folds shut as the owl takes it.
- **Modals**: the project dialog grows out of the card, slides between projects and fades out on close.
- **Secrets**: spells can be typed anywhere on the page (letters only, outside inputs), and the footer sign-off opens the Marauder's Map, which lists hints, counts what has been found and has a "whisper a spell" field for touch devices. Spell logic is in `lib/spells.ts`, discoveries in `lib/secrets.ts`, effects are requested through `lib/magicBus.ts`.

## Notes

- `AGENTS.md` (written by Next.js) tells coding agents to read `node_modules/next/dist/docs/` before changing framework code. Keep it in the repository.
- Type checking needs generated route types: use `npm run typecheck`, not a bare `tsc`.

## House worlds

The house button in the navigation bar opens four rooms: Gryffindor (default), Slytherin, Ravenclaw and Hufflepuff.
Each is a different environment, not a recolour. The choice is saved in `localStorage` and applied before first
paint. It is a visual preference, not a statement about a real house.

| Layer | Where |
| --- | --- |
| One source of truth: names, moods, backdrop photo, selector thumbnail, portrait path and focus point | `src/lib/theme/houses.ts` |
| Palette tokens (`html[data-house]`) | `src/app/globals.css` |
| Everything else that differs per house: photo cross-fade, ambient light, ornaments, card, button and nav treatments, typography, portrait frame particles, the spell played on switching | `src/app/houses.css` |
| Fixed photographic backdrop (one photo loaded at a time) | `src/components/theme/HouseBackdrop.tsx` |
| Hero compositions (banners, serpents, constellations, ivy, floaters) | `src/components/scene/house/*` via `HeroScene.tsx` |
| Margin ornaments for each chapter | `src/components/theme/HouseSectionOrnaments.tsx` |
| House selector | `src/components/theme/HouseSwitcher.tsx` |
| Store, boot script, photo cross-fade and spell trigger | `src/lib/theme/houseStore.ts` |

Backdrops: `public/images/houses/<house>/bg.webp`, `bg-sm.webp` (phones) and `thumb.webp` (selector). Portraits:
see `public/images/portrait/README.md` (four house portraits still need to be supplied).

Elements marked `data-h="gryffindor slytherin"` are shown only in those houses; `display: none` also stops their
animations, so inactive rooms cost nothing. `prefers-reduced-motion` removes the drifting photo, particles, leaves,
raven and the switching spell; phones get fewer particles and no photo drift.

## Magical upgrade: where things live

- Identity: `src/lib/site.ts` (`site.name`, `contact`). LinkedIn and Instagram stay empty until a verified URL is set; nothing is rendered for an empty channel.
- House magic as data: `src/lib/theme/houseMagic.ts` (signature creature, entrance creature, event weights, durations).
- Environment events: `src/components/environment/MagicalEnvironment.tsx` and `creatures.tsx` (phoenix, basilisk-inspired serpent, raven, badger, owl, troll in a doorway).
- Quidditch and Golden Snitch: `src/components/magic/QuidditchPitch.tsx`.
- Deathly Hallows: `src/components/magic/DeathlyHallows.tsx`.
- Half-Blood Prince book: `src/components/skills/HalfBloodPrinceBook.tsx`; content comes from `src/lib/content/*`.
- Wands: `src/lib/magic/wands.ts` (six styles) and `WandSelector.tsx` (with reset).
- Scroll progress: `src/components/layout/FlyingBroomProgress.tsx`.
- Social links: `src/components/contact/SocialLinks.tsx`.
- Internal storage keys still start with `cloudexe:` so existing visitors keep their saved choices; they are never displayed.
