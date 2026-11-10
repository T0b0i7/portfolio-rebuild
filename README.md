# portfolio-rebuild

[![CI](https://github.com/T0b0i7/portfolio-rebuild/actions/workflows/ci.yml/badge.svg)](https://github.com/T0b0i7/portfolio-rebuild/actions/workflows/ci.yml)
[![Deploy](https://github.com/T0b0i7/portfolio-rebuild/actions/workflows/deploy.yml/badge.svg)](https://github.com/T0b0i7/portfolio-rebuild/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)

Template de portfolio **open source**, prêt à déployer sur **GitHub Pages**. Un site entièrement
statique — aucune base de données, aucun serveur — avec une navigation rapide, une recherche au
clavier et un **mode sombre** déclenché par une icône qui bascule de l'écran au croissant de lune.

Site de démonstration : **https://t0b0i7.github.io/portfolio-rebuild/**

---

## Sommaire

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack](#stack)
- [Démarrer](#démarrer)
- [Mode sombre](#mode-sombre)
- [Personnaliser le template](#personnaliser-le-template)
- [Structure du projet](#structure-du-projet)
- [Déploiement GitHub Pages](#déploiement-github-pages)
- [CI/CD](#cicd)
- [SEO, performance et accessibilité](#seo-performance-et-accessibilité)
- [Scripts](#scripts)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Aperçu

Un portfolio complet, pensé pour être dupliqué puis personnalisé en quelques minutes :

- **6 sections sur la page d'accueil** : introduction, projets, profil, articles, contact, footer.
- **Pages secondaires** : `/uses`, `/services`, `/guestbook`, `/bucket-list`, `/links`.
- **Pages de détail** générées statiquement pour chaque projet (`/work/[slug]`) et chaque article
  (`/writing/[slug]`).
- **Recherche instantanée** (`⌘K` / `Ctrl K` ou `/`) alimentée par un index JSON statique.
- **Build 100 % statique** exporté dans `out/` : aucun runtime Node en production.
- **CI/CD GitHub Actions** : vérification TypeScript + build à chaque push/PR, déploiement
  automatique sur GitHub Pages depuis `master`.
- **Mode sombre** accessible en un clic, mémorisé dans le navigateur, sans flash au chargement.

Tout le contenu (nom, projets, articles, liens, palette) est factice : remplacez-le par le vôtre.
Le design et le code peuvent être réutilisés librement sous licence MIT.

## Fonctionnalités

| Fonctionnalité | Détails |
|---|---|
| Rendu statique | `output: "export"`, 21 routes prérendues, hébergement sans serveur |
| App Router / RSC | Server Components par défaut, interactivité isolée en `"use client"` |
| Recherche `⌘K` | Palette accessible au clavier, résultats groupés, fermeture `Échap`, verrouillage du scroll |
| Filtres projets | 8 filtres, carrousel à défilement aimanté, navigation précédent/suivant, `aria-live` |
| Parallax | Scroll + pointeur via `requestAnimationFrame`, désactivé si `prefers-reduced-motion` |
| Reveal au scroll | `IntersectionObserver`, fallback CSS sans JavaScript |
| Tarifs animés | Bascule mensuel/annuel avec chiffres roulants (`/services`) |
| Copie d'email | Presse-papiers + confirmation accessible |
| Guestbook local | Formulaire persistant dans `localStorage` (aucun backend requis) |
| Thème clair/sombre | Icône écran ↔ lune, préférence système par défaut, choix mémorisé |
| SEO | `sitemap.xml`, `robots.txt`, flux RSS, image Open Graph générée, balises canoniques |
| Typographie | Inter + JetBrains Mono auto-hébergées via `next/font` (zéro appel à Google) |
| Icônes | Sprite SVG unique (`public/icons/sprite.svg`), chargé à la demande |

## Stack

- **Next.js 16** (App Router, Turbopack, static export)
- **React 19**
- **TypeScript** strict
- **Tailwind CSS v4** avec tokens `oklch` et `@theme inline`
- **GitHub Actions** pour la CI et le déploiement GitHub Pages

Prérequis : **Node.js ≥ 20.9** et npm.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # vérification TypeScript (tsc --noEmit)
npm run build      # export statique dans ./out
npm run preview    # sert ./out en local (npx serve out)
```

Le build de production ne nécessite aucune variable d'environnement en local : le site est servi à
la racine (`http://localhost:3000`).

## Mode sombre

Le thème se change avec **une seule icône dans l'en-tête** :

- en mode clair, l'icône affiche un **écran d'ordinateur** (`monitor`) ;
- en mode sombre, elle affiche un **croissant de lune** (`moon`) ;
- un clic bascule de l'un à l'autre, avec un état `aria-pressed` et un libellé dynamique.

Fonctionnement :

1. **Aucune préférence enregistrée** → le site suit le thème du système d'exploitation
   (`prefers-color-scheme`) et reste synchronisé si l'OS change.
2. **Clic sur l'icône** → la classe `.dark` ou `.light` est appliquée sur `<html>` et le choix est
   stocké dans `localStorage` (clé `theme`).
3. **Au chargement suivant** → un court script inline dans `<head>` applique la classe avant le
   premier rendu : pas de flash clair avant l'hydratation.

Les couleurs vivent dans `app/globals.css` sous forme de tokens `oklch` :

```css
:root { --bg: var(--l-bg); --fg: var(--l-fg); /* ... */ }
:root.dark { color-scheme: dark; --bg: var(--d-bg); /* ... */ }
@media (prefers-color-scheme: dark) { :root:not(.light) { /* ... */ } }
```

Pour changer la palette, modifiez `--l-*` (clair) et `--d-*` (sombre).

## Personnaliser le template

| Fichier | Contenu à remplacer |
|---|---|
| `lib/site.ts` | Nom, rôle, email, ville, URL publique, réseaux sociaux, stack |
| `lib/content.ts` | Projets (`metrics`, `facets`, `links`) et articles |
| `lib/pages-content.ts` | Contenus de `/uses`, `/bucket-list`, seed du guestbook, liens |
| `app/globals.css` | Palette de marque (`--l-accent-*`, `--d-accent-*`) |
| `public/icons/sprite.svg` | Icônes (recherche, lune, écran, flèches, copie, check) |
| `app/layout.tsx` | Polices, métadonnées par défaut, `metadataBase` |
| `components/work-section.tsx` | Couvertures projets (dégradés à remplacer par `next/image`) |

Après avoir forké :

1. mettez à jour `site.url` et `site.repo` dans `lib/site.ts` ;
2. remplacez les textes et visuels factices ;
3. faites pointer `metadataBase` (via `site.url`) vers votre domaine ou votre URL GitHub Pages.

## Structure du projet

```
app/
  layout.tsx                  métadonnées, next/font, script anti-FOUC, noscript
  page.tsx                    sections de la page d'accueil (RSC)
  globals.css                 tokens oklch clair/sombre, @theme inline, utilitaires
  not-found.tsx               404
  opengraph-image.tsx         image Open Graph générée (1200×630)
  sitemap.ts / robots.ts      SEO statique
  feed.xml/route.ts           flux RSS statique
  search-index.json/route.ts  index de recherche statique
  uses/ services/ guestbook/ bucket-list/ links/
  work/[slug]/page.tsx        page projet (SSG + generateMetadata)
  writing/[slug]/page.tsx     page article (SSG + generateMetadata)
components/
  site-header.tsx             navigation sticky + recherche + toggle de thème
  theme-toggle.tsx            bascule clair/sombre (écran ↔ lune)
  command-palette.tsx         palette ⌘K / Ctrl K / "/"
  parallax.tsx                parallax scroll + pointeur (reduced-motion aware)
  reveal.tsx                  révélation au scroll
  work-section.tsx            filtres, carrousel, navigation projets
  pricing-toggle.tsx          bascule mensuel/annuel avec chiffres roulants
  copy-email.tsx              copie de l'email dans le presse-papiers
  reveal-photo.tsx            révélation de la photo de profil
  guestbook.tsx               formulaire persisté en localStorage
  page-shell.tsx              en-tête commun des pages secondaires
  icon.tsx                    <use href=".../sprite.svg#id">
lib/
  site.ts                     marque, navigation, pages, réseaux, stack
  content.ts                  modèle Project / Post + facettes de filtre
  pages-content.ts            contenus des pages secondaires
  search-index.ts             projection des données vers l'index de recherche
public/
  icons/sprite.svg            sprite SVG unique
  .nojekyll                   désactive Jekyll sur GitHub Pages
.github/workflows/
  ci.yml                      lint + build sur push et pull request
  deploy.yml                  build et publication sur GitHub Pages
```

## Déploiement GitHub Pages

Le projet est configuré pour un hébergement **entièrement statique** sur GitHub Pages.

### 1. Activer Pages

Dans le dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

Aucune branche `gh-pages` n'est nécessaire : le workflow `deploy.yml` construit `out/` puis publie
l'artefact avec `actions/deploy-pages`.

### 2. URLs et base path

Le workflow détecte automatiquement le type de site :

- **Site projet** (`https://<user>.github.io/<repo>/`) → `NEXT_PUBLIC_BASE_PATH=/<repo>` ;
- **Site utilisateur** (`https://<user>.github.io/`) → aucun base path.

En local, laissez `NEXT_PUBLIC_BASE_PATH` vide. Pour reproduire le build Pages à la main :

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/portfolio-rebuild"; npm run build
# macOS / Linux
NEXT_PUBLIC_BASE_PATH=/portfolio-rebuild npm run build
```

Le préfixe est appliqué aux pages, aux assets `_next`, au sprite d'icônes et à l'index de
recherche. Si votre dépôt s'appelle `<user>.github.io`, n'utilisez aucun base path.

### 3. Domaine personnalisé

1. ajoutez un fichier `public/CNAME` contenant votre domaine ;
2. configurez le DNS (enregistrement `CNAME` vers `<user>.github.io`) ;
3. mettez à jour `site.url` avec `https://votre-domaine.com` ;
4. laissez `NEXT_PUBLIC_BASE_PATH` vide.

### 4. Vérifier en local

```bash
npm run build
npx serve out        # ou : npm run preview
```

## CI/CD

Deux workflows GitHub Actions vivent dans `.github/workflows/` :

| Workflow | Déclencheur | Rôle |
|---|---|---|
| `ci.yml` | push sur `master`, pull requests | `npm ci` → `tsc --noEmit` → `next build` |
| `deploy.yml` | push sur `master`, lancement manuel | build statique → upload de `out/` → publication Pages |

Points clés :

- Node.js 22 avec cache npm ;
- permissions minimales (`contents: read`, `pages: write`, `id-token: write`) ;
- concurrence limitée pour éviter deux déploiements simultanés ;
- `touch out/.nojekyll` pour que GitHub Pages serve les dossiers `_next` ;
- environnement `github-pages` avec l'URL publiée en sortie.

Un pull request cassé bloque donc le merge ; un push sur `master` déploie automatiquement.

## SEO, performance et accessibilité

- **SEO** : `sitemap.xml` et `robots.txt` générés au build, URL canonique, Open Graph + Twitter
  Card, image OG générée en PNG, flux RSS des articles.
- **Performance** : pages prérendues, polices auto-hébergées en `woff2`, images non optimisées
  (contrainte du static export) mais formats AVIF/WebP déclarés, JavaScript client limité aux
  composants interactifs.
- **Accessibilité** : lien d'évitement, navigation clavier complète, `aria-*` sur les contrôles,
  `aria-live` pour les mises à jour, focus visible, respect de `prefers-reduced-motion`,
  contrastes issus des tokens `oklch`.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | serveur de développement Next.js |
| `npm run build` | build de production + export statique dans `out/` |
| `npm run preview` | sert le dossier `out/` localement |
| `npm run lint` | vérification TypeScript (`tsc --noEmit`) |

## Contribuer

Les contributions sont bienvenues :

1. forkez le dépôt et créez une branche (`feat/...`, `fix/...`) ;
2. lancez `npm run lint` et `npm run build` avant de pousser ;
3. ouvrez une pull request en décrivant le changement et son impact visuel.

Les bugs et idées se discutent dans les issues du dépôt.

## Licence

Distribué sous [licence MIT](./LICENSE). Vous pouvez l'utiliser, le modifier et le redistribuer,
y compris pour un usage commercial, en conservant la mention de copyright.
