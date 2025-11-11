import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ThoughtSpot PS Package Recommender',
  description: 'Professional Services Package Recommender for ThoughtSpot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


