"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Search, CheckCircle, XCircle, Eye, Loader2, PlayCircle, Clock, X, Award, Circle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROGRESS_OPTIONS = [
  { value: "Belum Mulai", label: "Belum Mulai", color: "bg-slate-100 text-slate-600 border-slate-300", dot: "bg-slate-400" },
  { value: "Sedang Berjalan", label: "Sedang Berjalan", color: "bg-amber-50 text-amber-700 border-amber-300", dot: "bg-amber-500" },
  { value: "Selesai", label: "Selesai", color: "bg-emerald-50 text-emerald-700 border-emerald-300", dot: "bg-emerald-500" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [linkInput, setLinkInput] = useState("");
  const [scheduleInput, setScheduleInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("course_orders")
        .select(`
          *,
          profiles ( name, email, phone, status_pekerjaan ),
          courses ( title, category_id, instructor_names, level, duration )
        `)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setOrders(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setLinkInput(order.meeting_link || "");
    setScheduleInput(order.meeting_schedule || "");
    setIsModalOpen(true);
  };

  const updateStatus = async (status: string) => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      const payload: any = { status };
      if (status === "Aktif") {
        payload.meeting_link = linkInput;
        payload.meeting_schedule = scheduleInput;
      }
      const { error } = await supabase.from("course_orders").update(payload).eq("id", selectedOrder.id);
      if (error) throw error;
      
      setSelectedOrder({ ...selectedOrder, ...payload });
      fetchOrders();
    } catch (e: any) {
      alert("Gagal update status: " + e.message);
    }
    setIsSaving(false);
  };

  const updateProgress = async (progressStatus: string) => {
    if (!selectedOrder) return;
    setProgressSaving(true);
    try {
      const payload: any = { progress_status: progressStatus };
      
      // When marking as complete, set completed_at and update main status too
      if (progressStatus === "Selesai") {
        payload.completed_at = new Date().toISOString();
        payload.status = "Selesai";
      }
      
      const { error } = await supabase
        .from("course_orders")
        .update(payload)
        .eq("id", selectedOrder.id);
      
      if (error) throw error;
      
      setSelectedOrder({ ...selectedOrder, ...payload });
      fetchOrders();
    } catch (e: any) {
      alert("Gagal update progress: " + e.message);
    }
    setProgressSaving(false);
  };

  const filteredOrders = orders.filter(o => {
    const term = search.toLowerCase();
    return (
      o.profiles?.name?.toLowerCase().includes(term) ||
      o.profiles?.email?.toLowerCase().includes(term) ||
      o.courses?.title?.toLowerCase().includes(term) ||
      o.status?.toLowerCase().includes(term)
    );
  });

  const getStatusColor = (status: string) => {
    if (status === "Aktif") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "Menunggu Konfirmasi") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "Dibatalkan") return "bg-red-50 text-red-700 border-red-200";
    if (status === "Selesai") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const getProgressBadge = (progress: string | undefined) => {
    const opt = PROGRESS_OPTIONS.find(p => p.value === progress) || PROGRESS_OPTIONS[0];
    return opt;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Pesanan Kursus</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Verifikasi pembayaran, atur jadwal, dan kelola progress kursus siswa.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total</p>
            <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Clock size={24} /></div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Menunggu</p>
            <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{orders.filter(o => o.status === "Menunggu Konfirmasi").length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><PlayCircle size={24} /></div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Berjalan</p>
            <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{orders.filter(o => o.progress_status === "Sedang Berjalan").length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Award size={24} /></div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Selesai</p>
            <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{orders.filter(o => o.progress_status === "Selesai").length}</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative">
            <input
              type="text" placeholder="Cari nama, email, kursus..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold w-full md:w-80 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mb-3 text-blue-600" size={32} />
            <p className="font-bold text-sm">Memuat pesanan...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tanggal</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Kustomer</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Kursus</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Progress</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm font-bold text-slate-500">Tidak ada pesanan.</td>
                  </tr>
                ) : (
                  filteredOrders.map((item) => {
                    const prog = getProgressBadge(item.progress_status);
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-slate-600 whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm mb-1">{item.profiles?.name || "Member"}</p>
                          <p className="text-[10px] font-extrabold text-slate-400">{item.profiles?.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm mb-1">
                            {item.courses?.title || item.course_title_snap || "Kursus Dihapus"}
                          </p>
                          <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest">Rp {item.price_paid.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border flex items-center gap-1.5 w-fit ${prog.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${prog.dot}`}></span>
                            {prog.value}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button onClick={() => openModal(item)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors">
                              <Eye size={14} /> Kelola
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Kelola Pesanan */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
              
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 text-slate-900">
                <h2 className="font-black text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Detail & Kelola Pesanan</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto hidden-scrollbar flex-1 space-y-5">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Kustomer</p>
                    <p className="text-sm font-bold text-slate-900">{selectedOrder.profiles?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedOrder.profiles?.email}</p>
                    <p className="text-xs text-slate-500">{selectedOrder.profiles?.phone}</p>
                    <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mt-2 bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-100">
                      {selectedOrder.profiles?.status_pekerjaan}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Pesanan</p>
                    <p className="text-sm font-bold text-slate-900">{selectedOrder.courses?.title || selectedOrder.course_title_snap || "Kursus Dihapus"}</p>
                    <p className="text-lg font-black text-slate-900 mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Rp {selectedOrder.price_paid.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── PROGRESS STATUS CONTROL ── */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700">
                  <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-3">🎓 Progress Kursus Siswa</p>
                  <p className="text-xs text-slate-400 font-bold mb-4">
                    Set progress siswa untuk kursus ini. Saat status <span className="text-emerald-400">"Selesai"</span> dipilih, 
                    sertifikat elektronik akan otomatis tersedia untuk diunduh oleh siswa.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {PROGRESS_OPTIONS.map((opt) => {
                      const isActive = (selectedOrder.progress_status || "Belum Mulai") === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => updateProgress(opt.value)}
                          disabled={progressSaving}
                          className={`py-3 px-3 rounded-xl font-bold text-xs transition-all border-2 flex flex-col items-center gap-1.5 ${
                            isActive
                              ? opt.value === "Selesai"
                                ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                                : opt.value === "Sedang Berjalan"
                                  ? "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/25"
                                  : "bg-slate-600 border-slate-500 text-white"
                              : "bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                          }`}
                        >
                          {progressSaving && isActive ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : opt.value === "Selesai" ? (
                            <Award size={16} />
                          ) : opt.value === "Sedang Berjalan" ? (
                            <PlayCircle size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                          {opt.label}
                          {isActive && <span className="text-[8px] opacity-70">● Aktif</span>}
                        </button>
                      );
                    })}
                  </div>
                  {selectedOrder.completed_at && (
                    <p className="text-[10px] text-emerald-400 font-bold mt-3">
                      ✓ Selesai pada: {new Date(selectedOrder.completed_at).toLocaleDateString("id-ID", { 
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })} WIB
                    </p>
                  )}
                </div>

                {/* Bukti Bayar */}
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Bukti Pembayaran</p>
                  {selectedOrder.payment_proof_url ? (
                    <a href={selectedOrder.payment_proof_url} target="_blank" rel="noopener noreferrer">
                      <img src={selectedOrder.payment_proof_url} alt="Proof" className="max-h-48 rounded-xl border border-slate-200 object-contain hover:opacity-90 transition-opacity" />
                    </a>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-500">
                      Tidak ada foto bukti. (Mungkin via konfirmasi WA manual)
                    </div>
                  )}
                </div>

                {/* Pengaturan Jadwal */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 inline-block px-2 py-0.5 rounded mb-1">
                    Atur Kelas & Jadwal
                  </p>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Jadwal Fix Pelaksanaan</label>
                    <input type="text" placeholder="Contoh: Senin & Rabu, 19.00 WIB" value={scheduleInput} onChange={e => setScheduleInput(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Meeting Link (Zoom/GMeet)</label>
                    <input type="url" placeholder="https://zoom.us/..." value={linkInput} onChange={e => setLinkInput(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 grid grid-cols-2 lg:grid-cols-4 gap-2">
                <button onClick={() => updateStatus("Selesai")} disabled={isSaving} className="px-4 py-3 rounded-xl font-bold text-[11px] text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors uppercase tracking-widest border border-blue-300">
                  Mark Selesai
                </button>
                <button onClick={() => updateStatus("Dibatalkan")} disabled={isSaving} className="px-4 py-3 rounded-xl font-bold text-[11px] text-red-700 bg-red-100 hover:bg-red-200 transition-colors uppercase tracking-widest border border-red-300">
                  Batalkan
                </button>
                <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-200 transition-colors bg-white border border-slate-200">
                  Tutup
                </button>
                <button onClick={() => updateStatus("Aktif")} disabled={isSaving} className="px-4 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-1">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} 
                  Aktifkan Sesi
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
