"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";

const mentors = [
  { id: 1, avatar: "BS", color: "#00897B", name: "Dr. Ir. Budi Santoso", expertise: "Analisis Struktur", sessions: 312, rating: 4.9, pending: 5, revenue: "54.600.000", status: "Aktif" },
  { id: 2, avatar: "SR", color: "#546E7A", name: "Ir. Siti Rahayu, M.T.", expertise: "Manajemen & RAB", sessions: 245, rating: 4.8, pending: 3, revenue: "36.750.000", status: "Aktif" },
  { id: 3, avatar: "AP", color: "#800020", name: "Andi Prasetyo, S.T., M.T.", expertise: "BIM & Gambar Teknik", sessions: 198, rating: 4.9, pending: 2, revenue: "31.680.000", status: "Aktif" },
  { id: 4, avatar: "DK", color: "#37474F", name: "Dr. Dewi Kusuma", expertise: "Geoteknik & Civil 3D", sessions: 167, rating: 4.7, pending: 8, revenue: "27.555.000", status: "Cuti" },
];

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
  const [bookings, setBookings] = useState(pendingBookings);

  const confirm = (id: string) => setBookings((b) => b.map((bk) => bk.id === id ? { ...bk, status: "Dikonfirmasi" } : bk));
  const reject = (id: string) => setBookings((b) => b.filter((bk) => bk.id !== id));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Mentor</h1>
        <p className="text-sm" style={{ color: "var(--text-light)" }}>4 mentor aktif · {pendingBookings.filter(b => b.status === "Pending").length} booking menunggu konfirmasi</p>
      </div>

      {/* Mentor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mentors.map((m, i) => (
          <AnimatedSection key={m.id} delay={i * 0.07}>
            <div className="card p-5" style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: m.color, fontFamily: "'Space Grotesk', sans-serif" }}>{m.avatar}</div>
                <div>
                  <p className="font-bold text-xs" style={{ color: "#1C2433", fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-light)" }}>{m.expertise}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  { val: m.sessions, label: "Sesi" },
                  { val: m.rating, label: "Rating" },
                  { val: m.pending, label: "Pending" },
                ].map(({ val, label }) => (
                  <div key={label} className="p-2 rounded-lg" style={{ background: "rgba(84,110,122,0.06)" }}>
                    <p className="font-bold text-sm" style={{ color: "#1C2433", fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
                    <p className="text-xs" style={{ color: "var(--text-light)" }}>{label}</p>
                  </div>
                ))}
                <div className="p-2 rounded-lg" style={{ background: "rgba(0,137,123,0.08)" }}>
                  <span className="text-xs font-semibold" style={{ color: m.status === "Aktif" ? "var(--green-dark)" : "#FFA000" }}>{m.status}</span>
                </div>
              </div>
              <p className="text-xs mt-3 text-center" style={{ color: "var(--text-light)" }}>Revenue: Rp {parseInt(m.revenue.replace(/\./g, "")).toLocaleString("id")}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Booking management table */}
      <AnimatedSection delay={0.15}>
        <div className="card p-6">
          <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>
            <Calendar size={15} className="inline mr-2" style={{ color: "var(--green)" }} />
            Permintaan Booking
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Pengguna", "Mentor", "Jadwal", "Topik", "Status", "Aksi"].map((h) => (
                    <th key={h} className="pb-3 text-left font-bold" style={{ color: "var(--text-light)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid rgba(84,110,122,0.06)" }}>
                    <td className="py-3 font-mono" style={{ color: "var(--slate)" }}>{b.id}</td>
                    <td className="py-3 font-medium" style={{ color: "#1C2433" }}>{b.user}</td>
                    <td className="py-3" style={{ color: "var(--text-secondary)" }}>{b.mentor}</td>
                    <td className="py-3" style={{ color: "var(--text-secondary)" }}>{b.slot}</td>
                    <td className="py-3 max-w-xs truncate" style={{ color: "var(--text-light)" }}>{b.topic}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: `${statusColors[b.status]}20`, color: statusColors[b.status] }}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {b.status === "Pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => confirm(b.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-100 text-green-700 font-bold hover:bg-green-200 transition-all text-[10px] uppercase">
                            <CheckCircle2 size={12} /> Setujui
                          </button>
                          <button onClick={() => reject(b.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-[10px] uppercase">
                            <XCircle size={12} /> Tolak
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
    </div>
  );
}
