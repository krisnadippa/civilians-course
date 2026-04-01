"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, BookOpen, ShoppingBag, ArrowUpRight,
  CheckCircle2, Clock, UserCheck, AlertCircle, TrendingUp
} from "lucide-react";
import AnimatedSection from "../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    mentors: 0,
    orders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const getCount = async (table: string) => {
        const { count, error } = await supabase.from(table).select("*", { count: 'exact', head: true });
        if (error) { console.error(`Error fetching count for ${table}:`, error); return 0; }
        return count || 0;
      };

      const [cCount, mCount, oCount, uCount] = await Promise.all([
        getCount("courses"),
        getCount("mentors"),
        getCount("course_orders"),
        getCount("profiles") // if profiles exist
      ]);

      setStats({
        users: uCount || 0,
        courses: cCount,
        mentors: mCount,
        orders: oCount
      });

      // Fetch recent orders
      const { data: recent } = await supabase
        .from("course_orders")
        .select("id, status, price_paid, created_at, profiles(name), courses(title)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recent) setRecentOrders(recent);
    } catch (error) {
      console.error("Fatal dashboard fetch error:", error);
    }
    setLoading(false);
  }

  const statCards = [
    { title: "Total Pengguna", value: stats.users, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { title: "Modul Aktif", value: stats.courses, icon: BookOpen, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
    { title: "Mentor", value: stats.mentors, icon: UserCheck, color: "bg-violet-50 text-violet-600", border: "border-violet-100" },
    { title: "Transaksi", value: stats.orders, icon: ShoppingBag, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dashboard Admin</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Ringkasan aktivitas platform Civilians.</p>
        </div>
      </div>

      {!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ? (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Database Belum Terhubung</h3>
            <p className="text-xs text-amber-700 mt-1">
              Silakan perbarui file <code>.env.local</code> Anda dengan URL dan Anon Key dari Supabase untuk mengaktifkan admin panel.
            </p>
          </div>
        </div>
      ) : null}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <AnimatedSection key={s.title} delay={i * 0.1}>
            <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow`}>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">{s.title}</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {loading ? "..." : s.value}
                  </h3>
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <TrendingUp size={10} className="mr-0.5" /> +12%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.color} ${s.border}`}>
                <s.icon size={20} />
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ORDERS */}
        <AnimatedSection delay={0.4} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-extrabold text-slate-900 text-sm">Pesanan Terbaru</h2>
              <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Lihat Semua <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
              {loading ? (
                <p className="text-xs text-slate-400 text-center font-bold">Memuat...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center font-bold">Belum ada pesanan terbaru.</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((ord, i) => (
                    <div key={ord.id || i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          ord.status === "Selesai" ? "bg-blue-50 text-blue-600" :
                          ord.status === "Aktif" ? "bg-emerald-50 text-emerald-600" :
                          ord.status === "Dibatalkan" ? "bg-red-50 text-red-600" :
                          "bg-amber-50 text-amber-600"
                        }`}>
                          {ord.status === "Selesai" ? <CheckCircle2 size={18} /> : 
                           ord.status === "Aktif" ? <BookOpen size={18} /> : 
                           <Clock size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{ord.profiles?.name || "Kustomer"}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-xs">{ord.courses?.title || "Pesanan Kursus"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Rp {(ord.price_paid || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          {ord.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* QUICK ACTIONS */}
        <AnimatedSection delay={0.5} className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="font-extrabold text-slate-900 text-sm">Aksi Cepat</h2>
            </div>
            <div className="p-5 space-y-3">
              <Link href="/admin/kursus" className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <BookOpen size={18} />
                </div>
                <div className="text-left flex-1 border-r border-slate-200">
                  <p className="text-sm font-bold text-slate-900">Tambah Kursus</p>
                  <p className="text-[10px] font-medium text-slate-500">Buat modul baru</p>
                </div>
              </Link>

              <Link href="/admin/orders" className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <ShoppingBag size={18} />
                </div>
                <div className="text-left flex-1 border-r border-slate-200">
                  <p className="text-sm font-bold text-slate-900">Validasi Pembayaran</p>
                  <p className="text-[10px] font-medium text-slate-500">Cek pesanan konfirmasi</p>
                </div>
              </Link>
              
              <Link href="/admin/mentor" className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                  <UserCheck size={18} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-slate-900">Kelola Mentor</p>
                  <p className="text-[10px] font-medium text-slate-500">Tambah staf pengajar</p>
                </div>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

    </div>
  );
}
