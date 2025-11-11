'use client'

import PSPackageRecommender from '@/components/PSPackageRecommender'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.container}>
        <TabNavigation />
        <PSPackageRecommender />
      </div>
    </main>
  )
}


