# WasteNot landing page

Landing page publik untuk WasteNot Android. Tampilan mengikuti [`DESIGN.md`](../wastenot-android/docs/design-kit/DESIGN.md) dan [`design-system.html`](../wastenot-android/docs/design-kit/design-system.html); pratinjau ponsel memakai data ilustrasi. APK saat ini masih build awal berisi kerangka aplikasi, sehingga halaman membedakan fitur yang direncanakan dari fitur yang sudah tersedia.

**URL publik:** https://oktaavsm.bccdev.id/wastenot-app/

## Pengembangan

```bash
npm ci
npm run dev
npm run build
```

Vite memakai base path `/wastenot-app/`. Font Plus Jakarta Sans disimpan lokal di `public/fonts/` beserta lisensi OFL.

## Deploy

Push ke `main` menjalankan `.github/workflows/deploy.yml`, membangun `dist/`, lalu mengunggahnya ke `/var/www/wastenot-landing/`. Nginx menyajikan folder tersebut di `/wastenot-app/`. APK dan `versions.json` tetap dihasilkan oleh pipeline Android di `/var/www/wastenot/`, lalu disajikan di bawah prefix publik yang sama:

- `/wastenot-app/download`
- `/wastenot-app/versions.json`
- `/wastenot-app/apk/<nama-rilis>.apk`

Konfigurasi Nginx berada di server `pg-bcc` pada `/etc/nginx/sites-available/oktaavsm`. Rute publik lama `/wastenot/` dan `/wastenot-landing/` dialihkan ke halaman baru.
