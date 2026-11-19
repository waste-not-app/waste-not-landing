# WasteNot Landing

**The public website and privacy policy for the WasteNot Android app.**

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node 24](https://img.shields.io/badge/Node-24-5FA04E?logo=nodedotjs&logoColor=white)
![nginx](https://img.shields.io/badge/served%20by-nginx--unprivileged-009639?logo=nginx&logoColor=white)

The site introduces WasteNot, a mobile app for logging household waste through Reduce, Reuse, Recycle, and Trash. It shows the app interface with illustrative data, separates shipped features from planned ones, and links to the latest APK. It also hosts the public privacy policy.

**Live site:** <https://waste-not.bccdev.id/>

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

- **Single-page site.** Hero, interface preview, benefits, about, and download sections, written in Indonesian for the app's audience.
- **APK download.** Reads release metadata from `/apk/versions.json` on the same origin and links to `/apk/latest.apk`.
- **Brand consistency.** Uses the WasteNot design system v1.3 and a self-hosted Plus Jakarta Sans font, with its OFL license, in `public/fonts/`.
- **Privacy policy.** A standalone static page at `/privacy/` with no JavaScript, forms, or trackers.
- **Strict security headers.**
  - A Content Security Policy that allows no inline scripts.
  - `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- **Accessibility.**
  - Follows the system light or dark theme.
  - Shows visible keyboard focus.
  - Uses touch-sized navigation targets.

## Getting started

Requirements: Node.js 22.12 or later (24 is recommended; see `.nvmrc`) and npm.

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

The production image is built in two stages: Node 24 builds the site, then `nginx-unprivileged` serves it on port 8080 as a nonroot user. [`deploy/nginx.conf`](deploy/nginx.conf) configures:

- the SPA fallback;
- long-lived caching for `/assets/`;
- a `/healthz` endpoint;
- the shared security headers in [`deploy/security-headers.conf`](deploy/security-headers.conf).

Apply the same headers on the staging Nginx.

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

- **CI** (`.github/workflows/ci.yml`) runs on every push and pull request. It installs dependencies with `npm ci`, runs `npm audit`, then runs `npm run check`.
- **CD** (`.github/workflows/deploy.yml`) runs only after CI succeeds on `main`. A single job builds the site and syncs `dist/` to `/var/www/wastenot-landing/` with `rsync`. It then verifies that `index.html` and `privacy/index.html` exist. The runner lives on the web host, so no deployment secrets are needed.
- **Dependabot** updates npm packages, GitHub Actions, and base images weekly.

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

An `alias` that points directly at `index.html` on a URI ending in `/` makes Nginx build `index.htmlindex.html` and return HTTP 500.

Run `sudo nginx -t` before reloading. After reloading, confirm three things:

1. `/apk/` returns HTML with status 200.
2. `/apk/versions.json` lists the newest version.
3. Its `download_url` downloads the APK.

## Privacy policy

Vite copies `public/privacy/index.html` unchanged to `dist/privacy/index.html`, so the canonical URL is <https://waste-not.bccdev.id/privacy/>. After each deployment, confirm that `/privacy/` serves the policy rather than the SPA fallback.

The policy describes how the app actually processes data:

- **Accounts and logs.** Stored in PostgreSQL. Photo attachments are kept in private storage.
- **On the device.** Room drafts and the outbox stay local, and refresh tokens are protected by the Android Keystore.
- **Scan photos.** Cached temporarily, not kept as attachments.
- **AI recommendations.** Requests to Google Gemini contain only object context and guide evidence, never photos or account details.
- **Account deletion.** Deleting an account removes active data immediately. Physical file cleanup may be retried later.

Update the policy whenever the Android app, the backend, or the AI workers change what they collect or how long they keep it.

## Related repositories

| Repository | Description |
|---|---|
| [waste-not-android](https://github.com/waste-not-app/waste-not-android) | Android client |
| [waste-not-backend](https://github.com/waste-not-app/waste-not-backend) | REST API |
| [waste-not-ai](https://github.com/waste-not-app/waste-not-ai) | Detection and recommendation workers |
