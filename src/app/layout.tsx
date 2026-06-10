import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Higgsfield AI — Cinematic AI Video Generation',
  description: 'Turn your ideas into stunning, professional-quality videos with the most advanced AI video generation platform. Text to video, image to video, 4K export.',
  keywords: ['AI video', 'video generation', 'text to video', 'AI creative tools'],
  openGraph: {
    title: 'Higgsfield AI — Cinematic AI Video Generation',
    description: 'Create stunning AI-generated videos in seconds.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Higgsfield AI',
    description: 'Create stunning AI-generated videos in seconds.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  )
}
