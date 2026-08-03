# City-Ton Austria — Corporate Website

Bilingual (DE/EN) corporate website for City-Ton Austria — professional window-film installation in partnership with Armolan Europe and LLumar.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 (brand tokens via `@theme`)
- next-intl 4 (manual DE/EN switcher, no geo detection)
- Pure SVG infographics (no chart library)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_GA_ID
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/de`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Project structure

```
app/[locale]/          # Locale-scoped pages
components/            # UI primitives + diagrams/
content/products.ts    # Product data + security placeholders
lib/                   # i18n helpers, content abstraction, analytics
messages/de.json|en.json
public/brand/          # Logo + partner logo placeholders
i18n/                  # next-intl routing / request / navigation
```

## Content TODOs

Marked in code with `TODO: content`:

- LLumar logo asset and partner bullet strengths
- Vector City-Ton logo (currently trimmed raster)
- Security certification standard (`SECURITY_STANDARD` in `content/products.ts`)
- Certified impact-test video URL
- Company address + map coordinates
- Product / case-study photography
- Form email delivery (Clients / Partners / Contact — stubbed this pass)

## Pages in this pass

**Complete:** Home, Products (catalog + 4 detail pages), How It Works  
**Stubbed (routable):** About, Cases, Blog, Clients, Partners, Contact
