"use client";

import { BarChart2, TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";

export default function AdminAnalitikPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Analitik & Laporan</h1>
        <p className="text-sm" style={{ color: "var(--text-light)" }}>Data performa platform Civilians bulan Maret 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Pertumbuhan Pengguna", val: "+12.4%", trend: "up", icon: Users, color: "var(--green)" },
          { label: "Konversi Kursus", val: "8.2%", trend: "up", icon: TrendingUp, color: "var(--green)" },
          { label: "Rata-rata Order", val: "Rp 162.000", trend: "down", icon: ShoppingBag, color: "var(--burgundy)" },
        ].map((s) => (
          <div key={s.label} className="card p-6 flex items-center justify-between">
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--text-light)" }}>{s.label}</p>
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</h3>
              <div className="flex items-center gap-1 mt-1">
                {s.trend === "up" ? <ArrowUpRight size={14} color="var(--green)" /> : <ArrowDownRight size={14} color="var(--burgundy)" />}
                <span className="text-xs" style={{ color: s.trend === "up" ? "var(--green)" : "var(--burgundy)" }}>
                  {s.trend === "up" ? "+2.1% dr bln lalu" : "-0.5% dr bln lalu"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
              <s.icon size={22} style={{ color: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <AnimatedSection>
        <div className="card p-8 text-center border-dashed border-2 flex flex-col items-center justify-center min-h-[300px]" style={{ borderColor: "var(--border)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(84,110,122,0.1)" }}>
             <BarChart2 size={32} style={{ color: "var(--text-secondary)" }} />
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>Modul Analitik Lanjutan</h3>
          <p className="text-sm max-w-sm" style={{ color: "var(--text-light)" }}>
            Bagan interaktif dan ekspor data CSV sedang dalam pengembangan. 
            Modul ini akan menampilkan retensi pengguna dan analisis pendapatan per kategori.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
