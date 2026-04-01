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
  CheckCircle2,
  Cpu,
  Building2,
  Layers,
  ChevronRight,
  Shield,
  Clock,
  MapPin,
  BookOpen
} from "lucide-react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import AnimatedSection from "./_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

/* ── DATA ── */
const stats = [
  { value: 2400, label: "Mahasiswa Aktif", suffix: "+", icon: Users },
  { value: 4, label: "Mentor Expert", suffix: "", icon: Award },
  { value: 98, label: "Tingkat Kepuasan", suffix: "%", icon: TrendingUp },
  { value: 150, label: "Alumni Berhasil", suffix: "+", icon: CheckCircle2 },
];

const coursePackages = [
  {
    id: "civil3d",
    icon: Cpu, title: "Civil 3D",
    desc: "Pembuatan jalan + galian dan timbunan dengan standar industri konstruksi.",
    features: ["Corridor Design", "Earthwork Calculation", "Layouting"],
    price: "Mulai Rp 250.000",
    color: "bg-emerald-600",
    textColor: "text-emerald-700",
    borderColor: "border-t-4 border-emerald-500",
  },
  {
    id: "sap2000",
    icon: Building2, title: "SAP2000",
    desc: "Dari dasar hingga lanjutan — analisis struktur beton & baja sesuai SNI terbaru.",
    features: ["Pelatihan Dasar ASSTT", "Beton SNI 2847", "Analisis SRPMK"],
    price: "Mulai Rp 250.000",
    color: "bg-blue-600",
    textColor: "text-blue-700",
    borderColor: "border-t-4 border-blue-500",
  },
  {
    id: "bim",
    icon: Layers, title: "Pelatihan BIM",
    desc: "Paket lengkap BIM dari Tekla, Revit, hingga perhitungan RAB digital.",
    features: ["Tekla & Revit Modeling", "Ms. Project", "Integrasi RAB"],
    price: "Mulai Rp 400.000",
    color: "bg-violet-600",
    textColor: "text-violet-700",
    borderColor: "border-t-4 border-violet-500",
  },
];

/* ── TYPES ── */
interface Mentor {
  id: string | number;
  name: string;
  title: string;
  role: string;
  expertise: string[];
  rating: number;
  sessions_count: number;
  avatarBg: string;
  initials: string;
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
  const [livePackages, setLivePackages] = useState(coursePackages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      
      try {
        const [mCount, kCount] = await Promise.all([
          supabase.from("mentors").select("*", { count: "exact", head: true }),
          supabase.from("courses").select("*", { count: "exact", head: true })
        ]);

        if (mCount.count !== null) {
          setLiveStats([
            { value: 2400 + (kCount.count || 24), label: "Mahasiswa Aktif", suffix: "+", icon: Users },
            { value: mCount.count || 4, label: "Mentor Expert", suffix: "", icon: Award },
            { value: 98, label: "Tingkat Kepuasan", suffix: "%", icon: TrendingUp },
            { value: 150, label: "Alumni Berhasil", suffix: "+", icon: CheckCircle2 },
          ]);
        }

        const { data: mData } = await supabase.from("mentors").select("*").limit(4);
        if (mData && mData.length > 0) {
          const parseArray = (val: any) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
              try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed; } 
              catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
            }
            return [];
          };

          setLiveMentors(mData.map(m => ({
            id: m.id,
            name: m.name,
            title: m.role || m.title,
            role: m.role,
            expertise: parseArray(m.expertise_tags),
            rating: m.rating || 5.0,
            sessions_count: m.sessions_count || m.sessions || 0,
            avatarBg: m.color_theme ? `bg-${m.color_theme}-600` : "bg-emerald-600",
            initials: m.initials || m.name.substring(0, 2).toUpperCase()
          })));
        }

        const { data: cData } = await supabase.from("courses").select("category_id, price").eq("status", "Aktif");
        if (cData && cData.length > 0) {
          setLivePackages(prev => prev.map(pkg => {
            const matches = cData.filter(c => c.category_id === pkg.id);
            if (matches.length > 0) {
              const minPrice = Math.min(...matches.map(m => m.price));
              return { ...pkg, price: `Mulai Rp ${minPrice.toLocaleString("id")}` };
            }
            return pkg;
          }));
        }
      } catch (err) {
        console.error("Gagal load data supabase", err);
      }

      setLoading(false);
    };
    fetchHomeData();
  }, []);

  const mentors = liveMentors.length > 0 ? liveMentors : (loading ? [] : [
    { id: 1, initials: "RE", name: "Ratna Essya", title: "Civil 3D Specialist", role: "Civil 3D Specialist", expertise: ["Civil 3D", "Drainase"], rating: 4.9, sessions_count: 87, avatarBg: "bg-emerald-600" },
    { id: 2, initials: "AR", name: "Arimantara", title: "Civil 3D & SAP2000", role: "Structural Analyst", expertise: ["Civil 3D", "SAP2000"], rating: 5.0, sessions_count: 92, avatarBg: "bg-blue-600" },
    { id: 3, initials: "EJ", name: "Eka Juniarta", title: "SAP2000 & BIM", role: "BIM Expert", expertise: ["SAP2000", "Revit"], rating: 4.9, sessions_count: 78, avatarBg: "bg-indigo-600" },
    { id: 4, initials: "BG", name: "Bagaskara", title: "BIM & Manajemen", role: "Project Manager", expertise: ["Tekla", "Ms. Project"], rating: 5.0, sessions_count: 65, avatarBg: "bg-violet-600" },
  ]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <main>
        {/* ── HERO SECTION ── */}
        <section className="bg-white border-b border-slate-200 pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden px-6">
           <div className="container-main max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-widest rounded-full border border-blue-200 flex items-center gap-2">
                         <Award size={13} /> #1 Platform EdTech Sipil
                       </span>
                    </div>
                    <h1 className="text-slate-900 mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                       Kuasai Software <br />
                       <span className="text-blue-600">Teknik Sipil</span> Bersama Praktisi
                    </h1>
                    <p className="text-base text-slate-500 mb-10 leading-relaxed max-w-xl">
                       Akses kursus profesional Civil 3D, SAP2000, dan BIM. Belajar langsung dari ahlinya untuk siap hadapi proyek nyata dengan standar industri konstruksi.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                       <Link href="/kursus" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
                          Mulai Belajar <ArrowRight size={16} />
                       </Link>
                       <Link href="/mentor" className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
                          Lihat Pengajar
                       </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-8 pt-8 border-t border-slate-100">
                       <div className="flex flex-col">
                          <span className="text-3xl font-extrabold text-slate-900 block leading-none mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>2.4k+</span>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Member Aktif</span>
                       </div>
                       <div className="w-px h-12 bg-slate-200" />
                       <div className="flex flex-col">
                          <span className="text-3xl font-extrabold text-slate-900 block leading-none mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>4.9/5</span>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Rating Terverifikasi</span>
                       </div>
                    </div>
                 </motion.div>

                 <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
                    <div className="relative w-full aspect-square max-w-[500px] ml-auto">
                       <div className="absolute top-0 right-0 w-3/4 h-full bg-slate-100 rounded-[2rem]" />
                       <div className="absolute bottom-10 left-0 w-full h-3/4 bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl p-2">
                          <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-50 relative">
                            <Image src="/hero-building.png" alt="Engineering Concept" fill className="object-cover opacity-90 mix-blend-multiply" />
                          </div>
                       </div>
                       
                       <div className="absolute top-1/2 -left-8 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                             <CheckCircle2 size={24} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">Materi Terverifikasi</p>
                             <p className="text-xs text-slate-500 font-medium">Standar SNI & Internasional</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-16 px-6 bg-white border-b border-slate-100">
          <div className="container-main max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {liveStats.map((s, i) => (
                <AnimatedSection key={s.label} delay={i * 0.1}>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                      <s.icon size={22} className="text-blue-600" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      <Counter target={s.value} suffix={s.suffix} />
                    </div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── KURSUS POPULER ── */}
        <section className="py-20 px-6">
          <div className="container-main max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-2">Pilihan Program</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Paket Kursus Unggulan</h2>
                  <p className="text-base text-slate-500 max-w-lg leading-relaxed">
                    Setiap paket dirancang khusus untuk membawa Anda dari pemahaman dasar hingga mahir dalam studi kasus perancangan.
                  </p>
                </div>
                <Link href="/kursus" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex-shrink-0">
                  Lihat Semua Kursus <ChevronRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {livePackages.map((s, i) => (
                <AnimatedSection key={s.title} delay={i * 0.08}>
                  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col transition-all hover:shadow-lg ${s.borderColor}`}>
                    <div className="p-7 flex-1 flex flex-col">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 shadow-sm ${s.color}`}>
                        <s.icon size={22} />
                      </div>
                      <h3 className="font-extrabold text-xl text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {s.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">{s.desc}</p>
                      
                      <div className="space-y-2.5 mb-8">
                        {s.features.map((f) => (
                          <div key={f} className="flex items-start gap-2.5">
                            <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-medium text-slate-700">{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                           <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Mulai Dari</p>
                           <p className={`font-extrabold text-lg ${s.textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.price}</p>
                        </div>
                        <Link href="/kursus" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors">
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── MENTORS ── */}
        <section className="py-20 px-6 bg-white border-y border-slate-200">
          <div className="container-main max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-2">Tim Pengajar</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Belajar dari Expert Industri</h2>
                  <p className="text-base text-slate-500 max-w-lg leading-relaxed">
                    Lebih dari sekadar teori pengoperasian software. Anda akan diajarkan metodologi best-practice proyek langsung.
                  </p>
                </div>
                <Link href="/mentor" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex-shrink-0">
                  Lihat Profil Mentor <ChevronRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {mentors.map((m, i) => (
                <AnimatedSection key={m.id} delay={i * 0.08}>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-sm border border-black/5 ${m.avatarBg}`}
                           style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {m.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-base text-slate-900 leading-tight truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</h3>
                        <p className="text-xs font-bold text-slate-500 mt-1 truncate">{m.role}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5 flex-1 content-start">
                      {m.expertise.slice(0, 3).map((e: string) => (
                         <span key={e} className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded-md">
                           {e}
                         </span>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between py-3 border-t border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-extrabold text-slate-900">{m.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users size={13} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">{m.sessions_count}+ Sesi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA / WHY US ── */}
        <section className="py-24 px-6 bg-slate-900">
          <div className="container-main max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block mb-3">Nilai Lebih Civilians</span>
                  <h2 className="text-3xl font-black text-white mb-5 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Metode Praktis,<br />Siap Terjun ke Industri.
                  </h2>
                  <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md">
                    Berbeda dengan platform edukasi umum, kami membimbing peserta dengan studi kasus perancangan infrastruktur dan gedung.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/kursus" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg">
                      Pilih Paket Kursus <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Shield, title: "Materi Uptodate", desc: "Sesuai SNI terbaru" },
                    { icon: Clock, title: "Waktu Efektif", desc: "Penyampaian to the point" },
                    { icon: Users, title: "Bimbingan Mentor", desc: "Tanya jawab intensif" },
                    { icon: MapPin, title: "Kasus Relatable", desc: "Proyek di Indonesia" },
                  ].map((item) => (
                    <div key={item.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:bg-slate-800/80 transition-colors">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 mb-4 text-blue-400">
                         <item.icon size={18} />
                      </div>
                      <p className="font-bold text-sm text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</p>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
