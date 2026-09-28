import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo}>
          <span aria-hidden="true">♻️</span>
          <span className={styles.logoText}>WasteNot</span>
        </a>
        <a
          href="https://oktaavsm.bccdev.id/wastenot/download"
          className={styles.ctaBtn}
          download
        >
          Download APK
        </a>
      </div>
    </header>
  )
}
