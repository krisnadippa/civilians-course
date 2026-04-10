"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, uploadImage } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, X, Upload, Check, AlertCircle, CheckCircle2, Copy,
  Building2, Cpu, Layers, Award, ArrowRight, MessageSquare, Users, ChevronRight, Download, Info, Loader2
} from "lucide-react";
import Link from "next/link";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";

/* ── TYPES ── */
type SubCourse = {
  id: string;
  title: string;
  price: number;
  mentor: string;
  duration: string;
  level: "Dasar" | "Menengah" | "Lanjutan" | string;
  description: string;
  db_id?: string; // mapping to supabase id
};

type Category = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
  color: string;       
  borderColor: string; 
  textColor: string;   
  badgeBg: string;
  tags: string[];
  subcourses: SubCourse[];
};

/* ── DATA STATIC FALLBACK ── */
const staticCategories: Category[] = [
  {
    id: "civil3d",
    title: "Civil 3D",
    subtitle: "Desain & Infrastruktur Digital",
    desc: "Kuasai perangkat lunak desain infrastruktur standar industri untuk perencanaan jalan, drainase, dan koridor.",
    icon: Cpu,
    color: "bg-emerald-600",
    borderColor: "border-t-4 border-emerald-500",
    textColor: "text-emerald-700",
    badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    tags: ["AutoDesk Civil 3D", "Corridor Design", "Earthwork"],
    subcourses: [
      {
        id: "c3d-1",
        title: "Pembuatan Jalan, Galian dan Timbunan",
        price: 350000,
        mentor: "Ratna Essya & Arimantara",
        duration: "2x Pertemuan",
        level: "Menengah",
        description: "Membuat desain geometri jalan, menghitung volume galian & timbunan menggunakan corridor Civil 3D sesuai standar proyek."
      }
    ]
  },
  {
    id: "sap2000",
    title: "SAP2000",
    subtitle: "Analisis Struktur Profesional",
    desc: "Dari dasar hingga lanjutan — analisis struktur beton & baja sesuai SNI terbaru dan standar internasional.",
    icon: Building2,
    color: "bg-blue-600",
    borderColor: "border-t-4 border-blue-500",
    textColor: "text-blue-700",
    badgeBg: "bg-blue-50 text-blue-700 border border-blue-200",
    tags: ["SNI 2847", "SNI 1729", "SRPMK", "Beton & Baja"],
    subcourses: [
      {
        id: "sap-1",
        title: "Pelatihan SAP Dasar (ASSTT)",
        price: 450000,
        mentor: "Arimantara & Eka Juniarta",
        duration: "2x Pertemuan",
        level: "Dasar",
        description: "Pengenalan antarmuka SAP2000, pembuatan model sederhana, input beban, dan interpretasi hasil analisis struktur."
      },
      {
        id: "sap-2",
        title: "Pemodelan Gedung Beton Sesuai SNI 2847",
        price: 450000,
        mentor: "Arimantara & Eka Juniarta",
        duration: "2x Pertemuan",
        level: "Menengah",
        description: "Pemodelan gedung beton bertulang sesuai SNI 2847: kombinasi beban, kapasitas elemen, dan laporan teknis."
      },
      {
        id: "sap-3",
        title: "Pemodelan Gedung Baja Berdasar SNI 1729",
        price: 450000,
        mentor: "Arimantara & Eka Juniarta",
        duration: "2x Pertemuan",
        level: "Lanjutan",
        description: "Pemodelan struktur baja profil WF, HSS, dan pipa sesuai SNI 1729, pengecekan tekuk dan sambungan."
      },
      {
        id: "sap-4",
        title: "Analisis SRPMK & Periode Struktur pada SAP2000",
        price: 450000,
        mentor: "Arimantara & Eka Juniarta",
        duration: "2x Pertemuan",
        level: "Lanjutan",
        description: "Analisis gempa dinamis SRPMK, penentuan periode struktur, dan evaluasi respons spektrum pada SAP2000."
      }
    ]
  },
  {
    id: "bim",
    title: "Pelatihan BIM",
    subtitle: "Building Information Modeling",
    desc: "Paket lengkap BIM: Tekla, Revit, Ms. Project, dan perhitungan RAB digital dalam satu alur kerja proyek nyata.",
    icon: Layers,
    color: "bg-violet-600",
    borderColor: "border-t-4 border-violet-500",
    textColor: "text-violet-700",
    badgeBg: "bg-violet-50 text-violet-700 border border-violet-200",
    tags: ["Tekla", "Revit", "Ms. Project", "RAB"],
    subcourses: [
      {
        id: "bim-1",
        title: "Tekla, Revit, Ms. Project + Perhitungan RAB",
        price: 500000,
        mentor: "Eka Juniarta & Bagaskara",
        duration: "2x Pertemuan",
        level: "Menengah",
        description: "Pemodelan 3D di Tekla & Revit, penjadwalan di Ms. Project, dan integrasi data BIM untuk RAB otomatis."
      }
    ]
  }
];

const levelStyle: Record<string, string> = {
  "Dasar":    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Menengah": "bg-amber-50 text-amber-700 border border-amber-200",
  "Lanjutan": "bg-red-50 text-red-700 border border-red-200",
};

/* ── SUB-COURSE MODAL ── */
function CourseListModal({
  category, onClose, onSelect
}: {
  category: Category;
  onClose: () => void;
  onSelect: (sub: SubCourse) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl shadow-slate-300/40 flex flex-col overflow-hidden"
        style={{ maxHeight: "88vh" }}
      >
        <div className="flex items-center gap-4 px-7 py-5 border-b border-slate-100 bg-slate-50">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${category.color}`}>
            <category.icon size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Pilih Kursus</p>
            <h2 className="font-extrabold text-slate-900 text-lg leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {category.title} — {category.subtitle}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <p className="text-xs font-bold text-slate-500 mb-4">{category.subcourses.length} kursus tersedia — klik "Daftar" untuk memulai pendaftaran</p>
          {category.subcourses.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest ${levelStyle[sub.level] || levelStyle["Dasar"]}`}>
                      {sub.level}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                      <Clock size={9} /> {sub.duration}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{sub.title}</h3>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 ml-10">{sub.description}</p>
              <div className="ml-10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Mentor</p>
                  <p className="text-xs font-bold text-slate-700">{sub.mentor}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Biaya</p>
                    <p className="font-extrabold text-slate-900 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Rp {sub.price.toLocaleString("id")}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelect(sub)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    Daftar <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── CHECKOUT MODAL ── */
function CheckoutModal({ subCourse, category, onClose }: { subCourse: SubCourse; category: Category; onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [waUrl, setWaUrl] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofDataUrl, setProofDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const fileRef = useRef<HTMLInputElement>(null);

  const BANK = { number: "1786875302", name: "Sang Ayu Putu Ratna Essya Pitaloka", bank: "BNI" };
  const WA_NUMBER = "6287762635300";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        const md = session.user.user_metadata || {};
        setForm({
          name: md.name || "",
          email: session.user.email || "",
          phone: md.phone || ""
        });
      }
    });
  }, []);

  const copyAccount = () => {
    navigator.clipboard.writeText(BANK.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProofFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setProofPreview(result);
      setProofDataUrl(result);
    };
    reader.readAsDataURL(f);
  };

  const downloadProof = () => {
    if (!proofDataUrl || !proofFile) return;
    const a = document.createElement("a");
    a.href = proofDataUrl;
    a.download = `bukti-bayar-${form.name.replace(/\s+/g, "-")}.${proofFile.name.split(".").pop()}`;
    a.click();
  };

  const handleConfirmOrder = async () => {
    if (!userId || !proofFile) {
      alert("Sesi login berakhir atau bukti transfer belum diunggah.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Upload file ke Supabase Storage (Bucket: course_proofs)
      const proofUrl = await uploadImage(proofFile, "course_proofs");
      
      // 2. Simpan ke tabel course_orders di Database
      const { error } = await supabase.from("course_orders").insert([{
        user_id: userId,
        course_id: subCourse.db_id || null, 
        course_title_snap: subCourse.title, // Simpan judul sebagai cadangan (Snapshot)
        price_paid: subCourse.price,
        payment_proof_url: proofUrl,
        status: "Menunggu Konfirmasi"
      }]);
      
      if (error) throw error;
      
      // 3. Susun Link WhatsApp
      const msg = encodeURIComponent(
        `Halo Admin Civilians! 👋\n\nSaya ingin konfirmasi pembayaran kursus:\n\n` +
        `📋 *Data Peserta*\n` +
        `• Nama: ${form.name}\n` +
        `• Email: ${form.email}\n` +
        `• No. WA: ${form.phone}\n\n` +
        `📚 *Detail Kursus*\n` +
        `• Paket: ${category.title}\n` +
        `• Kursus: ${subCourse.title}\n` +
        `• Biaya: Rp ${subCourse.price.toLocaleString("id")}\n\n` +
        `💳 *Bukti Transfer (Uploaded)*\n` +
        `• Link: ${proofUrl}\n\n` +
        `✅ Pesanan saya sudah tercatat di sistem website.\n*Mohon Admin segera memverifikasi pesanan saya.* Terima kasih! 🙏`
      );
      const waLink = `https://wa.me/${WA_NUMBER}?text=${msg}`;
      
      // Buka WA di tab/jendela baru
      window.open(waLink, "_blank");
      
      // Redirect ke halaman kelas saya
      router.push("/kelas-saya");
      
    } catch (err: any) {
      console.error("Order Error:", err);
      if (err.message.includes("Bucket")) {
        alert(err.message);
      } else {
        alert("Gagal mengirim pesanan: " + (err.message || "Pastikan koneksi internet stabil."));
      }
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = form.name.trim() && form.email.trim() && form.phone.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl shadow-slate-300/40 flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-0.5 ${category.textColor}`}>Pendaftaran Kursus</p>
            <h3 className="font-bold text-slate-900 text-base leading-snug max-w-[280px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {subCourse.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0 ml-3">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center px-6 py-4 gap-0 flex-shrink-0 border-b border-slate-50">
          {(["Data Diri", "Pembayaran", "Konfirmasi"] as const).map((label, idx) => {
            const n = idx + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center transition-all border-2 ${
                    done ? "bg-slate-900 border-slate-900 text-white" :
                    active ? "bg-white border-slate-900 text-slate-900" : "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {done ? <Check size={12} /> : n}
                  </div>
                  <span className={`text-xs font-bold hidden sm:block ${active ? "text-slate-900" : done ? "text-slate-600" : "text-slate-400"}`}>{label}</span>
                </div>
                {idx < 2 && <div className={`w-8 h-px mx-2 ${step > n ? "bg-slate-900" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {step === 1 && (
            <>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Ringkasan Pesanan</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${category.color}`}>
                    <category.icon size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm leading-tight">{subCourse.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{category.title} · {subCourse.duration}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-500">Total Biaya</span>
                  <span className="font-extrabold text-lg text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Rp {subCourse.price.toLocaleString("id")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {['name', 'email', 'phone'].map((f) => (
                  <div key={f}>
                    <label className="block text-xs font-extrabold text-slate-600 mb-1.5 capitalize">
                      {f === "phone" ? "Nomor WhatsApp" : f === "name" ? "Nama Lengkap" : "Alamat Email"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={f === "email" ? "email" : f === "phone" ? "tel" : "text"} 
                      placeholder={form[f as keyof typeof form] ? "" : "..."}
                      value={form[f as keyof typeof form]} 
                      onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-amber-800 leading-relaxed">
                  Jadwal kursus ditentukan Admin dan dikonfirmasi ke WhatsApp Anda setelah diverifikasi di Kelas Saya.
                </p>
              </div>

              <button
                onClick={() => setStep(2)} disabled={!isStep1Valid}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isStep1Valid ? "bg-slate-900 text-white hover:bg-blue-700 shadow-md" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Lanjut ke Pembayaran <ArrowRight size={15} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Informasi Rekening</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-orange-600 font-black text-sm tracking-wider">BNI</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bank Transfer</p>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">Bank Negara Indonesia</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3.5 border border-slate-200 mb-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Nomor Rekening</p>
                    <p className="text-2xl font-black text-slate-900 tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{BANK.number}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">a/n {BANK.name}</p>
                  </div>
                  <button onClick={copyAccount} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${copied ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
                    {copied ? <><Check size={13} /> Tersalin!</> : <><Copy size={13} /> Salin Nomor Rekening</>}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-3 border border-slate-200">
                <span className="text-sm font-bold text-slate-600">Jumlah Transfer</span>
                <span className="font-extrabold text-slate-900 text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Rp {subCourse.price.toLocaleString("id")}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">
                  Upload Bukti Transfer <span className="text-red-500">*</span>
                </p>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`w-full rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${proofFile ? "border-emerald-400 bg-emerald-50/50" : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30"}`}
                >
                  {proofPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={proofPreview} alt="Bukti" className="max-h-28 rounded-lg object-contain border border-slate-200 shadow-sm" />
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1"><Check size={12} /> {proofFile?.name}</p>
                      <p className="text-[10px] text-slate-400">Klik untuk ganti file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1"><Upload size={20} /></div>
                      <p className="text-sm font-bold text-slate-700">Pilih gambar atau PDF</p>
                      <p className="text-[11px] text-slate-400">JPG, PNG, PDF · Maks 5MB</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl font-bold text-sm border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">Kembali</button>
                <button
                  onClick={() => setStep(3)} disabled={!proofFile}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${proofFile ? "bg-slate-900 text-white hover:bg-emerald-700 shadow-md" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                >
                  Selesai <Check size={15} />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center pt-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={30} className="text-emerald-600" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Data Siap Disimpan!</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">Pesan kursus, upload bukti, dan kirim konfirmasi ke WhatsApp admin.</p>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Ringkasan</p>
                {[{ label: "Nama", val: form.name }, { label: "Kursus", val: subCourse.title }].map(({ label, val }) => (
                  <div key={label} className="flex items-start justify-between gap-2 text-sm">
                    <span className="text-slate-500 font-medium flex-shrink-0">{label}</span>
                    <span className="font-bold text-slate-900 text-right">{val}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-blue-800 mb-1">Cara finalisasi pendaftaran:</p>
                  <ol className="text-xs text-blue-700 font-medium space-y-1 list-decimal list-inside leading-relaxed">
                    <li>Klik tombol di bawah (Bukti akan diupload ke dashboard <b>Kelas Saya</b>).</li>
                    <li>Sistem akan membuka WhatsApp Admin otomatis.</li>
                    <li>Mohon kirimkan kembali foto bukti transfer di obrolan WA Admin agar pesanan Anda cepat diproses!</li>
                  </ol>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder} disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 text-white shadow-lg transition-all hover:bg-emerald-600 bg-emerald-500"
              >
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : <><MessageSquare size={17} /> Selesaikan Pesanan & Buka WA</>}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── CATEGORY CARD ── */
function CategoryCard({ cat, onOpenCourses }: { cat: Category; onOpenCourses: () => void; }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${cat.borderColor} flex flex-col h-full hover:shadow-lg transition-all duration-300`}>
      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm ${cat.color}`}><cat.icon size={24} /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{cat.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex-shrink-0 ${cat.badgeBg}`}>{cat.subcourses.length} Kursus</span>
            </div>
            <p className="text-xs font-bold text-slate-500">{cat.subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">{cat.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {cat.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200">{tag}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 mb-5">
          <div className="text-center">
            <p className="font-extrabold text-slate-900 text-lg leading-none mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{cat.subcourses.length}</p>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Topik</p>
          </div>
          <div className="text-center border-x border-slate-150">
            <p className="font-extrabold text-slate-900 text-lg leading-none mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>2x</p>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Sesi</p>
          </div>
          <div className="text-center">
            <p className="font-extrabold text-slate-900 text-lg leading-none mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>✓</p>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Mentor</p>
          </div>
        </div>
        {cat.subcourses.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Mulai dari</p>
            <p className={`text-2xl font-extrabold ${cat.textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Rp {Math.min(...cat.subcourses.map(s => s.price)).toLocaleString("id")}
            </p>
          </div>
        )}
        <button onClick={onOpenCourses} className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm mt-auto">
          Lihat Kursus <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── PAGE ── */
export default function KursusPage() {
  const router = useRouter();
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const [checkoutData, setCheckoutData] = useState<{ sub: SubCourse; cat: Category } | null>(null);
  
  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    const fetchDynamicCourses = async () => {
      try {
        const { data: catData } = await supabase.from('course_categories').select('*');
        const { data: courseData } = await supabase.from('courses').select('*').eq('status', 'Aktif');

        if (catData && catData.length > 0 && courseData && courseData.length > 0) {
          const combined = catData.map(c => {
            const matches = courseData.filter(cs => cs.category_id === c.id);
            return {
              id: c.id,
              title: c.title,
              subtitle: c.subtitle,
              desc: c.description,
              icon: c.icon === 'Cpu' ? Cpu : c.icon === 'Building2' ? Building2 : c.icon === 'Layers' ? Layers : BookOpen,
              color: c.color_theme ? `bg-${c.color_theme}-600` : "bg-emerald-600",
              borderColor: c.color_theme ? `border-t-4 border-${c.color_theme}-500` : "border-t-4 border-emerald-500",
              textColor: c.color_theme ? `text-${c.color_theme}-700` : "text-emerald-700",
              badgeBg: c.color_theme ? `bg-${c.color_theme}-50 text-${c.color_theme}-700 border border-${c.color_theme}-200` : "bg-emerald-50 text-emerald-700 border border-emerald-200",
              tags: c.tags || [],
              subcourses: matches
                .sort((a, b) => {
                  const order: Record<string, number> = { "Dasar": 1, "Menengah": 2, "Lanjutan": 3 };
                  const lvlA = order[a.level] || 4;
                  const lvlB = order[b.level] || 4;
                  if (lvlA === lvlB) return a.price - b.price;
                  return lvlA - lvlB;
                })
                .map(m => ({
                  id: m.id,
                  db_id: m.id,
                  title: m.title,
                  price: m.price,
                  mentor: m.instructor_names,
                  duration: m.duration || "2x Pertemuan",
                  level: m.level || "Dasar",
                  description: m.description || ""
                }))
            } as Category;
          });
          setCategories(combined);

          // Handle Redirect Auto Checkout
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const checkoutId = params.get("checkout");
            const catId = params.get("cat");
            
            if (checkoutId && catId) {
               const targetCat = combined.find(c => c.id === catId);
               if (targetCat) {
                  const targetSub = targetCat.subcourses.find(s => s.id === checkoutId || s.db_id === checkoutId);
                  if (targetSub) {
                     setCheckoutData({ sub: targetSub, cat: targetCat });
                  }
               }
            }
          }
        }
      } catch (err) {
        console.error("DB fallback to static", err);
      }
      setLoadingDb(false);
    };

    fetchDynamicCourses();
  }, []);

  const handleSelectSubcourse = async (sub: SubCourse, cat: Category) => {
    // Auth Check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login?redirect=" + encodeURIComponent(`/kursus?checkout=${sub.id}&cat=${cat.id}`));
      return;
    }
    setOpenCategory(null);
    setCheckoutData({ sub, cat });
  };

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 min-h-screen">
        <section className="bg-white border-b border-slate-200 pt-36 pb-20 px-6">
          <div className="container-main max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-[11px] font-extrabold uppercase tracking-widest mb-5">
                <BookOpen size={11} /> Platform Kursus Teknik Sipil
              </span>
              <h1 className="text-slate-900 mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Pilih Kursus yang<br />Sesuai Karir Anda
              </h1>
              <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
                Pilih paket kursus spesialis teknik sipil, daftar online, dan kelola semua dari Dashboard Kelas Saya.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[{ val: `${categories.length} Paket`, sub: "Spesialis" }, { val: "Interaktif", sub: "Dengan Mentor" }, { val: "Live Class", sub: "Via Zoom/Meet" }].map(({ val, sub }) => (
                  <div key={sub} className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left shadow-sm">
                    <p className="font-extrabold text-slate-900 text-sm">{val}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="container-main max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Paket Kursus Tersedia</h2>
                <p className="text-sm text-slate-500 font-medium">Pilih salah satu program kami di bawah ini.</p>
              </div>
            </AnimatedSection>

            {loadingDb ? (
              <div className="flex justify-center items-center py-20">
                 <Loader2 size={30} className="text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">
                {categories.map((cat, i) => (
                  <AnimatedSection key={cat.id} delay={i * 0.1}>
                    <CategoryCard cat={cat} onOpenCourses={() => setOpenCategory(cat)} />
                  </AnimatedSection>
                ))}
              </div>
            )}

            <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Alur Pendaftaran Otomatis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { n: "01", title: "Pilih / Login", desc: "Pilih paket dan login/daftar akun Civilians" },
                  { n: "02", title: "Checkout", desc: "Isi data dan upload bukti transfer BNI" },
                  { n: "03", title: "Konfirmasi WA", desc: "Kirim info pesanan ke WA admin kami" },
                  { n: "04", title: "Kelas Saya", desc: "Pantau pesanan Anda di Dashboard Pelanggan" },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="text-center">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-extrabold text-sm mx-auto mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{n}</div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <AnimatePresence>
        {openCategory && !checkoutData && (
          <CourseListModal category={openCategory} onClose={() => setOpenCategory(null)} onSelect={(sub) => handleSelectSubcourse(sub, openCategory)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutData && (
          <CheckoutModal subCourse={checkoutData.sub} category={checkoutData.cat} onClose={() => setCheckoutData(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
