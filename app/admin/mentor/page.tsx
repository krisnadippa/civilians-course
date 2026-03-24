"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Plus, Search, Trash2, Edit2, X, Save, Calendar, Check, Image as ImageIcon, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";
import { supabase, uploadImage } from "@/lib/supabase";

const pendingBookings = [
  { id: "#BKG-089", user: "Ahmad Fauzi", mentor: "Dr. Ir. Budi Santoso", slot: "Senin 19:00", topic: "Analisis Struktur SAP2000", status: "Pending" },
  { id: "#BKG-088", user: "Siti Rohani", mentor: "Ir. Siti Rahayu", slot: "Selasa 18:00", topic: "RAB Proyek Perumahan", status: "Pending" },
  { id: "#BKG-087", user: "Rizki P.", mentor: "Dr. Dewi Kusuma", slot: "Kamis 19:00", topic: "Analisis Pondasi", status: "Dikonfirmasi" },
  { id: "#BKG-086", user: "Dewi A.", mentor: "Andi Prasetyo", slot: "Rabu 20:00", topic: "Civil 3D Corridor", status: "Dikonfirmasi" },
];

const statusColors: Record<string, string> = {
  "Pending": "#FFA000",
  "Dikonfirmasi": "#00897B",
};

export default function AdminMentorPage() {
  const [view, setView] = useState("mentors"); // "mentors" or "bookings"
  const [mentors, setMentors] = useState<any[]>([]);
const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    avatar_initials: "",
    color_code: "#64748b",
    status: "Aktif",
    sessions_count: "0",
    revenue: "0",
    rating: "5.0",
    image_url: "",
    title: "",
    bio: "",
    available_slots: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMentors();
    fetchBookings();
  }, []);

  async function fetchMentors() {
    setLoading(true);
    try {
      const { data: mentorData, error } = await supabase
        .from("mentors")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching mentors:", error.message);
      } else {
        setMentors(mentorData || []);
      }
    } catch (e) {
      console.error("Fatal fetch error (Mentor):", e);
    }
    setLoading(false);
  }

  async function fetchBookings() {
    try {
      const { data, error } = await supabase
        .from("mentor_bookings")
        .select(`
          *,
          mentors (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error.message);
      } else {
        const formattedBookings = data.map((b: any) => ({
          id: b.id.substring(0, 8).toUpperCase(),
          realId: b.id,
          user: b.user_name,
          mentor: b.mentors?.name || "Unknown",
          slot: `${b.booking_date} ${b.booking_time}`,
          topic: b.topic,
          status: b.status
        }));
        setBookings(formattedBookings);
      }
    } catch (e) {
      console.error("Fatal fetch error (Bookings):", e);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, "mentors");
      setFormData({ ...formData, image_url: url });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const openModal = (mode: "add" | "edit", mentor?: any) => {
    setModalMode(mode);
    if (mode === "edit" && mentor) {
      setSelectedMentor(mentor);
      setFormData({
        name: mentor.name,
        expertise: mentor.expertise || "",
        avatar_initials: mentor.avatar_initials || mentor.name.charAt(0),
        color_code: mentor.color_code || "#64748b",
        status: mentor.status || "Aktif",
        sessions_count: mentor.sessions_count?.toString() || "0",
        revenue: mentor.revenue?.toString() || "0",
        rating: mentor.rating?.toString() || "5.0",
        image_url: mentor.image_url || "",
        title: mentor.title || "",
        bio: mentor.bio || "",
        available_slots: Array.isArray(mentor.available_slots) ? mentor.available_slots.join(", ") : (mentor.available_slots || "")
      });
    } else {
      setSelectedMentor(null);
      setFormData({
        name: "",
        expertise: "",
        avatar_initials: "",
        color_code: "#64748b",
        status: "Aktif",
        sessions_count: "0",
        revenue: "0",
        rating: "5.0",
        image_url: "",
        title: "",
        bio: "",
        available_slots: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      expertise: formData.expertise,
      avatar_initials: formData.avatar_initials || formData.name.charAt(0),
      color_code: formData.color_code,
      status: formData.status,
      sessions_count: parseInt(formData.sessions_count) || 0,
      revenue: parseInt(formData.revenue.toString().replace(/\./g, "")) || 0,
      rating: parseFloat(formData.rating) || 5.0,
      image_url: formData.image_url,
      title: formData.title,
      bio: formData.bio,
      available_slots: formData.available_slots.split(",").map(s => s.trim()).filter(s => s !== "")
    };

    if (modalMode === "add") {
      const { error } = await supabase.from("mentors").insert([payload]);
      if (error) {
        alert("Error saving mentor: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchMentors();
      }
    } else {
      const { error } = await supabase.from("mentors").update(payload).eq("id", selectedMentor.id);
      if (error) {
        alert("Error updating mentor: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchMentors();
      }
    }
  };

  const handleDeleteClick = (mentor: any) => {
    setItemToDelete(mentor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from("mentors").delete().eq("id", itemToDelete.id);
    if (error) {
      alert("Error deleting mentor: " + error.message);
    } else {
      setMentors((prev) => prev.filter((m) => m.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleConfirmBooking = async (realId: string) => {
    const { error } = await supabase
      .from("mentor_bookings")
      .update({ status: "Dikonfirmasi" })
      .eq("id", realId);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      fetchBookings();
    }
  };

  const handleRejectBooking = async (realId: string) => {
    const { error } = await supabase
      .from("mentor_bookings")
      .delete()
      .eq("id", realId);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      fetchBookings();
    }
  };

  return (
    <div className="p-1">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit border border-slate-200 relative shadow-inner">
         <button onClick={() => setView("mentors")} 
           className={`relative z-10 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${view === "mentors" ? "text-white" : "text-slate-500 hover:text-slate-700"}`}>
           {view === "mentors" && (
              <motion.div layoutId="activeTabMentor" className="absolute inset-0 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
           )}
           <span className="relative z-10 flex items-center gap-2">
              <User size={14} /> Manajemen Mentor
           </span>
         </button>
         <button onClick={() => setView("bookings")}
           className={`relative z-10 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${view === "bookings" ? "text-white" : "text-slate-500 hover:text-slate-700"}`}>
           {view === "bookings" && (
              <motion.div layoutId="activeTabMentor" className="absolute inset-0 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
           )}
           <span className="relative z-10 flex items-center gap-2">
              <Calendar size={14} /> Konfirmasi Booking
           </span>
         </button>
      </div>

      {view === "mentors" ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Daftar Mentor</h2>
              <p className="text-sm text-slate-500">Kelola profil, keahlian, dan ketersediaan jadwal mentor.</p>
            </div>
            <button onClick={() => openModal("add")} className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
              <Plus size={16} /> Tambah Mentor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
               Array(4).fill(0).map((_, i) => (
                 <div key={i} className="bg-white rounded-[32px] p-6 animate-pulse h-64 border border-slate-100"></div>
               ))
            ) : mentors.map((m, i) => (
              <AnimatedSection key={m.id} delay={i * 0.07}>
                <div className="group bg-white rounded-[32px] p-6 border border-slate-100 hover:border-blue-500/20 hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] transition-all duration-500 relative flex flex-col items-center text-center">
                  <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal("edit", m)} className="p-2 bg-white shadow-md border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleDeleteClick(m)} className="p-2 bg-white shadow-md border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className="w-20 h-20 rounded-[24px] flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-xl border-4 border-white overflow-hidden"
                    style={{ background: m.image_url ? "transparent" : m.color_code || "#3B82F6" }}>
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      m.avatar_initials || m.name.charAt(0)
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 mb-1 leading-tight">{m.name}</h3>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">{m.title || "Senior Mentor"}</p>
                  
                  <div className="w-full grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Sesi</p>
                      <p className="text-sm font-bold text-slate-800">{m.sessions_count || 0}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Rating</p>
                      <p className="text-sm font-bold text-slate-800">{m.rating || 5.0}</p>
                    </div>
                  </div>

                  <div className={`w-full py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest ${m.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                    {m.status}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </>
      ) : (
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
              <h3 className="font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Daftar Permintaan Booking</h3>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100 uppercase tracking-widest">
                {bookings.filter(b => b.status === "Pending").length} Menunggu
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50">
                    {["ID", "Pengguna", "Mentor", "Jadwal", "Topik", "Status", "Aksi"].map((h) => (
                      <th key={h} className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b) => (
                    <tr key={b.realId} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5 font-mono text-[11px] text-slate-400">{b.id}</td>
                      <td className="px-8 py-5 font-bold text-slate-900">{b.user}</td>
                      <td className="px-8 py-5 text-slate-600">{b.mentor}</td>
                      <td className="px-8 py-5 font-medium text-slate-500">{b.slot}</td>
                      <td className="px-8 py-5 max-w-xs truncate text-slate-400">{b.topic}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${b.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {b.status === "Pending" && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleConfirmBooking(b.realId)} className="px-3 py-1.5 bg-green-50 text-green-600 font-bold rounded-lg hover:bg-green-100 transition-all text-[10px] uppercase tracking-wider">
                              Setujui
                            </button>
                            <button onClick={() => handleRejectBooking(b.realId)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-all text-[10px] uppercase tracking-wider">
                              Tolak
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Mentor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
              style={{ maxHeight: "90vh" }}
            >
              <div className="p-8 border-b flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {modalMode === "add" ? "Tambah Mentor Baru" : "Edit Profil Mentor"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Lengkapi informasi profil dan keahlian mentor secara mendetail.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 pb-2 border-b-2 border-blue-50">Informasi Dasar</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="col-span-2">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Nama Lengkap</label>
                            <input 
                              type="text" required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm transition-all font-bold text-slate-800"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Inisial</label>
                            <input 
                              type="text" maxLength={2}
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm font-extrabold uppercase text-center"
                              value={formData.avatar_initials}
                              onChange={(e) => setFormData({...formData, avatar_initials: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Gelar / Jabatan</label>
                          <input 
                            type="text" required
                            placeholder="Contoh: Pakar Analisis Struktur"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm font-semibold"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Biografi</label>
                          <textarea 
                            rows={5} required
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm transition-all resize-none leading-relaxed"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 pb-2 border-b-2 border-blue-50">Atribut & Aset</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Status Aktif</label>
                            <select 
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm font-bold appearance-none cursor-pointer"
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="Aktif">Aktif</option>
                              <option value="Cuti">Cuti</option>
                              <option value="Nonaktif">Nonaktif</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Foto Profil Profesional</label>
                          <div className="flex gap-6 items-center p-5 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                            <div className="w-24 h-24 rounded-[28px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl">
                              {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                              ) : uploading ? (
                                <Loader2 className="animate-spin text-blue-600" size={32} />
                              ) : (
                                <ImageIcon className="text-slate-200" size={40} />
                              )}
                            </div>
                            <div className="flex-1">
                              <input type="file" accept="image/*" className="hidden" id="mentor-image" onChange={handleImageUpload} disabled={uploading} />
                              <label htmlFor="mentor-image" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                {uploading ? "Mengunggah..." : "Unggah Foto"}
                              </label>
                              <p className="text-[10px] text-slate-400 mt-3 ml-1 leading-tight font-medium">PNG/JPG. Rasio 1:1 direkomendasikan.</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                           <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Jadwal Ketersediaan (CSV)</label>
                            <input 
                              type="text" 
                              placeholder="Contoh: Senin 19:00, Rabu 20:00"
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white text-sm font-medium"
                              value={formData.available_slots}
                              onChange={(e) => setFormData({...formData, available_slots: e.target.value})}
                            />
                            <p className="text-[10px] text-slate-400 mt-2 ml-1">Gunakan koma sebagai pemisah.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Biaya / Sesi (Rp)</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white text-sm font-bold"
                              value={formData.revenue}
                              onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2 ml-1 tracking-widest">Keahlian (CSV)</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white text-sm font-medium"
                              value={formData.expertise}
                              onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div className="p-8 border-t bg-slate-50/50 flex gap-4 justify-end flex-shrink-0 sticky bottom-0 z-10 backdrop-blur-md">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-slate-50 transition-all translate-y-0"
                >
                  Tutup
                </button>
                <button 
                  type="button"
                  onClick={handleSave}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-300 flex items-center gap-3"
                >
                  <Save size={18} /> Simpan Profil Mentor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden p-10 text-center"
            >
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <XCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Yakin Menghapus?</h3>
              <p className="text-sm text-slate-500 mb-10 leading-relaxed">Profil mentor <strong className="text-slate-900">"{itemToDelete?.name}"</strong> akan dihapus secara permanen dari sistem.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Batal
                </button>
                <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200">
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
