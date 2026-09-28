# WasteNot Landing Page

Halaman landing untuk aplikasi Android WasteNot — personal 3R waste tracking dengan AI detection.

🌐 **Live:** https://oktaavsm.bccdev.id/wastenot-landing/  
📦 **Download APK:** https://oktaavsm.bccdev.id/wastenot/download  
🤖 **Repo Android:** https://github.com/waste-not-app/waste-not-android

---

## Stack

- **React 19** + **Vite 6** + **TypeScript**
- CSS Modules — no Tailwind, no external UI library
- Design system: WasteNot Design Kit (Pine/Lime palette, Plus Jakarta Sans)

## Development

```bash
npm install
npm run dev         # http://localhost:5173
npm run build       # output: dist/
npm run preview     # preview production build
```

## Deployment

Otomatis via GitHub Actions saat push ke `main`:

1. Build `dist/`
2. `rsync dist/` ke VM `dev@proxy.bccdev.id:/var/www/wastenot-landing/`
3. Nginx serve di `oktaavsm.bccdev.id/wastenot-landing/`

### Required Secret

| Secret Name | Value |
|---|---|
| `DEPLOY_SSH_KEY` | Private key yang sudah di-authorize di VM (`~/.ssh/wastenot_deploy_key`) |

> Secret ini sama dengan yang sudah dipakai di `waste-not-android` repo.

## Design System

Mengikuti `docs/design-kit/DESIGN.md` dari [waste-not-android](https://github.com/waste-not-app/waste-not-android):

- **Warna primary:** `#195B3D` (Pine)
- **Aksen progres:** `#D2EF69` (Lime)  
- **Font:** Plus Jakarta Sans (400–800)
- **Glass dock:** backdrop-filter blur 16px
