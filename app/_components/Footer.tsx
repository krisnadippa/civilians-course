"use client";

import Link from "next/link";
import { Building2, Mail, Phone, MapPin, Instagram, Youtube, Linkedin } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Jasa Perancangan", href: "/jasa" },
    { label: "Booking Mentor", href: "/mentor" },
    { label: "Toko Template", href: "/toko" },
  ],
  Layanan: [
    { label: "Pembuatan RAB", href: "/jasa" },
    { label: "Desain Struktur", href: "/jasa" },
    { label: "Gambar CAD", href: "/jasa" },
    { label: "Civil 3D Modeling", href: "/jasa" },
    { label: "Manajemen Konstruksi", href: "/jasa" },
  ],
  Dukungan: [
    { label: "Tentang Kami", href: "/" },
    { label: "FAQ", href: "/" },
    { label: "Kebijakan Privasi", href: "/" },
    { label: "Admin Panel", href: "/admin" },
  ],
};

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="mt-48 pb-12" style={{ background: "white" }}>
      <div className="container-main pt-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: "var(--primary)" }}>
                <Building2 size={24} color="white" />
              </div>
              <div>
                <span className="font-bold text-xl leading-none block" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)", letterSpacing: "0.05em" }}>
                  CIVILIANS
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--primary)" }}>
                  Teknik Sipil
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "var(--text-secondary)" }}>
              Ekosistem digital terintegrasi untuk mahasiswa dan praktisi Teknik Sipil Indonesia. Presisi dalam setiap karya.
            </p>

            <div className="flex flex-col gap-3.5 mb-8">
              {[
                { icon: Mail, text: "hello@civilians.id" },
                { icon: Phone, text: "+62 812-3456-7890" },
                { icon: MapPin, text: "Bandung, Jawa Barat" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "white" }}>
                    <Icon size={14} style={{ color: "var(--primary)" }} />
                  </div>
                  <span style={{ color: "var(--text-secondary)" }}>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white shadow-sm hover:shadow-md"
                  style={{ color: "var(--slate)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--primary)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; (e.currentTarget as HTMLElement).style.color = "var(--slate)"; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-7"
                style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                {title}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm transition-all hover:translate-x-1 inline-block"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--primary)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs font-medium" style={{ color: "var(--text-light)" }}>
            © {new Date().getFullYear()} Civilians. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-xs font-medium" style={{ color: "var(--text-light)" }}>
              Dibuat untuk Mahasiswa Teknik Sipil Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );}
