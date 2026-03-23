"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Users,
  Award,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  Calculator,
  Ruler,
  Cpu,
  HardHat,
  ShoppingCart,
  Building2,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Wrench,
  BookOpen,
  Package,
  Zap,
  Shield,
  MapPin,
} from "lucide-react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import AnimatedSection from "./_components/AnimatedSection";

/* ── DATA ── */
const stats = [
  { value: 2400, label: "Mahasiswa Aktif", suffix: "+", icon: Users },
  { value: 4, label: "Mentor Expert", suffix: "", icon: Award },
  { value: 98, label: "Tingkat Kepuasan", suffix: "%", icon: TrendingUp },
  { value: 500, label: "Proyek Selesai", suffix: "+", icon: CheckCircle2 },
];

const services = [
  {
    icon: Calculator, title: "Pembuatan RAB",
    desc: "Rencana Anggaran Biaya yang akurat dengan format standar nasional, analisa harga satuan, dan rekapitulasi lengkap.",
    features: ["Format Excel Profesional", "HSPK & SNI Terbaru", "Revisi Unlimited"],
    price: "Mulai Rp 350rb",
  },
  {
    icon: Building2, title: "Desain Struktur",
    desc: "Perencanaan dan analisis struktur gedung menggunakan SAP2000, ETABS sesuai SNI gempa berlaku.",
    features: ["SAP2000 / ETABS", "Laporan Teknis", "Respon Spektrum"],
    price: "Mulai Rp 850rb",
  },
  {
    icon: Ruler, title: "Gambar Kerja CAD",
    desc: "Set gambar kerja lengkap: denah, tampak, potongan, detail elemen struktural sesuai standar nasional.",
    features: ["AutoCAD DWG + PDF", "Layout A3/A1", "Auto Sheet Set"],
    price: "Mulai Rp 500rb",
  },
  {
    icon: Cpu, title: "Civil 3D Modeling",
    desc: "Pemodelan jalan, saluran, dan infrastruktur menggunakan Autodesk Civil 3D.",
    features: ["Corridor Design", "Volume Calc", "Drainage Design"],
    price: "Mulai Rp 750rb",
  },
];

const mentors = [
  {
    id: 1, avatar: "BS", name: "Budi Santoso",
    title: "Pakar Analisis Struktur",
    expertise: ["SAP2000", "ETABS", "Beton Bertulang"],
    rating: 4.9, sessions: 312, price: 175000,
  },
  {
    id: 2, avatar: "SR", name: "Siti Rahayu",
    title: "Spesialis RAB & Manajemen Konstruksi",
    expertise: ["RAB & Estimasi", "MS Project", "Kurva-S"],
    rating: 4.8, sessions: 245, price: 150000,
  },
  {
    id: 3, avatar: "AP", name: "Andi Prasetyo",
    title: "Ahli BIM & Gambar Teknik",
    expertise: ["AutoCAD", "Revit BIM", "Civil 3D"],
    rating: 4.9, sessions: 198, price: 160000,
  },
  {
    id: 4, avatar: "DK", name: "Dewi Kusuma",
    title: "Pakar Geoteknik & Pondasi",
    expertise: ["Plaxis", "Pondasi Dalam", "Geoteknik"],
    rating: 4.7, sessions: 167, price: 165000,
  },
];

const products = [
  {
    id: 1, title: "Template RAB Perumahan", category: "RAB",
    price: 145000, rating: 4.9, downloads: 423, icon: FileSpreadsheet,
  },
  {
    id: 2, title: "Set Gambar CAD Ruko 2 Lantai", category: "Gambar CAD",
    price: 195000, rating: 4.8, downloads: 289, icon: Ruler,
  },
  {
    id: 3, title: "Model Civil 3D Jalan Lingkungan", category: "Civil 3D",
    price: 225000, rating: 4.8, downloads: 178, icon: Cpu,
  },
  {
    id: 4, title: "Template RAB Gedung Kantor", category: "RAB",
    price: 175000, rating: 4.9, downloads: 312, icon: Building2,
  },
];

/* ── Animated Counter ── */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (inView) mv.set(target);
  }, [inView, mv, target]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO SECTION ── */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: "var(--primary)" }}>
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-building.png"
              alt="Civil Engineering Building"
              fill
              className="object-cover"
              priority
              style={{ opacity: 0.18 }}
            />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="container-main relative z-10 pt-40 pb-40">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-0.5 bg-white opacity-60" />
                  <span className="text-xs font-bold tracking-widest uppercase text-white opacity-70">
                    Platform Teknik Sipil Indonesia
                  </span>
                </div>
                <h1
                  className="text-white mb-6"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}
                >
                  Wujudkan Proyek Struktural Terbaik.
                </h1>
                <p className="mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", maxWidth: 520, fontSize: "1.1rem" }}>
                  Jasa perancangan sipil profesional, sesi bimbingan mentor expert, dan template digital siap pakai — semua dalam satu platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/jasa" className="btn-primary" style={{ background: "white", color: "var(--primary)", padding: "13px 28px", fontSize: "0.95rem" }}>
                    Lihat Layanan <ArrowRight size={18} />
                  </Link>
                  <Link href="/mentor" className="btn-outline-blue" style={{ padding: "13px 28px", fontSize: "0.95rem" }}>
                    Booking Mentor <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg viewBox="0 0 1440 120" className="w-full h-auto" fill="none" preserveAspectRatio="none">
              <path d="M0,0 C480,140 960,140 1440,0 L1440,120 L0,120 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-16" style={{ background: "white" }}>
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <AnimatedSection key={s.label} delay={i * 0.1}>
                  <div className="card p-6 text-center" style={{ borderTop: "3px solid var(--primary)" }}>
                    <div className="icon-box mx-auto mb-3">
                      <s.icon size={20} style={{ color: "var(--primary)" }} />
                    </div>
                    <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
                      <Counter target={s.value} suffix={s.suffix} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="py-20 blue-dot-bg">
          <div className="container-main">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
                <div>
                  <span className="section-label">Layanan Kami</span>
                  <div className="divider-blue" />
                  <h2 className="section-title">Solusi Perancangan Teknik Sipil</h2>
                  <p className="mt-3 text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
                    Dikerjakan oleh tim praktisi berpengalaman dengan standar nasional tertinggi.
                  </p>
                </div>
                <Link href="/jasa" className="btn-secondary text-sm hidden md:flex">
                  Semua Layanan <ChevronRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {services.map((s, i) => (
                <AnimatedSection key={s.title} delay={i * 0.08}>
                  <div className="card p-6 h-full flex flex-col">
                    <div className="icon-box-solid mb-4">
                      <s.icon size={22} color="white" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                    <ul className="flex flex-col gap-1.5 mb-5">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <CheckCircle2 size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{s.price}</span>
                      <Link href="/jasa" className="text-xs font-semibold flex items-center gap-1 animate-underline" style={{ color: "var(--primary)" }}>
                        Pesan <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="mt-8 flex justify-center md:hidden">
              <Link href="/jasa" className="btn-secondary text-sm">
                Semua Layanan <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── MENTORS ── */}
        <section className="py-20" style={{ background: "white" }}>
          <div className="container-main">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
                <div>
                  <span className="section-label">Tim Pengajar</span>
                  <div className="divider-blue" />
                  <h2 className="section-title">Belajar dari Para Expert</h2>
                  <p className="mt-3 text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
                    4 mentor senior siap membimbing sesi privat sesuai kebutuhan dan jadual Anda.
                  </p>
                </div>
                <Link href="/mentor" className="btn-secondary text-sm hidden md:flex">
                  Semua Mentor <ChevronRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {mentors.map((m, i) => (
                <AnimatedSection key={m.id} delay={i * 0.08}>
                  <div className="card p-5 flex flex-col h-full">
                    {/* Avatar */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                        style={{ background: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {m.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</p>
                        <p className="text-xs leading-tight" style={{ color: "var(--text-secondary)" }}>{m.title}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                      {m.expertise.map((e) => (
                        <span key={e} className="tag-primary">{e}</span>
                      ))}
                    </div>

                    <div className="mt-auto">
                      {/* Stats */}
                      <div className="flex items-center gap-3 mb-4" style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                        <div className="flex items-center gap-1">
                          <Star size={12} fill="var(--primary)" style={{ color: "var(--primary)" }} />
                          <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{m.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} style={{ color: "var(--text-light)" }} />
                          <span className="text-xs" style={{ color: "var(--text-light)" }}>{m.sessions} sesi</span>
                        </div>
                      </div>

                      <Link
                        href="/mentor"
                        className="btn-primary text-xs w-full justify-center"
                        style={{ padding: "9px" }}
                      >
                        Booking Sesi
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── SHOP PREVIEW ── */}
        <section className="py-20" style={{ background: "var(--bg-blue)" }}>
          <div className="container-main">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
                <div>
                  <span className="section-label">Toko Digital</span>
                  <div className="divider-blue" />
                  <h2 className="section-title">Template & Aset Teknik Sipil</h2>
                  <p className="mt-3 text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
                    Template profesional siap pakai untuk tugas kuliah, proyek, dan tender konstruksi.
                  </p>
                </div>
                <Link href="/toko" className="btn-secondary text-sm hidden md:flex">
                  Semua Produk <ChevronRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08}>
                  <div className="card p-5">
                    <div className="icon-box mb-3">
                      <p.icon size={20} style={{ color: "var(--primary)" }} />
                    </div>
                    <span className="tag-primary mb-2">{p.category}</span>
                    <h3 className="font-bold text-sm my-2 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: "var(--text-light)" }}>
                      <Star size={11} fill="var(--primary)" style={{ color: "var(--primary)" }} />
                      <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{p.rating}</span>
                      <span>|</span>
                      <span>{p.downloads} unduhan</span>
                    </div>
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
                        Rp {p.price.toLocaleString("id")}
                      </span>
                      <Link
                        href="/toko"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: "var(--primary)", color: "white" }}
                      >
                        <ShoppingCart size={14} />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US (CTA STRIP) ── */}
        <section className="py-24" style={{ background: "white" }}>
          <div className="container-main">
            <AnimatedSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="section-label">Mengapa Civilians</span>
                  <div className="divider-blue" />
                  <h2 className="mt-4 mb-6 section-title">
                    Standar Presisi, Dikerjakan Para Ahlinya.
                  </h2>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    Setiap layanan kami dirancang untuk memastikan output terbaik — mulai dari RAB yang akurat,
                    desain struktur yang aman, hingga gambar kerja yang siap tender.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/jasa" className="btn-primary">
                      Mulai Sekarang <ArrowRight size={16} />
                    </Link>
                    <Link href="/mentor" className="btn-secondary">
                      Tanya Mentor <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Shield, title: "Jaminan Kualitas", desc: "Revisi unlimited hingga Anda puas" },
                    { icon: Zap, title: "Cepat & Tepat", desc: "Pengerjaan terstruktur sesuai deadline" },
                    { icon: Users, title: "Tim Berpengalaman", desc: "Praktisi aktif di bidangnya" },
                    { icon: MapPin, title: "Standar Nasional", desc: "Sesuai SNI, HSPK, dan peraturan berlaku" },
                  ].map((item) => (
                    <div key={item.title} className="card p-4">
                      <item.icon size={20} style={{ color: "var(--primary)", marginBottom: "8px" }} />
                      <p className="font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>{item.title}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
