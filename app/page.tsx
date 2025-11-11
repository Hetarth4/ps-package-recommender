'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PSPackageRecommender from '@/components/PSPackageRecommender'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import styles from './page.module.css'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

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


