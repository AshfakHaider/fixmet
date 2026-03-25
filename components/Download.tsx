'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Smartphone, TabletSmartphone } from 'lucide-react'

const easeOutExpo = [0.22, 1, 0.36, 1]

// Replace with live URLs when published
const APP_STORE_URL = '#app-store'     // replace with live URL when published
const GOOGLE_PLAY_URL = '#google-play' // replace with live URL when published

export default function Download() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Notify me email:', email)
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section
      id="download"
      className="noise"
      style={{ background: 'var(--bg-secondary)', padding: '120px 0' }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontWeight: 500,
            fontSize: '12px',
            letterSpacing: '0.15em',
            color: 'var(--accent-cyan)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          Coming soon
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 52px)',
            color: 'var(--text-primary)',
            marginBottom: '20px',
            lineHeight: 1.15,
          }}
        >
          Fixmate is launching on iOS and Android
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontWeight: 400,
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto 48px',
            lineHeight: 1.7,
          }}
        >
          Be the first to know when we go live. Download the app the moment
          it&apos;s available on the App Store and Google Play.
        </p>

        {/* App Store Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          {/* App Store */}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-hover)',
                borderRadius: '14px',
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minWidth: '200px',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--bg-card-hover)'
                el.style.boxShadow = '0 0 32px var(--glow)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--bg-card)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}
            >
              <Smartphone size={32} style={{ color: 'var(--accent-blue-bright)', flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 400,
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  marginBottom: '2px',
                }}>
                  Download on the
                </p>
                <p style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: 'var(--text-primary)',
                }}>
                  App Store
                </p>
              </div>
            </div>
          </a>

          {/* Google Play */}
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-hover)',
                borderRadius: '14px',
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minWidth: '200px',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--bg-card-hover)'
                el.style.boxShadow = '0 0 32px var(--glow)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--bg-card)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}
            >
              <TabletSmartphone size={32} style={{ color: 'var(--accent-blue-bright)', flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 400,
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  marginBottom: '2px',
                }}>
                  Get it on
                </p>
                <p style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: 'var(--text-primary)',
                }}>
                  Google Play
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Note */}
        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: '24px',
          }}
        >
          Store links will be activated on launch. Leave your email below to get notified.
        </p>

        {/* Notify Me Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '440px',
            margin: '0 auto 28px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-label="Email address for launch notification"
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-geist)',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-blue)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <button
            type="submit"
            aria-label="Notify me when the app launches"
            style={{
              background: 'var(--accent-blue)',
              color: 'white',
              borderRadius: '10px',
              padding: '12px 20px',
              fontFamily: 'var(--font-syne)',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-blue-light)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-blue)' }}
          >
            Notify me
          </button>
        </form>

        {/* Success Message */}
        <AnimatePresence>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: '14px',
                color: 'var(--accent-cyan)',
                marginBottom: '24px',
              }}
            >
              ✓ You&apos;re on the list!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Platform Badges */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {['iOS 16+', 'Android 10+', 'Free to download'].map((badge) => (
            <span
              key={badge}
              style={{
                border: '1px solid var(--border)',
                background: 'rgba(37,99,235,0.08)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontFamily: 'var(--font-geist)',
                fontWeight: 500,
                fontSize: '13px',
                color: 'var(--accent-blue-bright)',
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
