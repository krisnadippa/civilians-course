"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Download, Package, Plus, Search, Trash2, Edit2, X, Save, ShoppingBag, ExternalLink, Image as ImageIcon, Loader2 } from "lucide-react";
import AnimatedSection from "../../_components/AnimatedSection";
import { supabase, uploadImage } from "@/lib/supabase";

const ordersData = [
  { id: "#ORD-2401", user: "Ahmad Fauzi", email: "ahmad@email.com", item: "Template RAB Perumahan", category: "RAB", status: "Selesai", amount: 145000, date: "19 Mar 2026" },
  { id: "#ORD-2399", user: "Dina Marlena", email: "dina@email.com", item: "Set Gambar CAD Ruko", category: "Gambar CAD", status: "Selesai", amount: 195000, date: "18 Mar 2026" },
  { id: "#ORD-2395", user: "Rizki Pratama", email: "rizki@email.com", item: "Model Civil 3D Jalan", category: "Civil 3D", status: "Diproses", amount: 225000, date: "17 Mar 2026" },
  { id: "#ORD-2390", user: "Sari Dewi", email: "sari@email.com", item: "Panduan SAP2000", category: "Struktur", status: "Selesai", amount: 95000, date: "16 Mar 2026" },
  { id: "#ORD-2385", user: "Budi Jr.", email: "budi.jr@email.com", item: "Template RAB Gedung", category: "RAB", status: "Menunggu", amount: 175000, date: "15 Mar 2026" },
  { id: "#ORD-2381", user: "Cinta S.", email: "cinta@email.com", item: "Set Gambar CAD Jembatan", category: "Gambar CAD", status: "Selesai", amount: 275000, date: "14 Mar 2026" },
  { id: "#ORD-2379", user: "Dono K.", email: "dono@email.com", item: "Template Laporan Proyek", category: "Panduan", status: "Menunggu", amount: 85000, date: "13 Mar 2026" },
];

const statusColors: Record<string, string> = {
  "Selesai": "#00897B",
  "Diproses": "#546E7A",
  "Menunggu": "#FFA000",
};

export default function AdminTokoPage() {
  const [view, setView] = useState("orders"); // "orders" or "products"
  const [orders, setOrders] = useState(ordersData);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Tersedia",
    image_url: "",
    description: "",
    rating: "4.9",
    reviews_count: "0",
    downloads_count: "0",
    includes: "",
    format: "Digital Download",
    icon_name: "ShoppingCart"
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message, error.details);
        // Special handling for network errors
        if (error.message === "TypeError: Failed to fetch" || error.message?.includes("fetch")) {
          alert("Gagal menghubungi database! Ini biasanya terjadi karena:\n1. Server butuh di-restart (setelah edit .env.local)\n2. Adblocker memblokir Supabase\n3. Koneksi internet terputus\n\nSilakan cek Console (F12) untuk detail lebih lanjut.");
        }
      } else {
        setProducts(data || []);
      }
    } catch (e: any) {
      console.error("Fatal fetch error:", e);
      alert("Terjadi kesalahan fatal saat mengambil data. Cek console log.");
    }
    setLoading(false);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, "products");
      setFormData({ ...formData, image_url: url });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const openModal = (mode: "add" | "edit", product?: any) => {
    setModalMode(mode);
    if (mode === "edit" && product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status || "Tersedia",
        image_url: product.image_url || "",
        description: product.description || "",
        rating: product.rating?.toString() || "4.9",
        reviews_count: product.reviews_count?.toString() || "0",
        downloads_count: product.downloads_count?.toString() || "0",
        includes: Array.isArray(product.includes) ? product.includes.join(", ") : (product.includes || ""),
        format: product.format || "Digital Download",
        icon_name: product.icon_name || "ShoppingCart"
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "Tersedia",
        image_url: "",
        description: "",
        rating: "4.9",
        reviews_count: "0",
        downloads_count: "0",
        includes: "",
        format: "Digital Download",
        icon_name: "ShoppingCart"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock),
      status: formData.status,
      image_url: formData.image_url,
      description: formData.description,
      rating: parseFloat(formData.rating) || 4.9,
      reviews_count: parseInt(formData.reviews_count) || 0,
      downloads_count: parseInt(formData.downloads_count) || 0,
      includes: formData.includes.split(",").map(i => i.trim()).filter(i => i !== ""),
      format: formData.format,
      icon_name: formData.icon_name
    };

    if (modalMode === "add") {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) {
        alert("Error saving product: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", selectedProduct.id);
      if (error) {
        alert("Error updating product: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchProducts();
      }
    }
  };

  const filteredOrders = orders.filter((o) => statusFilter === "Semua" || o.status === statusFilter);
  const totalRevenue = orders.filter(o => o.status === "Selesai").reduce((s, o) => s + o.amount, 0);
  
  const confirmOrder = (id: string) => setOrders((d) => d.map((o) => o.id === id ? { ...o, status: "Selesai" } : o));
  const cancelOrder = (id: string) => setOrders((d) => d.filter((o) => o.id !== id));

  const handleDeleteClick = (product: any) => {
    setItemToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", itemToDelete.id);
    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const deleteProduct = async (id: string) => {
    // keeping for reference, but using handleDeleteClick
    if (!confirm("Hapus produk ini?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1C2433" }}>Manajemen Toko & Produk</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>Kelola pesanan pelanggan dan katalog produk Civilians.</p>
        </div>
        {/* View Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 w-fit border border-slate-200 relative shadow-inner">
         <button onClick={() => setView("orders")} 
           className={`relative z-10 px-8 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${view === "orders" ? "text-white" : "text-slate-500 hover:text-slate-700"}`}>
           {view === "orders" && (
              <motion.div layoutId="activeTabToko" className="absolute inset-0 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
           )}
           <span className="relative z-10 flex items-center gap-2">
             <ShoppingBag size={14} /> Pesan Masuk
           </span>
         </button>
         <button onClick={() => setView("products")}
           className={`relative z-10 px-8 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${view === "products" ? "text-white" : "text-slate-500 hover:text-slate-700"}`}>
           {view === "products" && (
              <motion.div layoutId="activeTabToko" className="absolute inset-0 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
           )}
           <span className="relative z-10 flex items-center gap-2">
             <Package size={14} /> Katalog Produk
           </span>
         </button>
      </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Pesanan", val: orders.length, color: "var(--primary)" },
          { label: "Pendapatan", val: `Rp ${totalRevenue.toLocaleString("id")}`, color: "#00897B" },
          { label: "Produk Aktif", val: products.length, color: "#475569" },
          { label: "Stok Tipis", val: products.filter(p => p.stock < 5).length, color: "#FFA000" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-5 bg-white shadow-sm border-none">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-light)" }}>{label}</p>
            <p className="font-bold text-xl" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
          </div>
        ))}
      </div>

      <AnimatedSection>
        {view === "orders" ? (
          <div className="card overflow-hidden border-none shadow-sm">
            <div className="p-4 border-b flex items-center justify-between bg-white overflow-x-auto gap-2">
              <div className="flex gap-2">
                {["Semua", "Selesai", "Diproses", "Menunggu"].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    {["ID", "Pengguna", "Produk", "Status", "Total", "Aksi"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-slate-400">{o.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-700">{o.user}</p>
                        <p className="text-[10px] text-slate-400">{o.email}</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">{o.item}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                          style={{ background: `${statusColors[o.status]}15`, color: statusColors[o.status] }}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-blue-600">Rp {o.amount.toLocaleString("id")}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {o.status === "Menunggu" && (
                            <>
                              <button onClick={() => confirmOrder(o.id)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-all text-[10px] uppercase">
                                <CheckCircle2 size={12} /> Selesai
                              </button>
                              <button onClick={() => cancelOrder(o.id)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-[10px] uppercase">
                                <XCircle size={12} /> Batal
                              </button>
                            </>
                          )}
                          {o.status === "Selesai" && (
                            <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                              <Download size={12} /> Unduh
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden border-none shadow-sm">
            <div className="p-5 border-b bg-white flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Katalog Produk</h3>
              <button onClick={() => openModal("add")} className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">
                <Plus size={14} /> Tambah Produk
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    {["Nama Produk", "Kategori", "Harga", "Stok", "Aksi"].map((h) => (
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
                  ) : products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200/50">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">{p.name}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px]">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 capitalize text-slate-500">{p.category}</td>
                      <td className="px-5 py-4 font-bold">Rp {parseInt(p.price).toLocaleString("id")}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded font-bold text-[10px] ${p.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {p.stock > 0 ? `${p.stock} Unit` : "Habis"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-3 justify-end">
                           <button onClick={() => openModal("edit", p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-[10px] uppercase">
                             Edit
                           </button>
                           <button onClick={() => handleDeleteClick(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-[10px] uppercase">
                             Hapus
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AnimatedSection>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
              style={{ maxHeight: "90vh" }}
            >
              <div className="p-6 border-b flex items-center justify-between flex-shrink-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {modalMode === "add" ? "Tambah Produk Baru" : "Edit Detail Produk"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Lengkapi informasi produk digital untuk katalog toko.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 pb-2 border-b border-blue-50">Informasi Utama</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Nama Produk</label>
                          <input 
                            type="text" required
                            placeholder="Contoh: Template RAB Rumah Tipe 36"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm transition-all focus:bg-white focus:shadow-sm"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Kategori</label>
                            <select 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm appearance-none focus:bg-white"
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                              {["RAB", "Gambar CAD", "Civil 3D", "Struktur", "Panduan", "Jasa"].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Status</label>
                            <select 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm appearance-none focus:bg-white"
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="Tersedia">Tersedia</option>
                              <option value="Sold Out">Sold Out</option>
                              <option value="Draft">Draft</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Harga (Rp)</label>
                            <input 
                              type="number" required
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm font-bold focus:bg-white"
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Stok / Limit</label>
                            <input 
                              type="number" required
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm focus:bg-white"
                              value={formData.stock}
                              onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Deskripsi Produk (Optional)</label>
                          <textarea 
                            rows={4} 
                            placeholder="Jelaskan detail mengenai produk ini..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm transition-all resize-none focus:bg-white"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Assets & Technical */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 pb-2 border-b border-blue-50">Visual & Teknis</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Ikon Produk</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm appearance-none focus:bg-white"
                            value={formData.icon_name}
                            onChange={(e) => setFormData({...formData, icon_name: e.target.value})}
                          >
                            <option value="ShoppingCart">Keranjang (Toko)</option>
                            <option value="FileSpreadsheet">Excel (RAB)</option>
                            <option value="Ruler">Penggaris (CAD)</option>
                            <option value="Cpu">CPU (Civil 3D)</option>
                            <option value="Building2">Gedung (Struktur)</option>
                            <option value="BookOpen">Buku (Panduan)</option>
                            <option value="HardHat">Helm (Proyek)</option>
                            <option value="Layers">Lapisan (Struktur)</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Format File</label>
                            <input 
                              type="text"
                              placeholder="Excel (.xlsx)"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm focus:bg-white"
                              value={formData.format}
                              onChange={(e) => setFormData({...formData, format: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Rating Display</label>
                            <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-primary focus:bg-white" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Include / Fitur (Pisahkan dengan koma)</label>
                          <input 
                            type="text"
                            placeholder="Template RAB, Analisa Harga Satuan, Rekapitulasi"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary text-sm focus:bg-white"
                            value={formData.includes}
                            onChange={(e) => setFormData({...formData, includes: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Jumlah Reviews</label>
                            <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-primary focus:bg-white" value={formData.reviews_count} onChange={(e) => setFormData({...formData, reviews_count: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Jumlah Downloads</label>
                            <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-primary focus:bg-white" value={formData.downloads_count} onChange={(e) => setFormData({...formData, downloads_count: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1">Gambar Produk</label>
                          <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                              {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                              ) : uploading ? (
                                <Loader2 className="animate-spin text-blue-600" size={24} />
                              ) : (
                                <ImageIcon className="text-slate-300" size={30} />
                              )}
                            </div>
                            <div className="flex-1">
                              <input type="file" accept="image/*" className="hidden" id="product-image" onChange={handleImageUpload} disabled={uploading} />
                              <label htmlFor="product-image" className="inline-block px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase cursor-pointer hover:bg-slate-100 transition-all text-slate-600 shadow-sm">
                                {uploading ? "Mengunggah..." : "Pilih Gambar"}
                              </label>
                              <p className="text-[10px] text-slate-400 mt-1.5 ml-1 leading-tight">Gunakan rasio 16:9 untuk hasil terbaik (PNG/JPG up to 2MB)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                  className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                  <Save size={16} /> Simpan Produk
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
              <p className="text-sm text-slate-500 mb-8">Produk <strong className="text-slate-900">"{itemToDelete?.name}"</strong> akan dihapus secara permanen dari database.</p>
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
