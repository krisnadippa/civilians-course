"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Mail, Lock, User, Eye, EyeOff, Building2, CheckCircle2,
  ArrowRight, LogIn, UserPlus, Phone, ArrowLeft, Shield, Award, Users,
  Briefcase
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get("redirect") || "/kelas-saya";
  
  const [tab, setTab] = useState<"login" | "register">(
    searchParams.get("tab") === "register" ? "register" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "",
    status_pekerjaan: "Umum"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (tab === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              name: form.name,
              phone: form.phone,
              status_pekerjaan: form.status_pekerjaan,
            }
          }
        });
        
        if (error) throw error;
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectParams);
        }, 2000);

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        
        if (error) throw error;
        
        // Determine target redirect
        const userEmail = data.user?.email?.toLowerCase() || "";
        const allowedEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
        const allowedList = allowedEnv.split(",").map(e => e.replace(/['"]/g, '').trim().toLowerCase());
        const isAdminAccount = allowedList.includes(userEmail);

        let finalRedirect = redirectParams;
        // If the default is /kelas-saya but they are an admin, prioritize the admin panel
        if (isAdminAccount && finalRedirect === "/kelas-saya") {
          finalRedirect = "/admin";
        }

        setSuccess(true);
        setTimeout(() => {
          router.push(finalRedirect);
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      if (!success) setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-emerald-50">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </motion.div>
        <h3 className="font-extrabold text-xl mb-2 text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {tab === "login" ? "Berhasil Masuk!" : "Akun Berhasil Dibuat!"}
        </h3>
        <p className="text-sm mb-6 text-slate-500 font-medium">
          Mengarahkan Anda ke halaman tujuan...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-slate-100 mb-6 border border-slate-200">
        {(["login", "register"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setErrorMsg(""); }}
            className={`flex-1 py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 rounded-xl ${
              tab === t ? "bg-white text-blue-700 shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-700"
            }`}>
            {t === "login" ? <><LogIn size={16} /> Masuk</> : <><UserPlus size={16} /> Daftar</>}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {tab === "register" && (
          <>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pl-1">Nama Lengkap</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 bg-white">
                <div className="bg-slate-50 px-4 flex items-center justify-center border-r border-slate-200">
                  <User size={18} className="text-slate-400" />
                </div>
                <input type="text" required placeholder="Ahmad Fauzi" className="flex-1 px-4 py-3 text-sm outline-none font-bold text-slate-900"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pl-1">No. WhatsApp</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 bg-white">
                <div className="bg-slate-50 px-4 flex items-center justify-center border-r border-slate-200">
                  <Phone size={18} className="text-slate-400" />
                </div>
                <input type="tel" required placeholder="0812-3456-7890" className="flex-1 px-4 py-3 text-sm outline-none font-bold text-slate-900"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pl-1">Status Pekerjaan</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 bg-white">
                <div className="bg-slate-50 px-4 flex items-center justify-center border-r border-slate-200">
                  <Briefcase size={18} className="text-slate-400" />
                </div>
                <select 
                  className="flex-1 px-4 py-3 text-sm outline-none font-bold text-slate-900 bg-transparent appearance-none"
                  value={form.status_pekerjaan} onChange={(e) => setForm({ ...form, status_pekerjaan: e.target.value })}
                >
                  <option value="Umum">Umum / Profesional</option>
                  <option value="Mahasiswa">Mahasiswa Sipil</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pl-1">Email Layanan</label>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 bg-white">
            <div className="bg-slate-50 px-4 flex items-center justify-center border-r border-slate-200">
              <Mail size={18} className="text-slate-400" />
            </div>
            <input type="email" required placeholder="fauzi@civilians.id" className="flex-1 px-4 py-3 text-sm outline-none font-bold text-slate-900"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center pl-1">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Password</label>
          </div>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 bg-white">
            <div className="bg-slate-50 px-4 flex items-center justify-center border-r border-slate-200">
              <Lock size={18} className="text-slate-400" />
            </div>
            <input type={showPassword ? "text" : "password"} required placeholder="Min. 6 karakter"
              className="flex-1 px-4 py-3 text-sm outline-none font-bold text-slate-900"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="px-4 flex items-center justify-center transition-colors text-slate-400 hover:text-blue-600 bg-slate-50 border-l border-slate-200">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} 
          className="w-full justify-center mt-6 py-4 rounded-xl shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center gap-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Memproses...
            </span>
          ) : tab === "login" ? (
            <><LogIn size={20} /> Masuk Sekarang</>
          ) : (
            <><UserPlus size={20} /> Daftar Akun Gratis</>
          )}
        </button>
      </form>

      {tab === "login" && (
        <p className="text-center text-sm mt-8 text-slate-500 font-medium">
          Belum bergabung?{" "}
          <button onClick={() => { setTab("register"); setErrorMsg(""); }} className="font-extrabold text-blue-600 hover:text-blue-800 transition-colors">
            Daftar Gratis
          </button>
        </p>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
        />
        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-600 shadow-lg shadow-blue-600/30">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-lg tracking-widest uppercase leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CIVILIANS</p>
                <p className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest mt-1">Platform Edukasi Sipil</p>
              </div>
            </div>

            <h2 className="text-white font-black mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", lineHeight: 1.1 }}>
              Tingkatkan Karir<br/>Teknik Sipil Anda
            </h2>
            <p className="mb-10 text-slate-400 font-medium" style={{ lineHeight: 1.7 }}>
              Akses materi software standar industri, layanan perancangan profesional, dan konsultasi interaktif dengan expert aktif di lapangan.
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, text: "Sesuai standar SNI & Internasional" },
                { icon: Users, text: "Interaksi 1-on-1 dengan Mentor Expert" },
                { icon: Award, text: "Sertifikat Penyelesaian Modul Pelatihan" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800 border border-slate-700 flex-shrink-0">
                    <item.icon size={15} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-black text-sm tracking-widest uppercase text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CIVILIANS</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8">
            <h2 className="font-extrabold text-3xl mb-2 text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Masuk / Daftar
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Silakan autentikasi untuk memesan kursus dan mengelola layanan Anda.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-8 text-slate-500 text-sm font-bold">Memuat formulir...</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
