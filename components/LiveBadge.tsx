"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function LiveBadge() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.25rem 0.75rem",
        background: "rgba(34,211,165,0.1)",
        border: "1px solid rgba(34,211,165,0.3)",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "var(--green)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--green)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "var(--green)",
            animation: "pulse-ring 1.5s ease-out infinite",
          }}
        />
      </span>
      Live
    </div>
  );
}
