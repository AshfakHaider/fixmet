"use client";

import { motion, useInView, type Easing } from "framer-motion";
import { Building2, CheckCircle, Mail, Send } from "lucide-react";
import { useRef, useState } from "react";

const easeOutExpo = [0.22, 1, 0.36, 1] as Easing;

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "12px 16px",
  color: "var(--text-primary)",
  fontSize: "14px",
  fontFamily: "var(--font-geist)",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist)",
  fontWeight: 500,
  fontSize: "13px",
  color: "var(--text-secondary)",
  marginBottom: "6px",
  display: "block",
};

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submission:", form);
    setSent(true);
  };

  const focusStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.currentTarget.style.borderColor = "var(--accent-blue)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
  };
  const blurStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <section
      id="contact"
      className="noise"
      style={{ background: "var(--bg-primary)", padding: "120px 0" }}
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
        className="contact-grid"
      >
        {/* LEFT — Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
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
            Get in touch
          </p>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(24px, 3vw, 40px)",
              color: "var(--text-primary)",
              marginBottom: "40px",
              lineHeight: 1.15,
            }}
          >
            We&apos;d love to hear from you
          </h2>

          {!sent ? (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  aria-label="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  aria-label="Your email address"
                />
              </div>
              <div>
                <label htmlFor="subject" style={labelStyle}>
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  aria-label="Message subject"
                />
              </div>
              <div>
                <label htmlFor="message" style={labelStyle}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  aria-label="Your message"
                />
              </div>
              <button
                type="submit"
                aria-label="Send message"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  background: "var(--accent-blue)",
                  color: "white",
                  borderRadius: "10px",
                  padding: "14px 28px",
                  fontFamily: "var(--font-syne)",
                  fontWeight: 600,
                  fontSize: "16px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--accent-blue-light)";
                  el.style.boxShadow = "0 0 32px rgba(37,99,235,0.5)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--accent-blue)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                <Send size={18} />
                Send message
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.3)",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <CheckCircle
                size={24}
                style={{ color: "var(--accent-cyan)", flexShrink: 0 }}
              />
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: "15px",
                  color: "var(--accent-cyan)",
                }}
              >
                Message sent! We&apos;ll get back to you shortly.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT — Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.15 }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {[
            {
              Icon: Mail,
              label: "EMAIL",
              value: (
                <a
                  href="mailto:info@fixmet.co.uk"
                  style={{
                    color: "var(--text-primary)",
                    textDecoration: "none",
                  }}
                >
                  info@fixmet.co.uk
                </a>
              ),
            },
            // {
            //   Icon: MapPin,
            //   label: "ADDRESS",
            //   value: "49 Gelligaer Street, Cardiff, Wales, CF24 4LD",
            // },
            {
              Icon: Building2,
              label: "COMPANY",
              value: <span>Fixmet Solutions Ltd</span>,
            },
          ].map(({ Icon, label, value }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "24px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "rgba(37,99,235,0.12)",
                  border: "1px solid rgba(37,99,235,0.25)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={20}
                  style={{ color: "var(--accent-blue-bright)" }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-geist)",
                    fontWeight: 500,
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-geist)",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                  }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}

          {/* Legal note */}
          {/* <p
            style={{
              fontFamily: "var(--font-geist)",
              fontWeight: 400,
              fontSize: "12px",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              marginTop: "8px",
            }}
          >
            Fixmet Solutions Ltd is registered in England &amp; Wales (Company
            No.&nbsp;17008216). Registered office: 49 Gelligaer Street, Cardiff,
            Wales, CF24 4LD.
          </p> */}
        </motion.div>
      </div>
    </section>
  );
}
