'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './error.module.css'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          {error === 'AccessDenied' 
            ? 'Only ThoughtSpot employees with @thoughtspot.com email addresses can access this application.'
            : 'An error occurred during sign in. Please try again.'}
        </p>
        <Link href="/auth/signin" className={styles.button}>
          Try Again
        </Link>
      </div>
    </div>
  )
}

