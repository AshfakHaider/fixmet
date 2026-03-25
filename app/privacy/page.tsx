import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Fixmate',
  description: 'Privacy Policy for Fixmet Solutions Ltd, trading as Fixmate.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '100px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 120px' }}>
          {/* Back link */}
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
            Privacy Policy
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
                title: '1. Who we are',
                body: 'This Privacy Policy applies to Fixmet Solutions Ltd, registered in England & Wales (Company No. 17008216), trading as Fixmate. Our registered office is at 49 Gelligaer Street, Cardiff, Wales, CF24 4LD. We are the data controller for personal data collected through the Fixmate platform and website at www.fixmet.co.uk.',
              },
              {
                title: '2. What data we collect',
                body: 'We collect information you provide directly to us, including your name, email address, phone number, home address, and details of any home service requests you submit. When you use our platform, we may also collect technical data such as IP addresses, device identifiers, browser type, and usage data via standard web analytics tools.',
              },
              {
                title: '3. How we use your data',
                body: 'We use your personal data to: (a) provide and operate the Fixmate platform and connect you with tradespeople; (b) communicate with you about your service requests; (c) send you updates and marketing communications where you have consented; (d) improve and develop our platform and services; (e) comply with our legal obligations.',
              },
              {
                title: '4. Legal basis for processing',
                body: 'We process your personal data on the basis of: (a) contract performance — to provide the services you have requested; (b) legitimate interests — to operate and improve our business; (c) legal obligation — where required by UK law; (d) consent — for marketing communications, which you may withdraw at any time.',
              },
              {
                title: '5. Data sharing',
                body: 'We do not sell your personal data. We may share your data with: (a) vetted tradespeople on our platform, solely to fulfil your service requests; (b) third-party service providers who process data on our behalf (e.g. cloud hosting, email delivery) under strict data processing agreements; (c) regulatory authorities where required by law.',
              },
              {
                title: '6. Data retention',
                body: 'We retain your personal data for as long as necessary to provide our services and comply with our legal obligations. Account data is retained for the duration of your relationship with Fixmate and for up to 7 years thereafter to comply with financial and legal record-keeping requirements.',
              },
              {
                title: '7. Your rights',
                body: 'Under UK GDPR, you have the right to: access the personal data we hold about you; rectify inaccurate data; request erasure of your data; restrict or object to processing; data portability; and to withdraw consent where processing is based on consent. To exercise any of these rights, please contact us at info@fixmet.co.uk.',
              },
              {
                title: '8. Security',
                body: 'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure and we cannot guarantee absolute security.',
              },
              {
                title: '9. Cookies',
                body: 'Our website uses cookies and similar technologies to enhance your experience, analyse traffic, and improve our services. Please refer to our Cookie Policy for full details. You can control cookies through your browser settings.',
              },
              {
                title: '10. Contact us',
                body: 'If you have any questions about this Privacy Policy or our data practices, please contact us at info@fixmet.co.uk or write to us at: Fixmet Solutions Ltd, 49 Gelligaer Street, Cardiff, Wales, CF24 4LD.',
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
