"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import {
  Database,
  Bell,
  Shield,
  Key,
  Link as LinkIcon,
  User,
  CheckCircle,
} from "lucide-react";

const firebaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "";
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

export default function SettingsPage() {
  const { user } = useAuth();

  const sections = [
    {
      title: "Account",
      icon: User,
      color: "accent" as const,
      items: [
        { label: "Email", value: user?.email || "—", mono: false },
        { label: "Auth Provider", value: "Email / Password", mono: false },
        { label: "User ID", value: user?.uid || "—", mono: true },
      ],
    },
    {
      title: "Firebase Configuration",
      icon: Database,
      color: "green" as const,
      items: [
        { label: "Project ID", value: projectId, mono: true },
        { label: "Database URL", value: firebaseUrl, mono: true },
        { label: "Auth Domain", value: `${projectId}.firebaseapp.com`, mono: true },
      ],
    },
    {
      title: "Device Info",
      icon: Shield,
      color: "accent" as const,
      items: [
        { label: "Device Type", value: "ESP32", mono: false },
        { label: "RFID Reader", value: "MFRC522 (SPI)", mono: false },
        { label: "Firmware Version", value: "Code_V_1", mono: true },
        { label: "Cards Fetch Interval", value: "Daily at 01:00", mono: false },
        { label: "Door Unlock Duration", value: "5 seconds", mono: false },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "red" as const,
      items: [
        { label: "Discord Webhook", value: "Configured ✓", mono: false },
        { label: "Events Notified", value: "Access Granted, Denied, Manual Override", mono: false },
      ],
    },
  ];

  const colorMap = {
    accent: { bg: "var(--accent-dim)", border: "var(--border-accent)", icon: "var(--accent)" },
    green: { bg: "var(--green-dim)", border: "rgba(34,211,165,0.25)", icon: "var(--green)" },
    red: { bg: "var(--red-dim)", border: "rgba(245,92,122,0.25)", icon: "var(--red)" },
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "2rem" }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
          Settings
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          System configuration and account information.
        </p>
      </motion.div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          background: "var(--green-dim)",
          border: "1px solid rgba(34,211,165,0.3)",
          borderRadius: "12px",
          marginBottom: "1.5rem",
        }}
      >
        <CheckCircle size={20} color="var(--green)" />
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--green)" }}>System Online</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Firebase RTDB connected · Discord webhook active
          </p>
        </div>
      </motion.div>

      {/* Config Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {sections.map((section, si) => {
          const c = colorMap[section.color];
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * si }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <section.icon size={16} color={c.icon} />
                </div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {section.title}
                </h2>
              </div>

              {/* Items */}
              <div>
                {section.items.map((item, idx) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                      padding: "0.875rem 1.5rem",
                      borderBottom: idx < section.items.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500, flexShrink: 0 }}>
                      {item.label}
                    </span>
                    {item.mono ? (
                      <code
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-primary)",
                          background: "var(--bg-secondary)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "5px",
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                          textAlign: "right",
                          maxWidth: "450px",
                        }}
                      >
                        {item.value}
                      </code>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", textAlign: "right", maxWidth: "450px" }}>
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
