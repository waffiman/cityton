# Handover — City-Ton Austria website

This repository is a **rebuild of an approved HTML design prototype in Next.js**. The design is
high-fidelity: colours, type, spacing and interactions in the code match the prototype and should be
treated as final unless the client says otherwise.

- **Prototype (source of truth for look & feel):** `design-reference/city-ton-design-reference.html`
  — open it directly in a browser, it is self-contained.
- **Implementation:** everything under `src/`. Structure and commands: `README.md`.

Language: German (Austrian market). An EN switch is drawn in the header but inactive — see
"Open work → Zweisprachigkeit".

---

## 1. Design system

The visual language is a **wireframe/blueprint system**: light technical ground, one teal accent, a
dark accent field for inverted sections, square corners everywhere, hairline borders, and "+"
registration marks on framed objects. Photography is duotoned into the accent.

### Tokens (all in `src/app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#f2f2f3` | page ground |
| `--color-text` | `#1d1f20` | body ink |
| `--color-divider` | `#1d1f20` @ 16 % | every hairline |
| `--color-accent` | `#358a9a` | accent base, primary button, bars |
| `--color-accent-100…900` | `#eaf4f6 … #0f2f36` | tints, hovers, deep text |
| `--color-accent-700` | `#2a6f7d` | accent at body-copy contrast (links, eyebrows) |
| `--color-accent-900` | `#0f2f36` | the dark field: comparison, CTA, footer, quote plate |
| `--color-signal` | `#dca042` | sunlight rays in diagrams, rating stars — nothing else |
| `--color-warm` | `#ffb4a8` | "OHNE FOLIE" label on the dark field |
| `--color-neutral-100/200` | `#f5f5f8` / `#e7e7ea` | plate fills, progress tracks |
| `--color-on-dark-*` | `#f2f2f3` / `#fff` / `#cbe6ea` / `#7fa9b0` | reversed type steps |
| `--font-body` / `--font-heading` | Inter (400–800) | one family; headings at weight 600, `-0.02em` |
| `--space-1…8` | 3.4 / 6.8 / 10.2 / 13.6 / 20.4 / 27.2 px | component padding |
| `--page-max` / `--page-gutter` | 1600 px / 32 px (20 px mobile) | `.container` |
| `--section-gap` | 88 px (56 px mobile) | `.section` top padding |
| `--radius-*` | 0 is used everywhere | corners stay square by design |
| `--shadow-sm/md/lg` | ink-tinted | only the wipe handle uses one |

Type sizes in the design are fluid: headings use `clamp()` (e.g. hero `clamp(38px, 4.4vw, 66px)`,
section titles `clamp(30px, 3.2vw, 46px)`), body copy is 14–19 px, eyebrows 10–13 px with
0.08–0.34 em tracking and uppercase.

### Component classes (global, in `globals.css`)

`.blueprint` (+ `<Corners />`), `.duotone`, `.btn` / `.btn-primary` / `.btn-secondary` /
`.btn-inverse` / `.btn-lg`, `.card` + `.card-kicker/-title/-body/-meta`, `.tag` / `.tag-accent` /
`.tag-outline`, `.table`, `.field` / `.input`, plus utilities `.container`, `.section`,
`.section-tight`, `.eyebrow`, `.rule-head`, `.lead`, `.muted`, `.section-title`, `.accent-word`,
`.sr-only`, `.skip-link`.

Rules that matter:

1. Cards and figures are **transparent line drawings** — no surface fill, no radius. The solid accent
   primary button is the single deliberate exception.
2. Any element with `.blueprint` also renders `<Corners />`. Don't ship one without the other.
3. On a dark field, wrap in `.on-dark` (or add it to the element) so borders and marks lighten.
4. Icons are thin-stroke (Lucide style, `stroke-width: 1.5`). See `BenefitIcon`.
5. States are themed: `:hover` tints from the accent ramp, `:focus-visible` is a 2 px accent ring.
   Never leave a browser default.

---

## 2. Pages

| Route | File | Notes |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero → partner bar → 4 benefits → before/after on dark → 4-step process (video) → series list → consultation CTA → reviews → FAQ |
| `/ueber-uns` | `app/ueber-uns/page.tsx` | Intro + duotone portrait, quote plate on the dark field, 3 partner cards, 6 advantage cards |
| `/produkte` | `app/produkte/page.tsx` | Overview: the four series rows + sample CTA strip |
| `/produkte/[slug]` | `app/produkte/[slug]/page.tsx` | Statically generated per series. Full detail exists for `serie-r`; the other three render a short "Datenblatt in Arbeit" plate until copy lands |
| `/funktionsprinzip` | `app/funktionsprinzip/page.tsx` | Sticky diagram column + three scroll-linked sections (Sommer / Winter / Einbruchschutz) |
| `/referenzen`, `/blog`, `/partner`, `/kontakt`, `/impressum`, `/datenschutz` | one file each | `<PlaceholderPage>` — in the sitemap, not yet designed |

The header CTA and every in-page CTA point to `/kontakt`.

### Interactions

- **BeforeAfter wipe** (`components/BeforeAfter.tsx`): pointer-drag divider, `clip-path: inset(0 0 0 X%)`
  on the "after" image, clamped 2–98 %, starts at 46 %. Pointer events are bound on `window` so the
  drag survives leaving the element; a visually hidden `<input type="range">` covers keyboard use.
- **PrincipleScroller** (`components/PrincipleScroller.tsx`): IntersectionObserver with
  `rootMargin: -45% 0 -45% 0` picks the active section; the diagram column is `position: sticky`
  under the header and the three ticks below it fade to 0.2 opacity when inactive. Under 900 px the
  column becomes a sticky strip above the copy.
- **AutoplayVideo** (`components/AutoplayVideo.tsx`): muted + `playsInline` + `loop` (the only way
  autoplay is allowed). `startAt` / `clipLength` trim a longer clip to a usable loop window
  (process step 1 starts at 3 s; steps 2–4 loop 5 s). Reduced-motion users see the poster.
- **Header**: sticky, translucent (`rgba(242,242,243,.94)` + 6 px blur). Below 1180 px the nav
  collapses into a drawer; below 560 px the header CTA hides (the hero and page CTAs carry it).
- **FAQ**: native `<details>`; the `+` marker turns into `−` via CSS only.

### Responsive behaviour

The prototype was desktop-only; breakpoints here are additions, not design changes:
1180 px (nav → drawer), 1100 px (4-col grids → 2, split sections → stacked), 1000 px (about/product
grids → 1), 900 px (split hero and principle scroller stack), 640 px (everything single column).
Worth a design review pass on real devices before launch.

---

## 3. Content and data

All copy is in `src/content/`:

- `site.ts` — wordmark, nav, footer columns, CTA label, contact placeholders, `heroVariant`
- `series.ts` — the four film series incl. metrics and the Serie R detail page payload
- `home.ts` — benefits, comparison rows, process steps, reviews, FAQ, consultation block
- `principles.ts` — the three explainer sections
- `about.ts` — /ueber-uns

**Deliberate placeholders still in the build** (client to supply; they render as bracketed text):
phone, e-mail, address, the three Google review quotes, and the "Alle Rezensionen ansehen" link.
Search for `TODO(client)` and for `[` in the content files.

**Technical values** (TSER / VLT / UV, temperature deltas, film thickness, warranty spans) came from
the prototype copy and must be checked against current LLumar / Armolan datasheets before launch —
they are advertising claims.

---

## 4. Assets

`public/media/` — 13 photographs (JPEG) and 5 H.264 loops, all supplied by the client via the design
project. Logos: `logo-llumar.png`, `logo-armolan.png` (brand assets of the manufacturers, used with
partner permission).

Before launch: re-export the photographs at ≤ 2000 px on the long edge, and the loops as
poster + WebM/MP4 pairs — the raw files are heavier than a marketing site should ship. The diagrams
are inline SVG in `components/diagrams/` and need no assets.

---

## 5. Open work

1. **Kontaktformular** — `/kontakt` is a placeholder. Needs fields (Name, Objektart, Fläche, Ziel,
   Kontaktweg), a Server Action or API route, spam protection, a DSGVO consent line, and a success
   state. Endpoint env var stub in `.env.example`.
2. **Impressum / Datenschutz** — legal copy from the client; routes and `robots` exclusions exist.
3. **Referenzen, Blog, Für Partner** — designed content pending; placeholders in place.
4. **Serie-R-Geschwister** — detail copy for ARM Platinum/Spectrum, Safety and UV Protection Clear.
   Add a `detail` block in `content/series.ts` and the page fills in automatically.
5. **Zweisprachigkeit (DE/EN)** — the switch renders EN as inactive. Recommended: `next-intl` with a
   `[locale]` segment; the content modules are already the only place strings live.
6. **Reviews** — pull the real Google reviews (Places API or a paste-in) and link the profile.
7. **Analytics / consent** — nothing is loaded today; add behind a consent gate.
8. **Media optimisation and a design QA pass on mobile** (see above).

---

## 6. Definition of done for a launch

- `npm run build`, `npm run lint`, `npm run typecheck` clean.
- No bracketed placeholder text left in `src/content/`.
- Lighthouse: LCP image is the hero (already `priority`), videos `preload="metadata"`.
- Keyboard pass: skip link, header drawer, FAQ, before/after slider, all focus rings visible.
- Metadata: `NEXT_PUBLIC_SITE_URL` set, OG image added (`app/opengraph-image.*` — not yet created).
