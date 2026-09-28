import { useEffect, useState } from "react";
import "./styles/global.css";

type Release = { version: string; size: string; date: string };
const base = "/wastenot-app/";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path
            d="M5 17.5 12.5 25 27 7"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      WasteNot<span className="brand-dot">.</span>
    </span>
  );
}

function PhonePreview() {
  return (
    <div className="preview-wrap">
      <div className="preview-note">
        <span className="note-line" />
        Konsep antarmuka
      </div>
      <div
        className="phone"
        role="img"
        aria-label="Ilustrasi tampilan beranda WasteNot dengan data contoh"
      >
        <div className="phone-top">
          <span>9:41</span>
          <span aria-hidden="true">●●● ▰</span>
        </div>
        <div className="phone-body">
          <div className="app-heading">
            <div>
              <span className="app-overline">Senin, 28 September</span>
              <strong>Halo, selamat datang.</strong>
            </div>
            <span className="avatar">W</span>
          </div>
          <div className="summary-card">
            <span>Sudah kamu catat</span>
            <strong>
              650 <small>g</small>
            </strong>
            <span>Sampah ditangani hari ini</span>
            <div className="summary-rule" />
            <div className="summary-bottom">
              <span>Langkah kecil, tetap berarti.</span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
          <div className="app-section-title">
            <strong>Aktivitas terbaru</strong>
            <span>Hari ini</span>
          </div>
          <div className="activity">
            <span className="activity-icon" aria-hidden="true">
              ♧
            </span>
            <span>
              <strong>Botol plastik</strong>
              <small>Recycle · 250 g</small>
            </span>
            <span className="activity-time">09.24</span>
          </div>
          <div className="activity">
            <span className="activity-icon pale" aria-hidden="true">
              ♧
            </span>
            <span>
              <strong>Sisa makanan</strong>
              <small>Reuse · 400 g</small>
            </span>
            <span className="activity-time">08.10</span>
          </div>
          <div className="app-tip">
            <span aria-hidden="true">✦</span>
            <span>
              <strong>Kenali sebelum memilah</strong>
              <small>Panduan singkat untuk setiap material.</small>
            </span>
          </div>
        </div>
        <div className="app-dock">
          <span className="dock-active">
            ⌂<small>Beranda</small>
          </span>
          <span>
            ☷<small>Riwayat</small>
          </span>
          <span className="dock-add">＋</span>
          <span>
            ▥<small>Panduan</small>
          </span>
          <span>
            ▤<small>Statistik</small>
          </span>
        </div>
      </div>
      <div className="preview-caption">Konsep tampilan · data ilustrasi</div>
    </div>
  );
}

function ReleaseInfo() {
  const [release, setRelease] = useState<Release | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${base}versions.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Metadata rilis tidak tersedia");
        return response.json();
      })
      .then((data: { latest?: Release | null }) => {
        if (!data.latest || typeof data.latest.version !== "string")
          throw new Error("Belum ada rilis");
        setRelease(data.latest);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setState("error");
      });
    return () => controller.abort();
  }, []);
  return (
    <div className="release-info" aria-live="polite">
      {state === "loading" && "Memuat informasi rilis…"}
      {state === "error" && "Informasi versi belum dapat dimuat."}
      {state === "ready" &&
        release &&
        `Versi ${release.version} · ${release.size} · ${release.date}`}
    </div>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#atas" aria-label="WasteNot, kembali ke atas">
            <Brand />
          </a>
          <nav aria-label="Navigasi utama">
            <a href="#manfaat">Manfaat</a>
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#tentang">Tentang aplikasi</a>
          </nav>
          <a className="header-cta" href="#unduh">
            Build awal <Arrow diagonal />
          </a>
        </div>
      </header>
      <main id="main">
        <section className="hero" id="atas">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="eyebrow-dot" /> WASTENOT UNTUK ANDROID · DALAM
                PENGEMBANGAN
              </p>
              <h1>
                Kebiasaan baik dimulai dari <em>satu catatan.</em>
              </h1>
              <p className="hero-lede">
                Kami sedang membangun ruang untuk mencatat sampah yang kamu
                tangani, memahami pilihan 3R, dan melihat kebiasaanmu dari hari
                ke hari.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#manfaat">
                  Jelajahi konsepnya <Arrow diagonal />
                </a>
                <a className="text-link" href="#unduh">
                  Lihat build awal <Arrow />
                </a>
              </div>
              <p className="hero-footnote">
                Pratinjau di samping adalah rancangan, bukan tampilan APK saat
                ini.
              </p>
            </div>
            <PhonePreview />
          </div>
        </section>
        <section className="intro-band" aria-label="Alur WasteNot">
          <div className="container intro-inner">
            <span>CATAT</span>
            <i aria-hidden="true">→</i>
            <span>PAHAMI</span>
            <i aria-hidden="true">→</i>
            <span>LANJUTKAN</span>
            <p>Satu alur sederhana untuk kebiasaan yang lebih sadar.</p>
          </div>
        </section>
        <section className="section benefits" id="manfaat">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">ARAH PRODUK</p>
              <h2>Lebih mudah peduli saat semuanya terasa jelas.</h2>
              <p>Tiga kemampuan inti ini menjadi arah pengembangan WasteNot.</p>
            </div>
            <div className="benefit-grid">
              <article className="benefit-card">
                <span className="card-index">01 / CATAT</span>
                <div className="benefit-symbol">
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path
                      d="M13 11h22v29H13zM19 19h10M19 26h10M19 33h6M18 7h12v7H18z"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Catat tanpa repot.</h3>
                <p>
                  Alur yang dirancang akan memuat material, jumlah atau berat,
                  dan cara penanganan dalam satu catatan.
                </p>
              </article>
              <article className="benefit-card">
                <span className="card-index">02 / PAHAMI</span>
                <div className="benefit-symbol">
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path
                      d="M8 34V22m10 12V13m10 21V18m10 16V8M7 39h34"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Lihat pola, bukan tebakan.</h3>
                <p>
                  Riwayat dan statistik dirancang untuk memperlihatkan aktivitas
                  yang tercatat dari waktu ke waktu.
                </p>
              </article>
              <article className="benefit-card">
                <span className="card-index">03 / LANJUTKAN</span>
                <div className="benefit-symbol">
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path
                      d="M38 9C23 9 10 15 10 29c0 6 4 10 10 10 14 0 19-15 18-30ZM12 38c6-9 12-15 22-22"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Temukan langkah berikutnya.</h3>
                <p>
                  Panduan material dirancang untuk memberi arah Reduce, Reuse,
                  Recycle, atau Trash tanpa menghakimi pilihanmu.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="section how" id="cara-kerja">
          <div className="container how-grid">
            <div className="how-copy">
              <p className="eyebrow">ALUR YANG DIRENCANAKAN</p>
              <h2>Sederhana untuk dimulai. Berguna untuk diteruskan.</h2>
              <p>
                Alur inti dirancang singkat agar aktivitas sehari-hari mudah
                dilihat kembali saat fitur ini tersedia.
              </p>
              <a className="text-link" href="#unduh">
                Lihat status build <Arrow />
              </a>
            </div>
            <ol className="steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Pilih yang ingin dicatat</h3>
                  <p>
                    Misalnya botol plastik, sisa makanan, atau barang yang tidak
                    jadi kamu gunakan.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Tentukan caramu menanganinya</h3>
                  <p>
                    Catat Reduce, Reuse, Recycle, atau Trash dengan satuan yang
                    sesuai.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Lihat perubahanmu</h3>
                  <p>
                    Buka riwayat dan statistik untuk memahami kebiasaanmu
                    sendiri.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>
        <section className="section about" id="tentang">
          <div className="container about-grid">
            <div className="about-art" aria-hidden="true">
              <span className="art-top">WASTENOT / 3R</span>
              <div className="art-orbit">
                <span>
                  R<small>educe</small>
                </span>
                <span>
                  R<small>euse</small>
                </span>
                <span>
                  R<small>ecycle</small>
                </span>
              </div>
              <span className="art-bottom">
                Kebiasaan dimulai dari perhatian.
              </span>
            </div>
            <div className="about-copy">
              <p className="eyebrow">DIBUAT UNTUK KEBIASAAN NYATA</p>
              <h2>Lebih dari sekadar menghitung sampah.</h2>
              <p>
                WasteNot sedang dirancang sebagai ruang pribadi untuk mencatat
                keputusan sehari-hari, memahami pilihan yang tersedia, lalu
                menentukan langkah berikutnya.
              </p>
              <div className="about-rule" />
              <p className="about-small">
                Rancangan statistik memakai aktivitas yang dicatat pengguna,
                bukan klaim pengurangan emisi atau dampak lingkungan yang belum
                terukur.
              </p>
            </div>
          </div>
        </section>
        <section className="download-section" id="unduh">
          <div className="container download-grid">
            <div>
              <p className="eyebrow">BUILD PENGEMBANGAN</p>
              <h2>WasteNot sedang tumbuh. Ikuti dari awal.</h2>
              <p>
                APK saat ini berisi kerangka aplikasi. Fitur pencatatan,
                panduan, statistik, dan AI belum tersedia dalam build ini.
              </p>
            </div>
            <div className="download-card">
              <span className="download-platform">BUILD AWAL ANDROID</span>
              <strong>WasteNot Preview</strong>
              <ReleaseInfo />
              <a className="button button-lime" href={`${base}download`}>
                Unduh build awal <Arrow diagonal />
              </a>
              <small>
                Ini bukan rilis fitur lengkap. File diunduh dari server
                WasteNot; perangkat mungkin meminta izin pemasangan dari
                browser.
              </small>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container footer-top">
          <div>
            <Brand />
            <p>Catat. Pahami. Lanjutkan.</p>
          </div>
          <nav aria-label="Navigasi footer">
            <a href="#manfaat">Manfaat</a>
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#tentang">Tentang</a>
            <a href="#unduh">Unduh</a>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} WasteNot</span>
          <span>Lebih sadar, mulai dari satu catatan.</span>
        </div>
      </footer>
    </>
  );
}

export default App;
