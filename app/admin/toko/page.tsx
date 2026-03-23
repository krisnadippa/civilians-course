"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Download, Eye, Package, Plus } from "lucide-react";
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
  const [view, setView] = useState("orders"); // "orders" or "products"
  const [data, setData] = useState(orders);
  const [statusFilter, setStatusFilter] = useState("Semua");

  const products = [
    { id: 1, name: "Template RAB Perumahan", category: "RAB", price: 145000, stock: 99, status: "Tersedia" },
    { id: 2, name: "Set Gambar CAD Ruko", category: "Gambar CAD", price: 195000, stock: 45, status: "Tersedia" },
    { id: 3, name: "Jasa Pembuatan PPT Sidang", category: "Jasa", price: 75000, stock: 0, status: "Pre-order" },
    { id: 4, name: "Model Civil 3D Jalan Raya", category: "Civil 3D", price: 225000, stock: 12, status: "Tersedia" },
  ];

  const filtered = data.filter((o) => statusFilter === "Semua" || o.status === statusFilter);
  const totalRevenue = data.filter(o => o.status === "Selesai").reduce((s, o) => s + o.amount, 0);
  const confirm = (id: string) => setData((d) => d.map((o) => o.id === id ? { ...o, status: "Selesai" } : o));
  const cancel = (id: string) => setData((d) => d.filter((o) => o.id !== id));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Toko & Produk</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>Kelola pesanan pelanggan dan katalog produk Civilians.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setView("orders")} 
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === "orders" ? "bg-primary text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-500 border border-slate-200"}`}>
             Pesanan Masuk
           </button>
           <button onClick={() => setView("products")}
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === "products" ? "bg-primary text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-500 border border-slate-200"}`}>
             Katalog Produk
           </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Pesanan", val: data.length, color: "var(--primary)" },
          { label: "Pendapatan", val: `Rp ${totalRevenue.toLocaleString("id")}`, color: "#00897B" },
          { label: "Produk Aktif", val: products.length, color: "#475569" },
          { label: "Stok Tipis", val: "2", color: "#FFA000" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-5 bg-white shadow-sm border-none">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-light)" }}>{label}</p>
            <p className="font-bold text-xl" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
          </div>
        ))}
      </div>

      <AnimatedSection>
        {view === "orders" ? (
          <div className="card overflow-hidden border-none shadow-sm">
            <div className="p-4 border-b flex items-center justify-between bg-white overflow-x-auto gap-2">
              <div className="flex gap-2">
                {["Semua", "Selesai", "Diproses", "Menunggu"].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    {["ID", "Pengguna", "Produk", "Status", "Total", "Aksi"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-slate-400">{o.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-700">{o.user}</p>
                        <p className="text-[10px] text-slate-400">{o.email}</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">{o.item}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                          style={{ background: `${statusColors[o.status]}15`, color: statusColors[o.status] }}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-blue-600">Rp {o.amount.toLocaleString("id")}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {o.status === "Menunggu" && (
                            <>
                              <button onClick={() => confirm(o.id)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-all text-[10px] uppercase">
                                <CheckCircle2 size={12} /> Selesai
                              </button>
                              <button onClick={() => cancel(o.id)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-[10px] uppercase">
                                <XCircle size={12} /> Batal
                              </button>
                            </>
                          )}
                          {o.status === "Selesai" && (
                            <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                              <Download size={12} /> Unduh
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
        ) : (
          <div className="card overflow-hidden border-none shadow-sm">
            <div className="p-5 border-b bg-white flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Katalog Produk</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">
                <Plus size={14} /> Tambah Produk
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    {["Nama Produk", "Kategori", "Harga", "Stok", "Aksi"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-700">{p.name}</td>
                      <td className="px-5 py-4 capitalize text-slate-500">{p.category}</td>
                      <td className="px-5 py-4 font-bold">Rp {p.price.toLocaleString("id")}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded font-bold text-[10px] ${p.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {p.stock > 0 ? `${p.stock} Unit` : "Habis"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-3 justify-end">
                           <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-[10px] uppercase">
                             Edit
                           </button>
                           <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-[10px] uppercase">
                             Hapus
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
