'use client'

import { ReactNode, useState } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  content: string
  children: ReactNode
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={styles.tooltipContainer}>
      {children}
      <span 
        className={styles.infoIcon}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        ⓘ
      </span>
      {isVisible && (
        <div className={styles.tooltip}>
          {content}
        </div>
      )}
    </div>
  )
}

