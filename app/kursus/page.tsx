"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, Users, Star, Filter, ChevronRight,
  Building2, HardHat, Calculator, Ruler, Cpu, Layers, Play,
  Award, BarChart2, CheckCircle2, Search, ArrowRight, Sparkles,
  Book, GraduationCap, Layout as LayoutIcon, Laptop
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, any> = {
  BookOpen, Building2, HardHat, Calculator, Cpu, Layers, Ruler, Laptop, Book, GraduationCap, LayoutIcon
};

const categories = ["Semua", "Struktur", "RAB", "Manajemen", "Gambar", "Civil 3D", "Pondasi"];

export default function KursusPage() {
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeLevel, setActiveLevel] = useState("Semua Level");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCoursesData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("kursus")
          .select("*")
          .neq("status", "Draft") 
          .order("title", { ascending: true });
        
        if (error) throw error;

        if (data) {
          const mapped = data.map((c: any) => ({
            ...c,
            id: c.id,
            title: c.title || "Untitled Course",
            icon: iconMap[c.icon_name] || BookOpen,
            desc: c.description || "Tingkatkan skill teknik sipil Anda bersama mentor profesional.",
            tags: Array.isArray(c.tags) ? c.tags : ["Engineering"],
            students: c.students_count || 0,
            modules: c.modules_count || 0,
            rating: c.rating || 4.9,
            duration: c.duration || "Self-paced",
            level: c.level || "Menengah",
            status: c.status || "Aktif"
          }));
          setCoursesData(mapped);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesData();
  }, []);

  const filtered = coursesData.filter((c) => {
    const catMatch = activeCategory === "Semua" || c.category === activeCategory;
    const lvlMatch = activeLevel === "Semua Level" || c.level === activeLevel;
    const searchMatch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    return catMatch && lvlMatch && searchMatch;
  });

  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC]">
        {/* ── HERO SECTION ── */}
        <section className="relative pt-40 pb-32 overflow-hidden bg-slate-50">
          <div className="container-main relative z-10 px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold tracking-widest uppercase rounded-md border border-emerald-100">Interactive Learning</span>
              </div>
              
              <h1 className="text-slate-900 mb-6 leading-[1.1]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Kuasai Skill <br/><span className="text-emerald-600">Teknik Sipil</span> Bersama Kami
              </h1>
              <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-slate-500">
                Kurikulum terstruktur yang dirancang oleh praktisi industri. Dari analisis struktur hingga manajemen proyek, semua dalam satu platform profesional.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {[
                  { icon: BookOpen, val: "48+", label: "Modul Aktif" },
                  { icon: Users, val: "2.4k+", label: "Mahasiswa" },
                  { icon: Award, val: "Cert", label: "Accredited" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <Icon size={18} className="text-emerald-600" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 leading-none">{val}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <div className="container-main relative z-20 -mt-10 px-4 md:px-6">
          <div className="bg-white p-2 shadow-md flex flex-col lg:flex-row items-center gap-2 border border-slate-100">
            {/* Search Input Group */}
            <div className="flex-1 w-full relative">
              <input
                type="text"
                placeholder="Cari kursus SAP2000, RAB, AutoCAD..."
                className="w-full px-6 py-4 bg-slate-50 border-none outline-none text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all rounded-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 w-full lg:w-auto p-1 bg-slate-50">
              {/* Categories */}
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-none text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                      activeCategory === cat 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="hidden lg:block w-[1px] h-6 bg-slate-200 mx-1" />

              <select
                className="flex-1 lg:flex-none px-4 py-2.5 bg-transparent border-none outline-none text-[11px] font-extrabold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800"
                value={activeLevel}
                onChange={(e) => setActiveLevel(e.target.value)}
              >
                <option value="Semua Level">Semua Level</option>
                <option value="Dasar">Dasar</option>
                <option value="Menengah">Menengah</option>
                <option value="Lanjutan">Lanjutan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-24 px-6">
          <div className="container-main">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Jelajahi Kurikulum
              </h2>
              <p className="text-sm text-slate-500">Menampilkan {filtered.length} kursus eksklusif </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-[32px] p-8 h-[450px] animate-pulse border border-slate-100">
                    <div className="w-full h-40 bg-slate-50 rounded-2xl mb-6" />
                    <div className="h-6 bg-slate-50 rounded-lg w-3/4 mb-4" />
                    <div className="h-20 bg-slate-50 rounded-lg w-full mb-6" />
                    <div className="mt-auto h-12 bg-slate-50 rounded-2xl w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Kursus tidak ditemukan</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Kami terus menambahkan materi baru. Coba cek kategori lain atau tunggu update berikutnya.</p>
                <button onClick={() => {setSearch(""); setActiveCategory("Semua"); setActiveLevel("Semua Level")}} className="mt-8 text-emerald-600 font-bold text-sm hover:underline">Lihat Semua Kursus</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((item, i) => (
                  <AnimatedSection key={item.id} delay={i * 0.05}>
                    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-500 flex flex-col h-full relative overflow-hidden shadow-sm">
                      {/* Image container */}
                      <div className="h-48 w-full relative overflow-hidden rounded-t-2xl">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-emerald-400">
                            <item.icon size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md uppercase tracking-widest">{item.category}</span>
                            <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-md uppercase tracking-widest">{item.level}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-7 flex-1 flex flex-col">
                        <div className="flex items-center gap-1 text-amber-500 mb-3">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm font-bold text-slate-900">{item.rating}</span>
                          <span className="text-xs text-slate-400 ml-1">({item.students} siswa)</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {item.title}
                        </h3>

                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                          {item.desc}
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                          <div className="flex items-center gap-2 text-slate-600">
                             <Clock size={14} className="text-slate-400" />
                             <span className="text-xs font-semibold">{item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                             <BookOpen size={14} className="text-slate-400" />
                             <span className="text-xs font-semibold">{item.modules} Modul</span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all group/btn">
                            Mulai Belajar Sekarang <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}

            <div className="mt-24 p-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[40px] text-center relative overflow-hidden shadow-2xl shadow-emerald-200/50">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
               <div className="relative z-10">
                 <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Bawa Karir Teknik Sipil Anda ke Level Berikutnya</h3>
                 <p className="text-emerald-50 mb-10 max-w-2xl mx-auto text-lg opacity-90">Dapatkan akses ke semua modul pembelajaran, webinar eksklusif, dan komunitas diskusi profesional Civilians.</p>
                 <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-10 py-5 bg-white text-emerald-700 rounded-[20px] font-bold text-sm hover:scale-105 transition-all shadow-xl">Daftar Sekarang</button>
                    <button className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-[20px] font-bold text-sm hover:bg-white/10 transition-all">Lihat Kurikulum</button>
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
