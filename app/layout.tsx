import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Micro Editor ',
  description: 'Created with Next js & Typwscript',
  generator: 'Md Kamruzzaman',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
