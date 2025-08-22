import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'nstr - number to string, but looks good',
  description: 'Stringify numbers in JavaScript with smart precision detection',
  openGraph: {
    title: 'nstr - number to string, but looks good',
    description: 'Stringify numbers in JavaScript with smart precision detection',
    type: 'website',
    locale: 'en_US',
    siteName: 'nstr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nstr - number to string, but looks good',
    description: 'Stringify numbers in JavaScript with smart precision detection',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${GeistMono.className} font-mono antialiased`}>
        {children}
      </body>
    </html>
  )
}
