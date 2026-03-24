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
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, any> = {
  FileSpreadsheet, Ruler, Cpu, Building2, BookOpen, HardHat, Layers, ShoppingCart, Users, Award, TrendingUp, CheckCircle2
};

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

const mentorsInitial: Mentor[] = [
  { id: 1, avatar: "BS", name: "Loading...", title: "Expert Mentor", expertise: ["Sipil"], rating: 5.0, sessions: 0 }
];

const productsInitial: Product[] = [
  { id: 1, title: "Loading...", category: "Generic", price: 0, rating: 5.0, downloads: 0, icon: ShoppingCart }
];

/* ── TYPES ── */
interface Mentor {
  id: number | string;
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  sessions: number;
  image_url?: string;
  avatar?: string;
}

interface Product {
  id: number | string;
  title: string;
  category: string;
  price: number;
  rating: number;
  downloads: number;
  icon: any;
}

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
  const [liveStats, setLiveStats] = useState(stats);
  const [liveMentors, setLiveMentors] = useState<Mentor[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      
      // Fetch Stats
      const [mCount, pCount, kCount] = await Promise.all([
        supabase.from("mentors").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("kursus").select("*", { count: "exact", head: true })
      ]);

      setLiveStats([
        { value: 2400 + (kCount.count || 0), label: "Mahasiswa Aktif", suffix: "+", icon: Users },
        { value: mCount.count || 4, label: "Mentor Expert", suffix: "", icon: Award },
        { value: 98, label: "Tingkat Kepuasan", suffix: "%", icon: TrendingUp },
        { value: 500 + (pCount.count || 0), label: "Proyek Selesai", suffix: "+", icon: CheckCircle2 },
      ]);

      // Fetch Mentors
      const { data: mData } = await supabase.from("mentors").select("*").eq("status", "Aktif").limit(4);
      if (mData) {
        setLiveMentors(mData.map(m => ({
          ...m,
          avatar: m.avatar_initials || m.name.charAt(0),
          sessions: m.sessions_count || 0,
          expertise: Array.isArray(m.expertise) ? m.expertise : (m.expertise?.split(",") || [])
        })));
      }

      // Fetch Products
      const { data: pData } = await supabase.from("products").select("*").eq("status", "Tersedia").limit(4);
      if (pData) {
        setLiveProducts(pData.map(p => ({
          ...p,
          title: p.name,
          downloads: p.downloads_count || 0,
          icon: iconMap[p.icon_name] || ShoppingCart
        })));
      }

      setLoading(false);
    };
    fetchHomeData();
  }, []);

  const mentors = liveMentors.length > 0 ? liveMentors : (loading ? [] : mentorsInitial);
  const products = liveProducts.length > 0 ? liveProducts : (loading ? [] : productsInitial);
  return (
    <>
      <Navbar />

      <main>
        {/* ── NEW HERO SECTION (Clean & Structural) ── */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-white border-b border-slate-100">
           <div className="container-main relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                 {/* Text Content */}
                 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-blue-100">
                         #1 Platform EdTech Sipil
                       </span>
                    </div>
                    <h1 className="text-slate-900 mb-6 leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.8rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                       Bangun Karir <br />
                       <span className="text-blue-600">Teknik Sipil</span> Cemerlang
                    </h1>
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-xl">
                       Akses kursus profesional, konsultasi ahli, dan referensi desain industri. Belajar langsung dari praktisi untuk siap hadapi proyek nyata.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                       <Link href="/kursus" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                          Mulai Belajar <ArrowRight size={18} />
                       </Link>
                       <Link href="/mentor" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                          Cari Mentor
                       </Link>
                    </div>

                    <div className="mt-10 flex items-center gap-6 pt-6 border-t border-slate-100">
                       <div className="flex flex-col">
                          <span className="text-2xl font-extrabold text-slate-900 block leading-none mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>2.4k+</span>
                          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Member Aktif</span>
                       </div>
                       <div className="w-[1px] h-10 bg-slate-200" />
                       <div className="flex flex-col">
                          <span className="text-2xl font-extrabold text-slate-900 block leading-none mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>4.9/5</span>
                          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Rating Platfom</span>
                       </div>
                    </div>
                 </motion.div>

                 {/* Visual/Image Content */}
                 <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
                    <div className="relative w-full aspect-square max-w-[500px] ml-auto">
                       {/* Decorative structuring */}
                       <div className="absolute top-0 right-0 w-3/4 h-full bg-blue-50 rounded-3xl" />
                       <div className="absolute bottom-10 left-0 w-full h-3/4 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
                          <Image src="/hero-building.png" alt="Engineering Concept" fill className="object-cover opacity-80 mix-blend-multiply" />
                       </div>
                       
                       {/* Floating Badge */}
                       <div className="absolute top-1/2 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-[bounce_4s_infinite]">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                             <CheckCircle2 size={24} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">Materi Terverifikasi</p>
                             <p className="text-xs text-slate-500">Standar SNI & Internasional</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-16" style={{ background: "white" }}>
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {liveStats.map((s, i) => (
                <AnimatedSection key={s.label} delay={i * 0.1}>
                  <div className="card p-8 flex flex-col items-center justify-center">
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
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden"
                        style={{ background: m.image_url ? "transparent" : "var(--primary)", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {m.image_url ? (
                          <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          m.avatar
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</p>
                        <p className="text-xs leading-tight" style={{ color: "var(--text-secondary)" }}>{m.title}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                      {m.expertise.map((e: string) => (
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
