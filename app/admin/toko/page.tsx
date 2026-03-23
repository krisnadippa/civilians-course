"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Download, Eye, Package } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";

const orders = [
  { id: "#ORD-2401", user: "Ahmad Fauzi", email: "ahmad@email.com", item: "Template RAB Perumahan", category: "RAB", status: "Selesai", amount: 145000, date: "19 Mar 2026" },
  { id: "#ORD-2399", user: "Dina Marlena", email: "dina@email.com", item: "Set Gambar CAD Ruko", category: "Gambar CAD", status: "Selesai", amount: 195000, date: "18 Mar 2026" },
  { id: "#ORD-2395", user: "Rizki Pratama", email: "rizki@email.com", item: "Model Civil 3D Jalan", category: "Civil 3D", status: "Diproses", amount: 225000, date: "17 Mar 2026" },
  { id: "#ORD-2390", user: "Sari Dewi", email: "sari@email.com", item: "Panduan SAP2000", category: "Struktur", status: "Selesai", amount: 95000, date: "16 Mar 2026" },
  { id: "#ORD-2385", user: "Budi Jr.", email: "budi.jr@email.com", item: "Template RAB Gedung", category: "RAB", status: "Menunggu", amount: 175000, date: "15 Mar 2026" },
  { id: "#ORD-2381", user: "Cinta S.", email: "cinta@email.com", item: "Set Gambar CAD Jembatan", category: "Gambar CAD", status: "Selesai", amount: 275000, date: "14 Mar 2026" },
  { id: "#ORD-2379", user: "Dono K.", email: "dono@email.com", item: "Template Laporan Proyek", category: "Panduan", status: "Menunggu", amount: 85000, date: "13 Mar 2026" },
];

const statusColors: Record<string, string> = {
  "Selesai": "#00897B",
  "Diproses": "#546E7A",
  "Menunggu": "#FFA000",
};

export default function AdminTokoPage() {
  const [data, setData] = useState(orders);
  const [statusFilter, setStatusFilter] = useState("Semua");

  const filtered = data.filter((o) => statusFilter === "Semua" || o.status === statusFilter);
  const totalRevenue = data.filter(o => o.status === "Selesai").reduce((s, o) => s + o.amount, 0);
  const confirm = (id: string) => setData((d) => d.map((o) => o.id === id ? { ...o, status: "Selesai" } : o));
  const cancel = (id: string) => setData((d) => d.filter((o) => o.id !== id));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Toko & Pesanan</h1>
        <p className="text-sm" style={{ color: "var(--text-light)" }}>{orders.length} total pesanan · Rp {totalRevenue.toLocaleString("id")} pendapatan terkonfirmasi</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Pesanan", val: data.length, color: "#546E7A" },
          { label: "Selesai", val: data.filter(o => o.status === "Selesai").length, color: "#00897B" },
          { label: "Diproses", val: data.filter(o => o.status === "Diproses").length, color: "#546E7A" },
          { label: "Menunggu", val: data.filter(o => o.status === "Menunggu").length, color: "#FFA000" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-4 text-center" style={{ borderTop: `2px solid ${color}` }}>
            <p className="font-bold text-xl" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
            <p className="text-xs" style={{ color: "var(--text-light)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["Semua", "Selesai", "Diproses", "Menunggu"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: statusFilter === s ? "var(--green)" : "rgba(84,110,122,0.08)", color: statusFilter === s ? "white" : "var(--text-secondary)" }}>
            {s}
          </button>
        ))}
      </div>

      <AnimatedSection>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "rgba(84,110,122,0.06)", borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Pengguna", "Produk", "Kategori", "Status", "Total", "Tanggal", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-bold" style={{ color: "var(--text-light)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid rgba(84,110,122,0.06)" }}>
                    <td className="px-4 py-3 font-mono" style={{ color: "var(--slate)" }}>{o.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold" style={{ color: "#1C2433" }}>{o.user}</p>
                      <p style={{ color: "var(--text-light)" }}>{o.email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)", maxWidth: 160 }}>{o.item}</td>
                    <td className="px-4 py-3"><span className="tag-green">{o.category}</span></td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status] }}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color: "var(--burgundy)" }}>Rp {o.amount.toLocaleString("id")}</td>
                    <td className="px-4 py-3" style={{ color: "var(--text-light)" }}>{o.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {o.status === "Menunggu" && (
                          <>
                            <button onClick={() => confirm(o.id)} className="p-1.5 rounded-lg" style={{ color: "var(--green)", background: "rgba(0,137,123,0.1)" }}>
                              <CheckCircle2 size={12} />
                            </button>
                            <button onClick={() => cancel(o.id)} className="p-1.5 rounded-lg" style={{ color: "var(--burgundy)", background: "rgba(128,0,32,0.08)" }}>
                              <XCircle size={12} />
                            </button>
                          </>
                        )}
                        {o.status === "Selesai" && (
                          <button className="p-1.5 rounded-lg" style={{ color: "var(--slate)", background: "rgba(84,110,122,0.08)" }}>
                            <Download size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
