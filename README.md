# WasteNot Landing

**The public website and privacy policy for the WasteNot Android app.**

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node 24](https://img.shields.io/badge/Node-24-5FA04E?logo=nodedotjs&logoColor=white)
![nginx](https://img.shields.io/badge/served%20by-nginx--unprivileged-009639?logo=nginx&logoColor=white)

This is the website for WasteNot, an app for logging household waste as Reduce, Reuse, Recycle, or Trash. It walks visitors through the app with sample data, keeps shipped features apart from planned ones, and links to the latest APK. It also hosts the privacy policy.

Live site: <https://waste-not.bccdev.id/>

## Contents

- [Features](#features)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Docker](#docker)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Privacy policy](#privacy-policy)
- [Related repositories](#related-repositories)

## Features

The site is a single page with a hero, an interactive phone demo, benefits, an about section, and a download section, all in English. The download card reads release metadata from `/apk/versions.json` on the same origin and links to `/apk/latest.apk`.

It follows the WasteNot design system v1.3 and serves Plus Jakarta Sans itself, with the font's OFL license in `public/fonts/`. The privacy policy at `/privacy/` is a standalone static page with no JavaScript, forms, or trackers.

Security headers are strict: the Content Security Policy allows no inline scripts, and the site also sends `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.

The page follows the system's light or dark theme, shows a visible focus ring for keyboard users, and keeps navigation targets large enough to tap.

## Getting started

You'll need Node.js 22.12 or later (24 is recommended; see `.nvmrc`) and npm.

```sh
make install   # npm ci
make dev       # start the Vite dev server
make check     # format check, lint, audit, type-check, and build
```

## Scripts

| Make target | npm script | Purpose |
|---|---|---|
| `make dev` | `npm run dev` | Dev server with hot module replacement |
| `make build` | `npm run build` | Type-check with `tsc -b`, then build into `dist/` |
| `make preview` | `npm run preview` | Serve the production build locally |
| `make fmt` | `npm run format` | Format with Prettier |
| `make lint` | `npm run lint` | Lint with ESLint (typescript-eslint and react-hooks) |
| `make audit` | | Fail on high or critical npm advisories |
| `make check` | `npm run check` | Full quality gate |

## Docker

```sh
make up     # build the image and serve it at http://127.0.0.1:8081
make down
```

The production image is built in two stages. Node 24 builds the site, then `nginx-unprivileged` serves it on port 8080 as a nonroot user. [`deploy/nginx.conf`](deploy/nginx.conf) sets up the SPA fallback, long-lived caching for `/assets/`, a `/healthz` endpoint, and the shared headers in [`deploy/security-headers.conf`](deploy/security-headers.conf). Use the same headers on the staging Nginx.

## Project structure

```
waste-not-landing/
├── src/
│   ├── App.tsx              Page sections and components
│   ├── main.tsx             React entrypoint
│   └── styles/              Design tokens and global styles
├── public/
│   ├── fonts/               Self-hosted Plus Jakarta Sans and its license
│   ├── images/              Optimized WebP artwork and favicons
│   ├── privacy/index.html   Standalone privacy policy
│   └── scroll-restoration.js
├── deploy/                  Nginx and security header configuration
├── Dockerfile               Multi-stage production image
└── compose.yaml             Local production preview
```

## Deployment

CI (`.github/workflows/ci.yml`) runs on every push and pull request: `npm ci`, then `npm audit`, then `npm run check`.

CD (`.github/workflows/deploy.yml`) only runs after CI passes on `main`. One job builds the site, copies `dist/` to `/var/www/wastenot-landing/` with `rsync`, and checks that `index.html` and `privacy/index.html` made it. The runner lives on the web host, so the deployment needs no secrets.

Dependabot keeps npm packages, GitHub Actions, and base images up to date each week.

### APK distribution

The Android release pipeline owns `/var/www/wastenot-apk/`:

| URL | Content |
|---|---|
| `/apk/versions.json` | Release metadata |
| `/apk/latest.apk` | Latest build |
| `/apk/wastenot-v<VERSION>.apk` | A specific version |

Serve the `/apk/` index with an exact location and a root, not an alias:

```nginx
location = /apk/ {
    root /var/www/wastenot-apk;
    try_files /index.html =404;
}
```

If an `alias` points straight at `index.html` on a URI that ends in `/`, Nginx builds the path `index.htmlindex.html` and returns HTTP 500.

Run `sudo nginx -t` before you reload. Afterwards, check that `/apk/` returns HTML with a 200, that `/apk/versions.json` lists the newest version, and that its `download_url` actually downloads the APK.

## Privacy policy

Vite copies `public/privacy/index.html` unchanged to `dist/privacy/index.html`, so the policy lives at <https://waste-not.bccdev.id/privacy/>. After each deployment, make sure `/privacy/` shows the policy and not the SPA fallback.

The policy describes what the app really does with data. Accounts and logs are stored in PostgreSQL, and photo attachments sit in private storage. On the phone, drafts and the outbox stay local, and the Android Keystore protects the refresh token. Scan photos are cached for a short time and never become attachments. Requests to Google Gemini carry only object context and guide evidence, never photos or account details. Deleting an account removes active data right away, while cleanup of the physical files may be retried later.

Update the policy whenever the Android app, the backend, or the AI workers change what they collect or how long they keep it.

## Related repositories

| Repository | Description |
|---|---|
| [waste-not-android](https://github.com/waste-not-app/waste-not-android) | Android client |
| [waste-not-backend](https://github.com/waste-not-app/waste-not-backend) | REST API |
| [waste-not-ai](https://github.com/waste-not-app/waste-not-ai) | Detection and recommendation workers |
