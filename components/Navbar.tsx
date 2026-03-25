'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Download', href: '#download' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          backgroundColor: scrolled ? 'rgba(2, 8, 24, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: '22px',
              color: 'var(--accent-blue-bright)',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
            }}
          >
            Fixmate
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex"
            style={{ gap: '32px', alignItems: 'center' }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--text-primary)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--text-secondary)')
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="#contact"
              className="hidden md:inline-block"
              style={{
                fontFamily: 'var(--font-geist)',
                fontWeight: 500,
                fontSize: '14px',
                color: 'white',
                background: 'var(--accent-blue)',
                borderRadius: '8px',
                padding: '8px 18px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-blue-light)'
                e.currentTarget.style.boxShadow =
                  '0 0 20px rgba(37,99,235,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent-blue)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              aria-label="Get early access"
            >
              Get Early Access
            </a>

            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              zIndex: 999,
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border)',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--text-primary)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--text-secondary)')
                  }
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 500,
                  fontSize: '15px',
                  color: 'white',
                  background: 'var(--accent-blue)',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
                aria-label="Get early access"
              >
                Get Early Access
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
