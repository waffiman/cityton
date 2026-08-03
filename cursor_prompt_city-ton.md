# Cursor Build Prompt — City-Ton Austria Corporate Website

Copy everything below into Cursor (as the initial project prompt / composer instructions) to scaffold and build the site.

---

## Project Overview

Build a multi-page, bilingual (German + English) corporate website for **City-Ton Austria**, a company that professionally installs window films (solar control, UV protection, energy efficiency, and impact/security films) in Austria and Ukraine, operating in partnership with two film manufacturers: **Armolan Europe** and **LLumar**.

The site serves two audiences equally:
- **B2C**: homeowners, offices, and shop owners looking for comfort, heat/UV protection, and privacy.
- **B2B**: construction companies, glass workshops (installation partners), facility management, architects/planners, property management, and real estate developers looking for a reliable subcontractor/partner.

Brand tagline: *"We don't sell film rolls — we deliver the finished result: consultation, material, installation, and support, all from one hand."*

---

## Tech Stack

- **Framework**: Next.js (App Router), React, TypeScript.
- **Styling**: Tailwind CSS with a custom design-token theme (see Design System below).
- **i18n**: `next-intl` (or equivalent), manual language switcher in the header (DE default, EN secondary). **No automatic geolocation/browser-based language detection.**
- **Content for Blog & Case Studies**: structure content as local MDX/JSON files for now, but architect the data layer so it can be swapped for a Headless CMS (e.g., Sanity or Strapi) later without major refactoring.
- **Forms**: client + server-side validation, spam protection (honeypot field + rate limiting; reCAPTCHA-ready), submissions sent via an email API route.
- **Maps**: embed Google Maps (or OpenStreetMap/Leaflet) on the Contact page.
- **Analytics**: Google Analytics 4 integration (env-var-driven, GDPR-conscious — only load after consent if a cookie banner is added later).
- **Video embeds**: support YouTube/Vimeo embeds for the certified security-film test video.
- **Deployment target**: framework-agnostic (Vercel-ready), but don't hardcode any Vercel-only APIs.

---

## Design System

Preserve the brand's teal/dark-green palette but reinterpret it in a **cleaner, more modern, more minimal** direction than the current PDF brochure: more whitespace, fewer decorative borders, clearer typographic hierarchy, soft shadows instead of hard borders, subtle "glass"/frosted-panel effects (nod to the glass/window theme).

### Color tokens (Tailwind theme extension)
```
teal:        #358a9a   // primary accent, CTAs, icons
teal-dark:   #1e4a54   // section headers, dark banners
dark-green:  #0f2f36   // header/footer background
bg-soft:     #f4f7f8   // section backgrounds
border:      #dce4e6
amber:       #dca042   // diagram arrows / highlight accents
red:         #ff4d4f   // "without film" heat indicator
```

### Typography
System font stack (e.g., Inter or similar geometric sans). Strong weight for headings, generous line-height for body copy.

### Components to build as reusable primitives
- `Header` with logo, nav (Home / About / Products / How It Works / Case Studies / Blog / **For Clients** / **For Partners** / Contact — Clients and Partners must be two distinct, clearly separated nav items, never combined into one), language switcher (manual DE/EN toggle), mobile menu.
- `Footer` with both partner logos (Armolan Europe + LLumar) shown with equal visual weight, contact summary, sitemap links.
- `Section` wrapper with consistent padding/max-width.
- `IconCard` (icon + title + short description) — used across "Wer wir sind", "Vorteile", "Kooperationsmodelle".
- `ProductCard` — icon, series name, one-line tech summary, key metrics as pill badges (TSER / VLT / UV-Schutz), link to detail page.
- `BeforeAfterSlider` — draggable comparison slider (see Functional Requirements 1).
- `StatCallout` — big number + label (e.g., "−8.0 °C", "100+ m² installed").
- `ComparisonTable` — responsive table for the 4 film series (collapses to stacked cards on mobile).
- `CertificationBadge` — badge/icon marking certified security film content.
- `PartnerLogoBlock` — for Armolan Europe / LLumar / City-Ton, used consistently across pages.

**Important brand rule**: Never brand the overall product range under a single manufacturer name like "Armolan Folie." Both Armolan Europe and LLumar must be presented as co-equal technology partners throughout product and partnership content — do not let one partner visually or textually dominate.

---

## Sitemap & Pages

### 1. Home (`/`)
- Hero with headline "Fensterfolien für Sonnenschutz, UV-Schutz, Energieeffizienz und Einbruchschutz" + 4 benefit icons (Sonnenschutz / UV-Schutz / Energieeffizienz / Einbruchschutz).
- "Der Unterschied ist messbar" section with the **before/after comparison slider** (see Functional Requirements).
- Short overview of the 4 product series linking to the catalog.
- Separate CTA blocks for B2C ("Request a consultation" → links to `/clients`) and B2B ("Become a partner" → links to `/partners`).

### 2. About (`/about`, `Über uns`)
- Company story, mission, the brand quote/principle.
- Fact callout: "100+ m² of window surface installed."
- Partnership section: **Armolan Europe** and **LLumar** each get an equal-weight card (logo, 3 bullet strengths) — do not favor one.
- "Vorteile" (Why work with us) — 6 benefit cards.

### 3. Products (`/products`, `Produkte`)
- Catalog grid of 4 series: **Serie R**, **ARM Platinum/Spectrum**, **Safety Serie**, **UV Protection Clear**.
- Each series has its own detail page: technology description, key metrics (TSER, VLT, UV protection %) as badges, ideal-use-case list.
- Full comparison table of all 4 series (columns: Series / Technology / Key metrics / Ideal for).
- **Safety Serie gets special extended treatment** (see Functional Requirements 2): certification badge, standard name/number, embedded test video, thickness range (4/7/8/12/13 mil, 100–336 µm).

### 4. How It Works (`/how-it-works`, `Funktionsprinzip`)
- Interactive before/after visualization for solar film (example data point: Armolan R Silver 20 — TSER 78%, UV protection >99%, glare reduction 81%).
- Seasonal scenario diagrams: Summer vs. Winter.
- Impact protection diagram: force distribution across the glass surface + **embedded certification test video** for the security film.

### 5. Case Studies (`/cases`, `Referenzen`)
- Gallery of completed projects, filterable by object type (residential, office, retail, etc.).
- Case detail card: before/after photos, object type, film series used.

### 6. Blog (`/blog`)
- Article list with categories/tags and search.
- Individual article page.

### 7. For Clients (`/clients`, `Für Kunden`)
- B2C-focused landing page: the three core problems solved (overheating, glare, unwanted views), broken down by property type — homes/apartments, offices, shopfronts/display windows, security-sensitive areas.
- Short recap of the 4 product series framed for end customers (in plain, benefit-driven language, not technical spec sheets).
- Simple consultation-request form (name, contact info, property type, message) — this is the primary B2C conversion point, distinct from the B2B application form.
- CTA linking to relevant Product detail pages and to Case Studies for social proof.

### 8. For Partners (`/partners`, `Für Partner`)
- Description of 6 cooperation models, each as its own card: **construction companies, glass workshops, facility management, architects & planners, property management, real estate developers**.
- B2B application form (see Functional Requirements 3) — application only, no login/dashboard at this stage.
- Note on individual, project-based pricing (avoid a hardcoded flat rate — present as "custom quote per project").

### 9. Contact (`/contact`, `Kontakt`)
- Contact form with two modes: B2C inquiry vs. B2B partner application (see Functional Requirements 3).
- Embedded map with company location.
- Contact details:
  - Phone: **+43 677 61520700**
  - Email: **office@city-ton.com**

---

## Functional Requirements

### 1. Before/After Comparison Slider
A key interactive component used on Home and How It Works pages.
- Draggable divider between a "without film" and "with film" state (image or SVG diagram).
- Full touch/drag support on mobile.
- Works with both photographic images and schematic SVG diagrams (e.g., light-ray transmission diagrams).
- Metric labels displayed on both sides (e.g., temperature, TSER, VLT).
- Example real data point to seed content: 33.3 °C (without film) vs. 25.7 °C (with film) = −8.0 °C measured difference.

### 2. Security Film Certification Emphasis (Safety Serie)
Unlike the other three series, the impact-resistant "Safety Serie" gets a dedicated, more elaborate content treatment:
- Embedded video (YouTube/Vimeo) of the certified impact-resistance test, shown on both the Safety Serie product page and the How It Works page.
- Clear display of the security standard name/number the film is certified against — **use a placeholder/config value for now** (e.g. `SECURITY_STANDARD = "TBD"` in a content config file) since the exact standard (EN 12600 / ANSI Z97.1 / UL 972 / manufacturer-specific certificate) has not yet been provided by the client — make this trivially editable via a single content field.
- A certification badge/icon shown next to the Safety Serie name in the catalog and on its card.
- Thickness range spec (4 / 7 / 8 / 12 / 13 mil, 100–336 µm) shown in the comparison table.

### 3. Forms
- **B2C consultation-request form** (lives on the Clients page, and optionally as the default mode of the Contact page form): name, contact info, property type, message. Sends to company email.
- **B2B partner application form** (lives on the Partners page, and as the alternate mode of the Contact page form): company name, contact person, role (dropdown: construction company / glass workshop / facility management / architect-planner / property management / real estate developer), contact info, message. No account creation — submission only.
- Both forms: client-side + server-side validation, honeypot spam field, success/error states, localized (DE/EN) field labels and validation messages.

### 4. Map & Contact
Embedded interactive map on the Contact page with a marker at the company location (use a placeholder coordinate/address field to be filled in later).

### 5. Analytics
GA4 integration via environment variable (`NEXT_PUBLIC_GA_ID`), loaded client-side, page-view tracking on route change (App Router navigation events).

### 6. Product Catalog
- Filter/sort by use case and key metrics (TSER, VLT).
- Each series as a card with icon, short description, and link to its detail page.

### 7. Blog & Case Studies
- File-based content collection (MDX or JSON) for now, with a clean data-fetching abstraction so it can later point to a Headless CMS.
- Category/tag filtering for blog posts.

### Explicitly Out of Scope (do not build)
A full B2B portal with login, order history, document access, or account dashboards is **out of scope** for this phase. Only the simple partner-application form (item 3 above) should exist — do not scaffold auth, user accounts, or a dashboard.

---

## Localization (DE/EN)

- German is the default/primary language; English is secondary.
- Manual language switcher in the header — **no automatic detection by browser language or geolocation**, and no persistence requirement beyond the current session unless you choose to add it.
- All UI strings, form labels/validation, and page content must exist in both locales via the i18n library's message files — do not hardcode German or English strings directly in components.

---

## Non-Functional Requirements

- **Performance**: aim for LCP under 2.5s on 4G; use Next.js image optimization, code-splitting, and lazy-load below-the-fold sections (case gallery, blog list).
- **SEO**: semantic HTML, proper meta tags per page, `sitemap.xml`, `hreflang` tags for DE/EN.
- **Accessibility**: WCAG 2.1 AA baseline — sufficient color contrast, alt text on all images/icons, full keyboard navigation, visible focus states.
- **Responsiveness**: mobile-first, correct rendering from 360px width up through large desktop screens; all diagrams and the before/after slider must work correctly on small screens.
- **Form security**: server-side validation and rate-limiting on all form endpoints.
- **Browser support**: latest 2 versions of Chrome, Firefox, Safari, Edge.

---

## Content Notes

- Base copy, product metrics, and diagram values come from the City-Ton Austria partner brochure (latest version, Armolan Europe + LLumar partnership). Recreate all brochure diagrams (light-transmission diagrams, force-distribution diagrams) as **crisp vector/SVG or interactive components** — do not embed raster screenshots of the brochure.
- Seed real contact data:
  - Phone: `+43 677 61520700`
  - Email: `office@city-ton.com`
  - Note: the previous company domain `city-ton.com` is currently under maintenance — this project is the rebuild.
- Seed one real example metric set for the "How It Works" page: Armolan R Silver 20 — TSER 78%, UV protection >99%, glare reduction 81%; "without film" vs. "with film" transmission/reflection/absorption values from the brochure diagrams.

---

## Deliverable Structure (suggested)

```
/app
  /[locale]
    /page.tsx                 → Home
    /about/page.tsx
    /products/page.tsx
    /products/[slug]/page.tsx
    /how-it-works/page.tsx
    /cases/page.tsx
    /cases/[slug]/page.tsx
    /blog/page.tsx
    /blog/[slug]/page.tsx
    /clients/page.tsx
    /partners/page.tsx
    /contact/page.tsx
/components
  Header, Footer, Section, IconCard, ProductCard,
  BeforeAfterSlider, StatCallout, ComparisonTable,
  CertificationBadge, PartnerLogoBlock, ClientInquiryForm, PartnerApplicationForm
/content
  products.ts (or .json/.mdx per series)
  cases/*.mdx
  blog/*.mdx
/lib
  i18n config, form-submission API route, GA helper
/messages
  de.json, en.json
```

---

## Instructions to Cursor

1. Scaffold a new Next.js (App Router, TypeScript) project with Tailwind CSS and the color tokens above configured in `tailwind.config.ts`.
2. Set up `next-intl` with `de` as the default locale and `en` as the secondary locale, plus a manual language-switcher component in the header.
3. Build the shared layout (`Header`, `Footer` with both partner logos equally weighted) and the reusable component primitives listed under Design System.
4. Implement each page from the Sitemap section above, using placeholder/lorem content only where real brochure content hasn't been provided in this prompt — mark any placeholder clearly with a `// TODO: content` comment.
5. Build the `BeforeAfterSlider` component first as a standalone, reusable piece, then wire it into the Home and How It Works pages.
6. Implement the Safety Serie certification treatment (badge, video embed, standard placeholder field) as described.
7. Build the two forms (client-facing consultation request on `/clients`, partner application on `/partners`) with validation and a working `/api/contact` route (can stub the actual email-sending integration behind a clearly marked TODO). The Contact page form should let the user pick which of the two modes they want.
8. Add the GA4 script loader gated behind an environment variable.
9. Ensure everything is responsive and keyboard-accessible before considering a page "done."
10. Do not implement any B2B login/dashboard functionality — only the application form.

Ask me for the real brochure copy, product photos, case study photos, exact map coordinates, and the security certification standard name where marked as `TODO` before finalizing that content.
