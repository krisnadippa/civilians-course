"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageSquare, Eye, Wrench, Clock, AlertCircle, Trash2, Edit2, X, Save } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

const statusColors: Record<string, string> = {
  "Selesai": "#00897B",
  "Diproses": "#546E7A",
  "Menunggu": "#FFA000",
};

const priorityColors: Record<string, string> = {
  "Tinggi": "#DC2626",
  "Normal": "#1A56DB",
  "Rendah": "#64748B",
};

export default function AdminJasaPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJasa, setSelectedJasa] = useState<any>(null);
  const [formData, setFormData] = useState({
    status: "",
    priority: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: jasaData, error } = await supabase
        .from("jasa")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jasa:", error.message, error.details);
        if (error.message?.includes("fetch")) {
          alert("Gagal menghubungi database! Cek koneksi atau restart server.");
        }
      } else {
        setData(jasaData || []);
      }
    } catch (e) {
      console.error("Fatal fetch error (Jasa):", e);
    }
    setLoading(false);
  }

  const openModal = (jasa: any) => {
    setSelectedJasa(jasa);
    setFormData({
      status: jasa.status,
      priority: jasa.priority || "Normal"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("jasa")
      .update({ 
        status: formData.status, 
        priority: formData.priority 
      })
      .eq("id", selectedJasa.id);

    if (error) {
      alert("Error updating jasa: " + error.message);
    } else {
      setIsModalOpen(false);
      fetchData();
    }
  };

  const deleteJasa = async (id: string) => {
    if (!confirm("Hapus permintaan jasa ini secara permanen?")) return;
    const { error } = await supabase.from("jasa").delete().eq("id", id);
    if (error) {
      alert("Error deleting jasa: " + error.message);
    } else {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("jasa")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      setData((prev) => prev.map((item) => item.id === id ? { ...item, status: newStatus } : item));
    }
  };

  const filtered = data.filter((item) => statusFilter === "Semua" || item.status === statusFilter);

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
            Layanan Jasa & Konsultasi
          </h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>
            Kelola permintaan jasa desain, RAB, dan analisis struktur dari klien.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="card px-4 py-2 flex items-center gap-2 bg-white">
            <Clock size={16} className="text-blue-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Menunggu</p>
              <p className="text-sm font-bold text-slate-700">{data.filter(i => i.status === "Menunggu").length}</p>
            </div>
          </div>
          <div className="card px-4 py-2 flex items-center gap-2 bg-white">
            <AlertCircle size={16} className="text-red-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Prioritas</p>
              <p className="text-sm font-bold text-slate-700">{data.filter(i => i.priority === "Tinggi").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["Semua", "Menunggu", "Diproses", "Selesai"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-sm"
            style={{ 
              background: statusFilter === s ? "var(--primary)" : "white", 
              color: statusFilter === s ? "white" : "var(--text-secondary)",
              border: statusFilter === s ? "none" : "1px solid var(--border)"
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatedSection>
        <div className="card overflow-hidden border-none shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50/50" style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Klien", "Layanan", "Kategori", "Prioritas", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-5 py-4 h-16 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{item.user_name}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{item.user_whatsapp || "No WhatsApp"}</p>
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--primary)" }}>#{item.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">{item.service_name}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase" style={{ background: "var(--blue-50)", color: "var(--primary)" }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: priorityColors[item.priority] || '#64748b' }} />
                        <span className="font-semibold" style={{ color: priorityColors[item.priority] || '#64748b' }}>{item.priority || 'Normal'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                        style={{ background: `${statusColors[item.status]}15`, color: statusColors[item.status] }}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openModal(item)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => deleteJasa(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                          <Trash2 size={12} />
                        </button>
                        {item.status === "Menunggu" && (
                          <button 
                            onClick={() => updateStatus(item.id, "Diproses")}
                            className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-bold text-[10px] uppercase"
                          >
                            Terima
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Wrench size={40} className="mb-2 opacity-20" />
              <p>Tidak ada permintaan jasa ditemukan.</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Edit Jasa Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Atur Status & Prioritas</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status Permintaan</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Prioritas</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm appearance-none"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Normal">Normal</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all uppercase"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-3 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all uppercase flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Update Jasa
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
