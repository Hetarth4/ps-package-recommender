import styles from './Header.module.css'
import Image from 'next/image'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          {/* Official ThoughtSpot Logo */}
          <Image
            src="/thoughtspot-logo.png"
            alt="ThoughtSpot"
            width={500}
            height={126}
            className={styles.logo}
            priority
          />
        </div>
        <div className={styles.title}>
          Professional Services Package Recommender
        </div>
      </div>
    </header>
  )
}

