"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, PlayCircle, Loader2, Building2, Cpu, Layers, Award } from "lucide-react";
import Link from "next/link";

type Order = {
  id: string;
  price_paid: number;
  status: string;
  meeting_link: string | null;
  meeting_schedule: string | null;
  created_at: string;
  course_title_snap?: string | null;
  courses: {
    title: string;
    description: string;
    level: string;
    duration: string;
    instructor_names: string;
    category_id: string;
  } | null;
};

export default function KelasSayaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session) {
        // Not logged in, redirect to login
        router.push("/login?redirect=/kelas-saya");
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile({
        name: profileData?.name || session.user.user_metadata?.name || "Member",
        email: session.user.email,
        phone: profileData?.phone || session.user.user_metadata?.phone || "-",
        status_pekerjaan: profileData?.status_pekerjaan || session.user.user_metadata?.status_pekerjaan || "Umum"
      });

      // Fetch Orders
      const { data: orderData, error: orderError } = await supabase
        .from("course_orders")
        .select(`
          id, price_paid, status, meeting_link, meeting_schedule, created_at, course_title_snap,
          courses ( title, description, level, duration, instructor_names, category_id )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (orderData) {
        setOrders(orderData as unknown as Order[]);
      }
      
      setLoading(false);
    };

    fetchUserAndOrders();
  }, [router]);

  const getCategoryIcon = (id: string | undefined) => {
    if (id === "civil3d") return <Cpu size={20} />;
    if (id === "sap2000") return <Building2 size={20} />;
    if (id === "bim") return <Layers size={20} />;
    return <BookOpen size={20} />;
  };

  const getCategoryColor = (id: string | undefined) => {
    if (id === "civil3d") return "bg-emerald-600 border-emerald-500 text-emerald-50";
    if (id === "sap2000") return "bg-blue-600 border-blue-500 text-blue-50";
    if (id === "bim") return "bg-violet-600 border-violet-500 text-violet-50";
    return "bg-slate-600 border-slate-500 text-slate-50";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 font-bold text-slate-500">
            <Loader2 className="animate-spin text-blue-600" size={24} /> Memuat data...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="container-main max-w-5xl mx-auto">
          
          {/* Header Dashboard */}
          <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 mb-8 border border-slate-800 text-white shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-1">
                Dashboard Pembelajaran
              </p>
              <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Halo, {profile?.name.split(" ")[0]}!
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Pekerjaan: {profile?.status_pekerjaan} · {profile?.email}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 min-w-[120px]">
                 <p className="text-3xl font-extrabold mb-1 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{orders.length}</p>
                 <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Kursus</p>
               </div>
               <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 min-w-[120px]">
                 <p className="text-3xl font-extrabold mb-1 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                   {orders.filter(o => o.status === "Aktif").length}
                 </p>
                 <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Kursus Aktif</p>
               </div>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Kelas Saya</h2>
            <Link href="/kursus" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              + Pesan Kursus Baru
            </Link>
          </div>

          {/* List Kelas */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-400">
                <BookOpen size={30} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Belum ada kursus</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto font-medium">
                Anda belum terdaftar di kelas manapun. Mulai tingkatkan karir Anda bersama Civilians!
              </p>
              <Link href="/kursus" className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
                Cari Kursus Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((o) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  key={o.id} 
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`p-6 border-b flex-1 ${!o.courses ? "bg-slate-50" : ""}`}>
                    {o.courses ? (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-white ${getCategoryColor(o.courses.category_id)}`}>
                            {getCategoryIcon(o.courses.category_id)}
                          </div>
                          
                          {/* Status Badge */}
                          {o.status === "Aktif" ? (
                            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                              <CheckCircle2 size={12} /> Aktif
                            </span>
                          ) : o.status === "Selesai" ? (
                            <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                              <Award size={12} /> Selesai
                            </span>
                          ) : o.status === "Dibatalkan" ? (
                            <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-[10px] font-extrabold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                              Batal
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                              <Clock size={12} /> Menunggu Confirm
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-lg text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.3 }}>
                          {o.courses.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 mb-4 truncate text-ellipsis">
                          Mentor: <span className="text-slate-700">{o.courses.instructor_names}</span>
                        </p>

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {o.courses.duration}</span>
                          <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-slate-400"/> Level: {o.courses.level}</span>
                        </div>
                      </>
                    ) : (
                       <div className="h-full flex flex-col justify-center">
                         <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-extrabold uppercase tracking-widest rounded-md self-start mb-3">
                           {o.course_title_snap || "Kursus Dihapus"}
                         </span>
                         <p className="font-bold text-slate-500 text-sm">Informasi kursus sudah tidak tersedia.</p>
                       </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-5 border-t border-slate-100 flex flex-col gap-3">
                    {/* Action conditional on Status */}
                    {o.status === "Aktif" && o.meeting_link ? (
                      <>
                        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                           Jadwal: <span className="text-slate-800">{o.meeting_schedule || "Menyusul"}</span>
                        </p>
                        <a href={o.meeting_link} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                          <PlayCircle size={16} /> Gabung Sesi Kelas
                        </a>
                      </>
                    ) : o.status === "Aktif" ? (
                      <p className="text-xs text-center font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                        Admin segera mengirim/menginfokan jadwal kelas Anda di halaman ini.
                      </p>
                    ) : (o.status === "Menunggu Konfirmasi" ? (
                      <div>
                        <p className="text-xs text-center font-bold text-amber-700 mb-3 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                           Verifikasi pembayaran sedang diproses oleh admin (maks. 1x24 jam).
                        </p>
                        <a 
                          href={`https://wa.me/6287762635300?text=${encodeURIComponent(`Halo min, saya mau konfirmasi pembayaran kursus atas email: ${profile?.email}.`)}`} 
                          target="_blank" rel="noopener noreferrer"
                          className="w-full py-2.5 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          Hubungi CS (WhatsApp)
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-center font-bold text-slate-400 py-2">
                        {o.status === "Selesai" ? "Kursus telah diselesaikan." : "Pesanan Dibatalkan."}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
