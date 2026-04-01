"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Plus, Search, Trash2, Edit2, X, Save, Loader2, ToggleLeft, ToggleRight, XCircle } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";

const initialServices = [
  {
    title: "Pembuatan RAB",
    description: "RAB akurat sesuai HSPK & SNI, dilengkapi analisa harga satuan pekerjaan dan rekapitulasi lengkap.",
    duration: "3–7 Hari Kerja", price: "Mulai Rp 350.000",
    icon_name: "Calculator", status: "Tersedia"
  },
  {
    title: "Desain Struktur",
    description: "Perencanaan struktur gedung dan infrastruktur menggunakan SAP2000, ETABS, sesuai SNI terbaru.",
    duration: "5–14 Hari Kerja", price: "Mulai Rp 850.000",
    icon_name: "Building2", status: "Tersedia"
  },
  {
    title: "Gambar Kerja CAD",
    description: "Set gambar kerja lengkap sesuai standar nasional: Denah, Tampak, Potongan, Detail, dan As-Built Drawing.",
    duration: "4–10 Hari Kerja", price: "Mulai Rp 500.000",
    icon_name: "Ruler", status: "Tersedia"
  },
  {
    title: "Civil 3D Modeling",
    description: "Pemodelan jalan, saluran, dan terrain menggunakan Autodesk Civil 3D untuk proyek infrastruktur.",
    duration: "5–12 Hari Kerja", price: "Mulai Rp 750.000",
    icon_name: "Cpu", status: "Tersedia"
  },
  {
    title: "Manajemen Konstruksi",
    description: "Penjadwalan, monitoring progres, pelaporan proyek, dan analisis kurva-S untuk proyek konstruksi.",
    duration: "2–5 Hari Kerja", price: "Mulai Rp 450.000",
    icon_name: "HardHat", status: "Tersedia"
  },
  {
    title: "Analisis Struktur",
    description: "Analisis beban, defleksi, gaya dalam, dan desain elemen struktur menggunakan software certified.",
    duration: "4–10 Hari Kerja", price: "Mulai Rp 600.000",
    icon_name: "Layers", status: "Tersedia"
  }
];

export default function AdminKatalogJasaPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedJasa, setSelectedJasa] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "4-10 Hari",
    icon_name: "Wrench",
    status: "Tersedia"
  });

  useEffect(() => {
    fetchJasa();
  }, []);

  async function seedDataIfNeeded(existingData: any[]) {
    // Attempt seeding only if table exists but is empty
    if (existingData.length === 0) {
      try {
        const { error } = await supabase.from("jasa_katalog").insert(initialServices);
        if (!error) {
          const { data: newData } = await supabase.from("jasa_katalog").select("*").order("created_at", { ascending: true });
          if (newData) setData(newData);
        }
      } catch (e) {
         console.log("Seeding failed or table missing", e);
      }
    }
  }

  async function fetchJasa() {
    setLoading(true);
    try {
      const { data: jasaData, error } = await supabase
        .from("jasa_katalog")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching jasa_katalog:", error.message);
      } else {
        setData(jasaData || []);
        if (jasaData && jasaData.length === 0) {
          await seedDataIfNeeded(jasaData);
        }
      }
    } catch (e) {
      console.error("Fatal fetch error (Katalog Jasa):", e);
    }
    setLoading(false);
  }

  const openModal = (mode: "add" | "edit", jasa?: any) => {
    setModalMode(mode);
    if (mode === "edit" && jasa) {
      setSelectedJasa(jasa);
      setFormData({
        title: jasa.title,
        description: jasa.description || "",
        price: jasa.price || "",
        duration: jasa.duration || "4-10 Hari",
        icon_name: jasa.icon_name || "Wrench",
        status: jasa.status || "Tersedia"
      });
    } else {
      setSelectedJasa(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        duration: "4-10 Hari",
        icon_name: "Wrench",
        status: "Tersedia"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };

    if (modalMode === "add") {
      const { error } = await supabase.from("jasa_katalog").insert([payload]);
      if (error) {
        alert("Error saving jasa: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchJasa();
      }
    } else {
      const { error } = await supabase.from("jasa_katalog").update(payload).eq("id", selectedJasa.id);
      if (error) {
        alert("Error updating jasa: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchJasa();
      }
    }
  };

  const handleDeleteClick = (jasa: any) => {
    setItemToDelete(jasa);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from("jasa_katalog").delete().eq("id", itemToDelete.id);
    if (error) {
      alert("Error deleting jasa: " + error.message);
    } else {
      setData((prev) => prev.filter((k) => k.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Tersedia" ? "Penuh" : "Tersedia";
    const { error } = await supabase
      .from("jasa_katalog")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setData((prev) => prev.map((k) => k.id === id ? { ...k, status: newStatus } : k));
    }
  };

  const filtered = data.filter((k) => k.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Katalog Jasa</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>Kelola daftar layanan dan jasa teknik yang dapat dipesan pengguna.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Layanan", val: data.length, color: "var(--primary)" },
          { label: "Tersedia", val: data.filter(d => d.status === "Tersedia").length, color: "#00897B" },
          { label: "Sedang Penuh", val: data.filter(d => d.status !== "Tersedia").length, color: "#475569" },
          { label: "Permintaan Baru", val: "+0", color: "#3B82F6" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-5 bg-white shadow-sm border-none">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-light)" }}>{label}</p>
            <p className="font-bold text-2xl" style={{ color: color, fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
          </div>
        ))}
      </div>

      <AnimatedSection>
        <div className="card overflow-hidden border-none shadow-sm">
          <div className="p-4 border-b flex items-center justify-between bg-white overflow-x-auto gap-4">
            <input type="text" placeholder="Cari layanan jasa..." className="text-sm outline-none w-64 p-2 bg-slate-50 rounded-lg flex-shrink-0"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => openModal("add")} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all whitespace-nowrap">
              <Plus size={14} /> Tambah Layanan
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                  {["Layanan Jasa", "Durasi", "Harga", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-5 py-4 h-16 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : filtered.map((k) => {
                  const Icon = (LucideIcons as any)[k.icon_name] || Wrench;
                  return (
                  <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-sm mb-0.5">{k.title}</p>
                          <p className="text-[10px] text-slate-400 capitalize max-w-xs truncate">{k.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">{k.duration}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{k.price}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${k.status === "Tersedia" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openModal("edit", k)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-[10px] uppercase">
                          <Edit2 size={12} /> Edit
                        </button>
                         <button onClick={() => handleDeleteClick(k)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-[10px] uppercase">
                          <Trash2 size={12} />
                        </button>
                        <button onClick={() => toggleStatus(k.id, k.status)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold transition-all text-[10px] uppercase">
                          {k.status === "Tersedia" ? <ToggleRight size={14} /> : <ToggleLeft size={14} />} Status
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: "90vh" }}
            >
              <div className="p-6 border-b flex items-center justify-between flex-shrink-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {modalMode === "add" ? "Tambah Layanan Baru" : "Edit Layanan"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Lengkapi informasi jasa dan detail harga layanan.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Judul Layanan</label>
                    <input 
                      type="text" required
                      placeholder="Contoh: Pembuatan RAB Rumah"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm transition-all focus:bg-white focus:shadow-sm font-bold"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Estimasi Pengerjaan</label>
                      <input 
                        type="text" required
                        placeholder="4-10 Hari Kerja"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm focus:bg-white"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Teks Harga (Rp)</label>
                      <input 
                        type="text" required
                        placeholder="Mulai Rp 600.000"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm font-bold focus:bg-white"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Nama Ikon (Lucide)</label>
                      <input 
                        type="text" required
                        placeholder="Wrench, Calculator, dll"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm focus:bg-white"
                        value={formData.icon_name}
                        onChange={(e) => setFormData({...formData, icon_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Status Ketersediaan</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm appearance-none focus:bg-white"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Penuh">Sedang Penuh</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Deskripsi Lengkap Layanan</label>
                    <textarea 
                      rows={4} required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm transition-all resize-none focus:bg-white"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </form>

              <div className="p-6 border-t bg-slate-50 flex gap-4 justify-end flex-shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all uppercase tracking-wider"
                >
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <Save size={16} /> Simpan Layanan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Apakah Anda yakin?</h3>
              <p className="text-sm text-slate-500 mb-8">Layanan <strong className="text-slate-900">"{itemToDelete?.title}"</strong> akan dihapus secara permanen dari database.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all uppercase tracking-wider">
                  Batal
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all uppercase tracking-wider shadow-lg shadow-red-200">
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
