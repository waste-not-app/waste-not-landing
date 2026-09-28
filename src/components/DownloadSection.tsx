import { useState, useEffect } from 'react'
import styles from './DownloadSection.module.css'

interface VersionEntry {
  version: string
  name?: string
  date: string
  size: string
  sha256: string
  url?: string
}

const FALLBACK_VERSIONS: VersionEntry[] = [
  {
    version: 'v1.0.0',
    name: 'WasteNot v1.0.0',
    date: '2026-09-01',
    size: '~28 MB',
    sha256: 'a1b2c3d4e5f6...',
    url: 'https://oktaavsm.bccdev.id/wastenot/download',
  },
]

const INSTALL_STEPS = [
  'Unduh file APK dari tombol di atas.',
  'Buka file APK di perangkat Android kamu.',
  'Izinkan instalasi dari sumber tidak dikenal jika diminta.',
  'Selesai! Buka WasteNot dan mulai catat.',
]

export default function DownloadSection() {
  const [versions, setVersions] = useState<VersionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://oktaavsm.bccdev.id/wastenot/versions.json')
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.json() as Promise<VersionEntry[]>
      })
      .then((data) => {
        setVersions(data.slice(0, 3))
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setVersions(FALLBACK_VERSIONS)
        setLoading(false)
      })
  }, [])

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Rilis Resmi</span>
          <h2 className={styles.heading}>Unduh APK Resmi</h2>
          <p className={styles.sub}>
            Selalu unduh dari sumber resmi untuk keamanan perangkat kamu.
          </p>
        </div>

        <div className={styles.content}>
          {/* Versions list */}
          <div className={styles.versionsList}>
            {loading ? (
              <div className={styles.skeleton}>
                <div className={styles.skeletonRow} />
                <div className={styles.skeletonRow} />
              </div>
            ) : (
              <>
                {error && (
                  <div className={styles.errorBanner}>
                    ⚠️ Tidak dapat memuat daftar versi. Menampilkan data fallback.
                  </div>
                )}
                {versions.map((v) => (
                  <div key={v.version} className={styles.versionCard}>
                    <div className={styles.versionMeta}>
                      <div className={styles.versionBadge}>{v.version}</div>
                      <div className={styles.versionInfo}>
                        <span className={styles.versionName}>{v.name ?? `WasteNot ${v.version}`}</span>
                        <div className={styles.versionDetails}>
                          <span>📅 {v.date}</span>
                          <span>📦 {v.size}</span>
                          <span className={styles.sha}>🔑 SHA256: {v.sha256.slice(0, 16)}…</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={v.url ?? 'https://oktaavsm.bccdev.id/wastenot/download'}
                      className={styles.downloadBtn}
                      download
                    >
                      ⬇ Unduh
                    </a>
                  </div>
                ))}
              </>
            )}

            <div className={styles.mainDownload}>
              <a
                href="https://oktaavsm.bccdev.id/wastenot/download"
                className={styles.mainBtn}
                download
              >
                ⬇ Download APK Terbaru
              </a>
            </div>
          </div>

          {/* Install steps */}
          <div className={styles.installSteps}>
            <h3 className={styles.stepsTitle}>Cara Instalasi</h3>
            <ol className={styles.steps}>
              {INSTALL_STEPS.map((step, i) => (
                <li key={i} className={styles.step}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepText}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
