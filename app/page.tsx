"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Wifi,
  Bell,
  BarChart3,
  CreditCard,
  Lock,
  Unlock,
  ChevronRight,
  CheckCircle,
  Zap,
  Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: CreditCard,
    title: "RFID Access Control",
    desc: "Manage authorized RFID cards directly from the dashboard. Add or revoke access instantly — no physical configuration needed.",
    color: "accent" as const,
  },
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    desc: "Watch every access attempt live. See who entered, when they did, and flag unauthorized attempts in real time.",
    color: "green" as const,
  },
  {
    icon: Bell,
    title: "Discord Notifications",
    desc: "Instant alerts for every door event sent to your Discord channel — access granted, denied, or manual override.",
    color: "red" as const,
  },
  {
    icon: BarChart3,
    title: "Access Analytics",
    desc: "Visual charts of access patterns, peak hours, and denied attempt trends to keep your space secure.",
    color: "accent" as const,
  },
  {
    icon: Wifi,
    title: "Always Online",
    desc: "The ESP32 device syncs with Firebase in real time. Even offline access is supported via on-device NVS card cache.",
    color: "green" as const,
  },
  {
    icon: Shield,
    title: "Secure by Design",
    desc: "Firebase Auth protects the dashboard. All data in transit is encrypted. Your access logs stay private.",
    color: "accent" as const,
  },
];

const steps = [
  { num: "01", title: "Scan Your Card", desc: "Hold any RFID card near the reader on the smart door device." },
  { num: "02", title: "Instant Verification", desc: "The ESP32 checks the card UID against the Firebase card registry." },
  { num: "03", title: "Door Unlocks", desc: "Authorized cards unlock the door for 5 seconds. Denied attempts are logged." },
  { num: "04", title: "Log & Alert", desc: "The event is logged to Firebase and a Discord notification is sent instantly." },
];

const colorMap = {
  accent: { bg: "var(--accent-dim)", border: "var(--border-accent)", icon: "var(--accent)" },
  green: { bg: "var(--green-dim)", border: "rgba(34,211,165,0.25)", icon: "var(--green)" },
  red: { bg: "var(--red-dim)", border: "rgba(245,92,122,0.25)", icon: "var(--red)" },
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      <Navbar />

      {/* ====== HERO ====== */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "7rem 1.5rem 4rem",
        }}
      >
        {/* Background glow orbs */}
        <div
          className="glow-orb"
          style={{ width: "500px", height: "500px", background: "rgba(108,99,255,0.12)", top: "-100px", left: "-150px" }}
        />
        <div
          className="glow-orb"
          style={{ width: "400px", height: "400px", background: "rgba(34,211,165,0.07)", bottom: "0", right: "-100px", animationDelay: "-3s" }}
        />

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", background: "var(--accent-dim)", border: "1px solid var(--border-accent)", borderRadius: "999px", marginBottom: "1.5rem" }}
          >
            <Zap size={13} color="var(--accent)" />
            <span style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600, letterSpacing: "0.05em" }}>
              Powered by ESP32 + Firebase RTDB
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--text-primary)" }}
          >
            Smart Access Control
            <br />
            <span className="gradient-text">Redefined for IoT</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "580px", margin: "0 auto 2.5rem" }}
          >
            Inovus Smart Door brings RFID-based access control to your space — with real-time monitoring, card management, and instant Discord alerts. All from a single dashboard.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/login" className="btn-primary" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}>
              Access Dashboard <ChevronRight size={18} />
            </Link>
            <a href="#features" className="btn-ghost" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}>
              Explore Features
            </a>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              marginTop: "4rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)",
              position: "relative",
            }}
          >
            {/* Mock dashboard preview */}
            <div style={{ background: "var(--bg-secondary)", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {["#f55c7a", "#e5b200", "#22d3a5"].map((c) => (
                <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, height: "20px", background: "var(--bg-primary)", borderRadius: "5px", marginLeft: "0.5rem", display: "flex", alignItems: "center", paddingLeft: "0.5rem" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>inovus.vercel.app/dashboard</span>
              </div>
            </div>
            <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {[
                { label: "Total Logs", value: "1,284", color: "var(--accent)" },
                { label: "Access Granted", value: "97.2%", color: "var(--green)" },
                { label: "Denied Today", value: "3", color: "var(--red)" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "var(--bg-primary)",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    padding: "1rem",
                  }}
                >
                  <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</p>
                  <p style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Log rows */}
            <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                { owner: "Amith K", uid: "A3F2B1C4", granted: true },
                { owner: "Unknown", uid: "9D1E4A22", granted: false },
                { owner: "Manual Switch", uid: "N/A", granted: true },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.875rem",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {row.granted ? (
                      <CheckCircle size={13} color="var(--green)" />
                    ) : (
                      <Lock size={13} color="var(--red)" />
                    )}
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{row.owner}</span>
                  </div>
                  <code style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{row.uid}</code>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: row.granted ? "var(--green)" : "var(--red)",
                      background: row.granted ? "var(--green-dim)" : "var(--red-dim)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "999px",
                    }}
                  >
                    {row.granted ? "Granted" : "Denied"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" style={{ padding: "6rem 1.5rem", position: "relative" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
              Capabilities
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Everything you need to manage access
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              A complete suite of tools to monitor, manage, and secure physical access — in real time.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "1.75rem",
                    transition: "border-color 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = c.border)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)")}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <f.icon size={22} color={c.icon} />
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how-it-works" style={{ padding: "6rem 1.5rem", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
              How It Works
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "var(--text-primary)" }}>
              Access control in 4 steps
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1.5rem" }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "var(--accent-dim)",
                    border: "1px solid var(--border-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "var(--accent)",
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section style={{ padding: "7rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div
          className="glow-orb"
          style={{ width: "400px", height: "400px", background: "rgba(108,99,255,0.15)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-accent)",
              borderRadius: "24px",
              padding: "3.5rem 2rem",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(108,99,255,0.1)",
            }}
          >
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", boxShadow: "0 0 30px rgba(108,99,255,0.5)" }}>
              <Unlock size={26} color="white" />
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
              Ready to take control?
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Log in to your Inovus Smart Door dashboard and start managing access in real time.
            </p>
            <Link href="/login" className="btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}>
              Go to Dashboard <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 1.5rem", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={14} color="white" />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Inovus Smart Door
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Built with ESP32 + Firebase + Next.js · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
