import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Invoice Generator - Create Professional Invoices Online',
  description: 'Generate professional invoices for free. Manage customers, products, and invoices all in one place. Upgrade to Pro for advanced features.',
  keywords: 'invoice generator, free invoice, invoice maker, billing software, invoice creator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

