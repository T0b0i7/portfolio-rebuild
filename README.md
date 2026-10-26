# portfolio-rebuild

Reproduction de l'**architecture** décrite dans `PLAN.md` (structure, techniques d'animation,
modèle de données). Tout le contenu — nom, projets, articles, palette, logo — est un placeholder
à remplacer. Voir « À ne pas reprendre » dans `PLAN.md`.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production + 21 pages statiques
npm start
npm run lint       # tsc --noEmit
```

Stack : Next.js 16.4 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS v4.

## Structure

```
app/
  layout.tsx                  métadonnées, next/font, theme script anti-FOUC, noscript, palette
  page.tsx                    les 6 sections de la home (RSC)
  globals.css                 tokens oklch clair/sombre, @theme inline, .parallax, [data-reveal]
  not-found.tsx               404
  opengraph-image.tsx         OG image générée (ImageResponse, 1200×630)
  sitemap.ts / robots.ts      SEO
  feed.xml/route.ts           RSS statique
  search-index.json/route.ts  index de recherche statique (force-static)
  uses/ services/ guestbook/ bucket-list/ links/
  work/[slug]/page.tsx        page projet (SSG + generateMetadata)
  writing/[slug]/page.tsx     page article (SSG + generateMetadata)
components/
  site-header.tsx             nav sticky, blur au scroll, Search, thème, ⌘K/Ctrl K détecté
  command-palette.tsx         ⌘K + "/", fetch de l'index, ↑↓/Enter/Esc, body lock
  theme-toggle.tsx            light → system → dark persisté (classes .light/.dark, aucun script)
  parallax.tsx                rAF, --scroll / --pointer-x / --pointer-y, reduced-motion
  reveal.tsx                  IntersectionObserver → data-visible (fallback no-JS)
  work-section.tsx            8 filtres, carrousel snap, Go to <projet>, prev/next, aria-live
  pricing-toggle.tsx          switch mensuel/annuel + chiffres roulants (odometer)
  copy-email.tsx              Copy email (clipboard + aria-live)
  reveal-photo.tsx            Reveal photo (aria-pressed)
  guestbook.tsx               formulaire + persistance localStorage
  page-shell.tsx              en-tête commun aux pages secondaires
  icon.tsx                    <use href="/icons/sprite.svg#id">
lib/
  content.ts                  modèle Project / Post + facettes de filtre
  site.ts                     marque, nav, pages, socials, stack
  pages-content.ts            uses, bucket list, guestbook seed, links
  search-index.ts             projection des données → index de recherche
public/icons/sprite.svg       sprite unique (search, sun, moon, monitor, arrows, copy, check)
```

## Correspondance avec PLAN.md

| Exigence | État | Implémentation |
|---|---|---|
| Next.js 16 App Router, RSC | ✅ | `app/` en server components, interactif isolé en `"use client"` |
| CSS | ✅ | Tailwind v4 + tokens `@theme inline` sur variables CSS oklch |
| Thème `dark:` | ✅ | `light-dark()` + `color-scheme` piloté par `.light` / `.dark` : suit l'OS sans JavaScript, aucun `<script>` en `<head>` (immunise l'hydratation contre les extensions) |
| Fonts self-hosted | ✅ | `next/font` (Inter, JetBrains Mono) → woff2 servis depuis `/_next/static/media`, zéro appel Google |
| Images AVIF | ✅ | `images.formats` + `opengraph-image.tsx` (PNG généré) ; covers projets encore en dégradés CSS |
| Sprite SVG unique | ✅ | `public/icons/sprite.svg` + `<Icon />` |
| `/search-index.json` | ✅ | route handler `force-static`, consommé par la palette |
| Filtres ALL…UK | ✅ | `lib/content.ts` + `work-section.tsx` |
| Carrousel + `Go to <projet>` | ✅ | scroll-snap + `scrollTo`, prev/next, état `aria-current` |
| Palette ⌘K / Ctrl+K | ✅ | détection plateforme, navigation clavier, résultats groupés |
| Parallax scroll + souris | ✅ | `parallax.tsx` + utilitaire `.parallax` avec `--depth` |
| Toggle de tarifs à chiffres roulants | ✅ | `/services` — `pricing-toggle.tsx` (aucune section tarifs dans `outline.md`, donc page dédiée) |
| Reveal photo | ✅ | `reveal-photo.tsx` |
| Thème light/system/dark | ✅ | `theme-toggle.tsx` |
| Ordre des sections home | ✅ | intro → nav → work → profil → writing → contact → footer |
| Anti-copie | ✅ | contenu 100 % placeholder |

Hors `outline.md`, ajouté parce que présent sur le site source ou nécessaire au SEO :
`/uses`, `/guestbook`, `/bucket-list`, `/links`, `/services`, `sitemap.xml`, `robots.txt`, `feed.xml`,
`opengraph-image`, 404.

## NaviGarde IA — export PDF réglementaire & versioning (EF-35)

Module isolé, sans effet sur le rendu du portfolio. Routes montées sous `/api/v1/reports`.

```
src/ai/reportTemplate.js        structure administrative (en-tête, métadonnées, constatations, sceau)
src/server/report-types.ts      types Report / Finding / ReportPatch
src/server/report-store.ts      dépôt en mémoire + SHA-256 canonique + clone de version
src/server/report-pdf.ts        rendu A4 pdf-lib (en-tête, tableau, constatations, sceau, QR)
src/server/pdf-kit.ts           wrap texte, sections, filets (polices standard = pas de layout auto)
src/server/http.ts              origine publique (QR), erreurs JSON

app/api/v1/reports/route.ts               GET liste · POST création (201, Location)
app/api/v1/reports/[id]/route.ts          GET · PATCH (EF-35)
app/api/v1/reports/[id]/download/route.ts GET → application/pdf
app/verify/[id]/page.tsx                  page publique cible du QR (noindex)

tests/smoke-pdf.mjs             34 assertions bout-en-bout
```

```bash
npm run build && npm start     # terminal 1
npm run test:smoke             # terminal 2 (BASE_URL, défaut http://localhost:3000)
node tests/smoke-pdf.mjs --base http://localhost:3111
```

### Contrat

| Méthode | Route | Comportement |
|---|---|---|
| `GET` | `/api/v1/reports` | liste (id, référence, version, statut, hash) |
| `POST` | `/api/v1/reports` | crée v1 en `brouillon` (ou `validé`) |
| `GET` | `/api/v1/reports/:id` | rapport complet + historique |
| `PATCH` | `/api/v1/reports/:id` | brouillon → mise à jour en place (200) ; **validé → clone v(n+1) en `brouillon` (201)**, l'original reste intact et pointe via `supersededBy` |
| `GET` | `/api/v1/reports/:id/download` | PDF généré à la volée |

En-têtes de traçabilité : `X-Report-Reference`, `X-Report-Version`, `X-Report-Hash`,
`X-Versioning: in-place|cloned`, `Content-Disposition: attachment; filename="navigarde-<ref>-v<n>.pdf"`.

### PDF

- En-tête officiel (bandeau, unité, adresse), référence et version en clair.
- Métadonnées administratives sur deux colonnes, bandeau de synthèse (total / critiques / majeures / mineures).
- Constatations numérotées : sévérité colorée, détail justifié, preuve en police monospace, confiance IA.
- **Sceau de souveraineté numérique** en pied de page : empreinte SHA-256 en monospace, URL de vérification, QR généré par `qrcode`, horodatage.
- Pagination, `Content-Type: application/pdf`, PDF parseable (titres PDF renseignés).
- `npm run test:smoke` → 34/34 : type MIME, signature `%PDF-`, parsing pdf-lib, versioning, 404/400.

## Vérifications


```
next build      → 21 routes statiques, 0 erreur TS
/  /uses  /services  /guestbook  /bucket-list  /links
/work/{atlas,relay,ledger,prism,signal}   /writing/{3 posts}
/search-index.json  /sitemap.xml (14 urls)  /robots.txt  /feed.xml (3 items)  /opengraph-image (png)
404 sur route inconnue
```

## Reste à faire (contenu, pas code)

- [ ] `lib/site.ts` : nom, email, ville, URL réelle, réseaux (`site.url` sert au sitemap/robots/OG)
- [ ] `lib/content.ts` : vrais projets et articles (`metrics`, `facets`, `links`)
- [ ] `lib/pages-content.ts` : uses, bucket list, liens
- [ ] `app/globals.css` : palette de marque (`--accent-*`), logo
- [ ] Couvertures projets via `next/image` (remplacer les dégradés de `work-section.tsx`)
- [ ] Guestbook : remplacer localStorage par une server action + base de données
- [ ] Domaine réel dans `metadataBase` (`app/layout.tsx`) avant mise en ligne
