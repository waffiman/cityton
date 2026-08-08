# City-Ton Austria — Website

Marketing site for City-Ton Austria (Sonnenschutz-, UV-, Energiespar- und Sicherheitsfolien),
built with **Next.js 15 App Router**, **React 19** and **TypeScript**. No UI framework, no CSS-in-JS:
design tokens + CSS Modules.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
```

Node 20+ required. `next/font` fetches Inter at build time, so the first build needs network access.

## Structure

```
src/
  app/
    layout.tsx              root layout: font, metadata, header/footer, skip link
    globals.css             design tokens + design-system classes + utilities
    page.tsx                / — home
    home.module.css
    ueber-uns/              /ueber-uns
    produkte/               /produkte  (overview)
    produkte/[slug]/        /produkte/serie-r … (static, generateStaticParams)
    funktionsprinzip/       /funktionsprinzip (scroll-linked explainer)
    referenzen|blog|partner|kontakt|impressum|datenschutz/
                            routed placeholders — content pending
    sitemap.ts, robots.ts, not-found.tsx
  components/               presentational + 3 client components
  content/                  all copy and data (site, series, home, principles, about)
public/media/               images and video loops
design-reference/           the HTML design prototype this was built from
```

**Server Components by default.** Only four files are `"use client"`:
`SiteHeader` (mobile drawer), `BeforeAfter` (drag wipe), `PrincipleScroller`
(IntersectionObserver), `AutoplayVideo` (muted-loop control).

## Conventions

- **Content lives in `src/content/*`**, never inline in a page. Marketing edits happen there; it is
  also the shape to fetch into when a CMS arrives.
- **Styling:** tokens in `globals.css` (`--color-*`, `--font-*`, `--space-*`), design-system classes
  (`.blueprint`, `.btn`, `.card`, `.tag`, `.table`) global, everything layout-ish in a co-located
  `*.module.css`. Never hard-code a colour or font that a token already carries.
- **Framed objects** (cards, figures, primary buttons) carry `.blueprint` **and** `<Corners />` —
  the four "+" registration marks are part of the visual language, not decoration to drop.
- Images go through `next/image`; decorative videos through `<AutoplayVideo>` (muted, looped,
  `playsInline`, respects `prefers-reduced-motion`).

See **HANDOVER.md** for the design system rules, page-by-page notes, and the list of open work.
