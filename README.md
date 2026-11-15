# WasteNot landing page

Landing page publik untuk WasteNot Android. Tampilan mengikuti [`DESIGN.md`](../wastenot-android/docs/design-kit/DESIGN.md) dan [`design-system.html`](../wastenot-android/docs/design-kit/design-system.html); pratinjau ponsel memakai data ilustrasi. APK saat ini masih build awal berisi kerangka aplikasi, sehingga halaman membedakan fitur yang direncanakan dari fitur yang sudah tersedia.

**URL publik:** https://waste-not.bccdev.id/

## Pengembangan

```bash
npm ci
npm run dev
npm run build
```

Vite memakai base path `/`. Font Plus Jakarta Sans disimpan lokal di `public/fonts/` beserta lisensi OFL.

## Deploy

Push ke `main` menjalankan `.github/workflows/deploy.yml` pada runner self-hosted landing di `alberd-staging`, membangun `dist/`, lalu menyalinnya ke `/var/www/wastenot-landing/`. Nginx menyajikan folder tersebut pada root domain.

Pipeline Android mengelola `/var/www/wastenot-apk/`. Landing membaca `/apk/versions.json` dan mengunduh `/apk/latest.apk`. File versi tertentu tersedia di `/apk/wastenot-v<VERSION>.apk`; subfolder filesystem `apk/` tidak diulang dalam URL.

Konfigurasi Nginx berada di `alberd-staging` pada `/etc/nginx/sites-available/waste-not`. Frontend lama di `pg-bcc` mengalihkan pengguna ke domain baru.
