"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, X, CheckCircle2, Star, Download,
  FileSpreadsheet, Ruler, Cpu, Building2, BookOpen, HardHat, Layers,
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";

const categories = ["Semua", "RAB", "Gambar CAD", "Civil 3D", "Struktur", "Panduan", "Jasa"];

const products = [
  { id: 1, title: "Template RAB Perumahan Tipe 36–90", category: "RAB", desc: "Template Excel lengkap untuk RAB rumah tinggal. Termasuk analisa harga satuan dan rekapitulasi otomatis.", price: 145000, rating: 4.9, reviews: 87, downloads: 423, icon: FileSpreadsheet, includes: ["Analisa Harga Satuan", "Rekapitulasi Otomatis", "HSPK 2024"], format: "Excel (.xlsx)" },
  { id: 2, title: "Set Gambar CAD Ruko 2 Lantai", category: "Gambar CAD", desc: "Paket gambar kerja AutoCAD lengkap untuk ruko 2 lantai: denah, tampak, potongan, detail pondasi.", price: 195000, rating: 4.8, reviews: 62, downloads: 289, icon: Ruler, includes: ["Denah & Tampak", "Detail Pondasi", "PDF A3"], format: "AutoCAD (.dwg) + PDF" },
  { id: 3, title: "Model Civil 3D Jalan Lingkungan", category: "Civil 3D", desc: "Template Civil 3D siap pakai untuk desain jalan lingkungan: alignment, profile, cross-section.", price: 225000, rating: 4.8, reviews: 45, downloads: 178, icon: Cpu, includes: ["Alignment & Profile", "Cross Section", "Volume Calc"], format: "Civil 3D (.dwg)" },
  { id: 4, title: "Template RAB Gedung Kantor 3 Lantai", category: "RAB", desc: "RAB gedung kantor 3 lantai berbasis SNI dan HSPK terbaru. Formula otomatis dan mudah dikustomisasi.", price: 175000, rating: 4.9, reviews: 74, downloads: 312, icon: Building2, includes: ["RAB Sipil & Arsitektur", "MEP Estimate", "Kurva S"], format: "Excel (.xlsx)" },
  { id: 5, title: "Panduan Lengkap SAP2000 Pemula", category: "Struktur", desc: "E-Book + file latihan SAP2000 untuk pemula. Dari input beban hingga baca output perhitungan.", price: 95000, rating: 4.7, reviews: 128, downloads: 567, icon: BookOpen, includes: ["E-Book 120 Halaman", "File Latihan SAP2000", "Video Pendamping"], format: "PDF + SAP2000 (.sdb)" },
  { id: 6, title: "Set Gambar CAD Jembatan Gelagar", category: "Gambar CAD", desc: "Gambar kerja lengkap jembatan gelagar beton 20 meter. Denah, tampak, potongan, dan detail sambungan.", price: 275000, rating: 4.9, reviews: 38, downloads: 142, icon: Layers, includes: ["Plan & Elevation", "Detail Pier & Abutment", "BOM Material"], format: "AutoCAD (.dwg) + PDF" },
  { id: 7, title: "Template Laporan Manajemen Proyek", category: "Panduan", desc: "Template Word & Excel untuk laporan mingguan dan bulanan proyek konstruksi. Lengkap dengan kurva-S.", price: 85000, rating: 4.6, reviews: 93, downloads: 445, icon: HardHat, includes: ["Laporan Mingguan", "Template Kurva-S", "Checklist K3"], format: "Word (.docx) + Excel" },
  { id: 8, title: "Template RAB Jembatan Sederhana", category: "RAB", desc: "RAB detail untuk pembangunan jembatan beton sederhana, dilengkapi perhitungan volume dan analisa biaya.", price: 155000, rating: 4.8, reviews: 51, downloads: 203, icon: FileSpreadsheet, includes: ["Volume Pekerjaan", "Analisa Biaya", "Format BQ"], format: "Excel (.xlsx)" },
  { id: 9, title: "Jasa Pembuatan Laporan Proyek", category: "Jasa", desc: "Layanan penyusunan laporan mingguan, bulanan, dan akhir proyek konstruksi yang profesional.", price: 350000, rating: 4.9, reviews: 24, downloads: 12, icon: HardHat, includes: ["Laporan Mingguan/Bulanan", "Analisis Progres", "Dokumentasi Foto"], format: "Layanan Professional" },
  { id: 10, title: "Jasa Pembuatan PPT Teknik Sipil", category: "Jasa", desc: "Pembuatan presentasi (PPT) profesional untuk sidang skripsi dan tender konstruksi dengan desain premium.", price: 150000, rating: 4.9, reviews: 31, downloads: 18, icon: Layers, includes: ["Desain Custom", "Visualisasi Data", "Revisi 2x"], format: "Layanan Professional" },
];

function CartToast({ item, onClose }: { item: typeof products[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
      className="fixed bottom-6 right-6 z-50 card p-4 flex items-center gap-3"
      style={{ maxWidth: 320, borderLeft: "3px solid var(--primary)" }}
    >
      <div className="icon-box flex-shrink-0">
        <CheckCircle2 size={18} style={{ color: "var(--primary)" }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Ditambah ke keranjang</p>
        <p className="text-xs" style={{ color: "var(--text-light)" }}>{item.title}</p>
      </div>
      <button onClick={onClose} style={{ color: "var(--text-light)" }}><X size={15} /></button>
    </motion.div>
  );
}

export default function TokoPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [toast, setToast] = useState<typeof products[0] | null>(null);

  const addToCart = (item: typeof products[0]) => {
    if (!cart.includes(item.id)) {
      setCart([...cart, item.id]);
      setToast(item);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = products.filter((p) => {
    const catMatch = activeCategory === "Semua" || p.category === activeCategory;
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-48 pb-40 relative overflow-hidden" style={{ background: "var(--primary)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
          />
          <div className="container-main relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-0.5" style={{ background: "rgba(255,255,255,0.5)" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>Toko Digital</span>
              </div>
              <h1 className="text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1 }}>
                Template & Aset Teknik Sipil
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500, fontSize: "1rem" }}>
                Hemat waktu pengerjaan tugas dan proyek. Template profesional siap pakai, dikerjakan praktisi berpengalaman.
              </p>
              {cart.length > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
                  <ShoppingCart size={15} color="white" />
                  <span className="text-sm font-semibold text-white">{cart.length} item di keranjang</span>
                </div>
              )}
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg viewBox="0 0 1440 120" className="w-full h-auto" fill="none" preserveAspectRatio="none">
              <path d="M0,0 C480,140 960,140 1440,0 L1440,120 L0,120 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* Filters */}
        <section className="py-10 sticky top-16 z-40" style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
          <div className="container-main">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <input
                  type="text"
                  placeholder="Cari template..."
                  className="block w-full px-4 py-3 text-sm rounded-xl border transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition-all border"
                    style={{
                      background: activeCategory === cat ? "var(--primary)" : "white",
                      color: activeCategory === cat ? "white" : "var(--text-secondary)",
                      borderColor: activeCategory === cat ? "var(--primary)" : "var(--border)",
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-28" style={{ background: "white" }}>
          <div className="container-main">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Menampilkan <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> produk
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search size={40} style={{ color: "var(--text-light)", margin: "0 auto 12px" }} />
                <p style={{ color: "var(--text-secondary)" }}>Produk tidak ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((item, i) => (
                  <AnimatedSection key={item.id} delay={i * 0.05}>
                    <div className="card p-5 flex flex-col h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="icon-box flex-shrink-0">
                          <item.icon size={18} style={{ color: "var(--primary)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="tag-primary mb-1">{item.category}</span>
                          <h3 className="font-bold text-sm leading-snug mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>

                      <div className="mb-3">
                        {item.includes.map((inc) => (
                          <div key={inc} className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                            <CheckCircle2 size={11} style={{ color: "var(--primary)", flexShrink: 0 }} />
                            {inc}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mb-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                        <Star size={12} fill="var(--primary)" style={{ color: "var(--primary)" }} />
                        <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{item.rating}</span>
                        <span className="text-xs" style={{ color: "var(--text-light)" }}>({item.reviews} ulasan)</span>
                        <span className="text-xs ml-auto flex items-center gap-1" style={{ color: "var(--text-light)" }}>
                          <Download size={11} /> {item.downloads}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs" style={{ color: "var(--text-light)" }}>{item.format}</p>
                          <p className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
                            Rp {item.price.toLocaleString("id")}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                          style={{
                            background: cart.includes(item.id) ? "#065F46" : "var(--primary)",
                            color: "white",
                          }}
                        >
                          {cart.includes(item.id) ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
                        </button>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {toast && <CartToast item={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
}
