"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, MessageSquare, Eye, Wrench, Clock, AlertCircle } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";

const initialInquiries = [
  { id: "#JS-3001", user: "Rian Hidayat", email: "rian.h@email.com", service: "Analisis Struktur Gedung", type: "Struktur", status: "Diproses", priority: "Tinggi", date: "23 Mar 2026" },
  { id: "#JS-2998", user: "Siska Putri", email: "siska.p@email.com", service: "Penyusunan RAB Renovasi", type: "RAB", status: "Menunggu", priority: "Normal", date: "22 Mar 2026" },
  { id: "#JS-2995", user: "Bambang W.", email: "bambang.w@email.com", service: "Desain Interior & Layout", type: "Desain", status: "Selesai", priority: "Rendah", date: "21 Mar 2026" },
  { id: "#JS-2990", user: "Anita Sari", email: "anita.s@email.com", service: "Gambar IMB Ruko 3 Lantai", type: "Gambar", status: "Diproses", priority: "Tinggi", date: "20 Mar 2026" },
  { id: "#JS-2985", user: "Eko Prasetyo", email: "eko.p@email.com", service: "Manajemen Proyek Gudang", type: "Manajemen", status: "Menunggu", priority: "Normal", date: "19 Mar 2026" },
];

const statusColors: Record<string, string> = {
  "Selesai": "#00897B",
  "Diproses": "#546E7A",
  "Menunggu": "#FFA000",
};

const priorityColors: Record<string, string> = {
  "Tinggi": "#DC2626",
  "Normal": "#1A56DB",
  "Rendah": "#64748B",
};

export default function AdminJasaPage() {
  const [data, setData] = useState(initialInquiries);
  const [statusFilter, setStatusFilter] = useState("Semua");

  const filtered = data.filter((item) => statusFilter === "Semua" || item.status === statusFilter);
  
  const updateStatus = (id: string, newStatus: string) => {
    setData((prev) => prev.map((item) => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
            Layanan Jasa & Konsultasi
          </h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>
            Kelola permintaan jasa desain, RAB, dan analisis struktur dari klien.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="card px-4 py-2 flex items-center gap-2 bg-white">
            <Clock size={16} className="text-blue-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Menunggu</p>
              <p className="text-sm font-bold text-slate-700">{data.filter(i => i.status === "Menunggu").length}</p>
            </div>
          </div>
          <div className="card px-4 py-2 flex items-center gap-2 bg-white">
            <AlertCircle size={16} className="text-red-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Prioritas</p>
              <p className="text-sm font-bold text-slate-700">{data.filter(i => i.priority === "Tinggi").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["Semua", "Menunggu", "Diproses", "Selesai"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ 
              background: statusFilter === s ? "var(--primary)" : "white", 
              color: statusFilter === s ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border)"
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatedSection>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50/50" style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Klien", "Layanan", "Kategori", "Prioritas", "Status", "Tanggal", "Aksi"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{item.user}</p>
                      <p className="text-slate-400">{item.email}</p>
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--primary)" }}>{item.id}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">{item.service}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase" style={{ background: "var(--blue-50)", color: "var(--primary)" }}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: priorityColors[item.priority] }} />
                        <span className="font-semibold" style={{ color: priorityColors[item.priority] }}>{item.priority}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                        style={{ background: `${statusColors[item.status]}15`, color: statusColors[item.status] }}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-medium">{item.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {item.status === "Menunggu" && (
                          <button 
                            onClick={() => updateStatus(item.id, "Diproses")}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="Terima Inkuiri"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Hubungi Klien">
                          <MessageSquare size={14} />
                        </button>
                        <button className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors" title="Lihat Detail">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Wrench size={40} className="mb-2 opacity-20" />
              <p>Tidak ada permintaan jasa ditemukan.</p>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
