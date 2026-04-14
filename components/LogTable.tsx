"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Tag, User, ChevronRight } from "lucide-react";
import { LogEntry } from "@/lib/hooks/useLogs";

interface LogTableProps {
  logs: LogEntry[];
  loading?: boolean;
  compact?: boolean;
}

function formatTime(epoch: number): string {
  const d = new Date(epoch * 1000);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function timeAgo(epoch: number): string {
  const diff = Math.floor(Date.now() / 1000) - epoch;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function LogTable({ logs, loading, compact }: LogTableProps) {
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              height: "52px",
              background: "var(--bg-card)",
              borderRadius: "8px",
              marginBottom: "0.5rem",
              animation: "pulse 1.5s ease-in-out infinite",
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.9rem",
        }}
      >
        No access logs yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Status", "Owner", "UID / Tag", "Time", ""].map((h) => (
              <th
                key={h}
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {logs.map((log, idx) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-card-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                }}
              >
                {/* Status */}
                <td style={{ padding: "0.85rem 1rem" }}>
                  {log.status ? (
                    <span className="badge-granted">
                      <CheckCircle size={11} /> Granted
                    </span>
                  ) : (
                    <span className="badge-denied">
                      <XCircle size={11} /> Denied
                    </span>
                  )}
                </td>

                {/* Owner */}
                <td style={{ padding: "0.85rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: log.status ? "var(--green-dim)" : "var(--red-dim)",
                        border: `1px solid ${log.status ? "rgba(34,211,165,0.25)" : "rgba(245,92,122,0.25)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: log.status ? "var(--green)" : "var(--red)",
                        flexShrink: 0,
                      }}
                    >
                      {log.owner ? log.owner[0].toUpperCase() : "?"}
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>
                      {log.owner || "Unknown"}
                    </span>
                  </div>
                </td>

                {/* UID */}
                <td style={{ padding: "0.85rem 1rem" }}>
                  <code
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      background: "var(--bg-secondary)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "5px",
                      fontFamily: "monospace",
                    }}
                  >
                    {log.tag || "N/A"}
                  </code>
                </td>

                {/* Time */}
                <td style={{ padding: "0.85rem 1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>
                      {formatTime(log.time)}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                      {timeAgo(log.time)}
                    </p>
                  </div>
                </td>

                <td style={{ padding: "0.85rem 1rem" }}>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
