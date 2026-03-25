"use client";

import { motion } from "framer-motion";
import { Briefcase, ChevronDown, Zap } from "lucide-react";

const words = ["Emergency", "Home", "Repairs,", "Sorted", "in", "Minutes."];
const pills = [
  "Electrician",
  "Plumber",
  "Locksmith",
  "Gas & Boiler",
  "Handyman",
];

const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export default function Hero() {
  return (
    <section
      id="hero"
      className="noise"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--bg-primary)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 600px 500px at 10% 20%, rgba(37,99,235,0.18) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 500px 400px at 90% 80%, rgba(6,182,212,0.10) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%232563EB'/%3E%3C/svg%3E\")",
          backgroundSize: "32px 32px",
          backgroundRepeat: "repeat",
          opacity: 0.06,
          zIndex: 2,
        }}
      />

      {/* Foreground content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "860px",
          width: "100%",
          padding: "100px 24px 80px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(37,99,235,0.4)",
            background: "rgba(37,99,235,0.1)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "32px",
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--accent-cyan)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist)",
              fontWeight: 500,
              fontSize: "13px",
              color: "var(--accent-blue-bright)",
            }}
          >
            Now live across the UK
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(38px, 6vw, 76px)",
            color: "var(--text-primary)",
            lineHeight: 1.1,
            marginBottom: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.25em",
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: easeOutExpo,
                delay: 0.2 + i * 0.06,
              }}
              style={
                word === "Minutes."
                  ? {
                      color: "var(--accent-blue-bright)",
                      textShadow: "0 0 40px rgba(96,165,250,0.5)",
                    }
                  : {}
              }
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.8 }}
          style={{
            fontFamily: "var(--font-geist)",
            fontWeight: 400,
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          Fixmate connects UK homeowners with verified, insured tradespeople —
          on demand, day or night. Electricians, plumbers, locksmiths, gas
          engineers and handymen, dispatched to your door.
        </motion.p>

        {/* Service Pills */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "40px",
            overflowX: "auto",
          }}
        >
          {pills.map((pill, i) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease: easeOutExpo,
                delay: 1 + i * 0.05,
              }}
              style={{
                border: "1px solid var(--border)",
                background: "rgba(37,99,235,0.08)",
                borderRadius: "999px",
                padding: "6px 16px",
                fontFamily: "var(--font-geist)",
                fontWeight: 500,
                fontSize: "13px",
                color: "var(--accent-blue-bright)",
                whiteSpace: "nowrap",
              }}
            >
              {pill}
            </motion.span>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 1.1 }}
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--accent-blue)",
              color: "white",
              borderRadius: "10px",
              padding: "14px 28px",
              fontFamily: "var(--font-syne)",
              fontWeight: 600,
              fontSize: "16px",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-blue-light)";
              e.currentTarget.style.boxShadow = "0 0 32px rgba(37,99,235,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--accent-blue)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            aria-label="Request a tradesperson"
          >
            <Zap size={18} />
            Request a Tradesperson
          </a>

          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border-hover)",
              borderRadius: "10px",
              padding: "14px 28px",
              fontFamily: "var(--font-syne)",
              fontWeight: 600,
              fontSize: "16px",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(37,99,235,0.1)";
              e.currentTarget.style.borderColor = "var(--accent-blue-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--border-hover)";
            }}
            aria-label="Join as a professional tradesperson"
          >
            <Briefcase size={18} />
            Join as a Pro
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <ChevronDown
          size={20}
          className="bob"
          style={{ color: "var(--text-muted)" }}
        />
      </motion.div>
    </section>
  );
}
