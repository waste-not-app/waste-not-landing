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
CI pull request juga memakai runner self-hosted berlabel `landing`, sehingga build check tidak bergantung pada kuota runner GitHub-hosted.

Pipeline Android mengelola `/var/www/wastenot-apk/`. Landing membaca `/apk/versions.json` dan mengunduh `/apk/latest.apk`. File versi tertentu tersedia di `/apk/wastenot-v<VERSION>.apk`; subfolder filesystem `apk/` tidak diulang dalam URL.

Konfigurasi Nginx berada di `alberd-staging` pada `/etc/nginx/sites-available/waste-not`. Frontend lama di `pg-bcc` mengalihkan pengguna ke domain baru.

Untuk halaman `/apk/`, gunakan lokasi exact dengan root distribusi:

```nginx
location = /apk/ {
    root /var/www/wastenot-apk;
    try_files /index.html =404;
}
```

Jangan memakai alias langsung ke file `index.html` pada URI yang berakhiran `/`:
modul index Nginx dapat membentuk `index.htmlindex.html` dan menghasilkan HTTP 500.
Setelah perubahan, jalankan `sudo nginx -t` sebelum reload. Verifikasi `/apk/`
mengembalikan HTML 200, `/apk/versions.json` memuat versi terbaru, dan tautan
`download_url` mengunduh APK, bukan halaman HTML.

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
