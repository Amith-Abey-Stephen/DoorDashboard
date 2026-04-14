"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "accent" | "green" | "red" | "default";
  subtitle?: string;
  trend?: string;
}

const colorMap = {
  accent: { bg: "var(--accent-dim)", border: "var(--border-accent)", icon: "var(--accent)" },
  green: { bg: "var(--green-dim)", border: "rgba(34,211,165,0.25)", icon: "var(--green)" },
  red: { bg: "var(--red-dim)", border: "rgba(245,92,122,0.25)", icon: "var(--red)" },
  default: { bg: "var(--bg-card)", border: "var(--border)", icon: "var(--text-secondary)" },
};

export default function StatCard({ title, value, icon: Icon, color = "default", subtitle, trend }: StatCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        cursor: "default",
        transition: "border-color 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = c.border;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      {/* bg glow */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: c.bg,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </p>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: c.bg,
            border: `1px solid ${c.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} color={c.icon} />
        </div>
      </div>

      <div>
        <p style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)", lineHeight: 1 }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
            {subtitle}
          </p>
        )}
      </div>

      {trend && (
        <p style={{ fontSize: "0.78rem", color: "var(--green)", fontWeight: 500 }}>
          {trend}
        </p>
      )}
    </motion.div>
  );
}
