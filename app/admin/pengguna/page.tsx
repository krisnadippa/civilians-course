"use client";

import { useState } from "react";
import { Search, Filter, UserCheck, Ban, Trash2, Eye, Plus } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";

const users = [
  { id: 1, name: "Ahmad Fauzi", email: "ahmad@email.com", phone: "0812xx", joined: "12 Jan 2026", kursus: 3, status: "Aktif", role: "Mahasiswa" },
  { id: 2, name: "Dina Marlena", email: "dina@email.com", phone: "0813xx", joined: "15 Jan 2026", kursus: 2, status: "Aktif", role: "Mahasiswa" },
  { id: 3, name: "Rizki Pratama", email: "rizki@email.com", phone: "0814xx", joined: "20 Jan 2026", kursus: 5, status: "Aktif", role: "Mahasiswa" },
  { id: 4, name: "Sari Dewi", email: "sari@email.com", phone: "0815xx", joined: "25 Jan 2026", kursus: 1, status: "Nonaktif", role: "Mahasiswa" },
  { id: 5, name: "Budi Jr.", email: "budi.jr@email.com", phone: "0816xx", joined: "1 Feb 2026", kursus: 4, status: "Aktif", role: "Mahasiswa" },
  { id: 6, name: "Admin Superuser", email: "admin@civilians.id", phone: "0817xx", joined: "1 Jan 2026", kursus: 0, status: "Aktif", role: "Admin" },
];

export default function PenggunaPage() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Pengguna</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>{users.length} pengguna terdaftar</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
          <Plus size={15} /> Tambah User
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 mb-4 flex items-center gap-3">
        <Search size={16} style={{ color: "var(--text-light)" }} />
        <input type="text" placeholder="Cari pengguna..." className="flex-1 outline-none text-sm"
          style={{ background: "transparent", color: "var(--text-primary)" }}
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <AnimatedSection>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(84,110,122,0.06)", borderBottom: "1px solid var(--border)" }}>
                  {["#", "Nama", "Email", "Bergabung", "Kursus", "Role", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold" style={{ color: "var(--text-light)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(84,110,122,0.06)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,137,123,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-light)" }}>{u.id}</td>
                    <td className="px-4 py-3 font-semibold text-xs" style={{ color: "#1C2433" }}>{u.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-light)" }}>{u.joined}</td>
                    <td className="px-4 py-3 text-center text-xs font-bold" style={{ color: "var(--slate)" }}>{u.kursus}</td>
                    <td className="px-4 py-3">
                      <span className="tag-slate" style={{ fontSize: "0.65rem" }}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: u.status === "Aktif" ? "rgba(0,137,123,0.12)" : "rgba(128,0,32,0.1)", color: u.status === "Aktif" ? "var(--green-dark)" : "var(--burgundy)" }}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg" style={{ color: "var(--green)", background: "rgba(0,137,123,0.08)" }}><Eye size={13} /></button>
                        <button className="p-1.5 rounded-lg" style={{ color: "var(--burgundy)", background: "rgba(128,0,32,0.08)" }}><Ban size={13} /></button>
                        <button className="p-1.5 rounded-lg" style={{ color: "var(--text-light)", background: "rgba(84,110,122,0.08)" }}><Trash2 size={13} /></button>
                      </div>
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
