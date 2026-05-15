import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api, authFetch, productImageUrl, type ApiProduct } from "../utils/api";
import { useCart } from "../hooks/CartContext";
import { useAuth } from "../hooks/Authcontext";

type Product = ApiProduct & {
  brand?: string;
  category?: string;
  categoryName?: string;
  imageUrl?: string;
};
type ToastState = { message: string; type: "success" | "error" };

// ── Particle Canvas ───────────────────────────────────────────────────────────

function ParticleCanvas(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      color: string;
    };

    const COLORS = ["#f59e0b", "#fb923c", "#fcd34d", "#d97706", "#fff7ed"];
    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      r: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245,158,11,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow ring on larger particles
        if (p.r > 1.8) {
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          grad.addColorStop(0, `rgba(245,158,11,0.15)`);
          grad.addColorStop(1, "transparent");
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}

// ── Floating Orbs ─────────────────────────────────────────────────────────────

function FloatingOrbs(): React.ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: -150, right: -150,
          background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          animation: "floatOrb 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          bottom: -80, left: -80,
          background: "radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)",
          animation: "floatOrb 9s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 250, height: 250,
          top: "40%", left: "30%",
          background: "radial-gradient(circle, rgba(253,230,138,0.06) 0%, transparent 70%)",
          animation: "floatOrb 15s ease-in-out infinite 3s",
        }}
      />
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

interface ToastProps { message: string; type: "success" | "error" }

function Toast({ message, type }: ToastProps): React.ReactElement {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-bold
        flex items-center gap-2
        ${type === "success"
          ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30"
          : "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30"}`}
      style={{ animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

interface ProductCardProps { item: Product; onAddToCart: (item: Product) => Promise<void>; index: number; }

function ProductCard({ item, onAddToCart, index }: ProductCardProps): React.ReactElement {
  const [adding, setAdding] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const nav = useNavigate();

  const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAdding(true);
    setShimmer(true);
    await onAddToCart(item);
    setAdding(false);
    setTimeout(() => setShimmer(false), 800);
  };

  return (
    <div
      onClick={() => nav(`/product/details/${item.id}`)}
      className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer flex flex-col"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        animation: `cardReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) both`,
        animationDelay: `${index * 80}ms`,
        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px) scale(1.01)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(245,158,11,0.18), 0 8px 24px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)";
      }}
    >
      {/* Shimmer overlay */}
      {shimmer && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.25) 50%, transparent 60%)",
            animation: "shimmerSlide 0.8s ease forwards",
          }}
        />
      )}

      {item.brand && (
        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider shadow-lg shadow-amber-500/30">
          {item.brand}
        </span>
      )}

      {/* Amber glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1.5px rgba(245,158,11,0.3)" }} />

      <div className="overflow-hidden h-52 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative">
        <img
          src={productImageUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[3px]">
          {item.categoryName || item.category || "Furniture"}
        </span>
        <h4 className="text-stone-800 font-bold text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors duration-200">
          {item.name}
        </h4>
        <p className="text-stone-400 text-sm line-clamp-2 flex-1">{item.description}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
          <span className="text-amber-700 font-black text-lg">
            LKR {item.price?.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-60 text-white text-xs font-black px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-amber-500/25"
            style={{ transform: adding ? "scale(0.95)" : "scale(1)" }}
          >
            {adding ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>＋ Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

interface StatItem { value: string; label: string; }

const STATS: StatItem[] = [
  { value: "500+", label: "Products" },
  { value: "3", label: "Premium Brands" },
  { value: "10K+", label: "Happy Customers" },
  { value: "5★", label: "Rated Service" },
];

function Hero(): React.ReactElement {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 min-h-[88vh] flex items-center overflow-hidden">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <FloatingOrbs />
      <ParticleCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span
            className="text-amber-400 text-xs font-black uppercase tracking-[6px] flex items-center gap-3"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400" />
            Premium Furniture
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400" />
          </span>

          <h1
            className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            Design Your
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                Perfect
              </span>
              {/* Underline glow */}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 opacity-60 rounded-full" />
            </span>{" "}
            Space
          </h1>

          <p
            className="text-stone-300 text-lg leading-relaxed max-w-md"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            Curated furniture that blends timeless craftsmanship with modern
            living — delivered straight to your door.
          </p>

          <div
            className="flex gap-4 mt-2"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
            }}
          >
            <button
              onClick={() => navigate("/user/category")}
              className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-900 font-black px-8 py-4 rounded-2xl text-base transition-all duration-300 hover:scale-105 group"
              style={{ boxShadow: "0 8px 32px rgba(245,158,11,0.4)" }}
            >
              <span className="relative z-10">Shop Now</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
            <button
              onClick={() => navigate("/user/category")}
              className="border border-stone-600 hover:border-amber-400 text-stone-300 hover:text-amber-300 font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
            >
              Browse All
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          className="hidden md:grid grid-cols-2 gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="group relative overflow-hidden bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col gap-1 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 relative z-10">
                {s.value}
              </span>
              <span className="text-stone-400 text-sm font-medium relative z-10">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stone-900/50 to-transparent pointer-events-none" />
    </section>
  );
}

// ── Brands Strip ──────────────────────────────────────────────────────────────

const BRANDS = ["SUPER MAX", "TEKA", "FLEX"];

function BrandsStrip(): React.ReactElement {
  return (
    <div className="bg-stone-900 border-y border-stone-800 py-5 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-16 gap-y-3 items-center">
        {BRANDS.map((b, i) => (
          <span
            key={b}
            className="text-stone-500 hover:text-amber-400 font-black text-lg tracking-[6px] transition-all duration-300 cursor-pointer hover:scale-105 select-none"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Category Sections (NEW) ───────────────────────────────────────────────────

interface CategoryGroup {
  id: number | string;
  name: string;
  items: Product[];
}

interface CategorySectionsProps {
  onAddToCart: (item: Product) => Promise<void>;
}

const ITEMS_PER_CATEGORY = 4;          // products shown inline per category
const MIN_ITEMS_TO_SHOW   = 1;          // hide categories with fewer than this

function CategorySections({ onAddToCart }: CategorySectionsProps): React.ReactElement {
  const navigate = useNavigate();
  const [groups, setGroups]   = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          authFetch("http://localhost:8080/api/categories"),
          authFetch("http://localhost:8080/api/products"),
        ]);
        if (!catsRes.ok || !prodsRes.ok) throw new Error("Failed to fetch");

        const catsData  = await catsRes.json();
        const prodsData = await prodsRes.json();

        // Build category lookup
        const catMap: Record<string | number, { id: string | number; name: string }> = {};
        if (Array.isArray(catsData)) {
          catsData.forEach((c: any) => {
            const name = String(c?.name || c?.categoryName || "").trim();
            if (name && c?.id != null) catMap[c.id] = { id: c.id, name };
          });
        }

        // Resolve every product's category name (matches your CategoryPage logic)
        const resolveCat = (item: any): { id: string | number | null; name: string } => {
          if (item?.category?.name) return { id: item.category.id ?? null, name: String(item.category.name) };
          if (typeof item?.category === "string") return { id: null, name: item.category };
          if (item?.categoryId && catMap[item.categoryId]) return catMap[item.categoryId];
          if (item?.category_id && catMap[item.category_id]) return catMap[item.category_id];
          if (item?.category?.id && catMap[item.category.id]) return catMap[item.category.id];
          return { id: null, name: "Uncategorized" };
        };

        // Bucket products by category
        const bucket = new Map<string, CategoryGroup>();
        (prodsData || []).forEach((item: any) => {
          const { id, name } = resolveCat(item);
          const key = String(id ?? name);
          if (!bucket.has(key)) {
            bucket.set(key, { id: id ?? name, name, items: [] });
          }
          bucket.get(key)!.items.push({
            ...item,
            category: name,
            categoryName: name,
          } as Product);
        });

        // Keep categories from the categories API in their original order,
        // then append any leftover groups discovered only via product data.
        const ordered: CategoryGroup[] = [];
        Object.values(catMap).forEach((c) => {
          const g = bucket.get(String(c.id));
          if (g && g.items.length >= MIN_ITEMS_TO_SHOW) {
            ordered.push(g);
            bucket.delete(String(c.id));
          }
        });
        bucket.forEach((g) => {
          if (g.items.length >= MIN_ITEMS_TO_SHOW) ordered.push(g);
        });

        setGroups(ordered);
      } catch (err) {
        console.error("CategorySections load failed:", err);
        setError("Couldn't load categories right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Skeleton while loading
  if (loading) {
    return (
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto space-y-16">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k}>
              <div className="h-8 w-64 bg-stone-200 rounded-full animate-pulse mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl bg-gradient-to-br from-stone-100 to-stone-200 animate-pulse h-80"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-stone-50">
        <p className="text-center text-stone-400 text-lg">{error}</p>
      </section>
    );
  }

  if (groups.length === 0) return <></>;

  return (
    <>
      {groups.map((group, idx) => {
        const isAlt = idx % 2 === 1;
        const items = group.items.slice(0, ITEMS_PER_CATEGORY);
        const number = String(idx + 1).padStart(2, "0");

        return (
          <section
            key={`${group.id}-${group.name}`}
            className={`relative py-24 px-6 overflow-hidden ${isAlt ? "bg-stone-50" : "bg-white"}`}
          >
            {/* Decorative blobs (alternating positions) */}
            <div
              className={`absolute w-80 h-80 rounded-full blur-3xl pointer-events-none ${
                isAlt ? "bottom-10 right-10 bg-orange-200/20" : "top-10 left-10 bg-amber-200/25"
              }`}
            />

            {/* Faint dotted background */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, #78716c 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative z-10 max-w-7xl mx-auto">
              {/* Section header — editorial layout */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
                <div className="flex items-end gap-5">
                  <span
                    className="text-7xl md:text-8xl font-black leading-none text-transparent select-none"
                    style={{
                      WebkitTextStroke: "1.5px rgba(245,158,11,0.45)",
                      letterSpacing: "-2px",
                    }}
                  >
                    {number}
                  </span>
                  <div className="pb-2">
                    <span className="text-amber-600 text-[11px] font-black uppercase tracking-[5px] flex items-center gap-2">
                      <span className="h-px w-6 bg-amber-500" />
                      Category
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-stone-800 mt-2 leading-tight">
                      {group.name}
                    </h2>
                    <p className="text-stone-500 text-sm mt-2">
                      {group.items.length} {group.items.length === 1 ? "item" : "items"} available
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/user/category?category=${encodeURIComponent(group.name)}`)
                  }
                  className="group self-start md:self-end inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-black text-sm transition-all duration-200"
                >
                  View all in {group.name}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                </button>
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, i) => (
                  <ProductCard
                    key={`${group.id}-${item.id}`}
                    item={item}
                    onAddToCart={onAddToCart}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────

interface ServiceItem { icon: string; title: string; desc: string; color: string; }

const SERVICES: ServiceItem[] = [
  { icon: "🚚", title: "Free Delivery", desc: "Fast & safe delivery to your doorstep anywhere.", color: "from-amber-400/10 to-orange-400/10" },
  { icon: "🛠️", title: "Custom Design", desc: "Furniture crafted precisely for your space.", color: "from-blue-400/10 to-cyan-400/10" },
  { icon: "🧰", title: "Installation", desc: "Professional setup by our expert team.", color: "from-emerald-400/10 to-green-400/10" },
  { icon: "🔧", title: "Repair Service", desc: "Ongoing support to keep your furniture pristine.", color: "from-purple-400/10 to-pink-400/10" },
];

function Services(): React.ReactElement {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 py-28 px-6 overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-orange-200/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-600 text-xs font-black uppercase tracking-[6px]">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-800 mt-3">Our Services</h2>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`group relative bg-white rounded-3xl p-8 flex flex-col items-center text-center gap-4 overflow-hidden`}
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                animationDelay: `${i * 100}ms`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-10px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 50px rgba(245,158,11,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <span
                className="text-5xl relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
              >
                {s.icon}
              </span>
              <h3 className="font-black text-stone-800 text-lg relative z-10">{s.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed relative z-10">{s.desc}</p>
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonGrid(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-gradient-to-br from-stone-100 to-stone-200 animate-pulse h-80"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

// ── CSS Keyframes Injection ───────────────────────────────────────────────────

function GlobalStyles(): React.ReactElement {
  return (
    <style>{`
      @keyframes floatOrb {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33%       { transform: translate(30px, -20px) scale(1.05); }
        66%       { transform: translate(-20px, 15px) scale(0.95); }
      }
      @keyframes cardReveal {
        from { opacity: 0; transform: translateY(24px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes shimmerSlide {
        from { transform: translateX(-100%); }
        to   { transform: translateX(200%); }
      }
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(16px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
    `}</style>
  );
}

// ── Home (main) ───────────────────────────────────────────────────────────────

export default function Home(): React.ReactElement {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState["type"] = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.getFeaturedProducts(8)
      .then(setProducts)
      .catch(() => showToast("Failed to load products", "error"))
      .finally(() => setLoading(false));
  }, []);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = useCallback(async (product: Product) => {
    if (!user) { navigate("/login"); return; }
    try {
      await addToCart(product.id, 1);
      showToast(`"${product.name}" added to cart`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add to cart", "error");
    }
  }, [addToCart, navigate, user]);

  return (
    <div className="min-h-screen bg-stone-50">
      <GlobalStyles />
      <Header />
      <Hero />
      <BrandsStrip />

      {/* Featured Products */}
      <section className="py-28 px-6 bg-white relative overflow-hidden">
        {/* Subtle background dots */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #78716c 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-amber-600 text-xs font-black uppercase tracking-[5px]">
                Handpicked For You
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-stone-800 mt-2">
                Featured Products
              </h2>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </div>
            </div>
            <button
              onClick={() => navigate("/user/category")}
              className="group text-amber-600 hover:text-amber-700 font-black text-sm flex items-center gap-2 transition-all duration-200"
            >
              View All Products
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
            </button>
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : products.length === 0 ? (
            <p className="text-center text-stone-400 py-20 text-lg">No products available right now.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item, i) => (
                <ProductCard key={item.id} item={item} onAddToCart={handleAddToCart} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEW — Category-by-category sections */}
      <CategorySections onAddToCart={handleAddToCart} />

      <Services />
      <Footer />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}