"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, BookOpen, ShoppingBag, TrendingUp, ArrowUpRight,
  Calendar, CheckCircle2, Clock, UserCheck, AlertCircle, Wrench
} from "lucide-react";
import AnimatedSection from "../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

const recentOrders = [
  { id: "#ORD-2401", user: "Ahmad Fauzi", item: "Template RAB Perumahan", status: "Selesai", amount: "145.000", date: "19 Mar 2026" },
  { id: "#ORD-2399", user: "Dina Marlena", item: "Set Gambar CAD Ruko", status: "Selesai", amount: "195.000", date: "18 Mar 2026" },
  { id: "#ORD-2395", user: "Rizki Pratama", item: "Model Civil 3D Jalan", status: "Diproses", amount: "225.000", date: "17 Mar 2026" },
  { id: "#ORD-2390", user: "Sari Dewi", item: "Panduan SAP2000", status: "Selesai", amount: "95.000", date: "16 Mar 2026" },
  { id: "#ORD-2385", user: "Budi Santoso Jr.", item: "Template RAB Gedung", status: "Menunggu", amount: "175.000", date: "15 Mar 2026" },
];

const recentBookings = [
  { name: "Ahmad Fauzi", mentor: "Dr. Ir. Budi Santoso", slot: "Senin 19:00", status: "Dikonfirmasi" },
  { name: "Siti Rohani", mentor: "Ir. Siti Rahayu", slot: "Selasa 18:00", status: "Pending" },
  { name: "Rizki P.", mentor: "Andi Prasetyo", slot: "Rabu 20:00", status: "Dikonfirmasi" },
  { name: "Dewi A.", mentor: "Dr. Dewi Kusuma", slot: "Kamis 19:00", status: "Dikonfirmasi" },
];

/* Simple inline chart using SVG */
function RevenueChart() {
  const data = [8, 12, 9, 15, 11, 18, 14, 20, 16, 22, 19, 24]; // simplified
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 380},${90 - (v / max) * 80}`).join(" ");

  return (
    <svg viewBox="0 0 400 100" className="w-full" style={{ height: 120 }}>
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00897B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00897B" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 33, 66, 100].map((y) => (
        <line key={y} x1="0" y1={y * 0.9} x2="400" y2={y * 0.9} stroke="rgba(84,110,122,0.1)" strokeWidth="1" />
      ))}
      {/* Area fill */}
      <polygon
        points={`0,90 ${points} 380,90`}
        fill="url(#revGrad)"
      />
      {/* Line */}
      <polyline points={points} fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * 380} cy={90 - (v / max) * 80} r="3.5" fill="#00897B" />
      ))}
    </svg>
  );
}

function BookingChart() {
  const data = [
    { mentor: "Budi S.", count: 87 },
    { mentor: "Siti R.", count: 65 },
    { mentor: "Andi P.", count: 54 },
    { mentor: "Dewi K.", count: 42 },
  ];
  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex items-end gap-4 h-32">
      {data.map((d, i) => (
        <div key={d.mentor} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-xs font-bold" style={{ color: "var(--green)" }}>{d.count}</span>
          <motion.div
            initial={{ height: 0 }} animate={{ height: `${(d.count / max) * 100}px` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className="w-full rounded-t-lg"
            style={{ background: i % 2 === 0 ? "var(--green)" : "var(--slate-light)", minWidth: 32 }}
          />
          <span className="text-xs text-center" style={{ color: "var(--text-light)", fontSize: "0.65rem" }}>{d.mentor}</span>
        </div>
      ))}
    </div>
  );
}

const statusColors: Record<string, string> = {
  "Selesai": "#00897B",
  "Diproses": "#1A56DB",
  "Menunggu": "#FFA000",
  "Dikonfirmasi": "#00897B",
  "Pending": "#FFA000",
  "Tinggi": "#DC2626",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    kursus: 0,
    mentors: 0,
    jasa: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const isConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  async function fetchStats() {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Helper to fetch count for a table
      const getCount = async (table: string) => {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: 'exact', head: true });
        
        if (error) {
          console.error(`Error fetching count for ${table}:`, error);
          return 0;
        }
        return count || 0;
      };

      const [kCount, jCount, mCount, pCount] = await Promise.all([
        getCount("kursus"),
        getCount("jasa"),
        getCount("mentors"),
        getCount("products")
      ]);

      setStats({
        users: 2418, // Mock for now
        kursus: kCount,
        jasa: jCount,
        mentors: mCount,
        products: pCount
      });
    } catch (error) {
      console.error("Fatal dashboard fetch error:", error);
    }
    setLoading(false);
  }

  const kpiCards = [
    { label: "Total Pengguna", value: stats.users.toLocaleString("id"), change: "+12.4%", up: true, icon: Users, color: "var(--primary)" },
    { label: "Kursus Aktif", value: stats.kursus, change: "+3", up: true, icon: BookOpen, color: "#475569" },
    { label: "Mentor", value: stats.mentors, change: "+1", up: true, icon: Calendar, color: "#3B82F6" },
    { label: "Permintaan Jasa", value: stats.jasa, change: "+5", up: true, icon: Wrench, color: "#1E293B" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
            Panel Ringkasan Platform
          </h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>Data real-time ekosistem Civilians</p>
        </div>
        <div className="flex gap-2">
          {!isConfigured ? (
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <AlertCircle size={12} /> Konfigurasi Belum Terdeteksi
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">Sistem Aktif</span>
          )}
        </div>
      </div>

      {!isConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-bold text-amber-800">Koneksi Supabase Belum Siap</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Environment variables di <code className="bg-amber-100 px-1 rounded">.env.local</code> belum terbaca oleh browser. 
              Mohon <strong>matikan server (Ctrl+C)</strong> lalu jalankan kembali dengan <strong>npm run dev</strong>.
              Pastikan tidak ada logo "placeholder" di file <code className="bg-amber-100 px-1 rounded">lib/supabase.ts</code>.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((kpi, i) => (
          <AnimatedSection key={kpi.label} delay={i * 0.07}>
            <div className="card p-5 border-none shadow-sm shadow-blue-500/5 bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${kpi.color}10` }}>
                  <kpi.icon size={20} style={{ color: kpi.color }} />
                </div>
                <span className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: kpi.up ? "var(--primary)" : "#800020" }}>
                  <ArrowUpRight size={13} />
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-extrabold mb-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
                {loading ? "..." : kpi.value}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-light)" }}>{kpi.label}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Revenue */}
        <AnimatedSection delay={0.1}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
                  Pendapatan Bulanan
                </h3>
                <p className="text-xs" style={{ color: "var(--text-light)" }}>Jan – Des 2025</p>
              </div>
              <span className="tag-green">+24.3% YoY</span>
            </div>
            <RevenueChart />
            <div className="flex justify-between mt-2">
              {["Jan", "Mar", "Mei", "Jul", "Sep", "Nov"].map((m) => (
                <span key={m} className="text-xs" style={{ color: "var(--text-light)" }}>{m}</span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Booking Bar */}
        <AnimatedSection delay={0.15}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
                  Status Booking Mentor
                </h3>
                <p className="text-xs" style={{ color: "var(--text-light)" }}>Bulan ini</p>
              </div>
              <span className="tag-green">87 sesi total</span>
            </div>
            <BookingChart />
          </div>
        </AnimatedSection>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <AnimatedSection className="lg:col-span-2" delay={0.1}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
                Pesanan Terbaru
              </h3>
              <Link href="/admin/toko" className="text-xs font-medium" style={{ color: "var(--green)" }}>Lihat semua →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["ID", "Pengguna", "Produk", "Status", "Total"].map((h) => (
                      <th key={h} className="pb-2.5 text-left font-semibold" style={{ color: "var(--text-light)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid rgba(84,110,122,0.08)" }}>
                      <td className="py-3 font-mono" style={{ color: "var(--slate)" }}>{o.id}</td>
                      <td className="py-3 font-medium" style={{ color: "#1C2433" }}>{o.user}</td>
                      <td className="py-3" style={{ color: "var(--text-secondary)" }}>{o.item}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status] }}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 font-semibold" style={{ color: "#1C2433" }}>Rp {o.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>

        {/* Recent Bookings */}
        <AnimatedSection delay={0.15}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
                Booking Terbaru
              </h3>
              <Link href="/admin/mentor" className="text-xs font-medium" style={{ color: "var(--green)" }}>Semua →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentBookings.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(84,110,122,0.05)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "var(--green)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {b.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#1C2433" }}>{b.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-light)" }}>{b.mentor}</p>
                    <p className="text-xs" style={{ color: "var(--slate-light)" }}>{b.slot}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                    style={{ background: `${statusColors[b.status]}20`, color: statusColors[b.status] }}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
