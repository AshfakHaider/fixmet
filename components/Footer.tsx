'use client'

import Link from 'next/link'
import { Share2, Globe, MessageSquareShare, Mail, MapPin } from 'lucide-react'

const companyLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Download', href: '#download' },
  { label: 'Careers', href: '#contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: '#010612',
        borderTop: '1px solid var(--border)',
        padding: '64px 0 32px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 2fr 1fr',
            gap: '48px',
            marginBottom: '48px',
          }}
          className="footer-top"
        >
          {/* Column 1 — Brand */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: '22px',
                color: 'var(--accent-blue-bright)',
                textDecoration: 'none',
                letterSpacing: '-0.5px',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Fixmate
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-geist)',
                fontWeight: 400,
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
                lineHeight: 1.6,
              }}
            >
              Emergency home services, on demand.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { Icon: Share2, label: 'LinkedIn' },
                { Icon: Globe, label: 'Twitter / X' },
                { Icon: MessageSquareShare, label: 'Instagram' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    color: 'var(--text-muted)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--accent-blue-bright)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--text-muted)')
                  }
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Links */}
          <div style={{ display: 'flex', gap: '48px' }}>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 500,
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                Company
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {companyLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
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
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontWeight: 500,
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                Legal
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {legalLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
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
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-geist)',
                fontWeight: 500,
                fontSize: '12px',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Mail size={14} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                <a
                  href="mailto:info@fixmet.co.uk"
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
                  info@fixmet.co.uk
                </a>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontWeight: 400,
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  49 Gelligaer Street, Cardiff, Wales, CF24 4LD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontWeight: 400,
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            © 2026 Fixmet Solutions Ltd. Registered in England &amp; Wales. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontWeight: 400,
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            Trading as Fixmate · Company No. 17008216
          </p>
        </div>
      </div>
    </footer>
  )
}
