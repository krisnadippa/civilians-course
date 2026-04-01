"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, UserCheck, BookOpen,
  ShoppingBag, Building2, LogOut, X, ChevronRight, Bell, Loader2
} from "lucide-react";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pesanan Kursus", icon: ShoppingBag },
  { href: "/admin/kursus", label: "Katalog Kursus", icon: BookOpen },
  { href: "/admin/mentor", label: "Manajemen Mentor", icon: UserCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, [pathname]);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Jika tidak ada session, redirect ke login
    if (!session) {
      router.push("/login?redirect=/admin");
      return;
    }

    const email = session.user.email || "";
    // Daftar email admin diizinkan. Baca dari ENV, atau tambahkan email manual di array ini.
    // Contoh: NEXT_PUBLIC_ADMIN_EMAILS="admin@example.com,owner@example.com"
    const allowedEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
    const allowedList = allowedEnv.split(",").map(e => e.trim().toLowerCase());
    
    // Fallback jika belum men-setup .env, izinkan semua sementara TAPI tampilkan warning (atau hardcode email di sini)
    // Untuk keamanan produksi, sebaiknya tolak jika tidak ada di array.
    if (allowedEnv.length > 0 && !allowedList.includes(email.toLowerCase())) {
       alert("Akses Ditolak: Email Anda (" + email + ") tidak memiliki akses Admin.");
       router.push("/");
       return;
    }

    setAdminEmail(email);
    setIsAuthorized(true);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
        <p className="font-bold text-sm">Memverifikasi Akses Admin...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 flex flex-col bg-slate-900 border-r border-slate-800 ${collapsed ? "w-16" : "w-60"}`}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-600">
            <Building2 size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-black text-sm leading-none tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CIVILIANS</p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 mt-0.5">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto hidden-scrollbar">
          {sidebarItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all group ${
                  active ? "bg-blue-600 text-white shadow-md shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
                title={collapsed ? item.label : ""}
              >
                <item.icon size={18} className={active ? "text-white" : "text-slate-400 group-hover:text-slate-300"} />
                {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={17} />
            {!collapsed && <span className="text-sm font-bold">Kembali ke Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div>
            <p className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {sidebarItems.find(i => i.href === pathname)?.label || "Dashboard"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black bg-blue-600 shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
