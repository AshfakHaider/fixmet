'use client'

import { useRef } from 'react'
import { motion, useInView, type Easing } from 'framer-motion'
import { Camera, Sparkles, MapPin } from 'lucide-react'

const easeOutExpo = [0.22, 1, 0.36, 1] as Easing

const steps = [
  {
    num: '01',
    Icon: Camera,
    title: 'Describe your problem',
    desc: 'Upload a photo or video of the issue and add a short description. Our AI analyses the job instantly.',
  },
  {
    num: '02',
    Icon: Sparkles,
    title: 'Get an instant quote',
    desc: 'Receive a transparent price estimate in seconds — no phone calls, no waiting, no negotiation.',
  },
  {
    num: '03',
    Icon: MapPin,
    title: 'Expert arrives fast',
    desc: 'The nearest verified tradesperson accepts your job and is dispatched immediately. Track them live on the map.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="how-it-works"
      className="noise"
      style={{ background: 'var(--bg-secondary)', padding: '120px 0' }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
        }}
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
          Simple by design
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
          From problem to fix in three steps
        </motion.h2>

        {/* Grid */}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
        >
          {steps.map(({ num, Icon, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: easeOutExpo,
                delay: i * 0.15,
              }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '36px 32px',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-hover)'
                el.style.boxShadow = '0 0 32px var(--glow)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Step Number */}
              <p
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: '56px',
                  color: 'rgba(37,99,235,0.2)',
                  lineHeight: 1,
                  marginBottom: '16px',
                }}
              >
                {num}
              </p>

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
                }}
              >
                <Icon size={22} style={{ color: 'var(--accent-blue-bright)' }} />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 600,
                  fontSize: '20px',
                  color: 'var(--text-primary)',
                  marginTop: '20px',
                  marginBottom: '8px',
                }}
              >
                {title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
