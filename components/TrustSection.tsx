'use client'

import { useRef } from 'react'
import { motion, useInView, type Easing } from 'framer-motion'
import { ShieldCheck, BadgeCheck, Fingerprint, Award } from 'lucide-react'

const easeOutExpo = [0.22, 1, 0.36, 1] as Easing

const pillars = [
  {
    Icon: ShieldCheck,
    title: 'Gas Safe registered',
    body: 'All gas and boiler engineers hold a valid Gas Safe Register licence. We verify this directly before they go live on the platform.',
  },
  {
    Icon: BadgeCheck,
    title: 'Fully insured',
    body: 'Every Fixmate tradesperson carries a minimum of £1,000,000 public liability insurance. Verified at onboarding and renewed annually.',
  },
  {
    Icon: Fingerprint,
    title: 'Identity verified',
    body: 'Government-issued photo ID and DBS checks are completed for all providers before their first job.',
  },
  {
    Icon: Award,
    title: 'Certified professionals',
    body: 'Electricians hold NICEIC or NAPIT certification. All trade credentials are checked against official registers.',
  },
]

export default function TrustSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="trust"
      className="noise"
      style={{ background: 'var(--bg-primary)', padding: '120px 0' }}
    >
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo }}
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
          Safety first
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: 'var(--text-primary)',
            marginBottom: '64px',
          }}
        >
          Every tradesperson, fully vetted
        </motion.h2>

        {/* 2×2 Grid */}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
          className="trust-grid"
        >
          {pillars.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: easeOutExpo,
                delay: i * 0.1,
              }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-hover)'
                el.style.boxShadow = '0 0 32px var(--glow)'
                const bar = el.querySelector('.left-bar') as HTMLElement
                if (bar) bar.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                const bar = el.querySelector('.left-bar') as HTMLElement
                if (bar) bar.style.opacity = '0'
              }}
            >
              {/* Left accent bar on hover */}
              <div
                className="left-bar"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: 'var(--accent-blue)',
                  borderRadius: '16px 0 0 16px',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* Icon Box */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(37,99,235,0.12)',
                  border: '1px solid rgba(37,99,235,0.25)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Icon size={22} style={{ color: 'var(--accent-blue-bright)' }} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 600,
                  fontSize: '20px',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
