"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Users, CheckCircle2, BookOpen, ArrowRight, Award, X,
  MessageSquare, Clock, Layers, Building2, Cpu, Target, Briefcase
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";
import Link from "next/link";

/* ── TYPES ── */
type Mentor = {
  id: number;
  name: string;
  initials: string;
  avatarBg: string;      // solid bg color class
  accentColor: string;   // solid text color class
  topBorder: string;     // top border class
  role: string;
  title: string;
  courses: { name: string; bg: string }[];
  courseIcons: any[];
  expertise: string[];
  rating: number;
  sessions: number;
  experience: string;
  bio: string;
  specialization: string[];
  achievements: string[];
};

/* ── DATA ── */
const mentors: Mentor[] = [
  {
    id: 1,
    name: "Ratna Essya",
    initials: "RE",
    avatarBg: "bg-emerald-600",
    accentColor: "text-emerald-700",
    topBorder: "border-t-4 border-emerald-500",
    role: "Civil 3D Specialist",
    title: "Ahli Desain Jalan & Infrastruktur",
    courses: [{ name: "Civil 3D", bg: "bg-emerald-600" }],
    courseIcons: [Cpu],
    expertise: ["Autodesk Civil 3D", "Corridor Design", "Volume Earthwork", "Drainase", "Road Alignment"],
    rating: 4.9,
    sessions: 87,
    experience: "7+ Tahun",
    bio: "Praktisi aktif di bidang desain infrastruktur dan perencanaan jalan. Telah terlibat dalam berbagai proyek jalan nasional dan regional menggunakan Autodesk Civil 3D.",
    specialization: ["Perencanaan Geometric Jalan", "Perhitungan Galian & Timbunan", "Desain Koridor Civil 3D"],
    achievements: ["Proyek Jalan Nasional Bali–Lombok", "Konsultan 20+ Proyek Civil 3D", "Certified Autodesk Professional"],
  },
  {
    id: 2,
    name: "Arimantara",
    initials: "AR",
    avatarBg: "bg-blue-600",
    accentColor: "text-blue-700",
    topBorder: "border-t-4 border-blue-500",
    role: "Civil 3D & Structural Analyst",
    title: "Spesialis Infrastruktur & Struktur",
    courses: [{ name: "Civil 3D", bg: "bg-emerald-600" }, { name: "SAP2000", bg: "bg-blue-600" }],
    courseIcons: [Cpu, Building2],
    expertise: ["Civil 3D", "SAP2000", "Structural Analysis", "Beban Gempa", "SNI 2847"],
    rating: 5.0,
    sessions: 92,
    experience: "9+ Tahun",
    bio: "Konsultan senior dengan keahlian ganda di bidang infrastruktur sipil dan analisis struktur. Telah menyelesaikan ratusan proyek dari desain jalan hingga struktur gedung bertingkat.",
    specialization: ["Desain Infrastruktur Civil 3D", "Analisis Struktur Beton & Baja", "Pelatihan SAP Dasar (ASSTT)"],
    achievements: ["200+ Peserta Dibimbing", "Proyek Tol Trans-Jawa", "M.T. Teknik Sipil UI"],
  },
  {
    id: 3,
    name: "Eka Juniarta",
    initials: "EJ",
    avatarBg: "bg-indigo-600",
    accentColor: "text-indigo-700",
    topBorder: "border-t-4 border-indigo-500",
    role: "SAP2000 & BIM Expert",
    title: "Pakar Analisis Struktur & BIM",
    courses: [{ name: "SAP2000", bg: "bg-blue-600" }, { name: "BIM", bg: "bg-violet-600" }],
    courseIcons: [Building2, Layers],
    expertise: ["SAP2000", "Revit", "Tekla", "SRPMK", "SNI 1729"],
    rating: 4.9,
    sessions: 78,
    experience: "8+ Tahun",
    bio: "Expert di dua bidang yang saling melengkapi: analisis struktur tingkat lanjut dan Building Information Modeling (BIM). Berpengalaman dalam pemodelan gedung beton dan baja sesuai SNI terbaru.",
    specialization: ["SNI 2847 Beton Bertulang", "SNI 1729 Konstruksi Baja", "Analisis SRPMK & Respons Spektrum", "Revit & BIM Workflow"],
    achievements: ["Certified BIM Manager", "Proyek Gedung 25 Lantai", "Pembicara Seminar Nasional BIM"],
  },
  {
    id: 4,
    name: "Bagaskara",
    initials: "BG",
    avatarBg: "bg-violet-600",
    accentColor: "text-violet-700",
    topBorder: "border-t-4 border-violet-500",
    role: "BIM & Project Management",
    title: "Spesialis BIM & Manajemen Proyek",
    courses: [{ name: "BIM", bg: "bg-violet-600" }],
    courseIcons: [Layers],
    expertise: ["Tekla Structures", "Ms. Project", "Revit MEP", "RAB Otomatis", "4D BIM"],
    rating: 5.0,
    sessions: 65,
    experience: "6+ Tahun",
    bio: "Praktisi BIM dengan fokus pada integrasi workflow dari pemodelan 3D hingga penjadwalan proyek dan estimasi biaya otomatis. Berpengalaman pada proyek gedung komersial dan infrastruktur publik.",
    specialization: ["Tekla Structural Designer", "Ms. Project Scheduling", "Perhitungan RAB dari Model BIM"],
    achievements: ["BIM Implementation Lead", "Proyek BIM Award 2023", "S2 Manajemen Konstruksi"],
  },
];

/* ── MENTOR MODAL ── */
function MentorModal({ mentor, onClose }: { mentor: Mentor; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className={`bg-white rounded-2xl w-full max-w-xl shadow-2xl shadow-slate-300/40 flex flex-col overflow-hidden border-t-4 ${mentor.topBorder.split(" ")[1]} ${mentor.topBorder.split(" ")[0]}`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center gap-5 px-7 py-6 border-b border-slate-100 bg-slate-50">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-sm ${mentor.avatarBg}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {mentor.initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-extrabold rounded-md border border-amber-200">Expert</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded-md border border-slate-200">{mentor.experience}</span>
            </div>
            <h2 className="font-extrabold text-slate-900 text-xl leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{mentor.name}</h2>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{mentor.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Courses */}
          <div className="flex flex-wrap gap-2">
            {mentor.courses.map((c) => (
              <span key={c.name} className={`px-3 py-1.5 ${c.bg} text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm`}>
                <BookOpen size={11} /> {c.name}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-slate-900 text-sm">{mentor.rating}</span>
              </div>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Rating</p>
            </div>
            <div className="text-center border-x border-slate-200">
              <p className="font-extrabold text-slate-900 text-sm">{mentor.sessions}+</p>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Sesi</p>
            </div>
            <div className="text-center">
              <p className="font-extrabold text-slate-900 text-sm">{mentor.experience}</p>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Pengalaman</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Profil</p>
            <p className="text-sm text-slate-600 leading-relaxed">{mentor.bio}</p>
          </div>

          {/* Expertise */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Keahlian</p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map((e) => (
                <span key={e} className="px-2.5 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Specialization */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Spesialisasi Pengajaran</p>
            <div className="space-y-2">
              {mentor.specialization.map((s) => (
                <div key={s} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-slate-700">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Pencapaian</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {mentor.achievements.map((a) => (
                <div key={a} className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                  <Award size={16} className="text-amber-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-700 leading-tight">{a}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/kursus"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-blue-700 transition-colors shadow-md"
          >
            Daftar Kursus {mentor.courses.map(c => c.name).join(" & ")} <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── PAGE ── */
export default function MentorPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [liveMentors, setLiveMentors] = useState<Mentor[]>(mentors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data } = await import("@/lib/supabase").then(m => m.supabase.from("mentors").select("*"));
        if (data && data.length > 0) {
          const parseArray = (val: any) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
              try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed; } 
              catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
            }
            return [];
          };

          const mapped = data.map(m => ({
            id: m.id,
            name: m.name,
            initials: m.initials || m.name.substring(0, 2).toUpperCase(),
            avatarBg: m.color_theme ? `bg-${m.color_theme}-600` : "bg-emerald-600",
            accentColor: m.color_theme ? `text-${m.color_theme}-700` : "text-emerald-700",
            topBorder: m.color_theme ? `border-t-4 border-${m.color_theme}-500` : "border-t-4 border-emerald-500",
            role: m.role || "Mentor",
            title: m.title || "Ahli Teknik Sipil",
            courses: parseArray(m.courses_handled).map((c: string) => ({ name: c, bg: m.color_theme ? `bg-${m.color_theme}-600` : "bg-emerald-600" })),
            courseIcons: [BookOpen],
            expertise: parseArray(m.expertise_tags),
            rating: m.rating || 5.0,
            sessions: m.sessions_count || 0,
            experience: m.experience || "5+ Tahun",
            bio: m.bio || "-",
            specialization: parseArray(m.specializations),
            achievements: parseArray(m.achievements),
          }));
          setLiveMentors(mapped);
        }
      } catch (e) {
        console.error("Gagal load mentor statis", e);
      }
      setLoading(false);
    };
    fetchMentors();
  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen">
        {/* ── HERO ── */}
        <section className="bg-white border-b border-slate-200 pt-36 pb-20 px-6">
          <div className="container-main max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-[11px] font-extrabold uppercase tracking-widest mb-5">
                <Award size={11} /> Tim Pengajar Berpengalaman
              </span>
              <h1 className="text-slate-900 mb-4 leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Belajar dari Praktisi<br />Aktif di Industri
              </h1>
              <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
                4 mentor kami adalah konsultan yang aktif terlibat dalam proyek konstruksi nyata di Indonesia.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { val: "4 Mentor", sub: "Aktif di Industri" },
                  { val: "4.9 / 5", sub: "Rata-rata Rating" },
                  { val: "7–9 Tahun", sub: "Pengalaman" },
                ].map(({ val, sub }) => (
                  <div key={sub} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-left shadow-sm">
                    <p className="font-extrabold text-slate-900 text-sm">{val}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MENTOR GRID ── */}
        <section className="py-16 px-6">
          <div className="container-main">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Kenali Mentor Kami</h2>
                <p className="text-sm text-slate-500 font-medium">Klik "Lihat Profil" untuk melihat keahlian dan spesialisasi lengkap masing-masing mentor.</p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {liveMentors.map((m, i) => (
                <AnimatedSection key={m.id} delay={i * 0.08}>
                  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col ${m.topBorder}`}>
                    <div className="p-7 flex-1 flex flex-col">
                      {/* Top: avatar + name */}
                      <div className="flex items-start gap-4 mb-5">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-sm ${m.avatarBg}`}
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {m.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-extrabold rounded-md border border-amber-200">Expert</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded-md border border-slate-200">{m.experience}</span>
                          </div>
                          <h3 className="text-lg font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</h3>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">{m.role}</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">{m.bio}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="font-extrabold text-slate-900 text-sm">{m.rating}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Rating</p>
                        </div>
                        <div className="text-center border-x border-slate-200">
                          <p className="font-extrabold text-slate-900 text-sm">{m.sessions}+</p>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Sesi</p>
                        </div>
                        <div className="text-center">
                          <p className="font-extrabold text-slate-900 text-sm">{m.courses.length}</p>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Paket</p>
                        </div>
                      </div>

                      {/* Expertise tags */}
                      <div className="mb-4">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Keahlian</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.expertise.slice(0, 4).map((e) => (
                            <span key={e} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200">
                              {e}
                            </span>
                          ))}
                          {m.expertise.length > 4 && (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-[11px] font-bold rounded-lg border border-slate-200">
                              +{m.expertise.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course badges */}
                      <div className="mb-5">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Mengajar Paket</p>
                        <div className="flex flex-wrap gap-2">
                          {m.courses.map((c) => (
                            <span key={c.name} className={`px-3 py-1.5 ${c.bg} text-white text-[11px] font-bold rounded-xl shadow-sm`}>
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-2.5">
                        <button
                          onClick={() => setSelectedMentor(m)}
                          className="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50 transition-all"
                        >
                          Lihat Profil
                        </button>
                        <Link
                          href="/kursus"
                          className="flex-1 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Daftar Kursus <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Bottom CTA row */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-600 rounded-2xl p-7 text-white">
                <BookOpen size={28} className="text-blue-200 mb-3" />
                <h3 className="text-lg font-extrabold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Siap Belajar?</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-5">Pilih paket kursus dan daftar bersama mentor pilihan Anda.</p>
                <Link href="/kursus" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
                  Pilih Kursus <ArrowRight size={14} />
                </Link>
              </div>
              <div className="bg-slate-900 rounded-2xl p-7 text-white">
                <MessageSquare size={28} className="text-slate-500 mb-3" />
                <h3 className="text-lg font-extrabold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Ada Pertanyaan?</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">Konsultasi pemilihan kursus via WhatsApp admin kami.</p>
                <a
                  href="https://wa.me/6287762635300" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ background: "#25D366" }}
                >
                  <MessageSquare size={14} /> WhatsApp Admin
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {selectedMentor && (
          <MentorModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
