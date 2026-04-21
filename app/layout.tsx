import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fixmate — Emergency Home Services, On Demand',
  description:
    'Fixmate connects UK homeowners with verified, insured tradespeople — electricians, plumbers, locksmiths, gas engineers and handymen — on demand, day or night.',
  keywords:
    'emergency home services, plumber near me, electrician near me, locksmith, gas engineer, on demand tradespeople, UK',
  openGraph: {
    title: 'Fixmate — Emergency Home Services, On Demand',
    description: 'Verified tradespeople dispatched in minutes across the UK.',
    url: 'https://www.fixmet.co.uk',
    siteName: 'Fixmate',
    locale: 'en_GB',
    type: 'website',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.fixmet.co.uk' },
  verification: {
  google: "google1bf61f721282718c",},
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${syne.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
