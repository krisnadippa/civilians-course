"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Users, BookOpen, LogIn, Building2, Home, UserCircle, LogOut, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/kursus", label: "Kursus", icon: BookOpen },
  { href: "/mentor", label: "Mentor", icon: Users },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkIfAdmin(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      checkIfAdmin(session);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkIfAdmin = (session: any) => {
    if (!session) {
      setIsAdminUser(false);
      return;
    }
    const email = session.user.email?.toLowerCase() || "";
    const allowedEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
    const allowedList = allowedEnv.split(",").map(e => e.replace(/['"]/g, '').trim().toLowerCase());
    setIsAdminUser(allowedList.includes(email));
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminUser(false);
    setOpen(false);
    router.push("/");
  };

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
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm ${isAdminUser ? "bg-slate-900" : "bg-blue-600"}`}
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
              <span className={`text-[9px] font-bold leading-none tracking-widest uppercase ${isAdminUser ? "text-slate-500" : "text-blue-600"}`}>
                {isAdminUser ? "ADMIN MODE" : "Teknik Sipil"}
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
            {isAdminUser && (
               <li key="/admin">
                 <Link
                   href="/admin"
                   className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100"
                 >
                   <Shield size={14} className="text-blue-600" />
                   Admin Panel
                 </Link>
               </li>
            )}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/kelas-saya"
                  className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                >
                  <UserCircle size={16} /> Kelas Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Keluar"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  <LogIn size={14} /> Masuk
                </Link>
                <Link href="/login?tab=register" 
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all inline-flex items-center shadow-sm disabled:opacity-50">
                  Daftar Kursus
                </Link>
              </>
            )}
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
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 group">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${isAdminUser ? "bg-slate-900" : "bg-blue-600"}`}>
                    <Building2 size={18} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-sm tracking-widest text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CIVILIANS</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
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
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                        active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <link.icon size={18} className={active ? "text-blue-400" : "text-slate-400"} />
                      {link.label}
                    </Link>
                  );
                })}

                {isAdminUser && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    <Shield size={18} className="text-blue-600" />
                    Admin Panel
                  </Link>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-5 border-t bg-slate-50/50 flex flex-col gap-3" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                {session ? (
                  <>
                    <Link
                      href="/kelas-saya"
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100 shadow-sm"
                    >
                      <UserCircle size={18} /> Kelas Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm"
                    >
                      <LogOut size={18} /> Keluar dari Akun
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold border border-slate-200 bg-white hover:bg-slate-100 transition-all text-slate-700">
                      <LogIn size={18} /> Masuk ke Akun
                    </Link>
                    <Link href="/login?tab=register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                      Daftar Sekarang
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
