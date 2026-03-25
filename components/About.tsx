"use client";

import { motion, useInView, type Easing } from "framer-motion";
import { CheckCircle2, Clock, Globe, Layers, ShieldCheck } from "lucide-react";
import { useRef } from "react";

const easeOutExpo = [0.22, 1, 0.36, 1] as Easing;

const stats = [
  { Icon: Globe, value: "UK", label: "Registered & operating" },
  { Icon: ShieldCheck, value: "100%", label: "Verified tradespeople" },
  { Icon: Layers, value: "5", label: "Service categories" },
  { Icon: Clock, value: "24/7", label: "Emergency availability" },
];

const companyRows = [
  { label: "Legal name", value: "Fixmet Solutions Ltd" },
  { label: "Company number", value: "17008216" },
  { label: "Registered in", value: "England & Wales" },
  {
    label: "Registered office",
    value: "49 Gelligaer Street, Cardiff, Wales, CF24 4LD",
  },
  { label: "Trading as", value: "Fixmate" },
  { label: "Contact", value: "info@fixmet.co.uk" },
  { label: "SIC code", value: "63120 — Web portals" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      className="noise"
      style={{ background: "var(--bg-secondary)", padding: "120px 0" }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "start",
        }}
        className="about-grid"
      >
        {/* LEFT — Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: "var(--font-geist)",
              fontWeight: 500,
              fontSize: "12px",
              letterSpacing: "0.15em",
              color: "var(--accent-cyan)",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            About Fixmate
          </p>

          {/* Headline */}
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              color: "var(--text-primary)",
              marginBottom: "24px",
              lineHeight: 1.15,
            }}
          >
            Built in the UK, for UK homes
          </h2>

          {/* Body */}
          <p
            style={{
              fontFamily: "var(--font-geist)",
              fontWeight: 400,
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "32px",
            }}
          >
            Fixmate is a UK-registered technology platform designed to eliminate
            the stress of finding reliable help during a home emergency. We
            connect homeowners and occupiers with verified, insured tradespeople
            — removing the need for phone calls, guesswork, and waiting. Our
            platform brings the speed and simplicity of on-demand apps to the
            trades industry.
          </p>

          {/* Company Details Box */}
          {/* <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px 24px",
              background: "rgba(37,99,235,0.05)",
              marginBottom: "20px",
            }}
          >
            {companyRows.map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "8px 0",
                  borderBottom:
                    i < companyRows.length - 1
                      ? "1px solid rgba(37,99,235,0.08)"
                      : "none",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist)",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    minWidth: "140px",
                    flexShrink: 0,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist)",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "var(--text-primary)",
                  }}
                >
                  {label === "Contact" ? (
                    <a
                      href="mailto:info@fixmet.co.uk"
                      style={{
                        color: "var(--text-primary)",
                        textDecoration: "none",
                      }}
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </span>
              </div>
            ))}
          </div> */}

          {/* Registered Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2
              size={16}
              style={{ color: "var(--accent-cyan)", flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "var(--font-geist)",
                fontWeight: 500,
                fontSize: "13px",
                color: "var(--accent-cyan)",
              }}
            >
              Active company — Companies House verified
            </span>
          </div>
        </motion.div>

        {/* RIGHT — Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {stats.map(({ Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                ease: easeOutExpo,
                delay: 0.2 + i * 0.1,
              }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "28px 24px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-hover)";
                el.style.boxShadow = "0 0 32px var(--glow)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
              }}
            >
              <Icon
                size={24}
                style={{
                  color: "var(--accent-blue-bright)",
                  marginBottom: "12px",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 800,
                  fontSize: "36px",
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
