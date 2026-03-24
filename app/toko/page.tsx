"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, X, CheckCircle2, Star, Download,
  FileSpreadsheet, Ruler, Cpu, Building2, BookOpen, HardHat, Layers,
  ShoppingBag, ArrowRight, Tag, Sparkles
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AnimatedSection from "../_components/AnimatedSection";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, any> = {
  FileSpreadsheet, Ruler, Cpu, Building2, BookOpen, HardHat, Layers, ShoppingCart
};

const categories = ["Semua", "RAB", "Gambar CAD", "Civil 3D", "Struktur", "Panduan", "Jasa"];

function CartToast({ item, onClose }: { item: any; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }} 
      animate={{ opacity: 1, y: 0, x: "-50%" }} 
      exit={{ opacity: 0, y: 20, x: "-50%" }}
      className="fixed bottom-10 left-1/2 z-[100] bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl flex items-center gap-4 shadow-2xl min-w-[320px]"
    >
      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
        <ShoppingCart size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">Item ditambahkan!</p>
        <p className="text-xs text-slate-400 truncate max-w-[180px]">{item.title}</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><X size={16} /></button>
    </motion.div>
  );
}

export default function TokoPage() {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [toast, setToast] = useState<any | null>(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .neq("status", "Draft") // Show everything except Draft
          .order("created_at", { ascending: false });
        
        if (error) throw error;

        if (data) {
          const mappedData = data.map((p: any) => {
            try {
              return {
                ...p,
                id: p.id,
                title: p.name || "Unnamed Product",
                desc: p.description || "Aset Teknik Sipil berkualitas untuk mempermudah pekerjaan Anda.",
                icon: iconMap[p.icon_name] || ShoppingCart,
                reviews: p.reviews_count || 0,
                downloads: p.downloads_count || 0,
                rating: p.rating || 5.0,
                price: parseFloat(p.price) || 0,
                includes: Array.isArray(p.includes) ? p.includes : (p.includes ? p.includes.split(",") : ["Aset Digital"]),
                format: p.format || "Digital Download",
                status: p.status || "Tersedia"
              };
            } catch (err) {
              console.error("Error mapping product:", p.id, err);
              return null;
            }
          }).filter(p => p !== null);

          setProductsData(mappedData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, []);

  const addToCart = (item: any) => {
    if (!cart.includes(item.id)) {
      setCart([...cart, item.id]);
      setToast(item);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const filtered = productsData.filter((p) => {
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    return searchMatch;
  });

  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC]">
        {/* ── HERO SECTION ── */}
        {/* ── HERO SECTION ── */}
        <section className="relative pt-40 pb-32 overflow-hidden bg-slate-50">
          <div className="container-main relative z-10 px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold tracking-widest uppercase rounded-md border border-blue-100">Premium Digital Assets</span>
              </div>
              
              <h1 className="text-slate-900 mb-6 leading-[1.1]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Koleksi Desain <br/><span className="text-blue-600">Teknik Sipil</span>
              </h1>
              
              <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-slate-500">
                Akses koleksi eksklusif template RAB, desain CAD, dan panduan teknis yang dikurasi oleh para ahli untuk mempercepat alur kerja teknik sipil Anda.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <div className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <div className="flex flex-col text-left border-r border-slate-200 pr-5">
                     <span className="text-xl font-extrabold text-slate-900 leading-none">50+</span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Templates</span>
                  </div>
                  <div className="flex flex-col text-left border-r border-slate-200 px-5">
                     <span className="text-xl font-extrabold text-slate-900 leading-none">1.2k</span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Downloads</span>
                  </div>
                  <div className="flex flex-col text-left pl-2">
                     <span className="text-xl font-extrabold text-slate-900 leading-none flex items-center gap-1">4.9<Star size={14} className="text-amber-400 fill-amber-400" /></span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Rating</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>



        {/* Products Grid */}
        <section className="py-24 px-6">
          <div className="container-main">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="w-full md:w-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Katalog Terkini
                </h2>
                <p className="text-sm text-slate-500">Menampilkan {filtered.length} produk pilihan untuk Anda</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                 <input
                   type="text"
                   placeholder="Cari produk..."
                   className="w-full md:w-64 lg:w-80 px-4 py-2.5 bg-white border border-slate-200 outline-none text-slate-900 font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm rounded-none shadow-sm"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
                 {cart.length > 0 && (
                   <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 rounded-none shadow-sm whitespace-nowrap">
                     <ShoppingBag size={14} /> {cart.length} Item
                   </div>
                 )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-6 h-[420px] animate-pulse border border-slate-100">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-6" />
                    <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-4" />
                    <div className="h-20 bg-slate-100 rounded-lg w-full mb-6" />
                    <div className="mt-auto h-12 bg-slate-100 rounded-2xl w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tidak ditemukan apapun</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Coba gunakan kata kunci lain atau ubah kategori pencarian Anda.</p>
                <button onClick={() => {setSearch(""); setActiveCategory("Semua")}} className="mt-8 text-blue-600 font-bold text-sm hover:underline">Reset Pencarian</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((item, i) => (
                  <AnimatedSection key={item.id} delay={i * 0.05}>
                    <div className="group bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
                      {/* Top Bar */}
                      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white border border-slate-200 rounded-none flex items-center justify-center text-slate-700 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors group-hover:border-blue-600">
                             <item.icon size={20} strokeWidth={2} />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-0.5">{item.category}</span>
                            <div className="flex items-center gap-1 text-slate-700">
                               <Star size={12} className="text-amber-500 fill-amber-500" />
                               <span className="text-xs font-bold">{item.rating}</span>
                               <span className="text-[10px] text-slate-400">({item.reviews || 0})</span>
                            </div>
                          </div>
                        </div>
                        {item.status !== "Tersedia" && (
                           <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-red-100">
                              {item.status}
                           </span>
                        )}
                      </div>
                      
                      {/* Middle Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6">
                          {item.desc}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.format}</p>
                           <p className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                             Rp {item.price.toLocaleString("id")}
                           </p>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="px-6 pb-6">
                         <button 
                           onClick={() => addToCart(item)}
                           disabled={item.status !== "Tersedia"}
                           className={`w-full py-3.5 flex items-center justify-center gap-2 font-bold text-sm transition-all rounded-none border ${
                             item.status !== "Tersedia"
                             ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                             : cart.includes(item.id)
                               ? "bg-green-50 text-green-700 border-green-200"
                               : "bg-slate-900 text-white border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-blue-100"
                           }`}
                         >
                           {cart.includes(item.id) ? (
                             <><CheckCircle2 size={16} /> Ditambahkan</>
                           ) : item.status !== "Tersedia" ? (
                             "Stok Habis"
                           ) : (
                             <><ShoppingCart size={16} /> Beli Sekarang</>
                           )}
                         </button>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
            
            <div className="mt-20 p-10 bg-slate-900 text-center relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full" />
               <h3 className="text-2xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Butuh desain custom atau jasa teknik spesial?</h3>
               <p className="text-slate-400 mb-8 max-w-lg mx-auto relative z-10">Tim kami siap membantu pengerjaan laporan, pemodelan struktur, atau gambar kerja yang belum tersedia di katalog.</p>
               <button className="px-8 py-4 bg-white text-slate-900 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all relative z-10 flex items-center gap-2 mx-auto rounded-none">
                 Hubungi Specialist <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AnimatePresence>
        {toast && <CartToast item={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
}
