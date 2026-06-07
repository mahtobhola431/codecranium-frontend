import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import QueryProvider from '@/providers/QueryProvider'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'CodeCranium', template: '%s | CodeCranium' },
  description: 'Interactive coding courses for serious developers. Learn JavaScript, React, Python, Go, and Rust with an in-browser code playground.',
  keywords: ['coding courses', 'learn javascript', 'react tutorial', 'python course', 'developer education'],
  openGraph: {
    type: 'website',
    siteName: 'CodeCranium',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
