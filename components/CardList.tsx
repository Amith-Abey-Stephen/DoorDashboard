"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Check, X, CreditCard } from "lucide-react";
import { Card } from "@/lib/hooks/useCards";

interface CardListProps {
  cards: Card[];
  loading?: boolean;
  onRemove: (uid: string) => Promise<void>;
  onUpdate: (uid: string, newOwner: string) => Promise<void>;
}

export default function CardList({ cards, loading, onRemove, onUpdate }: CardListProps) {
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const startEdit = (card: Card) => {
    setEditingUid(card.uid);
    setEditValue(card.owner);
  };

  const saveEdit = async (uid: string) => {
    setBusy(true);
    await onUpdate(uid, editValue);
    setEditingUid(null);
    setBusy(false);
  };

  const confirmDelete = async (uid: string) => {
    setBusy(true);
    await onRemove(uid);
    setDeleteConfirm(null);
    setBusy(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: "64px", background: "var(--bg-card)", borderRadius: "10px", opacity: 1 - i * 0.2 }} />
        ))}
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        <CreditCard size={40} style={{ marginBottom: "0.75rem", opacity: 0.3, display: "block", margin: "0 auto 0.75rem" }} />
        No RFID cards registered yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.uid}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem 1.25rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              gap: "1rem",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
            }}
          >
            {/* Icon + info */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "var(--accent-dim)",
                  border: "1px solid var(--border-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CreditCard size={18} color="var(--accent)" />
              </div>

              <div style={{ minWidth: 0 }}>
                {editingUid === card.uid ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(card.uid)}
                    className="input-field"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.875rem", width: "200px" }}
                    autoFocus
                  />
                ) : (
                  <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.15rem" }}>
                    {card.owner}
                  </p>
                )}
                <code style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                  {card.uid}
                </code>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              {editingUid === card.uid ? (
                <>
                  <button
                    onClick={() => saveEdit(card.uid)}
                    disabled={busy}
                    style={{
                      padding: "0.4rem 0.75rem",
                      background: "var(--green-dim)",
                      border: "1px solid rgba(34,211,165,0.3)",
                      borderRadius: "7px",
                      color: "var(--green)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    <Check size={14} />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUid(null)}
                    style={{
                      padding: "0.4rem",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "7px",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : deleteConfirm === card.uid ? (
                <>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Sure?</span>
                  <button onClick={() => confirmDelete(card.uid)} disabled={busy} className="btn-danger">
                    Delete
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} style={{ padding: "0.35rem 0.75rem", background: "transparent", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(card)}
                    style={{
                      padding: "0.4rem",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "7px",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)")}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(card.uid)}
                    className="btn-danger"
                    style={{ padding: "0.4rem" }}
                    title="Delete card"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
