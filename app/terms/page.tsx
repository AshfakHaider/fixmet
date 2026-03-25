import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — Fixmate',
  description: 'Terms of Service for Fixmet Solutions Ltd, trading as Fixmate.',
}

export default function TermsPage() {
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
            Terms of Service
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
                title: '1. About these terms',
                body: 'These Terms of Service govern your use of the Fixmate platform and website, operated by Fixmet Solutions Ltd, a company registered in England & Wales (Company No. 17008216) with a registered office at 49 Gelligaer Street, Cardiff, Wales, CF24 4LD, trading as Fixmate. By using our platform, you agree to these terms.',
              },
              {
                title: '2. The Fixmate platform',
                body: 'Fixmate is a technology platform that connects homeowners and occupiers with independent, self-employed tradespeople. Fixme Solutions Ltd acts as a technology intermediary and is not itself a provider of trade or home services. The tradespeople you engage through Fixmate are independent contractors.',
              },
              {
                title: '3. Eligibility',
                body: 'You must be at least 18 years of age and a resident of the United Kingdom to use Fixmate as a customer. By using our platform, you confirm that you meet these requirements and that all information you provide is accurate and complete.',
              },
              {
                title: '4. Booking and payments',
                body: 'When you submit a job request through Fixmate, you are entering into a contract for services with the individual tradesperson who accepts your job — not with Fixmet Solutions Ltd. Pricing displayed on the platform is an estimate and may vary based on the actual scope of work. Payment terms will be confirmed at the time of booking.',
              },
              {
                title: '5. Tradesperson vetting',
                body: 'Fixmate takes reasonable steps to verify the credentials, insurance, and identity of tradespeople on its platform. However, we cannot guarantee the workmanship or conduct of any individual tradesperson. It is your responsibility to satisfy yourself as to their suitability for any particular job.',
              },
              {
                title: '6. User responsibilities',
                body: 'You agree to: (a) provide accurate job descriptions and access to your property; (b) treat all tradespeople with respect; (c) pay agreed amounts promptly; (d) not attempt to engage tradespeople outside the platform to circumvent fees. You must not use the platform for any unlawful purpose.',
              },
              {
                title: '7. Limitation of liability',
                body: 'To the maximum extent permitted by law, Fixmet Solutions Ltd will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Fixmate platform. Our total aggregate liability to you shall not exceed the amount paid for the relevant service booking.',
              },
              {
                title: '8. Intellectual property',
                body: 'All intellectual property in the Fixmate platform, including the brand, software, design, and content, belongs to Fixmet Solutions Ltd or its licensors. You may not copy, modify, distribute, or create derivative works from any part of our platform without our prior written consent.',
              },
              {
                title: '9. Changes to these terms',
                body: 'We may update these Terms of Service from time to time. We will notify registered users of any material changes by email or through the platform. Your continued use of Fixmate after any changes indicates your acceptance of the revised terms.',
              },
              {
                title: '10. Governing law',
                body: 'These Terms of Service are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales. If you are a consumer, you may also have rights under the law of your home country.',
              },
              {
                title: '11. Contact',
                body: 'If you have any questions about these Terms of Service, please contact us at info@fixmet.co.uk or in writing to: Fixmet Solutions Ltd, 49 Gelligaer Street, Cardiff, Wales, CF24 4LD.',
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
