"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CreditCard, Search } from "lucide-react";
import { useCards } from "@/lib/hooks/useCards";
import CardList from "@/components/CardList";
import AddCardModal from "@/components/AddCardModal";

export default function CardsPage() {
  const { cards, loading, addCard, removeCard, updateCard } = useCards();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = cards.filter(
    (c) =>
      c.owner.toLowerCase().includes(search.toLowerCase()) ||
      c.uid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Card Manager
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Manage authorized RFID cards for door access.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
          id="add-card-btn"
        >
          <Plus size={16} /> Add Card
        </button>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}
      >
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={16} color="var(--accent)" />
          </div>
          <div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Total Cards</p>
            <p style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
              {loading ? "—" : cards.length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ position: "relative", marginBottom: "1.25rem" }}
      >
        <div style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <Search size={16} color="var(--text-muted)" />
        </div>
        <input
          className="input-field"
          placeholder="Search by owner or UID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "2.5rem" }}
        />
      </motion.div>

      {/* Card List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <CardList
          cards={filtered}
          loading={loading}
          onRemove={removeCard}
          onUpdate={updateCard}
        />
      </motion.div>

      {!loading && filtered.length === 0 && search && (
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "2rem" }}>
          No cards match "{search}"
        </p>
      )}

      <AddCardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addCard}
      />
    </div>
  );
}
