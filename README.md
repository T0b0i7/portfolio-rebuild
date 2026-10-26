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
  theme-toggle.tsx            light → system → dark persisté + écoute prefers-color-scheme
                              (bootstrap anti-FOUC dans public/theme-init.js, pas en inline)
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
public/theme-init.js          bootstrap de thème (externe : immunisé contre l'injection d'extensions)
```

## Correspondance avec PLAN.md

| Exigence | État | Implémentation |
|---|---|---|
| Next.js 16 App Router, RSC | ✅ | `app/` en server components, interactif isolé en `"use client"` |
| CSS | ✅ | Tailwind v4 + tokens `@theme inline` sur variables CSS oklch |
| Thème `dark:` | ✅ | `@custom-variant dark` piloté par `.dark` + `public/theme-init.js` chargé en `<head>` avant peinture |
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
