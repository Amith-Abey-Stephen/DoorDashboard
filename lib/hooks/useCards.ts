"use client";

import { useEffect, useState } from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { db } from "@/lib/firebase";

export interface Card {
  uid: string;   // the key in Firebase (RFID UID)
  owner: string; // the value
}

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cardsRef = ref(db, "SmartDoor/cards");
    const unsub = onValue(cardsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setCards([]);
        setLoading(false);
        return;
      }
      const list: Card[] = Object.entries(data).map(([uid, owner]) => ({
        uid,
        owner: owner as string,
      }));
      setCards(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addCard = async (uid: string, owner: string) => {
    const normalized = uid.toUpperCase().replace(/\s/g, "");
    await set(ref(db, `SmartDoor/cards/${normalized}`), owner);
  };

  const removeCard = async (uid: string) => {
    await remove(ref(db, `SmartDoor/cards/${uid}`));
  };

  const updateCard = async (uid: string, newOwner: string) => {
    await set(ref(db, `SmartDoor/cards/${uid}`), newOwner);
  };

  return { cards, loading, addCard, removeCard, updateCard };
}
