"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";

const kursus = [
  { id: 1, title: "Analisis Struktur Beton Bertulang", category: "Struktur", level: "Menengah", students: 342, modules: 18, status: "Aktif" },
  { id: 2, title: "Manajemen Konstruksi & Penjadwalan", category: "Manajemen", level: "Lanjutan", students: 218, modules: 12, status: "Aktif" },
  { id: 3, title: "RAB & Estimasi Biaya Konstruksi", category: "RAB", level: "Dasar", students: 489, modules: 10, status: "Aktif" },
  { id: 4, title: "Gambar Teknik AutoCAD 2D/3D", category: "Gambar", level: "Dasar", students: 521, modules: 15, status: "Aktif" },
  { id: 5, title: "Civil 3D Surface & Road Design", category: "Civil 3D", level: "Lanjutan", students: 174, modules: 20, status: "Draft" },
  { id: 6, title: "Perancangan Jembatan Beton & Baja", category: "Struktur", level: "Lanjutan", students: 156, modules: 24, status: "Aktif" },
  { id: 7, title: "Teknik Pondasi & Geoteknik", category: "Pondasi", level: "Menengah", students: 203, modules: 12, status: "Aktif" },
  { id: 8, title: "ETABS – Analisis Gedung Bertingkat", category: "Struktur", level: "Lanjutan", students: 128, modules: 16, status: "Draft" },
];

const categoryColors: Record<string, string> = {
  Struktur: "#00897B", Manajemen: "#546E7A", RAB: "#800020",
  Gambar: "#546E7A", "Civil 3D": "#37474F", Pondasi: "#00897B",
};

export default function AdminKursusPage() {
  const [data, setData] = useState(kursus);
  const [search, setSearch] = useState("");

  const filtered = data.filter((k) => k.title.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id: number) => {
    setData((d) => d.map((k) => k.id === id
      ? { ...k, status: k.status === "Aktif" ? "Draft" : "Aktif" }
      : k
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Kursus</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>{kursus.length} kursus · {kursus.filter(k => k.status === "Aktif").length} aktif</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
          <Plus size={15} /> Tambah Kursus
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Kursus", val: kursus.length, color: "#546E7A" },
          { label: "Kursus Aktif", val: kursus.filter(k => k.status === "Aktif").length, color: "#00897B" },
          { label: "Total Siswa", val: kursus.reduce((s, k) => s + k.students, 0).toLocaleString("id"), color: "#800020" },
          { label: "Total Modul", val: kursus.reduce((s, k) => s + k.modules, 0), color: "#546E7A" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-4 text-center" style={{ borderTop: `2px solid ${color}` }}>
            <p className="font-bold text-lg" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
            <p className="text-xs" style={{ color: "var(--text-light)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card p-3 mb-4 flex items-center gap-2">
        <input type="text" placeholder="Cari kursus..." className="flex-1 text-sm outline-none"
          style={{ background: "transparent", color: "var(--text-primary)" }}
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <AnimatedSection>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "rgba(84,110,122,0.06)", borderBottom: "1px solid var(--border)" }}>
                  {["#", "Judul Kursus", "Kategori", "Level", "Siswa", "Modul", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-bold" style={{ color: "var(--text-light)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((k) => (
                  <tr key={k.id} style={{ borderBottom: "1px solid rgba(84,110,122,0.06)" }}>
                    <td className="px-4 py-3" style={{ color: "var(--text-light)" }}>{k.id}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: "#1C2433", maxWidth: 200 }}>{k.title}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: `${categoryColors[k.category]}18`, color: categoryColors[k.category] }}>
                        {k.category}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{k.level}</td>
                    <td className="px-4 py-3 font-bold text-center" style={{ color: "#1C2433" }}>{k.students}</td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--text-secondary)" }}>{k.modules}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: k.status === "Aktif" ? "rgba(0,137,123,0.12)" : "rgba(84,110,122,0.12)", color: k.status === "Aktif" ? "var(--green-dark)" : "var(--slate)" }}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg" style={{ color: "var(--green)", background: "rgba(0,137,123,0.08)" }}><Edit2 size={12} /></button>
                        <button onClick={() => toggleStatus(k.id)} className="p-1.5 rounded-lg" style={{ color: "var(--slate)", background: "rgba(84,110,122,0.08)" }}>
                          {k.status === "Aktif" ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                        </button>
                        <button className="p-1.5 rounded-lg" style={{ color: "var(--burgundy)", background: "rgba(128,0,32,0.08)" }}><Trash2 size={12} /></button>
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
