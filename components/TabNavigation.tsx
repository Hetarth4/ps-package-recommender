'use client'

import { useState } from 'react'
import styles from './TabNavigation.module.css'

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState('ps-package')

  const tabs = [
    { id: 'ps-package', label: 'PS Package Recommender' },
    // Future tabs can be added here
  ]

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}


