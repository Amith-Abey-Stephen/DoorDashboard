"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useLogs } from "@/lib/hooks/useLogs";
import StatCard from "@/components/StatCard";
import LogTable from "@/components/LogTable";
import LiveBadge from "@/components/LiveBadge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const { logs, loading } = useLogs(100);

  const stats = useMemo(() => {
    if (!logs.length) return { total: 0, granted: 0, denied: 0, uniqueUsers: 0, grantedPct: 0 };
    const now = Date.now() / 1000;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTs = todayStart.getTime() / 1000;

    const todayLogs = logs.filter((l) => l.time >= todayTs);
    const granted = todayLogs.filter((l) => l.status).length;
    const denied = todayLogs.filter((l) => !l.status).length;
    const total = todayLogs.length;
    const uniqueUsers = new Set(logs.filter((l) => l.owner && l.owner !== "Unknown" && l.owner !== "").map((l) => l.owner)).size;
    const grantedPct = total > 0 ? Math.round((granted / total) * 100) : 0;

    return { total, granted, denied, uniqueUsers, grantedPct };
  }, [logs]);

  // Chart data — last 7 days
  const chartData = useMemo(() => {
    const days: { [key: string]: { day: string; granted: number; denied: number } } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { weekday: "short" });
      days[d.toDateString()] = { day: key, granted: 0, denied: 0 };
    }

    logs.forEach((log) => {
      const d = new Date(log.time * 1000).toDateString();
      if (days[d]) {
        if (log.status) days[d].granted++;
        else days[d].denied++;
      }
    });

    return Object.values(days);
  }, [logs]);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Real-time overview of your smart door system.
          </p>
        </div>
        <LiveBadge />
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard
          title="Today's Access Events"
          value={loading ? "—" : stats.total}
          icon={Activity}
          color="accent"
          subtitle="Total door events today"
        />
        <StatCard
          title="Access Granted"
          value={loading ? "—" : stats.granted}
          icon={CheckCircle}
          color="green"
          subtitle={`${stats.grantedPct}% success rate`}
        />
        <StatCard
          title="Access Denied"
          value={loading ? "—" : stats.denied}
          icon={XCircle}
          color="red"
          subtitle="Unauthorized attempts"
        />
        <StatCard
          title="Unique Users"
          value={loading ? "—" : stats.uniqueUsers}
          icon={Users}
          color="default"
          subtitle="Across all logs"
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "1.5rem" }}
        >
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TrendingUp size={16} color="var(--accent)" />
            Weekly Access Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradGranted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3a5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3a5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDenied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f55c7a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f55c7a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#55556a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#55556a", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.8rem" }}
                itemStyle={{ color: "var(--text-primary)" }}
                labelStyle={{ color: "var(--text-secondary)" }}
              />
              <Area type="monotone" dataKey="granted" stroke="#22d3a5" strokeWidth={2} fill="url(#gradGranted)" name="Granted" />
              <Area type="monotone" dataKey="denied" stroke="#f55c7a" strokeWidth={2} fill="url(#gradDenied)" name="Denied" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "1.5rem" }}
        >
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={16} color="var(--accent)" />
            Daily Comparison
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#55556a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#55556a", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.8rem" }}
                itemStyle={{ color: "var(--text-primary)" }}
                labelStyle={{ color: "var(--text-secondary)" }}
              />
              <Bar dataKey="granted" fill="#22d3a5" radius={[4, 4, 0, 0]} name="Granted" />
              <Bar dataKey="denied" fill="#f55c7a" radius={[4, 4, 0, 0]} name="Denied" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Live Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={16} color="var(--accent)" />
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Live Access Log
            </h3>
          </div>
          <LiveBadge />
        </div>
        <LogTable logs={logs} loading={loading} />
      </motion.div>
    </div>
  );
}
