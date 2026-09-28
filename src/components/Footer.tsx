import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <span aria-hidden="true">♻️</span> WasteNot
          </span>
          <p className={styles.tagline}>
            Satu catatan kecil untuk kebiasaan yang lebih baik.
          </p>
        </div>
        <nav className={styles.links} aria-label="Footer links">
          <a
            href="https://github.com/wastenot-android"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repo
          </a>
          <a
            href="https://oktaavsm.bccdev.id/wastenot/download"
            className={styles.link}
            download
          >
            Download APK
          </a>
          <a
            href="https://oktaavsm.bccdev.id/wastenot/"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Design System
          </a>
        </nav>
        <p className={styles.copyright}>
          WasteNot © 2026 Engineering Team
        </p>
      </div>
    </footer>
  )
}
