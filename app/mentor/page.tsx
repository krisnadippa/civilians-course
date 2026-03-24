"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Users, Clock, Calendar, X, CheckCircle2, BookOpen, ArrowRight,
  Building2, HardHat, Ruler, Cpu, Sparkles, MessageSquare, Linkedin, ExternalLink
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

function BookingModal({
  mentor,
  onClose,
}: {
  mentor: any;
  onClose: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [topic, setTopic] = useState("");
  const [booked, setBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested time slots
  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "19:00", "20:00"];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("mentor_bookings").insert([
        {
          mentor_id: mentor.id,
          user_name: "User Civilians", // In a real app, this would be the logged-in user
          topic: topic || "Bimbingan Mentor",
          booking_date: selectedDate,
          booking_time: selectedTime,
          status: "Pending"
        }
      ]);

      if (error) throw error;
      setBooked(true);
    } catch (err: any) {
      alert("Gagal membuat booking: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
               {mentor.image_url ? (
                 <img src={mentor.image_url} alt={mentor.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                   {mentor.avatar}
                 </div>
               )}
             </div>
             <div>
               <h3 className="font-bold text-slate-900 leading-tight">{mentor.name}</h3>
               <p className="text-xs text-slate-500">{mentor.title}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold"><X size={20} className="text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {booked ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Booking Dikirim!</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Permintaan bimbingan Anda telah masuk ke sistem. Tim kami akan segera mengkonfirmasi via WhatsApp/Email.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detil Sesi:</p>
                 <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Calendar size={16} className="text-blue-500" /> {selectedDate} pk {selectedTime} WIB
                 </div>
              </div>
              <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all">Tutup</button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-8">
               <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Fee Bimbingan</p>
                    <p className="text-2xl font-extrabold text-blue-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Rp {mentor.price.toLocaleString("id")}</p>
                    <p className="text-[10px] text-blue-400 font-medium">Durasi 60 Menit / Sesi</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <Clock size={24} />
                  </div>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">1. Pilih Tanggal</label>
                   <input 
                      type="date"
                      min={minDate}
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm font-bold transition-all"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">2. Pilih Jam Sesi</label>
                   <div className="grid grid-cols-3 gap-2">
                     {timeSlots.map((time) => (
                       <button
                         key={time}
                         type="button"
                         onClick={() => setSelectedTime(time)}
                         className={`px-3 py-3 rounded-xl text-xs font-bold transition-all border ${
                           selectedTime === time 
                             ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                             : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                         }`}
                       >
                         {time}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">3. Topik Diskusi (Opsional)</label>
                   <textarea
                     rows={3}
                     placeholder="Sebutkan kendala atau materi yang ingin Anda tanyakan..."
                     className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all resize-none"
                     value={topic}
                     onChange={(e) => setTopic(e.target.value)}
                   />
                 </div>
               </div>

               <button
                 type="submit"
                 disabled={!selectedDate || !selectedTime}
                 className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                   !selectedDate || !selectedTime
                     ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                     : "bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200"
                 }`}
               >
                 Konfirmasi Booking <ArrowRight size={18} />
               </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MentorPage() {
  const [mentorsData, setMentorsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMentor, setActiveMentor] = useState<any | null>(null);

  useEffect(() => {
    const fetchMentorsData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("mentors")
          .select("*")
          .neq("status", "Draft") 
          .order("name", { ascending: true });
        
        if (error) throw error;

        if (data) {
          const mapped = data.map((m: any) => ({
            ...m,
            id: m.id,
            avatar: m.image_url ? null : (m.avatar_initials || m.name.charAt(0)),
            color: m.color_code || "#3B82F6",
            name: m.name,
            title: m.title || "Senior Mentor",
            bio: m.bio || "Berpengalaman membimbing mahasiswa teknik sipil dalam mengerjakan tugas akhir dan proyek praktis.",
            expertise: Array.isArray(m.expertise) ? m.expertise : (m.expertise?.split(",") || ["General"]),
            rating: m.rating || 5.0,
            sessions: m.sessions_count || 0,
            price: m.price || 150000,
            available: Array.isArray(m.available_slots) ? m.available_slots : ["Senin 19:00", "Rabu 19:00"],
            image_url: m.image_url
          }));
          setMentorsData(mapped);
        }
      } catch (err) {
        console.error("Error fetching mentors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentorsData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC]">
        {/* ── HERO SECTION ── */}
        {/* ── HERO SECTION ── */}
        <section className="relative pt-40 pb-24 overflow-hidden bg-white border-b border-slate-100">
          <div className="container-main relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold tracking-widest uppercase rounded-md border border-blue-100">Expert Mentorship</span>
              </div>
              
              <h1 className="text-slate-900 mb-6 leading-[1.1]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Pelajari Langsung dari <br/><span className="text-blue-600">Para Praktisi</span>
              </h1>
              
              <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-slate-500">
                Bimbingan 1-on-1 eksklusif bersama praktisi senior untuk menguasai software teknik, penyusunan RAB, hingga konsultasi Tugas Akhir dengan standar industri.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl">
                   <CheckCircle2 className="text-blue-600" size={20} />
                   <p className="text-sm font-bold text-slate-700 tracking-wide">Sesi Privat 60 Menit</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl">
                   <MessageSquare className="text-blue-600" size={20} />
                   <p className="text-sm font-bold text-slate-700 tracking-wide">Q&A Tak Terbatas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mentors Section */}
        <section className="py-24 px-6">
          <div className="container-main">
            <div className="flex items-center justify-between mb-16">
               <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Pilih Mentor Anda</h2>
                  <p className="text-slate-500">Menghubungkan Anda dengan expertise terbaik di bidang perancangan dan sipil.</p>
               </div>
               <div className="hidden md:flex gap-2">
                  <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                    {mentorsData.length} Mentor Aktif
                  </div>
               </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-10 h-80 animate-pulse border border-slate-100 shadow-sm" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {mentorsData.map((m, i) => (
                  <AnimatedSection key={m.id} delay={i * 0.1}>
                    <div className="group bg-white rounded-2xl p-8 md:p-10 border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all duration-500 flex flex-col h-full shadow-sm">
                       <div className="flex flex-col md:flex-row gap-8 mb-8">
                         {/* Avatar container */}
                         <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-50 overflow-hidden border-2 border-slate-100 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-500">
                               {m.image_url ? (
                                 <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: m.color }}>
                                   {m.avatar}
                                 </div>
                               )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center text-white">
                               <CheckCircle2 size={16} />
                            </div>
                         </div>

                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                               <Sparkles size={14} className="text-amber-400" />
                               <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">Featured Mentor</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</h3>
                            <p className="text-sm font-bold text-blue-600 mb-4">{m.title}</p>
                            
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-6">
                               <div className="flex items-center gap-1">
                                 <Star size={14} className="text-amber-400 fill-amber-400" />
                                 <span className="text-slate-900">{m.rating}</span>
                               </div>
                               <div className="w-1 h-1 bg-slate-200 rounded-full" />
                               <div className="flex items-center gap-1">
                                 <Users size={14} className="text-slate-400" />
                                 <span>{m.sessions} Sesi</span>
                               </div>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">
                               {m.bio}
                            </p>
                         </div>
                       </div>

                       <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 mt-auto">
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                             {m.expertise.slice(0, 3).map((exp: string) => (
                               <span key={exp} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl border border-slate-100">
                                  {exp}
                               </span>
                             ))}
                             {m.expertise.length > 3 && <span className="text-[10px] font-bold text-slate-300 self-center">+{m.expertise.length - 3} More</span>}
                          </div>

                          <div className="flex items-center gap-4 w-full md:w-auto">
                             <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Per Sesi</p>
                                <p className="text-lg font-bold text-slate-900">Rp {m.price.toLocaleString("id")}</p>
                             </div>
                             <button 
                                onClick={() => setActiveMentor(m)}
                                className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
                             >
                                Booking Mentor
                             </button>
                          </div>
                       </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white relative overflow-hidden">
           <div className="container-main relative z-10 px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                 <div className="lg:col-span-1">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Kenapa bimbingan 1-on-1 di Civilians?</h2>
                    <p className="text-slate-500 mb-10 leading-relaxed">Metode belajar yang dipersonalisasi sesuai kendala Anda memberikan hasil 5x lebih cepat dibanding belajar otodidak.</p>
                    <div className="space-y-6">
                        {[
                          { title: "Terarah & Spesifik", desc: "Langsung ke inti masalah yang Anda hadapi." },
                          { title: "Fleksibel", desc: "Pilih jadwal yang paling cocok dengan rutinitas Anda." },
                          { title: "Review Langsung", desc: "Dapatkan feedback instant untuk hasil pekerjaan Anda." }
                        ].map((item, id) => (
                          <div key={id} className="flex gap-4">
                             <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                                <CheckCircle2 size={14} />
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                             </div>
                          </div>
                        ))}
                    </div>
                 </div>
                 <div className="lg:col-span-2 relative">
                    <div className="aspect-video bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden relative group">
                       <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl hover:scale-110 transition-transform">
                             <ArrowRight size={32} />
                          </button>
                       </div>
                       <div className="absolute bottom-10 left-10">
                          <p className="text-white text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Sesi Real-time dengan Mentor</p>
                          <p className="text-white/60 text-sm">Bagikan layar, diskusikan file, dan selesaikan tantangan teknis bersama.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />

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
