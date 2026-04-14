"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, CreditCard, User } from "lucide-react";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (uid: string, owner: string) => Promise<void>;
}

export default function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [uid, setUid] = useState("");
  const [owner, setOwner] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!uid.trim() || !owner.trim()) {
      setError("Both UID and owner name are required.");
      return;
    }
    setBusy(true);
    try {
      await onAdd(uid.trim(), owner.trim());
      setUid("");
      setOwner("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add card.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 200,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "420px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-accent)",
              borderRadius: "16px",
              padding: "2rem",
              zIndex: 201,
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "var(--accent-dim)",
                    border: "1px solid var(--border-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CreditCard size={18} color="var(--accent)" />
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Add New Card
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.35rem",
                  display: "flex",
                  transition: "all 0.15s",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  RFID UID
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. A1B2C3D4"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  spellCheck={false}
                  style={{ fontFamily: "monospace", textTransform: "uppercase" }}
                />
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                  Scan the card near the reader and check the serial log for the UID.
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  Owner Name
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. John Doe"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>

              {error && (
                <p style={{ fontSize: "0.82rem", color: "var(--red)", background: "var(--red-dim)", border: "1px solid rgba(245,92,122,0.25)", padding: "0.5rem 0.75rem", borderRadius: "8px" }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1, padding: "0.7rem" }}>
                  Cancel
                </button>
                <button type="submit" disabled={busy} className="btn-primary" style={{ flex: 1, padding: "0.7rem" }}>
                  {busy ? "Adding..." : <><Plus size={16} /> Add Card</>}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
