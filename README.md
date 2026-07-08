# React + Vite

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
