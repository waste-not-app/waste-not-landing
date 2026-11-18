# WasteNot Landing Page

Landing page publik untuk aplikasi Android WasteNot, dibangun dengan React 19, TypeScript, dan Vite 8. Tampilan mengikuti [DESIGN.md](https://github.com/waste-not-app/waste-not-android/blob/main/docs/design-kit/DESIGN.md) dari repo Android. Pratinjau ponsel memakai data ilustrasi, dan halaman membedakan fitur yang sudah tersedia dari yang masih direncanakan.

**URL publik:** <https://waste-not.bccdev.id/>

## Pengembangan

Prasyarat: Node.js 22.12+ (lihat `.nvmrc`, disarankan 24) dan npm.

```sh
make install   # npm ci
make dev       # Vite dev server
make check     # format, lint, audit, type-check, build
```

| Target / script | Fungsi |
|---|---|
| `make dev` / `npm run dev` | Dev server dengan HMR |
| `make build` / `npm run build` | Type-check (`tsc -b`) lalu build ke `dist/` |
| `make fmt` / `npm run format` | Format dengan Prettier |
| `make lint` / `npm run lint` | ESLint (typescript-eslint, react-hooks) |
| `make audit` | `npm audit` level high ke atas |
| `make check` / `npm run check` | Gate kualitas lengkap |

Vite memakai base path `/`. Font Plus Jakarta Sans disimpan lokal di `public/fonts/` beserta lisensi OFL. Data unduhan APK diambil dari `/apk/versions.json` pada origin yang sama.

## Docker

```sh
make up     # build image lalu sajikan di http://127.0.0.1:8081
make down
```

Image produksi dibangun multi-stage: Node 24 untuk build, lalu `nginx-unprivileged` (port 8080, nonroot, filesystem read-only). Konfigurasi di `deploy/nginx.conf` mengatur fallback SPA, cache jangka panjang untuk `/assets/`, endpoint `/healthz`, dan header keamanan di `deploy/security-headers.conf` (CSP ketat tanpa script inline, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). Gunakan header yang sama pada Nginx staging.

## CI/CD

- **CI** (`.github/workflows/ci.yml`) berjalan di setiap push dan pull request pada runner self-hosted `landing`: `npm ci`, `npm audit`, lalu `npm run check`.
- **CD** (`.github/workflows/deploy.yml`) hanya berjalan setelah CI di `main` sukses. Build dan publikasi berada dalam satu job, lalu `rsync` ke `/var/www/wastenot-landing/` dan memeriksa `index.html` serta `privacy/index.html`. Tidak ada secret yang dibutuhkan karena runner berada di host yang sama dengan Nginx.
- Dependabot memperbarui npm, GitHub Actions, dan base image setiap minggu.

## Nginx staging dan APK

Konfigurasi Nginx berada di `alberd-staging` pada `/etc/nginx/sites-available/waste-not`. Pipeline Android mengelola `/var/www/wastenot-apk/`. Landing membaca `/apk/versions.json` dan mengunduh `/apk/latest.apk`; versi tertentu tersedia di `/apk/wastenot-v<VERSION>.apk`.

Untuk halaman `/apk/`, gunakan lokasi exact dengan root distribusi:

```nginx
location = /apk/ {
    root /var/www/wastenot-apk;
    try_files /index.html =404;
}
```

Jangan memakai alias langsung ke file `index.html` pada URI yang berakhiran `/`, karena modul index Nginx dapat membentuk `index.htmlindex.html` dan menghasilkan HTTP 500. Jalankan `sudo nginx -t` sebelum reload, lalu pastikan `/apk/` mengembalikan HTML 200, `/apk/versions.json` memuat versi terbaru, dan `download_url` mengunduh APK.

## Kebijakan privasi publik

`public/privacy/index.html` disalin Vite apa adanya ke `dist/privacy/index.html`, sehingga URL kanonisnya adalah <https://waste-not.bccdev.id/privacy/>. Halaman ini HTML mandiri, tanpa router SPA, JavaScript, dependensi baru, formulir, atau pelacak. Font dan favicon memakai aset WasteNot yang sudah tersedia. Setelah deploy, pastikan `/privacy/` mengembalikan dokumen kebijakan, bukan fallback landing SPA.

Isi bertanggal 16 November 2026 menjelaskan penyimpanan akun/catatan di PostgreSQL, penyimpanan privat foto lampiran, cache scan Android, Room/outbox/draf lokal, token Android Keystore, notifikasi opsional, dan pencarian alamat eksternal tanpa izin lokasi. Foto scan tidak disamakan dengan lampiran permanen. Payload rekomendasi Google Gemini berisi konteks objek dan evidence panduan, bukan foto/nama/email/riwayat akun. Retensi provider tidak diasumsikan nol, dan status billing/provider tidak dijadikan klaim pelatihan atau kepatuhan.

Dasar implementasi pada repositori terkait:

- Android: `AndroidManifest.xml`, `data/local/ActivityDatabase.kt`, `LocalEditorDraftStore.kt`, `KeystoreRefreshTokenStore.kt`, `ScanPhotoCache.kt`, `AttachmentImagePreparer.kt`, serta alur penghapusan akun.
- Backend: `internal/modules/ai/service.go` dan `repository.go` (normalisasi scan, snapshot operasi, kedaluwarsa), `internal/modules/photos/` (normalisasi dan penyimpanan lampiran privat), `internal/modules/logs/repository.go` (soft delete), `internal/database/database.go` (pemeliharaan), serta alur penghapusan akun dan antrean pembersihan foto.
- AI: `src/wastenot_ai/providers.py` (Google Gemini, payload teks), `src/wastenot_ai/recommendation.py` (proyeksi konteks dan pemilihan evidence). [Ketentuan Gemini API](https://ai.google.dev/gemini-api/terms) dan [privasi Google](https://policies.google.com/privacy) tetap berlaku pada pemrosesan provider.
- Kontak publik pengelola: [Oktavianus Samuel Minarto](https://github.com/oktavsm), `oktaavsm@student.ub.ac.id`, sesuai identitas publik yang dikonfirmasi. Tidak mengklaim alamat ini sebagai sistem tiket atau menjanjikan waktu balasan.

Penghapusan database aktif dan pencabutan sesi dibedakan dari pembersihan berkas fisik yang dapat tertunda dan dicoba ulang. Tidak ada janji penghapusan cadangan/arsip lama atau batas retensi universal yang belum diverifikasi. Email reset membutuhkan SMTP yang benar-benar tersedia; halaman tidak menyatakan pengiriman email sudah beroperasi. Ini dokumentasi pemrosesan aktual, bukan persetujuan hukum atau sertifikasi.

Arah visual mengikuti situs yang ada: pinus untuk identitas dan tautan, bidang lime hanya untuk ringkasan penting, Plus Jakarta Sans lokal untuk kesinambungan merek. Satu kolom berukuran baca menjaga teks panjang pada ponsel; heading dan jarak memisahkan topik tanpa deretan kartu promosi. Tema mengikuti preferensi sistem terang/gelap, fokus keyboard memiliki outline, tautan navigasi berukuran sentuh, dan tidak ada animasi. Design read: kebijakan layanan untuk pengguna WasteNot, utilitarian ramah, ENERGY 1 / RHYTHM 1 / MOTION 1.

Verifikasi lokal: `npm run build` lulus; browser membuka kebijakan melalui tautan footer, anchor isi valid, dan dokumen tidak meluber horizontal pada lebar 320 px gelap serta 390 px terang. Tidak ada error runtime browser. Verifikasi HTTP publik tetap diperlukan sesudah CD.
