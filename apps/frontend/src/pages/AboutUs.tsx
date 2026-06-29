import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, Users, Truck, Wrench, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(-28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes floatIcon {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(12px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shimmerSlide {
    from { transform: translateX(-100%); }
    to   { transform: translateX(200%); }
  }
  .reveal { opacity: 0; }
  .reveal.visible { animation: fadeUp 0.65s ease forwards; }
  .reveal-left { opacity: 0; }
  .reveal-left.visible { animation: fadeLeft 0.65s ease forwards; }
  .reveal-right { opacity: 0; }
  .reveal-right.visible { animation: fadeRight 0.65s ease forwards; }
`;

// ── Scroll reveal hook ────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Products" },
  { value: "10K+", label: "Happy Customers" },
  { value: "3", label: "Premium Brands" },
];

const VALUES = [
  {
    icon: Award,
    title: "Premium Quality",
    desc: "Every piece is crafted with the finest materials, built to last generations.",
    color: "#f59e0b",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Exceptional service from browsing to delivery — we're with you every step.",
    color: "#f97316",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "Fast, safe delivery to your doorstep anywhere across Sri Lanka.",
    color: "#f59e0b",
  },
  {
    icon: Wrench,
    title: "Expert Installation",
    desc: "Our trained team sets everything up so you don't have to worry.",
    color: "#f97316",
  },
  {
    icon: Shield,
    title: "Warranty Assured",
    desc: "All products come with manufacturer warranty for your peace of mind.",
    color: "#f59e0b",
  },
  {
    icon: Star,
    title: "5-Star Rated",
    desc: "Thousands of delighted customers rate us 5 stars across Sri Lanka.",
    color: "#f97316",
  },
];

const BRANDS = [
  { name: "SUPER MAX", desc: "Bold, durable designs for modern living." },
  { name: "TEKA", desc: "European-inspired craftsmanship." },
  { name: "FLEX", desc: "Versatile furniture for every space." },
];

// ── Component ─────────────────────────────────────────────────────────────────

const AboutUs: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const storyRef    = useReveal();
  const valuesRef   = useReveal();
  const brandsRef   = useReveal();
  const ctaRef      = useReveal();
  const imgRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <div className="min-h-screen bg-stone-50">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden py-20 px-6"
          style={{ background: "linear-gradient(135deg, #1c1917 0%, #431407 50%, #1c1917 100%)" }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.10) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
          {/* Blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.11) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,146,60,0.09) 0%, transparent 70%)" }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <div
            className="relative z-10 max-w-6xl mx-auto"
            style={{
              opacity: mounted ? 1 : 0,
              animation: mounted ? "fadeUp 0.65s ease both" : "none",
            }}
          >
            <span className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-black uppercase tracking-[5px] mb-5">
              <span className="h-px w-6 bg-amber-400/60" />
              Who We Are
              <span className="h-px w-6 bg-amber-400/60" />
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              About Leema
            </h1>
            <p className="text-stone-400 mt-3 text-lg max-w-md">
              Premium furniture for your beautiful home — crafted with care, delivered with pride.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-4 mt-8">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="bg-white/7 border border-white/10 backdrop-blur-sm rounded-2xl px-5 py-3"
                  style={{
                    opacity: mounted ? 1 : 0,
                    animation: mounted ? `countUp 0.5s ease ${0.2 + i * 0.08}s both` : "none",
                  }}
                >
                  <div
                    className="text-xl font-black text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg,#fbbf24,#f97316)" }}
                  >
                    {value}
                  </div>
                  <div className="text-stone-400 text-[11px] font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Our Story ────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div ref={storyRef} className="reveal-left">
              <span className="text-amber-500 text-xs font-black uppercase tracking-[4px]">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mt-2 mb-6 leading-tight">
                Furnishing Homes <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg,#f59e0b,#f97316)" }}
                >
                  Since Day One
                </span>
              </h2>

              <div className="space-y-4">
                {[
                  "Leema is dedicated to providing high-quality, stylish, and durable furniture that transforms your living spaces into comfortable havens.",
                  "With years of experience in the furniture industry, we pride ourselves on exceptional customer service and reliable delivery across Sri Lanka.",
                  "Our mission is simple — make quality furniture accessible to everyone, ensuring every home is furnished with elegance and lasting comfort.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-1 rounded-full flex-shrink-0 mt-1"
                      style={{
                        height: "auto",
                        minHeight: 16,
                        background: i % 2 === 0
                          ? "linear-gradient(180deg,#f59e0b,#f97316)"
                          : "linear-gradient(180deg,#f97316,#f59e0b)",
                      }}
                    />
                    <p className="text-stone-600 leading-relaxed text-sm">{text}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/user/category"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-2xl text-sm font-black text-white transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#f97316)",
                  boxShadow: "0 6px 24px rgba(245,158,11,0.35)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Products <ArrowRight size={16} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </div>

            {/* Image */}
            <div
              ref={imgRef}
              className="reveal-right relative"
            >
              {/* Glow */}
              <div className="absolute -inset-3 rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(245,158,11,0.15) 0%, transparent 70%)",
                  filter: "blur(16px)",
                }} />

              {/* Corner brackets */}
              {[
                "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
                "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
              ].map((cls, i) => (
                <span key={i} className={`absolute w-7 h-7 border-amber-400/50 z-10 pointer-events-none ${cls}`} />
              ))}

              <img
                src="/images/services.jpg"
                alt="About Leema"
                className="relative w-full h-96 object-cover rounded-2xl"
                style={{
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(245,158,11,0.15)",
                }}
              />

              {/* Floating badge */}
              <div
                className="absolute -bottom-5 -left-5 z-20 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
                style={{ animation: "floatIcon 3.5s ease-in-out infinite" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
                  🛋️
                </div>
                <div>
                  <div className="text-stone-800 text-xs font-black">Est. 2014</div>
                  <div className="text-stone-400 text-[10px]">Kegalle, Sri Lanka</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Our Values ───────────────────────────────────────────────────── */}
        <div className="py-20 px-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1c1917 0%, #431407 50%, #1c1917 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.07) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          <div ref={valuesRef} className="reveal relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-amber-400 text-xs font-black uppercase tracking-[5px]">
                What Drives Us
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Our Values</h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/60" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/60" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
                <div
                  key={title}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300"
                  style={{ animationDelay: `${i * 80}ms` }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(255,255,255,0.09)";
                    el.style.borderColor = "rgba(245,158,11,0.35)";
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(255,255,255,0.05)";
                    el.style.borderColor = "rgba(255,255,255,0.1)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ background: `linear-gradient(90deg,${color},#f97316)` }}
                  />

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg,${color},#f97316)`,
                      animation: `floatIcon 3.5s ease-in-out ${i * 0.5}s infinite`,
                    }}
                  >
                    <Icon size={20} color="#fff" />
                  </div>
                  <h3 className="text-white font-black text-base mb-2">{title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Our Brands ───────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div ref={brandsRef} className="reveal">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-xs font-black uppercase tracking-[4px]">
                Trusted Names
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mt-2">
                Our Brands
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/60" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/60" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {BRANDS.map(({ name, desc }, i) => (
                <div
                  key={name}
                  className="group bg-white rounded-2xl p-7 border border-stone-100 text-center transition-all duration-300"
                  style={{
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    animationDelay: `${i * 100}ms`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-6px)";
                    el.style.boxShadow = "0 16px 40px rgba(245,158,11,0.13), 0 4px 12px rgba(0,0,0,0.07)";
                    el.style.borderColor = "rgba(245,158,11,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                    el.style.borderColor = "rgb(231,229,228)";
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl"
                    style={{ background: "linear-gradient(135deg,#fef3c7,#fed7aa)" }}
                  >
                    🏷️
                  </div>
                  <h3
                    className="font-black text-lg tracking-widest text-transparent bg-clip-text mb-2"
                    style={{ backgroundImage: "linear-gradient(135deg,#b45309,#c2410c)" }}
                  >
                    {name}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
                  {/* Bottom line */}
                  <div
                    className="h-0.5 rounded-full mx-auto mt-5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{
                      width: "60%",
                      background: "linear-gradient(90deg,#f59e0b,#f97316)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden py-20 px-6"
          style={{ background: "linear-gradient(135deg, #1c1917 0%, #431407 50%, #1c1917 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          <div ref={ctaRef} className="reveal relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-6 text-3xl"
              style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", boxShadow: "0 8px 28px rgba(245,158,11,0.35)" }}>
              🛋️
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Ready to Transform <br />Your Space?
            </h2>
            <p className="text-stone-400 text-base mb-8 max-w-md mx-auto">
              Browse our full collection and find the perfect furniture for every room in your home.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/user/category"
                className="relative overflow-hidden group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#f97316)",
                  boxShadow: "0 6px 28px rgba(245,158,11,0.4)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now <ArrowRight size={16} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                to="/contactus"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-stone-300 border border-stone-600 hover:border-amber-500/50 hover:text-amber-300 hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default AboutUs;