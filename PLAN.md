# Plan de build — portfolio

Analyse REA (`inspect_web_page` + `analyze_web_bundle`) sur <https://aayushbharti.in/>.
Ce document décrit une **architecture à reproduire**, pas un contenu à copier.

## Stack observée (avec preuves)

| Couche | Constat | Preuve |
|---|---|---|
| Framework | Next.js 16 App Router, Turbopack | `inferences[].vendor_fingerprint` = Next.js (high) |
| UI | React 19 | fingerprint React (medium) |
| Rendu | RSC, payload inline `__next_f.push` | 23 scripts, `application_routes: unknown` |
| CSS | CSS Modules hachés, 547 Ko / 4 feuilles | `resources[] type=Stylesheet` |
| Fonts | 4 woff2 self-hosted | convention `next/font` |
| Images | `next/image` → AVIF, `?url=…&w=…&q=75` | `resources[] type=Image` |
| Icônes | un seul sprite SVG | `/icons/sprite.svg?v=…` |
| Recherche | `/search-index.json` via `fetch` | `observations.endpoints[0]` |

## Ordre des sections (voir `outline.md`)

1. Introduction — `region[Introduction]`, un seul `h1`
2. Nav sticky — marque + 4 entrées de parcours
3. Curated work — `h2`, cartes projet en `h3`, filtres
4. Profil — `h2`, texte + compétences
5. Thoughts & writings — `h2`, 3 cartes d'article
6. Explore & contact — `h2`, 2 CTA
7. Footer — 3 colonnes `h2` (WORK / SITE / SOCIAL)

## Interactif à réimplémenter

- Filtres projet : `ALL / FRONTEND / BACKEND / AI / TOOLS / LOCAL / US / UK`
- Carrousel projet : boutons `Go to <projet>`
- Palette de recherche : `Search (⌘K)` / `Ctrl+K` selon plateforme
- Parallax pilotée scroll **et** souris
- Toggle de tarifs à chiffres roulants
- Icônes via `<use href="/icons/sprite.svg#…">`
- Thème clair/sombre par variantes `dark:`

## À ne pas reprendre

Nom, photo, copy, articles, captures de projets, palette et logo.
Reprends la **structure**, les **techniques d'animation**, le **modèle de données**.
