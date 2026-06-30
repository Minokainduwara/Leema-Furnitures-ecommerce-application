import { useState, useEffect, useCallback, useMemo } from "react";
import CategoryBanner from "../../components/Category-Componanent/CategoryBanner";
import ProductCard from "../../components/Category-Componanent/ProductCard";
import type { Product } from "../../types/Product";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/api";
import { Search, SlidersHorizontal, X } from "lucide-react";

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #e7e5e4 25%, #d6d3d1 50%, #e7e5e4 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s ease infinite;
  }
`;

// ── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-2/3 rounded-full" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-5 w-1/3 rounded-full" />
          <div className="skeleton h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const [search, setSearch]       = useState<string>("");
  const [category, setCategory]   = useState<string>("All");

  const [products, setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading]     = useState<boolean>(true);

  // ── Price Filter State ──────────────────────────────────────────────────────
  const PRICE_STEP = 500;
  const PRICE_MIN = 0;
  const PRICE_MAX = 500000;

  const [priceMin, setPriceMin] = useState<number>(PRICE_MIN);
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX);

  const clamp = useCallback((v: number, min = PRICE_MIN, max = PRICE_MAX) => {
    return Math.max(min, Math.min(max, Math.round(v)));
  }, []);

  const decMin = useCallback(() => setPriceMin((p) => clamp(p - PRICE_STEP, PRICE_MIN, priceMax)), [clamp, priceMax]);
  const incMin = useCallback(() => setPriceMin((p) => clamp(p + PRICE_STEP, PRICE_MIN, priceMax)), [clamp, priceMax]);
  const decMax = useCallback(() => setPriceMax((p) => clamp(p - PRICE_STEP, priceMin, PRICE_MAX)), [clamp, priceMin]);
  const incMax = useCallback(() => setPriceMax((p) => clamp(p + PRICE_STEP, priceMin, PRICE_MAX)), [clamp, priceMin]);

  // ── Fetch Initial Data ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch categories and products simultaneously
        const [catsRes, prodsRes] = await Promise.all([
          authFetch("http://localhost:8080/api/categories"),
          authFetch("http://localhost:8080/api/products")
        ]);

        if (!catsRes.ok || !prodsRes.ok) throw new Error("Failed to fetch data");

        const catsData = await catsRes.json();
        const prodsData = await prodsRes.json();

        // 1. Build category map for quick lookup
        const catMap: Record<string | number, string> = {};
        const catNames: string[] = ["All"];
        
        if (Array.isArray(catsData)) {
          catsData.forEach((c: any) => {
            const name = String(c?.name || c?.categoryName || "").trim();
            if (name && c?.id) {
              catMap[c.id] = name;
              catNames.push(name);
            }
          });
        }
        setCategories(catNames);

        // 2. Format products with reliable categories
        const formatted: Product[] = prodsData.map((item: any) => {
          let catName = "Uncategorized";
          
          // Try to derive the category name safely from various formats
          if (item?.category?.name) {
            catName = String(item.category.name);
          } else if (typeof item?.category === "string") {
            catName = item.category;
          } else if (item?.categoryId && catMap[item.categoryId]) {
            catName = catMap[item.categoryId];
          } else if (item?.category_id && catMap[item.category_id]) {
            catName = catMap[item.category_id];
          } else if (item?.category?.id && catMap[item.category.id]) {
            catName = catMap[item.category.id];
          }
          
          return {
            id: item.id,
            name: item.name || "",
            sub: item.sku || "N/A",
            price: Number(item.finalPrice ?? item.price ?? 0),
            originalPrice: Number(item.price ?? 0),
            discount: Number(item.discountValue ?? 0),
            category: catName,
            type: "All",
            img: item.image
              ? `http://localhost:8080/${String(item.image).replace(/^\/+/, "")}`
              : "/placeholder.png",
          };
        });
        
        setProducts(formatted);
      } catch (err) {
        console.error("Failed to fetch products/categories:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered: Product[] = useMemo(() => {
    return products.filter((p) => {
      const pCat = String(p.category || "").toLowerCase().trim();
      const sCat = category.toLowerCase().trim();
      
      const matchesCategory = category === "All" || pCat === sCat;
      const matchesPrice = p.price >= priceMin && p.price <= priceMax;
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sub.toLowerCase().includes(search.toLowerCase());
        
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [products, category, priceMin, priceMax, search]);

  const hasActiveFilters = category !== "All" || priceMin !== PRICE_MIN || priceMax !== PRICE_MAX || search !== "";

  const clearAll = () => {
    setSearch("");
    setCategory("All");
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="min-h-screen bg-stone-50 text-stone-900">

        {/* ── Hero Banner ──────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden py-16 px-6"
          style={{
            background: "linear-gradient(135deg, #1c1917 0%, #431407 50%, #1c1917 100%)",
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.12) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)" }} />

          {/* Top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <div
            className="relative z-10 max-w-6xl mx-auto"
            style={{ animation: "fadeUp 0.6s ease both" }}
          >
            <span className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-black uppercase tracking-[5px] mb-4">
              <span className="h-px w-6 bg-amber-400/60" />
              Our Collection
              <span className="h-px w-6 bg-amber-400/60" />
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Explore Products
            </h1>
            <p className="text-stone-300 mt-2 text-base max-w-md">
              Browse, filter and discover the finest furniture for your space.
            </p>

            {/* Quick stats */}
            <div className="flex gap-6 mt-6">
              {[
                [String(products.length || "…"), "Items"],
                [String(Math.max(categories.length - 1, 0) || "…"), "Categories"],
                ["Free", "Delivery"],
              ].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col gap-0.5">
                  <span className="text-amber-400 font-black text-lg leading-none">{val}</span>
                  <span className="text-stone-400 text-[11px] tracking-wide">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category Banner ───────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-5 mt-6 text-stone-800">
          <CategoryBanner />
        </div>

        {/* ── Filter Bar ───────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-5 mt-5">
          <div
            className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4"
            style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="w-full pl-9 pr-9 py-2.5 text-sm text-stone-900 placeholder-stone-400 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition-all duration-200"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Category pills — scrollable on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none flex-nowrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex-shrink-0"
                      style={
                        category === cat
                          ? {
                              background: "linear-gradient(135deg,#f59e0b,#f97316)",
                              color: "#ffffff",
                              boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                            }
                          : {
                              background: "#f5f5f4",
                              color: "#44403c",
                            }
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-stone-600 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <X size={13} />
                    Clear
                  </button>
                )}
              </div>

              {/* Price filter UI */}
              <div className="flex gap-4 items-center flex-wrap pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-stone-500" />
                  <span className="text-sm font-semibold text-stone-700">Price:</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button onClick={decMin} className="px-2.5 py-1.5 bg-white text-stone-800 hover:bg-stone-100 border-r border-stone-200 transition-colors">−</button>
                    <input
                      type="number"
                      value={priceMin || 0}
                      min={PRICE_MIN}
                      max={priceMax}
                      step={PRICE_STEP}
                      onChange={(e) => setPriceMin(clamp(Number(e.target.value) || PRICE_MIN, PRICE_MIN, priceMax))}
                      className="w-20 py-1.5 text-xs text-center focus:outline-none bg-transparent text-stone-900"
                    />
                    <button onClick={incMin} className="px-2.5 py-1.5 bg-white text-stone-800 hover:bg-stone-100 border-l border-stone-200 transition-colors">+</button>
                  </div>
                  <span className="text-stone-500 text-sm">to</span>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button onClick={decMax} className="px-2.5 py-1.5 bg-white text-stone-800 hover:bg-stone-100 border-r border-stone-200 transition-colors">−</button>
                    <input
                      type="number"
                      value={priceMax || 0}
                      min={priceMin}
                      max={PRICE_MAX}
                      step={PRICE_STEP}
                      onChange={(e) => setPriceMax(clamp(Number(e.target.value) || PRICE_MAX, priceMin, PRICE_MAX))}
                      className="w-20 py-1.5 text-xs text-center focus:outline-none bg-transparent text-stone-900"
                    />
                    <button onClick={incMax} className="px-2.5 py-1.5 bg-white text-stone-800 hover:bg-stone-100 border-l border-stone-200 transition-colors">+</button>
                  </div>
                </div>

                <div className="flex-1 min-w-[150px] max-w-xs flex items-center gap-3 ml-2">
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={priceMax}
                    onChange={(e) => setPriceMax(clamp(Number(e.target.value)))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Products ─────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-5 py-8">

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (

            /* Empty state */
            <div
              className="flex flex-col items-center justify-center py-28 bg-white rounded-2xl border border-stone-200 shadow-sm"
              style={{ animation: "fadeUp 0.4s ease both" }}
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
                style={{ background: "linear-gradient(135deg,#fef3c7,#fed7aa)" }}
              >
                🛋️
              </div>
              <p className="text-stone-800 font-black text-lg">No products found</p>
              <p className="text-stone-500 text-sm mt-1.5 mb-6">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}
                >
                  Clear All Filters
                </button>
              )}
            </div>

          ) : (
            <>
              {/* Result header */}
              <div
                className="flex items-center justify-between mb-5"
                style={{ animation: "fadeUp 0.4s ease both" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-stone-600 text-sm">Showing</span>
                  <span
                    className="text-sm font-black px-2.5 py-0.5 rounded-lg text-amber-800"
                    style={{ background: "linear-gradient(135deg,#fef3c7,#fed7aa)" }}
                  >
                    {filtered.length}
                  </span>
                  <span className="text-stone-600 text-sm">
                    {filtered.length === 1 ? "product" : "products"}
                  </span>
                  {category !== "All" && (
                    <span className="text-stone-500 text-sm">in <span className="font-semibold text-stone-800">{category}</span></span>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-stone-500 hover:text-amber-600 font-semibold transition-colors flex items-center gap-1"
                  >
                    <X size={12} /> Clear filters
                  </button>
                )}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {filtered.map((product, i) => (
                  <Link to={`/product/details/${product.id}`} key={product.id}>
                    <div
                      className="bg-white rounded-2xl overflow-hidden border border-stone-200 transition-all duration-300 group text-stone-900"
                      style={{
                        animation: `cardIn 0.5s ease both`,
                        animationDelay: `${Math.min(i * 50, 400)}ms`,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(245,158,11,0.14), 0 4px 12px rgba(0,0,0,0.08)";
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgb(231,229,228)";
                      }}
                    >
                      <ProductCard product={product} />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}