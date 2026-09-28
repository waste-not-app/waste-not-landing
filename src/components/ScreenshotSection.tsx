import styles from './ScreenshotSection.module.css'

const TECH_STACK = [
  'Kotlin',
  'Jetpack Compose',
  'Navigation 3',
  'CameraX',
  'YOLO',
  'Material 3',
  'AGP 9',
  'JDK 17',
]

export default function ScreenshotSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Dibangun Dengan</span>
          <h2 className={styles.heading}>Tech Stack</h2>
        </div>
        <div className={styles.pills}>
          {TECH_STACK.map((tech) => (
            <span key={tech} className={styles.pill}>{tech}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
