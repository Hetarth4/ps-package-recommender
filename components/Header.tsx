'use client'

import styles from './Header.module.css'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

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
        {session && (
          <div className={styles.userSection}>
            <span className={styles.userEmail}>{session.user?.email}</span>
            <button 
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className={styles.signOutButton}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

