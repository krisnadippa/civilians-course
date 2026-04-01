"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Trash2, Edit2, X, Save, UserCheck, Star, Loader2 } from "lucide-react";

export default function AdminMentorPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    initials: "",
    title: "",
    role: "",
    bio: "",
    experience: "",
    rating: "5.0",
    sessions_count: "0",
    color_theme: "emerald",
    expertise_tags: "",
    courses_handled: "",
    specializations: "",
    achievements: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("mentors").select("*").order("name");
      if (error) throw error;
      setData(data || []);
    } catch (e: any) {
      alert("Gagal memuat data: " + e.message);
    }
    setLoading(false);
  }

  const openModal = (mode: "add" | "edit", mentor?: any) => {
    setModalMode(mode);
    if (mode === "edit" && mentor) {
      setSelectedMentor(mentor);
      setFormData({
        name: mentor.name,
        initials: mentor.initials || "",
        title: mentor.title || "",
        role: mentor.role || "",
        bio: mentor.bio || "",
        experience: mentor.experience || "",
        rating: mentor.rating?.toString() || "5.0",
        sessions_count: mentor.sessions_count?.toString() || "0",
        color_theme: mentor.color_theme || "emerald",
        expertise_tags: mentor.expertise_tags || "",
        courses_handled: mentor.courses_handled || "",
        specializations: mentor.specializations || "",
        achievements: mentor.achievements || ""
      });
    } else {
      setSelectedMentor(null);
      setFormData({
        name: "",
        initials: "",
        title: "",
        role: "",
        bio: "",
        experience: "",
        rating: "5.0",
        sessions_count: "0",
        color_theme: "emerald",
        expertise_tags: "",
        courses_handled: "",
        specializations: "",
        achievements: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      initials: formData.initials || formData.name.substring(0, 2).toUpperCase(),
      title: formData.title,
      role: formData.role,
      bio: formData.bio,
      experience: formData.experience,
      rating: parseFloat(formData.rating) || 0,
      sessions_count: parseInt(formData.sessions_count) || 0,
      color_theme: formData.color_theme,
      expertise_tags: formData.expertise_tags,
      courses_handled: formData.courses_handled,
      specializations: formData.specializations,
      achievements: formData.achievements
    };

    if (modalMode === "add") {
      const { error } = await supabase.from("mentors").insert([payload]);
      if (error) alert("Error: " + error.message);
      else { setIsModalOpen(false); fetchData(); }
    } else {
      const { error } = await supabase.from("mentors").update(payload).eq("id", selectedMentor.id);
      if (error) alert("Error: " + error.message);
      else { setIsModalOpen(false); fetchData(); }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus akun mentor ini permanen?")) return;
    const { error } = await supabase.from("mentors").delete().eq("id", id);
    if (error) alert("Gagal menghapus: " + error.message);
    else fetchData();
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.role?.toLowerCase().includes(search.toLowerCase())
  );

  const seedMentors = async () => {
    try {
      const defaultMentors = [
        { 
          name: "Ratna Essya", initials: "RE", title: "Ahli Desain Jalan & Infrastruktur", role: "Civil 3D Specialist", 
          bio: "Praktisi aktif di bidang desain infrastruktur dan perencanaan jalan.", experience: "7+ Tahun", rating: 4.9, sessions_count: 87, color_theme: "emerald",
          expertise_tags: "Autodesk Civil 3D, Corridor Design, Volume Earthwork, Drainase, Road Alignment",
          courses_handled: "Civil 3D",
          specializations: "Perencanaan Geometric Jalan, Perhitungan Galian & Timbunan, Desain Koridor Civil 3D",
          achievements: "Proyek Jalan Nasional Bali–Lombok, Konsultan 20+ Proyek Civil 3D, Certified Autodesk Professional"
        },
        { 
          name: "Arimantara", initials: "AR", title: "Spesialis Infrastruktur & Struktur", role: "Civil 3D & Structural Analyst", 
          bio: "Konsultan senior dengan keahlian ganda di bidang infrastruktur sipil dan analisis struktur.", experience: "9+ Tahun", rating: 5.0, sessions_count: 92, color_theme: "blue",
          expertise_tags: "Civil 3D, SAP2000, Structural Analysis, Beban Gempa, SNI 2847",
          courses_handled: "Civil 3D, SAP2000",
          specializations: "Desain Infrastruktur Civil 3D, Analisis Struktur Beton & Baja, Pelatihan SAP Dasar (ASSTT)",
          achievements: "200+ Peserta Dibimbing, Proyek Tol Trans-Jawa, M.T. Teknik Sipil UI"
        },
        { 
          name: "Eka Juniarta", initials: "EJ", title: "Pakar Analisis Struktur & BIM", role: "SAP2000 & BIM Expert", 
          bio: "Expert di analisis struktur tingkat lanjut dan Building Information Modeling.", experience: "8+ Tahun", rating: 4.9, sessions_count: 78, color_theme: "indigo",
          expertise_tags: "SAP2000, Revit, Tekla, SRPMK, SNI 1729",
          courses_handled: "SAP2000, BIM",
          specializations: "SNI 2847 Beton Bertulang, SNI 1729 Konstruksi Baja, Analisis SRPMK & Respons Spektrum, Revit & BIM Workflow",
          achievements: "Certified BIM Manager, Proyek Gedung 25 Lantai, Pembicara Seminar Nasional BIM"
        },
        { 
          name: "Bagaskara", initials: "BG", title: "Spesialis BIM & Manajemen Proyek", role: "BIM & Project Management", 
          bio: "Praktisi BIM dengan fokus pada integrasi workflow 3D dan penjadwalan.", experience: "6+ Tahun", rating: 5.0, sessions_count: 65, color_theme: "violet",
          expertise_tags: "Tekla Structures, Ms. Project, Revit MEP, RAB Otomatis, 4D BIM",
          courses_handled: "BIM",
          specializations: "Tekla Structural Designer, Ms. Project Scheduling, Perhitungan RAB dari Model BIM",
          achievements: "BIM Implementation Lead, Proyek BIM Award 2023, S2 Manajemen Konstruksi"
        }
      ];
      const { error } = await supabase.from("mentors").insert(defaultMentors);
      if (error) throw error;
      
      alert("Mentor berhasil dimuat!");
      fetchData();
    } catch (e: any) {
      alert("Gagal memuat mentor: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Manajemen Mentor</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Atur profil, keahlian, dan informasi pengajar aktif.</p>
        </div>
        <div className="flex items-center gap-2">
          {data.length === 0 && (
            <button onClick={seedMentors} className="bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-200 transition-colors">
              Load 4 Mentor Default
            </button>
          )}
          <button onClick={() => openModal("add")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md">
            <Plus size={18} /> Tambah Mentor Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><UserCheck size={24} /></div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Mentor</p>
            <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{data.length}</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative">
            <input type="text" placeholder="Cari nama / peran..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold w-full md:w-72 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none" />
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mb-3 text-blue-600" size={32} />
            <p className="font-bold text-sm">Memuat mentor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Profil Mentor</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Role / Title</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tema (Color)</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Rating</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-sm font-bold text-slate-500">Data mentor kosong. Klik "Load 4 Mentor Default" di atas.</td></tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-sm" style={{ backgroundColor: item.color_theme === "emerald" ? "#10b981" : item.color_theme === "blue" ? "#3b82f6" : item.color_theme === "violet" ? "#8b5cf6" : "#4f46e5" }}>
                            {item.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">{item.experience}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{item.role}</p>
                        <p className="text-xs font-medium text-slate-500">{item.title}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">
                        {item.color_theme || "emerald"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                          <Star size={14} className="text-amber-400 fill-amber-400" /> {item.rating}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openModal("edit", item)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 text-slate-900">
              <h2 className="font-black text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {modalMode === "add" ? "Tambah Akun Mentor" : "Edit Profil Mentor"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto hidden-scrollbar flex-1">
              <form id="mentorForm" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Nama Lengkap</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Inisial (2 Huruf)</label>
                    <input type="text" maxLength={2} value={formData.initials} onChange={e => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Pekerjaan/Role Spesifik</label>
                    <input type="text" required placeholder="Civil 3D Specialist" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Gelar Judul</label>
                    <input type="text" required placeholder="Ahli Desain Jalan" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Pengalaman Lulus</label>
                    <input type="text" required placeholder="7+ Tahun" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tema Warna</label>
                    <select required value={formData.color_theme} onChange={e => setFormData({ ...formData, color_theme: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 bg-white text-slate-900">
                      <option value="emerald">Emerald (Hijau)</option>
                      <option value="blue">Blue (Biru - SAP2000)</option>
                      <option value="indigo">Indigo</option>
                      <option value="violet">Violet (Ungu - BIM)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Keahlian (Pisahkan dengan koma)</label>
                    <input type="text" placeholder="Civil 3D, SAP2000, Analisis Struktur" value={formData.expertise_tags} onChange={e => setFormData({ ...formData, expertise_tags: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Paket yang Diajar (Pisahkan dengan koma)</label>
                    <input type="text" placeholder="Civil 3D, SAP2000" value={formData.courses_handled} onChange={e => setFormData({ ...formData, courses_handled: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Spesialisasi Pengajaran (Pisahkan dengan koma)</label>
                    <textarea rows={2} placeholder="Desain Jalan, Perhitungan Volume..." value={formData.specializations} onChange={e => setFormData({ ...formData, specializations: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 resize-none text-slate-900"></textarea>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Pencapaian/Achievements (Pisahkan dengan koma)</label>
                    <textarea rows={2} placeholder="Proyek Tol Trans-Jawa, Sertifikasi Autodesk..." value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 resize-none text-slate-900"></textarea>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Biografi & Karir Singkat</label>
                    <textarea rows={3} required value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 resize-none text-slate-900"></textarea>
                  </div>

                  <div className="space-y-1.5 sm:col-span-1 col-span-2">
                     <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Rating Profil</label>
                     <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })}
                       className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1 col-span-2">
                     <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Jumlah Sesi Diselesaikan</label>
                     <input type="number" value={formData.sessions_count} onChange={e => setFormData({ ...formData, sessions_count: e.target.value })}
                       className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 text-slate-900" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">Batal</button>
              <button type="submit" form="mentorForm" className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2">
                <Save size={16} /> Simpan Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
