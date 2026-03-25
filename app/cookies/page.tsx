import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Cookie Policy — Fixmate',
  description: 'Cookie Policy for Fixmet Solutions Ltd, trading as Fixmate.',
}

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '100px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 120px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-geist)',
              fontSize: '14px',
              color: 'var(--accent-blue-bright)',
              textDecoration: 'none',
              marginBottom: '40px',
            }}
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <h1 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 44px)',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            Cookie Policy
          </h1>
          <p style={{
            fontFamily: 'var(--font-geist)',
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginBottom: '48px',
          }}>
            Last updated: March 2026 · Fixmet Solutions Ltd (Company No. 17008216)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {[
              {
                title: '1. What are cookies?',
                body: 'Cookies are small text files placed on your device when you visit a website. They help websites function correctly, remember your preferences, and provide analytical information to site operators.',
              },
              {
                title: '2. How we use cookies',
                body: 'Fixmate uses essential cookies required for the website to function, and analytical cookies to understand how visitors interact with our platform. We do not use advertising or tracking cookies that follow you across third-party websites.',
              },
              {
                title: '3. Types of cookies we use',
                body: 'Essential cookies: required for core site functionality such as session management and security. These cannot be disabled. Analytical cookies: help us understand page performance and visitor behaviour so we can improve our platform. These are only set with your consent.',
              },
              {
                title: '4. Managing cookies',
                body: 'You can control and delete cookies through your browser settings. Please note that disabling essential cookies may impact the functionality of the Fixmate platform. For more information on managing cookies, visit www.aboutcookies.org.',
              },
              {
                title: '5. Contact',
                body: 'If you have questions about our use of cookies, please contact us at info@fixmet.co.uk or write to: Fixmet Solutions Ltd, 49 Gelligaer Street, Cardiff, Wales, CF24 4LD.',
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '20px',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}>
                  {title}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
