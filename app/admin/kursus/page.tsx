"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  const [view, setView] = useState("courses"); // "courses" or "students"

  const students = [
    { id: 1, name: "Ahmad Fauzi", course: "Analisis Struktur Beton", progress: "45%", date: "23 Mar 2026", status: "Aktif" },
    { id: 2, name: "Siska Putri", course: "RAB & Estimasi Biaya", progress: "100%", date: "22 Mar 2026", status: "Selesai" },
    { id: 3, name: "Bambang W.", course: "Gambar Teknik AutoCAD", progress: "12%", date: "21 Mar 2026", status: "Aktif" },
    { id: 4, name: "Anita Sari", course: "Civil 3D Surface Design", progress: "0%", date: "20 Mar 2026", status: "Baru" },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Kursus Online</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>Kelola kurikulum dan pantau progres siswa secara real-time.</p>
        </div>
        <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 relative">
           <button onClick={() => setView("courses")} 
             className={`relative z-10 px-6 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${view === "courses" ? "text-white" : "text-slate-500 hover:text-slate-700"}`}>
             {view === "courses" && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary rounded-lg shadow-md shadow-blue-500/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
             )}
             <span className="relative z-10">Manajemen Konten</span>
           </button>
           <button onClick={() => setView("students")}
             className={`relative z-10 px-6 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${view === "students" ? "text-white" : "text-slate-500 hover:text-slate-700"}`}>
             {view === "students" && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary rounded-lg shadow-md shadow-blue-500/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
             )}
             <span className="relative z-10">Data Siswa</span>
           </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Kursus", val: kursus.length, color: "var(--primary)" },
          { label: "Siswa Aktif", val: "1,248", color: "#475569" },
          { label: "Penyelesaian", val: "84%", color: "#00897B" },
          { label: "Baru Hari Ini", val: "+12", color: "#3B82F6" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-5 bg-white shadow-sm border-none">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-light)" }}>{label}</p>
            <p className="font-bold text-2xl" style={{ color: color, fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
          </div>
        ))}
      </div>

      <AnimatedSection>
        {view === "courses" ? (
          <div className="card overflow-hidden border-none shadow-sm">
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <input type="text" placeholder="Cari judul kursus..." className="text-sm outline-none w-64 p-2 bg-slate-50 rounded-lg"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">
                <Plus size={14} /> Tambah Kursus
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    {["#", "Judul Kursus", "Kategori", "Level", "Siswa", "Status", "Aksi"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-400 font-medium">{k.id}</td>
                      <td className="px-5 py-4 font-bold text-slate-700">{k.title}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-bold text-[10px] uppercase">{k.category}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{k.level}</td>
                      <td className="px-5 py-4 font-bold">{k.students.toLocaleString("id")}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${k.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-[10px] uppercase">
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => toggleStatus(k.id)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold transition-all text-[10px] uppercase">
                            {k.status === "Aktif" ? <ToggleRight size={14} /> : <ToggleLeft size={14} />} Status
                          </button>
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
              <h3 className="font-bold text-slate-800">Siswa Terdaftar</h3>
              <span className="text-xs text-slate-400">Menampilkan {students.length} pendaftaran terbaru</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    {["Nama Siswa", "Kursus", "Progres", "Tanggal Daftar", "Status"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-700">{s.name}</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">{s.course}</td>
                      <td className="px-5 py-4 w-48">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: s.progress }} />
                          </div>
                          <span className="font-bold">{s.progress}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{s.date}</td>
                      <td className="px-5 py-4">
                         <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-bold text-[10px] uppercase">{s.status}</span>
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

