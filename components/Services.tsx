'use client'

import { useRef } from 'react'
import { motion, useInView, type Easing } from 'framer-motion'
import { Zap, Droplets, KeyRound, Flame, Wrench } from 'lucide-react'

const easeOutExpo = [0.22, 1, 0.36, 1] as Easing

const services = [
  { Icon: Zap, name: 'Electrician', desc: 'Fuse boards, wiring, faults' },
  { Icon: Droplets, name: 'Plumber', desc: 'Leaks, boilers, blockages' },
  { Icon: KeyRound, name: 'Locksmith', desc: 'Lockouts, lock changes, security' },
  { Icon: Flame, name: 'Gas & Boiler', desc: 'Gas Safe registered engineers' },
  { Icon: Wrench, name: 'Handyman', desc: 'Repairs, fitting, odd jobs' },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="services"
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
            color: 'var(--accent-blue-bright)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          What we cover
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
          Every home emergency, covered
        </motion.h2>

        {/* Cards Grid */}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px',
          }}
          className="services-grid"
        >
          {services.map(({ Icon, name, desc }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
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
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-hover)'
                el.style.boxShadow = '0 0 40px var(--glow)'
                el.style.transform = 'translateY(-4px)'
                const bar = el.querySelector('.accent-bar') as HTMLElement
                if (bar) bar.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
                const bar = el.querySelector('.accent-bar') as HTMLElement
                if (bar) bar.style.opacity = '0'
              }}
            >
              {/* Bottom Accent Bar */}
              <div
                className="accent-bar"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--accent-blue)',
                  borderRadius: '0 0 16px 16px',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* Icon Circle */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(37,99,235,0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <Icon size={32} style={{ color: 'var(--accent-blue-bright)' }} />
              </div>

              {/* Name */}
              <h3
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 600,
                  fontSize: '18px',
                  color: 'var(--text-primary)',
                  marginTop: '16px',
                  marginBottom: '6px',
                }}
              >
                {name}
              </h3>

              {/* Descriptor */}
              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
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
