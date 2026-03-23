"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail, Lock, User, Eye, EyeOff, Building2, CheckCircle2,
  ArrowRight, LogIn, UserPlus, Phone, ArrowLeft, Shield, Award, Users,
} from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">(
    searchParams.get("tab") === "register" ? "register" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "var(--blue-50)" }}>
          <CheckCircle2 size={40} style={{ color: "var(--primary)" }} />
        </motion.div>
        <h3 className="font-bold text-xl mb-2" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
          {tab === "login" ? "Selamat Datang Kembali!" : "Akun Berhasil Dibuat!"}
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {tab === "login" ? "Anda berhasil masuk ke platform Civilians." : "Akun Anda sudah aktif. Selamat belajar!"}
        </p>
        <Link href="/" className="btn-primary w-full justify-center">
          Ke Beranda <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-[var(--bg-subtle)] mb-8 border" style={{ borderColor: "var(--border)" }}>
        {(["login", "register"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 rounded-xl"
            style={{
              background: tab === t ? "white" : "transparent",
              color: tab === t ? "var(--primary)" : "var(--text-light)",
              boxShadow: tab === t ? "0 4px 12px rgba(15, 23, 42, 0.08)" : "none",
            }}>
            {t === "login" ? <><LogIn size={16} /> Masuk</> : <><UserPlus size={16} /> Daftar</>}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {tab === "register" && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-light)" }}>Nama Lengkap</label>
            <div className="flex rounded-xl border overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500" style={{ borderColor: "var(--border)", background: "white" }}>
              <div className="bg-[var(--bg-subtle)] px-4 flex items-center justify-center border-r" style={{ borderColor: "var(--border)" }}>
                <User size={18} style={{ color: "var(--text-light)" }} />
              </div>
              <input type="text" required placeholder="Ahmad Fauzi" className="flex-1 px-4 py-3.5 text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }}
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-light)" }}>Email Layanan</label>
          <div className="flex rounded-xl border overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500" style={{ borderColor: "var(--border)", background: "white" }}>
            <div className="bg-[var(--bg-subtle)] px-4 flex items-center justify-center border-r" style={{ borderColor: "var(--border)" }}>
              <Mail size={18} style={{ color: "var(--text-light)" }} />
            </div>
            <input type="email" required placeholder="fauzi@civilians.id" className="flex-1 px-4 py-3.5 text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }}
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        {tab === "register" && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-light)" }}>No. WhatsApp</label>
            <div className="flex rounded-xl border overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500" style={{ borderColor: "var(--border)", background: "white" }}>
              <div className="bg-[var(--bg-subtle)] px-4 flex items-center justify-center border-r" style={{ borderColor: "var(--border)" }}>
                <Phone size={18} style={{ color: "var(--text-light)" }} />
              </div>
              <input type="tel" required placeholder="0812-3456-7890" className="flex-1 px-4 py-3.5 text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }}
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between items-center pl-1">
            <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-light)" }}>Password</label>
            {tab === "login" && (
              <a href="#" className="text-xs font-bold animate-underline" style={{ color: "var(--primary)" }}>Lupa?</a>
            )}
          </div>
          <div className="flex rounded-xl border overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500" style={{ borderColor: "var(--border)", background: "white" }}>
            <div className="bg-[var(--bg-subtle)] px-4 flex items-center justify-center border-r" style={{ borderColor: "var(--border)" }}>
              <Lock size={18} style={{ color: "var(--text-light)" }} />
            </div>
            <input type={showPassword ? "text" : "password"} required placeholder="Min. 8 karakter"
              className="flex-1 px-4 py-3.5 text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="px-3 flex items-center justify-center transition-colors hover:text-[var(--primary)]" style={{ color: "var(--text-light)" }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-4 py-4 rounded-xl shadow-lg shadow-blue-500/20"
          style={{ fontSize: "1rem" }}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Menyambung...
            </span>
          ) : tab === "login" ? (
            <><LogIn size={20} /> Masuk Sekarang</>
          ) : (
            <><UserPlus size={20} /> Daftar Akun Gratis</>
          )}
        </button>
      </form>

      {tab === "login" && (
        <p className="text-center text-sm mt-8" style={{ color: "var(--text-light)" }}>
          Belum bergabung?{" "}
          <button onClick={() => setTab("register")} className="font-bold underline underline-offset-4" style={{ color: "var(--primary)" }}>
            Daftar Gratis
          </button>
        </p>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden"
        style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
        />
        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Building2 size={26} color="white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CIVILIANS</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Platform Teknik Sipil</p>
              </div>
            </div>

            <h2 className="text-white font-extrabold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", lineHeight: 1.2 }}>
              Platform Teknik Sipil Terlengkap di Indonesia
            </h2>
            <p className="mb-10" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              Akses layanan perancangan, sesi mentor expert, dan template digital untuk mahasiswa dan profesional teknik sipil.
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, text: "Layanan standar HSPK & SNI terbaru" },
                { icon: Users, text: "4 Mentor senior, puluhan sesi per minggu" },
                { icon: Award, text: "98% tingkat kepuasan pengguna" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <item.icon size={16} color="white" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-10">
              {[["2.400+", "Mahasiswa"], ["98%", "Kepuasan"], ["4", "Mentor Expert"], ["500+", "Proyek"]].map(([val, label]) => (
                <div key={label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <p className="font-bold text-xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 blueprint-bg">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="card p-8 w-full" style={{ maxWidth: 440 }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <Building2 size={20} color="white" />
            </div>
            <span className="font-bold text-base tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>CIVILIANS</span>
          </div>

          <h2 className="font-bold text-2xl mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Selamat Datang
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-light)" }}>
            Masuk atau buat akun baru untuk mulai menggunakan layanan.
          </p>

          <Suspense fallback={<div className="text-center py-8">Memuat...</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold transition-all animate-underline" style={{ color: "var(--text-secondary)" }}>
              <ArrowLeft size={13} /> Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
