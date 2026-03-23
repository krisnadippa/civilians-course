"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Users, Star, Filter, ChevronRight,
  Building2, HardHat, Calculator, Ruler, Cpu, Layers, Play,
  Award, BarChart2, CheckCircle2
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";

const categories = ["Semua", "Struktur", "RAB", "Manajemen", "Gambar", "Civil 3D", "Pondasi"];

const allCourses = [
  {
    id: 1, title: "Analisis Struktur Beton Bertulang", category: "Struktur", level: "Menengah",
    duration: "24 Jam", modules: 18, students: 342, rating: 4.9, progress: 0,
    icon: Building2, color: "var(--primary)",
    desc: "Kuasai analisis dan desain beton bertulang menggunakan SNI terbaru. Mencakup balok, kolom, pelat, dan pondasi.",
    tags: ["SAP2000", "SNI 2847", "Excel"],
  },
  {
    id: 2, title: "Manajemen Konstruksi & Penjadwalan", category: "Manajemen", level: "Lanjutan",
    duration: "18 Jam", modules: 12, students: 218, rating: 4.8, progress: 0,
    icon: HardHat, color: "var(--accent)",
    desc: "Pelajari Project Management, Critical Path Method (CPM), kurva-S, dan pelaporan proyek konstruksi.",
    tags: ["MS Project", "CPM", "Kurva-S"],
  },
  {
    id: 3, title: "RAB & Estimasi Biaya Konstruksi", category: "RAB", level: "Dasar",
    duration: "12 Jam", modules: 10, students: 489, rating: 4.9, progress: 0,
    icon: Calculator, color: "var(--slate)",
    desc: "Cara menyusun Rencana Anggaran Biaya yang akurat menggunakan HSPK, analisa harga satuan, dan Excel.",
    tags: ["Excel", "HSPK", "SNI"],
  },
  {
    id: 4, title: "Gambar Teknik AutoCAD 2D/3D", category: "Gambar", level: "Dasar",
    duration: "20 Jam", modules: 15, students: 521, rating: 4.7, progress: 0,
    icon: Building2, color: "var(--primary)",
    desc: "Belajar menggambar struktur, arsitektur, dan MEP menggunakan AutoCAD sesuai standar gambar kerja nasional.",
    tags: ["AutoCAD", "Sheet Sets", "Layout"],
  },
  {
    id: 5, title: "Civil 3D Surface & Road Design", category: "Civil 3D", level: "Lanjutan",
    duration: "30 Jam", modules: 20, students: 174, rating: 4.8, progress: 0,
    icon: Cpu, color: "var(--accent)",
    desc: "Desain jalan raya, saluran drainase, dan analisis terrain menggunakan Autodesk Civil 3D.",
    tags: ["Civil 3D", "Corridor", "Grading"],
  },
  {
    id: 6, title: "Perancangan Jembatan Beton & Baja", category: "Struktur", level: "Lanjutan",
    duration: "36 Jam", modules: 24, students: 156, rating: 4.9, progress: 0,
    icon: Layers, color: "var(--slate)",
    desc: "Analisis dan desain jembatan komposit, jembatan rangka baja, dan jembatan beton prategang.",
    tags: ["SAP2000", "AASHTO", "BMS"],
  },
  {
    id: 7, title: "Teknik Pondasi & Geoteknik", category: "Pondasi", level: "Menengah",
    duration: "16 Jam", modules: 12, students: 203, rating: 4.8, progress: 0,
    icon: Building2, color: "var(--primary)",
    desc: "Analisis daya dukung tanah, desain pondasi dangkal dan dalam, serta analisis stabilitas lereng.",
    tags: ["Plaxis", "SPT", "Bore Log"],
  },
  {
    id: 8, title: "Hidrologi & Drainase Perkotaan", category: "Civil 3D", level: "Menengah",
    duration: "14 Jam", modules: 10, students: 185, rating: 4.7, progress: 0,
    icon: Cpu, color: "var(--accent)",
    desc: "Analisis hidrologi, debit banjir, desain saluran drainase, dan perencanaan sistem polder.",
    tags: ["HEC-RAS", "EPA-SWMM", "Civil 3D"],
  },
  {
    id: 9, title: "ETABS – Analisis Gedung Bertingkat", category: "Struktur", level: "Lanjutan",
    duration: "22 Jam", modules: 16, students: 128, rating: 4.9, progress: 0,
    icon: Building2, color: "var(--burgundy)",
    desc: "Modeling, analisis dinamik, dan desain struktur gedung tinggi berbasis ETABS dan SNI gempa.",
    tags: ["ETABS", "SNI 1726", "Respon Spektrum"],
  },
];

export default function KursusPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeLevel, setActiveLevel] = useState("Semua Level");

  const filtered = allCourses.filter((c) => {
    const catMatch = activeCategory === "Semua" || c.category === activeCategory;
    const lvlMatch = activeLevel === "Semua Level" || c.level === activeLevel;
    return catMatch && lvlMatch;
  });

  return (
    <>
      <Navbar />
      <main>
        <section
          className="pt-32 pb-16 relative overflow-hidden bg-white"
        >
          <div className="absolute inset-0 opacity-40 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
          />
          <div className="container-main relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="section-label mb-3">Modul Pembelajaran</p>
              <h1
                className="mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 3.8rem)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}
              >
                Kursus Teknik Sipil <br />
                <span className="gradient-text">Terlengkap</span>
              </h1>
              <p className="text-base max-w-xl" style={{ color: "var(--text-secondary)" }}>
                48+ modul pembelajaran yang dirancang khusus untuk mahasiswa dan profesional teknik sipil,
                dipandu mentor berpengalaman.
              </p>
            </motion.div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { icon: BookOpen, val: "48+", label: "Modul Aktif" },
                { icon: Users, val: "2.400+", label: "Mahasiswa" },
                { icon: Award, val: "Bersertifikat", label: "Setiap Kursus" },
                { icon: BarChart2, val: "4.9/5", label: "Rating Rata-rata" },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)" }}>
                    <Icon size={18} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm leading-none">{val}</p>
                    <p className="text-xs" style={{ color: "var(--text-light)" }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 0C1200 35 800 50 0 0Z" fill="var(--bg)" /></svg>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 sticky top-16 z-40 glass" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="container-main">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: activeCategory === cat ? "var(--primary)" : "var(--bg-subtle)",
                      color: activeCategory === cat ? "white" : "var(--text-secondary)",
                      border: "1px solid var(--border)"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select
                value={activeLevel}
                onChange={(e) => setActiveLevel(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "rgba(84,110,122,0.08)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                {["Semua Level", "Dasar", "Menengah", "Lanjutan"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-12 blueprint-bg min-h-screen">
          <div className="container-main">
            <p className="text-sm mb-6" style={{ color: "var(--text-light)" }}>
              Menampilkan <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> kursus
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => (
                <AnimatedSection key={c.id} delay={i * 0.06}>
                  <div className="card overflow-hidden h-full flex flex-col group">
                    {/* Top color bar */}
                    <div className="h-1.5 w-full" style={{ background: c.color }} />
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${c.color}18` }}>
                          <c.icon size={24} style={{ color: c.color }} />
                        </div>
                        <div className="text-right">
                          <span className="tag-green">{c.category}</span>
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <Star size={11} style={{ color: "#FFA000" }} />
                            <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{c.rating}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-bold text-base mb-2 group-hover:text-[var(--green)] transition-colors"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
                        {c.title}
                      </h3>
                      <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-light)" }}>{c.desc}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {c.tags.map((t) => <span key={t} className="tag-slate">{t}</span>)}
                      </div>

                      <div className="flex items-center gap-4 text-xs mb-4 mt-auto" style={{ color: "var(--text-light)" }}>
                        <span className="flex items-center gap-1"><Clock size={12} />{c.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen size={12} />{c.modules} modul</span>
                        <span className="flex items-center gap-1"><Users size={12} />{c.students}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="tag-slate">{c.level}</span>
                        <button className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.8rem" }}>
                          <Play size={13} /> Mulai
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
