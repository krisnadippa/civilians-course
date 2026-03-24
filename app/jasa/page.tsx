"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calculator, Building2, Ruler, Cpu, HardHat, Layers,
  CheckCircle2, ArrowRight, Clock, ChevronRight,
  MessageSquare, Mail, Phone, Send, Loader2,
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

const services = [
  {
    id: 1, icon: Calculator, title: "Pembuatan RAB",
    desc: "RAB akurat sesuai HSPK & SNI, dilengkapi analisa harga satuan pekerjaan dan rekapitulasi lengkap.",
    features: ["Analisa Harga Satuan", "Rekapitulasi Biaya", "Format Excel Profesional", "Referensi HSPK & SNI"],
    duration: "3–7 Hari Kerja", price: "Mulai Rp 350.000",
  },
  {
    id: 2, icon: Building2, title: "Desain Struktur",
    desc: "Perencanaan struktur gedung dan infrastruktur menggunakan SAP2000, ETABS, sesuai SNI terbaru.",
    features: ["Analisis Struktural", "Perhitungan Beban", "Output Software Lengkap", "Laporan Teknis"],
    duration: "5–14 Hari Kerja", price: "Mulai Rp 850.000",
  },
  {
    id: 3, icon: Ruler, title: "Gambar Kerja CAD",
    desc: "Set gambar kerja lengkap sesuai standar nasional: Denah, Tampak, Potongan, Detail, dan As-Built Drawing.",
    features: ["Denah & Tampak", "Detail Konstruksi", "Auto Layout + Sheet Set", "Format DWG & PDF"],
    duration: "4–10 Hari Kerja", price: "Mulai Rp 500.000",
  },
  {
    id: 4, icon: Cpu, title: "Civil 3D Modeling",
    desc: "Pemodelan jalan, saluran, dan terrain menggunakan Autodesk Civil 3D untuk proyek infrastruktur.",
    features: ["Surface Modeling", "Corridor Design", "Volume Calculation", "Drainage Design"],
    duration: "5–12 Hari Kerja", price: "Mulai Rp 750.000",
  },
  {
    id: 5, icon: HardHat, title: "Manajemen Konstruksi",
    desc: "Penjadwalan, monitoring progres, pelaporan proyek, dan analisis kurva-S untuk proyek konstruksi.",
    features: ["Network Planning", "Kurva S", "Laporan Progres", "Identifikasi Risiko"],
    duration: "2–5 Hari Kerja", price: "Mulai Rp 450.000",
  },
  {
    id: 6, icon: Layers, title: "Analisis Struktur",
    desc: "Analisis beban, defleksi, gaya dalam, dan desain elemen struktur menggunakan software certified.",
    features: ["Analisis Beban", "Model 3D Struktur", "Laporan Output Lengkap", "Revisi Unlimited"],
    duration: "4–10 Hari Kerja", price: "Mulai Rp 600.000",
  },
];

const steps = [
  { step: "01", title: "Konsultasi Awal", desc: "Hubungi kami melalui form atau WhatsApp. Jelaskan kebutuhan proyek Anda secara detail." },
  { step: "02", title: "Analisis & Penawaran", desc: "Tim kami menganalisis kebutuhan dan memberikan penawaran harga yang transparan." },
  { step: "03", title: "Proses Pengerjaan", desc: "Tim ahli mengerjakan sesuai timeline yang disepakati dengan update progres berkala." },
  { step: "04", title: "Serah Terima", desc: "Output final dikirimkan. Tersedia revisi hingga Anda puas dengan hasilnya." },
];

export default function JasaPage() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    service: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.service) {
      alert("Mohon lengkapi data Nama, WhatsApp, dan Layanan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("jasa").insert([
        {
          user_name: formData.name,
          user_whatsapp: formData.whatsapp,
          service_name: formData.service,
          description: formData.description,
          status: "Menunggu",
          priority: "Normal"
        }
      ]);

      if (error) throw error;
      setIsSuccess(true);
      setFormData({ name: "", whatsapp: "", service: "", description: "" });
    } catch (err: any) {
      alert("Gagal mengirim permintaan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };  const scrollToForm = (serviceTitle?: string) => {
    if (serviceTitle) {
      setFormData((prev) => ({ ...prev, service: serviceTitle }));
    }
    const formElement = document.getElementById("jasa-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-24 relative overflow-hidden bg-white border-b border-slate-100">
          <div className="container-main relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-blue-100">
                  Jasa Profesional
                </span>
              </div>
              <h1 className="text-slate-900 mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Layanan Perancangan <br/><span className="text-blue-600">Teknik Sipil</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                Dikerjakan oleh tim praktisi berpengalaman dengan standar presisi tertinggi — dari RAB, desain struktur, hingga Civil 3D.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20" style={{ background: "white" }}>
          <div className="container-main">
            <AnimatedSection>
              <div className="mb-12">
                <span className="section-label">Layanan Tersedia</span>
                <div className="divider-blue" />
                <h2 className="section-title">6 Layanan Unggulan</h2>
                <p className="mt-3 text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
                  Pilih layanan sesuai kebutuhan proyek atau tugas Anda.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {services.map((s, i) => (
                <AnimatedSection key={s.id} delay={i * 0.07}>
                  <div className="card p-8 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="icon-box-solid flex-shrink-0">
                        <s.icon size={20} color="white" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>{s.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={11} style={{ color: "var(--text-light)" }} />
                          <span className="text-xs" style={{ color: "var(--text-light)" }}>{s.duration}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>

                    <ul className="flex flex-col gap-1.5 mb-5">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <CheckCircle2 size={12} style={{ color: "var(--primary)", flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="font-bold text-sm" style={{ color: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif" }}>{s.price}</span>
                      <button 
                        onClick={() => scrollToForm(s.title)}
                        className="btn-primary text-xs" style={{ padding: "7px 14px" }}
                      >
                        Pesan <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 blue-dot-bg">
          <div className="container-main">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="section-label">Alur Kerja</span>
                <div className="divider-blue mx-auto" />
                <h2 className="section-title">Proses yang Terstruktur</h2>
                <p className="mt-3 text-base max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                  Dari konsultasi hingga serah terima, setiap langkah terpantau.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {steps.map((s, i) => (
                <AnimatedSection key={s.step} delay={i * 0.1}>
                  <div className="card p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white font-bold"
                      style={{ background: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                      {s.step}
                    </div>
                    <h4 className="font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>{s.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation Form */}
        <section id="jasa-form" className="py-28" style={{ background: "white" }}>
          <div className="container-main">
            <div className="max-w-2xl mx-auto">
              <AnimatedSection>
                <div className="text-center mb-10">
                  <span className="section-label">Konsultasi Gratis</span>
                  <div className="divider-blue mx-auto" />
                  <h2 className="section-title">Diskusikan Kebutuhan Anda</h2>
                  <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
                    Tim kami akan merespons dalam 1x24 jam kerja.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="card p-10">
                  {isSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Permintaan Terkirim!</h3>
                      <p className="text-sm text-slate-500 mb-6">Terima kasih, tim kami akan segera menghubungi Anda melalui WhatsApp dalam 1x24 jam.</p>
                      <button onClick={() => setIsSuccess(false)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                        Kirim Form Lain
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nama Lengkap</label>
                          <input 
                            type="text" required
                            placeholder="Ahmad Fauzi" 
                            className="w-full text-sm" 
                            style={{ color: "var(--text-primary)" }}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>No. WhatsApp</label>
                          <input 
                            type="tel" required
                            placeholder="08123456789" 
                            className="w-full text-sm" 
                            style={{ color: "var(--text-primary)" }}
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Layanan yang Dibutuhkan</label>
                        <select 
                          required
                          className="w-full text-sm" 
                          style={{ color: "var(--text-primary)" }}
                          value={formData.service}
                          onChange={(e) => setFormData({...formData, service: e.target.value})}
                        >
                          <option value="">-- Pilih Layanan --</option>
                          {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Deskripsi Proyek</label>
                        <textarea 
                          rows={4} 
                          placeholder="Jelaskan kebutuhan proyek Anda secara singkat..." 
                          className="w-full text-sm" 
                          style={{ resize: "none", color: "var(--text-primary)" }}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>Mengirim... <Loader2 className="animate-spin" size={16} /></>
                        ) : (
                          <>Kirim Permintaan <Send size={16} /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
