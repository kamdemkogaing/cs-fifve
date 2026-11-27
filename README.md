# FIFVE 2027

Site officiel du Week-End FIFVE 2027, construit avec React et Vite. Les vues
publiques sont bilingues (français/anglais) et s'appuient actuellement sur les
données locales de `src/data/fifveData.js`, encapsulées par
`src/services/publicDataService.js`. Cette couche est le point d'adaptation
prévu pour le futur service REST Java Spring Boot.

## Développement

```bash
npm install
npm run dev
npm run build
```

La page d'accueil présente le Top 5, les statistiques, les documents et le club
hôte. Le classement complet est disponible sur `/classement`; les équipes, la
programmation, le lieu et le module de classement sont accessibles sur
`/equipes`, `/programmation`, `/lieu` et `/module`. L'espace équipe et les
licences restent accessibles sur `/espace-cs` et `/licences`. Les pages
d'administration restent sous `/admin/login` et `/admin/dashboard`.
Le tableau de bord conserve ses outils existants et expose des écrans de
préparation pour les modules Éditions FIFVE, Organisation et Utilisateurs ;
ceux-ci ne modifient pas de données et attendent la future API.

Définir `VITE_API_BASE_URL` dans un fichier `.env.local` pour configurer la base
d'URL de l'API (voir `.env.example`). Aucune API ni base de données n'est créée
par le frontend.

## Application desktop

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Version desktop (installable Windows)

Cette application peut maintenant etre lancee comme application desktop et generee en installateur Windows.

### 1) Installer les dependances

```bash
npm install
```

### 2) Lancer en mode desktop (developpement)

```bash
npm run desktop:dev
```

### 3) Generer l'installateur Windows (.exe)

```bash
npm run desktop:build
```

Le script genere automatiquement une icone Windows a partir de:

```text
public/images/logo_fifve.jpeg
```

Fichiers icone produits:

```text
electron/assets/icon.png
electron/assets/icon.ico
```

Sortie par defaut:

```text
C:/temp/fifve-release/FIFVE Setup 0.0.0.exe
```

### 4) Generer seulement l'application non-installee

```bash
npm run desktop:pack
```

Sortie par defaut:

```text
C:/temp/fifve-release/win-unpacked
```

### 5) deployen

Nur lokal bauen : npm run build
Bauen und automatisch zu IONOS hochladen : npm run build:deploy
Nur zu IONOS hochladen : npm run deploy
