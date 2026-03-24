"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wrench, Users, ShoppingBag, LogIn, Building2 } from "lucide-react";

const navLinks = [
  { href: "/jasa", label: "Jasa", icon: Wrench },
  { href: "/mentor", label: "Mentor", icon: Users },
  { href: "/toko", label: "Toko", icon: ShoppingBag },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const isSolid = scrolled || open;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSolid ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <nav className="container-main flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 bg-blue-600 shadow-sm"
            >
              <Building2 size={20} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <span
                className="font-bold text-base leading-none block text-slate-900"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.05em" }}
              >
                CIVILIANS
              </span>
              <span className="text-[9px] font-bold leading-none tracking-widest uppercase text-blue-600">
                Teknik Sipil
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      active ? "bg-slate-900 text-white shadow-sm" : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <link.icon size={14} className={active ? "text-blue-400" : "text-slate-400"} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <LogIn size={14} /> Masuk
            </Link>
            <Link href="/login?tab=register" 
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all inline-flex items-center shadow-sm disabled:opacity-50">
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-all border border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[280px] bg-white z-[100] md:hidden shadow-2xl flex flex-col h-[100dvh]"
            >
              {/* Header */}
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "var(--primary)" }}>
                    <Building2 size={18} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-sm tracking-widest text-blue-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CIVILIANS</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: active ? "var(--blue-50)" : "transparent",
                        color: active ? "var(--primary)" : "var(--text-primary)",
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? "bg-blue-100/50" : "bg-slate-50"}`}>
                        <link.icon size={18} style={{ color: active ? "var(--primary)" : "var(--slate)" }} />
                      </div>
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="p-5 border-t bg-slate-50/50 flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold border border-slate-200 bg-white hover:bg-slate-100 transition-all text-slate-700">
                  <LogIn size={16} /> Masuk ke Akun
                </Link>
                <Link href="/login?tab=register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Daftar Sekarang
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
