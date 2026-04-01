"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, Plus, Search, Trash2, Edit2, X, Save, Layers, Loader2 } from "lucide-react";

export default function AdminKatalogKursusPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedKursus, setSelectedKursus] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category_id: "civil3d",
    level: "Dasar",
    instructor_names: "",
    price: "",
    status: "Aktif",
    description: "",
    duration: "2x Pertemuan"
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [coursesRes, catRes] = await Promise.all([
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("course_categories").select("*")
      ]);

      if (coursesRes.data) setData(coursesRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (e) {
      console.error("Fetch error:", e);
    }
    setLoading(false);
  }

  const openModal = (mode: "add" | "edit", kursus?: any) => {
    setModalMode(mode);
    if (mode === "edit" && kursus) {
      setSelectedKursus(kursus);
      setFormData({
        title: kursus.title,
        category_id: kursus.category_id,
        level: kursus.level || "Dasar",
        instructor_names: kursus.instructor_names || "",
        price: kursus.price?.toString() || "",
        status: kursus.status || "Aktif",
        description: kursus.description || "",
        duration: kursus.duration || "2x Pertemuan"
      });
    } else {
      setSelectedKursus(null);
      setFormData({
        title: "",
        category_id: categories.length > 0 ? categories[0].id : "civil3d",
        level: "Dasar",
        instructor_names: "",
        price: "",
        status: "Aktif",
        description: "",
        duration: "2x Pertemuan"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      category_id: formData.category_id,
      level: formData.level,
      instructor_names: formData.instructor_names,
      price: parseFloat(formData.price) || 0,
      status: formData.status,
      description: formData.description,
      duration: formData.duration
    };

    if (modalMode === "add") {
      const { error } = await supabase.from("courses").insert([payload]);
      if (error) alert("Error: " + error.message);
      else {
        setIsModalOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("courses").update(payload).eq("id", selectedKursus.id);
      if (error) alert("Error: " + error.message);
      else {
        setIsModalOpen(false);
        fetchData();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kursus ini secara permanen? Data yang ditautkan di pesanan mungkin akan berdampak.")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) alert("Gagal menghapus: " + error.message);
    else fetchData();
  };

  const seedCourses = async () => {
    try {
      // 1. Seed Categories first (Matching app/kursus/page.tsx)
      const defaultCategories = [
        { 
          id: "civil3d", 
          title: "Civil 3D", 
          subtitle: "Desain & Infrastruktur Digital", 
          description: "Kuasai perangkat lunak desain infrastruktur standar industri untuk perencanaan jalan, drainase, dan koridor.", 
          icon: "Cpu", 
          color_theme: "emerald", 
          tags: ["AutoDesk Civil 3D", "Corridor Design", "Earthwork"] 
        },
        { 
          id: "sap2000", 
          title: "SAP2000", 
          subtitle: "Analisis Struktur Profesional", 
          description: "Dari dasar hingga lanjutan — analisis struktur beton & baja sesuai SNI terbaru dan standar internasional.", 
          icon: "Building2", 
          color_theme: "blue", 
          tags: ["SNI 2847", "SNI 1729", "SRPMK", "Beton & Baja"] 
        },
        { 
          id: "bim", 
          title: "Pelatihan BIM", 
          subtitle: "Building Information Modeling", 
          description: "Paket lengkap BIM: Tekla, Revit, Ms. Project, dan perhitungan RAB digital dalam satu alur kerja proyek nyata.", 
          icon: "Layers", 
          color_theme: "violet", 
          tags: ["Tekla", "Revit", "Ms. Project", "RAB"] 
        }
      ];
      
      const { error: catError } = await supabase.from("course_categories").upsert(defaultCategories);
      if (catError) throw catError;

      // 2. Seed Courses (Matching subcourses in app/kursus/page.tsx)
      const defaultCourses = [
        // Civil 3D
        { category_id: "civil3d", title: "Pembuatan Jalan, Galian dan Timbunan", price: 350000, instructor_names: "Ratna Essya & Arimantara", duration: "2x Pertemuan", level: "Menengah", description: "Membuat desain geometri jalan, menghitung volume galian & timbunan menggunakan corridor Civil 3D sesuai standar proyek.", status: "Aktif" },
        
        // SAP2000
        { category_id: "sap2000", title: "Pelatihan SAP Dasar (ASSTT)", price: 450000, instructor_names: "Arimantara & Eka Juniarta", duration: "2x Pertemuan", level: "Dasar", description: "Pengenalan antarmuka SAP2000, pembuatan model sederhana, input beban, dan interpretasi hasil analisis struktur.", status: "Aktif" },
        { category_id: "sap2000", title: "Pemodelan Gedung Beton Sesuai SNI 2847", price: 450000, instructor_names: "Arimantara & Eka Juniarta", duration: "2x Pertemuan", level: "Menengah", description: "Pemodelan gedung beton bertulang sesuai SNI 2847: kombinasi beban, kapasitas elemen, dan laporan teknis.", status: "Aktif" },
        { category_id: "sap2000", title: "Pemodelan Gedung Baja Berdasar SNI 1729", price: 450000, instructor_names: "Arimantara & Eka Juniarta", duration: "2x Pertemuan", level: "Lanjutan", description: "Pemodelan struktur baja profil WF, HSS, dan pipa sesuai SNI 1729, pengecekan tekuk dan sambungan.", status: "Aktif" },
        { category_id: "sap2000", title: "Analisis SRPMK & Periode Struktur pada SAP2000", price: 450000, instructor_names: "Arimantara & Eka Juniarta", duration: "2x Pertemuan", level: "Lanjutan", description: "Analisis gempa dinamis SRPMK, penentuan periode struktur, dan evaluasi respons spektrum pada SAP2000.", status: "Aktif" },
        
        // BIM
        { category_id: "bim", title: "Tekla, Revit, Ms. Project + Perhitungan RAB", price: 500000, instructor_names: "Eka Juniarta & Bagaskara", duration: "2x Pertemuan", level: "Menengah", description: "Pemodelan 3D di Tekla & Revit, penjadwalan di Ms. Project, dan integrasi data BIM untuk RAB otomatis.", status: "Aktif" }
      ];
      
      const { error: corError } = await supabase.from("courses").insert(defaultCourses);
      if (corError) throw corError;

      alert("Data berhasil dimigrasi dari website ke database!");
      fetchData();
    } catch (e: any) {
      alert("Gagal migrasi data: " + e.message);
    }
  };

  const filteredData = data.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.category_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Katalog Modul Kursus</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Kelola data modul pelatihan Civil 3D, SAP2000, BIM, dll.</p>
        </div>
        <div className="flex items-center gap-2">
          {data.length === 0 && (
            <button
              onClick={seedCourses}
              className="bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-200 transition-colors"
            >
              Load Modul Default
            </button>
          )}
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
          >
            <Plus size={18} /> Tambah Modul Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><BookOpen size={24} /></div>
          <div>
             <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Modul</p>
             <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{data.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Layers size={24} /></div>
          <div>
             <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status Aktif</p>
             <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{data.filter(d => d.status === "Aktif").length}</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative">
            <input
              type="text" placeholder="Cari judul..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold w-full md:w-72 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mb-3 text-blue-600" size={32} />
            <p className="font-bold text-sm">Memuat data kursus...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Kategori</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Judul Kursus</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Harga</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Mentor</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm font-bold text-slate-500">
                      Tidak ada data kursus.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase rounded-lg border border-slate-200">
                          {item.category_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm mb-1">{item.title}</p>
                        <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">{item.level} · {item.duration}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-sm text-slate-900">Rp {item.price.toLocaleString("id")}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.instructor_names || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${
                          item.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openModal("edit", item)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
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

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-black text-lg text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {modalMode === "add" ? "Tambah Modul Baru" : "Edit Modul Kursus"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto hidden-scrollbar flex-1">
              <form id="kursusForm" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Judul Kursus</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">ID Kategori (Paket)</label>
                    <select required value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 bg-white">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      <option value="civil3d">Civil 3D</option>
                      <option value="sap2000">SAP2000</option>
                      <option value="bim">BIM</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Level</label>
                    <select required value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 bg-white">
                      <option value="Dasar">Dasar</option>
                      <option value="Menengah">Menengah</option>
                      <option value="Lanjutan">Lanjutan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Harga (Rp)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Durasi</label>
                    <input type="text" placeholder="Contoh: 2x Pertemuan" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Nama Mentor</label>
                    <input type="text" placeholder="Arimantara & Ratna" value={formData.instructor_names} onChange={e => setFormData({ ...formData, instructor_names: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Deskripsi Singkat</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                     <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Status</label>
                     <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                       className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 bg-white">
                       <option value="Aktif">Aktif</option>
                       <option value="Draft">Draft</option>
                     </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">
                Batal
              </button>
              <button type="submit" form="kursusForm" className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2">
                <Save size={16} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
