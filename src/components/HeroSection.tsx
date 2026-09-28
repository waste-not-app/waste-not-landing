import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          {/* Eyebrow badge */}
          <span className={styles.badge}>🌱 ANDROID APP · BETA</span>

          {/* Headline */}
          <h1 className={styles.headline}>
            Lebih sadar,<br />
            mulai dari satu catatan.
          </h1>

          {/* Subheadline */}
          <p className={styles.sub}>
            Catat kebiasaan 3R (Reduce, Reuse, Recycle, Trash) harianmu dengan mudah.
            AI membantu identifikasi jenis sampah, kamu yang memutuskan.
          </p>

          {/* Stats row */}
          <div className={styles.stats}>
            <span className={styles.stat}>25 layar &amp; panel</span>
            <span className={styles.statDot} aria-hidden="true">·</span>
            <span className={styles.stat}>39 komponen</span>
            <span className={styles.statDot} aria-hidden="true">·</span>
            <span className={styles.stat}>AI-assisted detection</span>
          </div>

          {/* CTA buttons */}
          <div className={styles.actions}>
            <a
              href="https://oktaavsm.bccdev.id/wastenot/download"
              className={styles.primaryBtn}
              download
            >
              ⬇ Download APK Terbaru (v1.0.0)
            </a>
            <a
              href="https://oktaavsm.bccdev.id/wastenot/"
              className={styles.ghostBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat Design System →
            </a>
          </div>
        </div>

        {/* Mock phone frame */}
        <div className={styles.phoneWrapper} aria-hidden="true">
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <div className={styles.phoneStatusBar} />
              <div className={styles.phoneContent}>
                <div className={styles.phoneCard} />
                <div className={styles.phoneCard} />
                <div className={styles.phoneCardSm} />
              </div>
            </div>
            <div className={styles.phoneHome} />
          </div>
        </div>
      </div>
    </section>
  )
}
