import styles from './FeaturesSection.module.css'

interface Feature {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '🌿',
    title: 'Personal 3R Tracking',
    description:
      'Catat sampah dalam berat atau jumlah benda. Reduce dicatat terpisah agar tidak salah hitung recycling rate.',
  },
  {
    icon: '📷',
    title: 'AI Waste Detection',
    description:
      'Foto sampah, YOLO deteksi objek, LLM rekomendasikan penanganan. Kamu tetap punya keputusan akhir.',
  },
  {
    icon: '📊',
    title: 'Statistik & Progres',
    description:
      'Visualisasi mingguan, recycling rate, dan XP berbasis aktivitas nyata yang kamu catat.',
  },
  {
    icon: '🏆',
    title: 'Gamifikasi XP & Level',
    description:
      '10 XP per catatan baru. Naik level dengan konsisten, bukan dengan angka emisi palsu.',
  },
]

export default function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Fitur Utama</span>
          <h2 className={styles.heading}>
            Dari catat, pahami, hingga berkembang.
          </h2>
        </div>
        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.title} className={styles.card}>
              <span className={styles.icon} aria-hidden="true">{f.icon}</span>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
