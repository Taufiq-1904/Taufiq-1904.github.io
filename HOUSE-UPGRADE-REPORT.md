# Hogwarts house worlds: implementation report

Status: code complete, **not yet built or run in a browser** (see "What was and was not verified").

## 1. Assets found

| File | Type | House | Use | Ready |
| --- | --- | --- | --- | --- |
| `public/images/houses/gryffindor/bg.webp` (735x490), `bg-sm.webp` (640x427), `thumb.webp` (320x180) | photo backdrop | Gryffindor (tower bedroom, banners, hearth) | fixed page backdrop, phone backdrop, selector card | yes (low resolution, see 6) |
| `.../slytherin/bg.webp` (736x414), `bg-sm.webp`, `thumb.webp` | photo backdrop | Slytherin (vaulted chamber, green pillars, fireplace) | same | yes (low resolution) |
| `.../ravenclaw/bg.webp` (736x414), `bg-sm.webp`, `thumb.webp` | photo backdrop | Ravenclaw (tall library, chandeliers) | same | yes (low resolution) |
| `.../hufflepuff/bg.webp` (1200x675), `bg-sm.webp`, `thumb.webp` | photo backdrop | Hufflepuff (sunlit greenhouse room, sofas) | same | yes |
| `public/images/portrait/profile.jpg` (420x525) | portrait | none (original photo) | identity reference and fallback | yes, but small |
| `src/components/scene/house/*Scene.tsx` | code-drawn art | each house | hero banners, serpents, constellation, ivy, floaters, foregrounds | yes |
| `src/components/theme/AstroRing.tsx`, `HouseIcon.tsx`, `HouseCrest.tsx` | code-drawn art | various | ornaments, crests | yes |
| `src/components/media/PortraitOrnaments.tsx` | code-drawn art | each house | frame corners and particles | yes |

The four backdrop images match the four reference pictures supplied in the request, so they were mapped by content.

## 2 and 4. Assigned assets

Each house maps to its own backdrop, thumbnail and hero art (table above). Everything is declared once in
`houseScenes` in `src/lib/theme/houses.ts`.

## 3. Portrait variants: STILL MISSING

Only one portrait exists (`profile.jpg`). The four house portraits cannot be made from here (no image generation, and
altering a real face is exactly what the brief says to avoid), so they must be supplied:

- `public/images/portrait/gryffindor.webp`
- `public/images/portrait/slytherin.webp`
- `public/images/portrait/ravenclaw.webp`
- `public/images/portrait/hufflepuff.webp`

Drop the files in and they are used automatically (existence is checked at runtime; no code change). Until then each
house shows the original photo inside that house's frame, corners, particles and rim light, and in development a small
"portrait pending" tag names the missing file. Visitors do not see the tag. Details: `public/images/portrait/README.md`.

## 5. What differs per house

- **Backdrop**: its own photograph, cross-faded (the next photo is decoded first; only one photo is ever loaded).
  Per-house darkening and readability veil.
- **Ambient light**: Gryffindor firelight pools; Slytherin drifting underwater caustics and light ray; Ravenclaw twinkling
  stars and a faint rotating astronomical ring; Hufflepuff sun shafts through glass.
- **Hero**: Gryffindor crimson banners with sunburst device, wand sparks, floating candles, oak mantel; Slytherin silver
  serpents, green lamps, rune seal, drifting orbs; Ravenclaw self-drawing constellations, floating books and feather,
  a raven crossing, telescope; Hufflepuff swaying ivy and lanterns, falling leaves, golden feathers, ferns.
- **Portrait**: frame corners, particle type (embers / silver motes / stars / pollen), rim light, cross-fade between variants.
- **Chapters**: per-house margin ornaments (sunburst + ember glow / rune seal / astro ring / leaf sprig), section divider
  emblem (flame / serpent / wing / badger shield), translucent veil so the room shows through.
- **Components**: cards (gold corner brackets + ember glow / silver edge lines / star chart / rounded with leaf sprig),
  buttons (ember rise / silver sweep / starlight / honey glow and pill shape), navbar hairline, heading typography
  (Cinzel vs italic or bold Cormorant), shape language (square vs rounded).
- **Switching**: a house-specific spell wash starting where the visitor clicked (golden burst / emerald ripple /
  celestial fade / golden glow), under one second.

## 6. Missing or weak assets

1. The four house portraits (above).
2. Backdrops are small (about 735 px wide for three houses) and are stretched to full screen with a slight blur to hide
   softness. Replace with 1920 px WebP (under about 300 KB) in the same file names for a crisper result.
3. `profile.jpg` is 420x525; an 800x1000 original would look sharper on high-density screens.
4. No ambient sound per house: the existing music box plays one track, so nothing was added.

## 7. Files changed

New: `src/components/theme/HouseSectionOrnaments.tsx`, `HOUSE-UPGRADE-REPORT.md`.
Rewritten: `src/lib/theme/houses.ts`, `src/lib/theme/houseStore.ts`, `src/components/theme/HouseSwitcher.tsx`,
`src/components/media/ProfilePortrait.tsx`, `src/components/ui/GoldDivider.tsx`.
Edited: `src/app/layout.tsx` (loads `houses.css`, mounts backdrop and spell layer), `src/app/globals.css` (transparent
body), `src/app/houses.css`, `src/components/scene/HeroScene.tsx`, `SectionBackdrop.tsx`, `ui/SectionShell.tsx`,
`ui/Button.tsx`, `layout/Navbar.tsx`, `layout/Footer.tsx`, `projects/ProjectCard.tsx`, `experience/Timeline.tsx`,
`src/lib/i18n/dictionary.ts`, `README.md`, `public/images/portrait/README.md`.

The repository already contained `HouseBackdrop`, `houses.css`, the four hero scenes and the portrait ornaments, but they
were not connected (`houseScenes` did not exist, `houses.css` was never imported, `HouseCrest` read a missing `ink`
field). This work wires them together and finishes the missing pieces.

Two bugs in the existing `houses.css` were fixed after rendering it: the `house-enter` keyframe forced every `data-h`
element to opacity 1 (which made Slytherin's caustics cover the whole room), and the caustics were too bright.

## 8. Performance and accessibility

One photo loaded at a time (CSS only gives the active house's layer an image); phones get the small file; photo drift,
second caustic sheet, leaves and astro ring are reduced or disabled on phones; inactive houses are `display: none` so
their animations stop; only transform and opacity animate; `prefers-reduced-motion` removes drift, particles, leaves,
raven, constellation drawing and the switching spell. Selector: keyboard operable (Enter/Space, arrows, Escape, focus
returns), `aria-pressed`, labelled, pinned to screen edges on phones. Portrait has house-specific alt text (EN and ID)
and a fixed 4:5 frame so nothing shifts while loading. No new dependencies.

## 9. What was and was not verified

The package registry is blocked in the environment used, so dependencies could not be installed and these did NOT run:
`npm run lint`, `npm run typecheck`, `npm run build`, the dev server, and any browser test of the real site.

What was done instead:
- Syntax check of every source file (no errors).
- Type check against stubs for React, Next and Framer Motion: no errors involving the project's own types (house config,
  dictionary shape, store API). Stub-only noise was ignored.
- CSS class, `data-h` and asset-path cross-checks: all referenced classes exist; all backdrop and thumbnail files exist;
  the four portrait files are the only missing paths.
- The backdrop stage (the project's real `globals.css` and `houses.css`) rendered in Chromium for all four houses at
  desktop and phone width, with a sample card hovered. Tailwind-styled parts (hero art, selector panel, portrait frame)
  could not be rendered.

Run `npm ci && npm run check` first, then check each house at desktop and phone width, the selector, the portrait swap
and a refresh to confirm persistence.
