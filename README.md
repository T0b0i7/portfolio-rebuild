# Scaffolding — portfolio-rebuild

Reproduction de l'**architecture** décrite dans `PLAN.md` (structure, animations, modèle de
données). Tout le contenu (nom, projets, articles, palette, logo) est un placeholder à remplacer.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production + génération statique
```

## Structure

```
app/
  layout.tsx                  shell, métadonnées, theme script anti-FOUC, palette
  page.tsx                    les 6 sections de la home (RSC)
  globals.css                 tokens CSS (clair/sombre), utilitaires
  search-index.json/route.ts  index de recherche statique (force-static)
  work/[slug]/page.tsx        page projet (SSG via generateStaticParams)
  writing/[slug]/page.tsx     page article (SSG)
components/
  site-header.tsx             nav sticky + bouton Search + toggle thème
  command-palette.tsx         palette ⌘K / Ctrl+K (fetch de l'index)
  theme-toggle.tsx            light → system → dark, persisté en localStorage
  parallax.tsx                publie --scroll / --pointer-x / --pointer-y sur <html>
  work-section.tsx            filtres + carrousel snap + "Go to <projet>"
  reveal-photo.tsx            bouton Reveal photo
  icon.tsx                    sprite SVG unique (<use href="/icons/sprite.svg#id">)
lib/
  content.ts                  modèle Project / Post + filtres (facettes)
  site.ts                     config de marque et de navigation
  search-index.ts             projection des données vers l'index de recherche
public/icons/sprite.svg       sprite d'icônes
```

## Correspondance avec PLAN.md

| Exigence | Implémentation |
|---|---|
| Next.js 16 App Router, RSC | `app/` en server components, seuls les interactifs sont `"use client"` |
| CSS | Tailwind v4 + tokens `@theme inline` sur variables CSS (clair/sombre) |
| Thème `dark:` | `@custom-variant dark` piloté par `.dark` + script inline avant peinture |
| Fonts self-hosted | ⚠️ non fait — piles système ; remplacer par `next/font/local` avec les woff2 |
| Images AVIF | `next.config.ts` → `images.formats` (aucune image réelle pour l'instant) |
| Sprite SVG unique | `public/icons/sprite.svg` + `<Icon />` |
| `/search-index.json` | route handler `force-static` consommé par la palette |
| Filtres ALL…UK | `filters` dans `lib/content.ts`, état dans `work-section.tsx` |
| Parallax scroll + souris | `components/parallax.tsx` + utilitaire `.parallax` avec `--depth` |
| Reveal photo | `components/reveal-photo.tsx` |
| Anti-copie | contenu 100 % placeholder |

## Reste à faire

- [ ] Contenu réel : `lib/content.ts` (projets, articles), `lib/site.ts` (nom, email, liens)
- [ ] Palette de marque : variables `--accent-*` dans `app/globals.css`
- [ ] Fonts locales + logo + images de couverture (`next/image`)
- [ ] Toggle de tarifs à chiffres roulants — interaction présente sur le site source mais **sans section de tarifs** dans `outline.md` : à rattacher à une future section services
- [ ] Liste `uses`, guestbook, bucket list (pages `/uses`, `/guestbook` dans le footer source)
- [ ] Scroll-reveal par IntersectionObserver (actuellement animation d'entrée CSS uniquement)
