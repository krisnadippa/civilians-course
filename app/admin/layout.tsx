"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, BookOpen,
  ShoppingBag, BarChart2, Building2, LogOut, X, ChevronRight, Bell, Wrench
} from "lucide-react";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jasa", label: "Layanan Jasa", icon: Wrench },
  { href: "/admin/mentor", label: "Mentor", icon: UserCheck },
  { href: "/admin/kursus", label: "Kursus", icon: BookOpen },
  { href: "/admin/toko", label: "Toko & Pesanan", icon: ShoppingBag },
  { href: "/admin/pengguna", label: "Pengguna", icon: Users },
  { href: "/admin/analitik", label: "Analitik", icon: BarChart2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#F4F4F0" }}>
      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed top-0 left-0 h-full z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
        style={{ display: "flex", flexDirection: "column", background: "var(--slate-dark)" }}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(0,137,123,0.1)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary)" }}>
            <Building2 size={20} color="white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-none tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CIVILIANS</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--green-light)" }}>Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded-md"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {collapsed ? <ChevronRight size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all group"
                style={{
                  background: active ? "rgba(26,86,219,0.15)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.5)",
                  borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                }}
                title={collapsed ? item.label : ""}
              >
                <item.icon size={18} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(0,137,123,0.1)" }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <LogOut size={17} />
            {!collapsed && <span className="text-sm">Kembali ke Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-30"
          style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
              {sidebarItems.find(i => i.href === pathname)?.label || "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg" style={{ background: "rgba(84,110,122,0.08)" }}>
              <Bell size={17} style={{ color: "var(--text-secondary)" }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--burgundy)" }} />
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto" style={{ color: "var(--text-primary)" }}>{children}</main>
      </div>
    </div>
  );
}
