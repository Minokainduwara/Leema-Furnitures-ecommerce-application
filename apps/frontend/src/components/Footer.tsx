import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Wood Furniture",            to: "/user/category" },
  { label: "Plastic Furniture",         to: "/user/category" },
  { label: "Steel Fabricated Furniture",to: "/user/category" },
];

const COMPANY = [
  { label: "Home",              to: "/" },
  { label: "About Us",          to: "/aboutus" },
  { label: "Contact Us",        to: "/contactus" },
  { label: "Terms & Conditions",to: "/terms" },
];

const SHOWROOMS = [
  {
    name: "Kegalle Branch",
    address: "123/A, Main Street, Kegalle",
    email: "leemakegalle@gmail.com",
    phone: "+94 77 123 4567",
  },
  {
    name: "Gampola Branch",
    address: "No 24, Nuwara Eliya Rd, Gampola",
    email: "leemagampola@gmail.com",
    phone: "+94 77 842 4567",
  },
];

const SOCIALS = [
  { icon: Facebook,  label: "Facebook",  href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter,   label: "Twitter",   href: "#" },
];

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Top accent blob */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)" }}
      />
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* ── Main grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Brand column ── */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-stone-900"
                style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
              >
                L
              </div>
              <span className="text-white font-black text-xl tracking-tight">Leema</span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-5">
              Premium furniture crafted for modern living — delivered with pride across Sri Lanka.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-stone-700 text-stone-500 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[4px] text-amber-400 mb-5 flex items-center gap-2">
              <span className="h-px w-5 bg-amber-400/50" />
              Categories
            </h4>
            <ul className="space-y-3">
              {CATEGORIES.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-stone-400 hover:text-amber-400 text-sm transition-all duration-200"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[4px] text-amber-400 mb-5 flex items-center gap-2">
              <span className="h-px w-5 bg-amber-400/50" />
              Our Company
            </h4>
            <ul className="space-y-3">
              {COMPANY.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-stone-400 hover:text-amber-400 text-sm transition-all duration-200"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Showrooms ── */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[4px] text-amber-400 mb-5 flex items-center gap-2">
              <span className="h-px w-5 bg-amber-400/50" />
              Showrooms
            </h4>
            <div className="space-y-6">
              {SHOWROOMS.map(({ name, address, email, phone }) => (
                <div key={name}>
                  <p className="text-white text-xs font-black mb-2.5 tracking-wide">{name}</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-stone-400 text-xs leading-relaxed">{address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail size={13} className="text-amber-500 flex-shrink-0" />
                      <a
                        href={`mailto:${email}`}
                        className="text-stone-400 hover:text-amber-400 text-xs transition-colors duration-200 truncate"
                      >
                        {email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={13} className="text-amber-500 flex-shrink-0" />
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="text-stone-400 hover:text-amber-400 text-xs transition-colors duration-200"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-600 text-xs">
            © 2026 <span className="text-stone-500 font-semibold">Leema Furniture</span>. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;