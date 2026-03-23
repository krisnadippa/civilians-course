"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Users,
  Clock,
  Calendar,
  X,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Building2,
  HardHat,
  Ruler,
  Cpu,
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";

const mentors = [
  {
    id: 1,
    avatar: "BS",
    color: "var(--primary)",
    name: "Eka Juniarta",
    title: "Pakar Analisis & Desain Struktur",
    bio: "20+ tahun pengalaman di bidang teknik struktur. Terlibat dalam proyek jembatan nasional dan gedung bertingkat tinggi di berbagai kota besar Indonesia.",
    expertise: [
      "Analisis Struktur",
      "SAP2000",
      "ETABS",
      "Beton Bertulang",
      "Baja Struktur",
      "SNI Gempa",
    ],
    rating: 4.9,
    sessions: 312,
    price: 175000,
    available: [
      "Senin 19:00",
      "Rabu 19:00",
      "Sabtu 10:00",
      "Sabtu 14:00",
      "Minggu 10:00",
    ],
  },
  {
    id: 2,
    avatar: "SR",
    color: "#1345B5",
    name: "Ratna Essya",
    title: "Spesialis Manajemen Konstruksi & RAB",
    bio: "Praktisi aktif manajemen proyek konstruksi dengan portofolio proyek senilai lebih dari Rp 500 miliar. Ahli penyusunan RAB dan penjadwalan proyek.",
    expertise: [
      "Manajemen Konstruksi",
      "RAB & Estimasi",
      "MS Project",
      "Kurva-S",
      "HSPK",
      "K3 Proyek",
    ],
    rating: 4.8,
    sessions: 245,
    price: 150000,
    available: [
      "Selasa 18:00",
      "Kamis 18:00",
      "Jumat 18:00",
      "Sabtu 08:00",
      "Sabtu 13:00",
    ],
  },
  {
    id: 3,
    avatar: "AP",
    color: "#0F2878",
    name: "Arimantara",
    title: "Ahli BIM & Gambar Teknik",
    bio: "Spesialis BIM dan drafting teknik dengan pengalaman di proyek infrastruktur internasional. Certified Autodesk Professional untuk AutoCAD, Revit, dan Civil 3D.",
    expertise: [
      "AutoCAD 2D/3D",
      "Revit BIM",
      "Civil 3D",
      "Navisworks",
      "BIM Coordinator",
      "Set Gambar Kerja",
    ],
    rating: 4.9,
    sessions: 198,
    price: 160000,
    available: [
      "Senin 20:00",
      "Rabu 20:00",
      "Jumat 19:00",
      "Sabtu 15:00",
      "Minggu 14:00",
    ],
  },
  {
    id: 4,
    avatar: "DK",
    color: "#1A56DB",
    name: "Bagaskara",
    title: "Pakar Geoteknik & Pondasi",
    bio: "Peneliti dan konsultan geoteknik dengan spesialisasi analisis pondasi, perbaikan tanah, dan analisis stabilitas lereng untuk proyek konstruksi skala besar.",
    expertise: [
      "Geoteknik",
      "Pondasi Dalam",
      "Analisis Lereng",
      "Plaxis 2D/3D",
      "SPT Correlation",
      "Perbaikan Tanah",
    ],
    rating: 4.7,
    sessions: 167,
    price: 165000,
    available: [
      "Selasa 19:00",
      "Kamis 19:00",
      "Sabtu 09:00",
      "Sabtu 16:00",
      "Minggu 09:00",
    ],
  },
];

function BookingModal({
  mentor,
  onClose,
}: {
  mentor: (typeof mentors)[0];
  onClose: () => void;
}) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [topic, setTopic] = useState("");
  const [booked, setBooked] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setBooked(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="card w-full max-w-lg overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-start justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{
                background: mentor.color,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {mentor.avatar}
            </div>
            <div>
              <h3
                className="font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                {mentor.name}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {mentor.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-light)" }}
          >
            <X size={18} />
          </button>
        </div>

        {booked ? (
          <div className="p-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--blue-50)" }}
            >
              <CheckCircle2 size={32} style={{ color: "var(--primary)" }} />
            </div>
            <h3
              className="font-bold text-lg mb-2"
              style={{
                color: "var(--text-primary)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Booking Berhasil!
            </h3>
            <p
              className="text-sm mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Sesi dengan <strong>{mentor.name}</strong>
            </p>
            <p
              className="text-sm mb-4 font-semibold"
              style={{ color: "var(--primary)" }}
            >
              {selectedSlot}
            </p>
            <p className="text-xs" style={{ color: "var(--text-light)" }}>
              Konfirmasi akan dikirim ke email Anda. Mentor akan menghubungi
              sebelum sesi dimulai.
            </p>
            <button onClick={onClose} className="btn-primary mt-6 mx-auto">
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="p-5 flex flex-col gap-5">
            {/* Price Info */}
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "var(--blue-50)",
                border: "1px solid var(--border-blue)",
              }}
            >
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Biaya per sesi (60 menit)
                </p>
                <p
                  className="font-bold text-lg"
                  style={{
                    color: "var(--primary)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Rp {mentor.price.toLocaleString("id")}
                </p>
              </div>
              <Clock
                size={22}
                style={{ color: "var(--primary)", opacity: 0.6 }}
              />
            </div>

            {/* Slot Selection */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Pilih Waktu Sesi
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mentor.available.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all border"
                    style={{
                      background:
                        selectedSlot === slot ? "var(--primary)" : "white",
                      color:
                        selectedSlot === slot
                          ? "white"
                          : "var(--text-secondary)",
                      borderColor:
                        selectedSlot === slot
                          ? "var(--primary)"
                          : "var(--border)",
                    }}
                  >
                    <Calendar size={12} />
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Topik / Pertanyaan{" "}
                <span style={{ color: "var(--text-light)", fontWeight: 400 }}>
                  (opsional)
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Saya ingin belajar analisis gempa menggunakan SAP2000..."
                className="w-full text-sm"
                style={{ resize: "none", color: "var(--text-primary)" }}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedSlot}
              className="btn-booking w-full justify-center"
            >
              Konfirmasi Booking <CheckCircle2 size={16} />
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function MentorPage() {
  const [activeMentor, setActiveMentor] = useState<(typeof mentors)[0] | null>(
    null,
  );

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="pt-48 pb-40 relative overflow-hidden"
          style={{ background: "var(--primary)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-5 h-0.5"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                />
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Tim Pengajar
                </span>
              </div>
              <h1
                className="text-white mb-4"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                Belajar dari Para Expert
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: 500,
                  fontSize: "1rem",
                }}
              >
                4 mentor senior siap membimbing sesi privat 1-on-1. Booking
                sesuai jadwal dan kebutuhan Anda.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-auto"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C480,140 960,140 1440,0 L1440,120 L0,120 Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* Mentors Grid */}
        <section className="py-20" style={{ background: "white" }}>
          <div className="container-main">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((m, i) => (
                <AnimatedSection key={m.id} delay={i * 0.1}>
                  <div className="card p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                        style={{
                          background: m.color,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {m.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-lg leading-tight mb-1"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "var(--text-primary)",
                          }}
                        >
                          {m.name}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {m.title}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Star
                              size={13}
                              fill="var(--primary)"
                              style={{ color: "var(--primary)" }}
                            />
                            <span
                              className="text-sm font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {m.rating}
                            </span>
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-light)" }}
                          >
                            {m.sessions} sesi selesai
                          </span>
                        </div>
                      </div>
                    </div>

                    <p
                      className="text-sm leading-relaxed mb-5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {m.bio}
                    </p>

                    <div className="flex-1">
                      {/* Expertise */}
                      <div className="mb-5">
                        <p
                          className="text-xs font-bold uppercase tracking-wider mb-2"
                          style={{ color: "var(--text-light)" }}
                        >
                          Keahlian
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.expertise.map((e) => (
                            <span key={e} className="tag-primary">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Available Slots */}
                      <div className="mb-5">
                        <p
                          className="text-xs font-bold uppercase tracking-wider mb-2"
                          style={{ color: "var(--text-light)" }}
                        >
                          Jadwal Tersedia
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.available.slice(0, 3).map((slot) => (
                            <span
                              key={slot}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                              style={{
                                background: "var(--blue-50)",
                                color: "var(--primary)",
                                border: "1px solid var(--border-blue)",
                              }}
                            >
                              <Calendar size={10} />
                              {slot}
                            </span>
                          ))}
                          {m.available.length > 3 && (
                            <span
                              className="px-2 py-1 rounded-md text-xs"
                              style={{
                                background: "var(--bg-subtle)",
                                color: "var(--text-light)",
                              }}
                            >
                              +{m.available.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between pt-4 mt-auto"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-light)" }}
                        >
                          Harga per sesi
                        </p>
                        <p
                          className="font-bold text-base"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "var(--text-primary)",
                          }}
                        >
                          Rp {m.price.toLocaleString("id")}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveMentor(m)}
                        className="btn-booking"
                      >
                        Booking Sesi <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-28" style={{ background: "white" }}>
          <div className="container-main">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="section-label">Cara Kerja</span>
                <div className="divider-blue mx-auto" />
                <h2 className="section-title">Booking dalam 3 Langkah</h2>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: Users,
                  title: "Pilih Mentor",
                  desc: "Pilih mentor sesuai kebutuhan dan keahlian yang Anda butuhkan.",
                },
                {
                  step: "02",
                  icon: Calendar,
                  title: "Pilih Jadwal",
                  desc: "Pilih slot waktu yang tersedia dan sesuai jadwal Anda.",
                },
                {
                  step: "03",
                  icon: CheckCircle2,
                  title: "Mulai Sesi",
                  desc: "Konfirmasi booking dan mulai sesi bimbingan 1-on-1 bersama mentor.",
                },
              ].map((item, i) => (
                <AnimatedSection key={item.step} delay={i * 0.1}>
                  <div className="card p-6 text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold"
                      style={{
                        background: "var(--primary)",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.step}
                    </div>
                    <h4
                      className="font-bold mb-2"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      <AnimatePresence>
        {activeMentor && (
          <BookingModal
            mentor={activeMentor}
            onClose={() => setActiveMentor(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
