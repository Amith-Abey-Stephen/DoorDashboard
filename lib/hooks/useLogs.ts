"use client";

import { useEffect, useState } from "react";
import { ref, onValue, query, orderByKey, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";

export interface LogEntry {
  id: string;
  owner: string;
  tag: string;
  status: boolean;
  time: number;
}

export function useLogs(limit = 50) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logsRef = query(
      ref(db, "SmartDoor/logs"),
      orderByKey(),
      limitToLast(limit)
    );

    const unsub = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setLogs([]);
        setLoading(false);
        return;
      }

      const entries: LogEntry[] = Object.entries(data)
        .map(([id, val]) => {
          const v = val as Omit<LogEntry, "id">;
          return { id, ...v };
        })
        .sort((a, b) => b.time - a.time); // newest first

      setLogs(entries);
      setLoading(false);
    });

    return () => unsub();
  }, [limit]);

  return { logs, loading };
}
