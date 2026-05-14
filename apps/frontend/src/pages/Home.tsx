import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api, productImageUrl, type ApiProduct } from "../utils/api";
import { useCart } from "../hooks/CartContext";
import { useAuth } from "../hooks/Authcontext";

type Product = ApiProduct & { brand?: string; category?: string; imageUrl?: string };
type ToastState = { message: string; type: "success" | "error" };

// ── Toast ─────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  type: "success" | "error";
}

function Toast({ message, type }: ToastProps): React.ReactElement {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold
        transition-all duration-300
        ${type === "success" ? "bg-green-600" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  item: Product;
  onAddToCart: (item: Product) => Promise<void>;
}

function ProductCard({ item, onAddToCart }: ProductCardProps): React.ReactElement {
  const [adding, setAdding] = useState<boolean>(false);
  const nav = useNavigate();

  const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(item);
    setAdding(false);
  };

  return (
    <div
      onClick={() => nav(`/product/details/${item.id}`)}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer">
      {item.brand && (
        <span className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {item.brand}
        </span>
      )}

      <div className="overflow-hidden h-52 bg-amber-50 flex items-center justify-center">
        <img
          src={productImageUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
          {item.categoryName || item.category || "Furniture"}
        </span>
        <h4 className="text-gray-800 font-bold text-base leading-snug line-clamp-2">
          {item.name}
        </h4>
        <p className="text-gray-500 text-sm line-clamp-2 flex-1">{item.description}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-amber-700 font-extrabold text-lg">
            LKR {item.price?.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors duration-200 flex items-center gap-1"
          >
            {adding ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "＋ Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: "500+", label: "Products" },
  { value: "3", label: "Premium Brands" },
  { value: "10K+", label: "Happy Customers" },
  { value: "5★", label: "Rated Service" },
];

function Hero(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 min-h-[88vh] flex items-center overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-orange-400/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span className="text-amber-400 text-sm font-bold uppercase tracking-[4px]">
            Premium Furniture
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
            Design Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Perfect
            </span>{" "}
            Space
          </h1>
          <p className="text-stone-300 text-lg md:text-xl leading-relaxed max-w-md">
            Curated furniture that blends timeless craftsmanship with modern
            living — delivered straight to your door.
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => navigate("/category")}
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-black px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-500/30"
            >
              Shop Now
            </button>
            <button
              onClick={() => navigate("/category")}
              className="border border-stone-600 hover:border-amber-500 text-stone-300 hover:text-amber-400 font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200"
            >
              Browse All
            </button>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col gap-1 hover:bg-white/10 transition-colors duration-300"
            >
              <span className="text-4xl font-black text-amber-400">{s.value}</span>
              <span className="text-stone-400 text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Brands Strip ──────────────────────────────────────────────────────────────

const BRANDS: string[] = ["SUPER MAX", "TEKA", "FLEX"];

function BrandsStrip(): React.ReactElement {
  return (
    <div className="bg-stone-900 py-5 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-16 gap-y-3 items-center">
        {BRANDS.map((b) => (
          <span
            key={b}
            className="text-stone-400 hover:text-amber-400 font-black text-lg tracking-widest transition-colors duration-200 cursor-pointer"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────

interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
}

const SERVICES: ServiceItem[] = [
  { icon: "🚚", title: "Free Delivery", desc: "Fast & safe delivery to your doorstep anywhere." },
  { icon: "🛠️", title: "Custom Design", desc: "Furniture crafted precisely for your space." },
  { icon: "🧰", title: "Installation", desc: "Professional setup by our expert team." },
  { icon: "🔧", title: "Repair Service", desc: "Ongoing support to keep your furniture pristine." },
];

function Services(): React.ReactElement {
  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-600 text-sm font-bold uppercase tracking-[4px]">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-800 mt-2">
            Our Services
          </h2>
          <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-3xl p-8 flex flex-col items-center text-center gap-4 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <span className="text-5xl">{s.icon}</span>
              <h3 className="font-black text-stone-800 text-lg">{s.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
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
        <div key={i} className="rounded-3xl bg-stone-100 animate-pulse h-80" />
      ))}
    </div>
  );
}

// ── Home (main) ───────────────────────────────────────────────────────────────

export default function Home(): React.ReactElement {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState["type"] = "success"): void => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api
      .getFeaturedProducts(8)
      .then(setProducts)
      .catch(() => showToast("Failed to load products", "error"))
      .finally(() => setLoading(false));
  }, []);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = useCallback(
    async (product: Product): Promise<void> => {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        await addToCart(product.id, 1);
        showToast(`"${product.name}" added to cart`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add to cart";
        showToast(message, "error");
      }
    },
    [addToCart, navigate, user]
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero />
      <BrandsStrip />

      {/* Featured Products */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-amber-600 text-sm font-bold uppercase tracking-[4px]">
                Handpicked For You
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-stone-800 mt-1">
                Featured Products
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full mt-4" />
            </div>
            <button
              onClick={() => navigate("/category")}
              className="text-amber-600 hover:text-amber-800 font-bold text-sm underline underline-offset-4 transition-colors"
            >
              View All Products →
            </button>
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : products.length === 0 ? (
            <p className="text-center text-stone-400 py-20 text-lg">
              No products available right now.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item) => (
                <ProductCard key={item.id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Services />
      <Footer />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}