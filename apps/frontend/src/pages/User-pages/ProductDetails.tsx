import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authFetch } from "../../utils/api";
import { useCart } from "../../hooks/CartContext";
import { useAuth } from "../../hooks/Authcontext";
import { ShoppingCart, Zap, Truck, Shield, RotateCcw, ArrowLeft, Tag } from "lucide-react";

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg,#e7e5e4 25%,#d6d3d1 50%,#e7e5e4 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s ease infinite;
  }
`;

// ── Info cards data ───────────────────────────────────────────────────────────

const INFO_CARDS = [
  { icon: Truck,     title: "Free Delivery",   desc: "Free delivery within selected areas", color: "#f59e0b" },
  { icon: Shield,    title: "10-Year Warranty", desc: "Full manufacturer warranty included",  color: "#f97316" },
  { icon: RotateCcw, title: "7-Day Returns",   desc: "Return if product is damaged",         color: "#f59e0b" },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonDetail() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="skeleton h-5 w-28 rounded-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton rounded-3xl h-[460px]" />
          <div className="bg-white rounded-3xl p-7 space-y-5 border border-stone-100">
            <div className="skeleton h-4 w-20 rounded-full" />
            <div className="skeleton h-8 w-3/4 rounded-full" />
            <div className="skeleton h-4 w-1/4 rounded-full" />
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-10 w-2/3 rounded-full mt-6" />
            <div className="skeleton h-12 w-full rounded-2xl mt-4" />
            <div className="skeleton h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [addingCart, setAddingCart] = useState(false);
  const [buyingNow,  setBuyingNow]  = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);

  const getImage = (img?: string) =>
    img ? `http://localhost:8080/${img.replace(/^\/+/, "")}` : "/placeholder.png";

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) { navigate("/login"); return; }
    setAddingCart(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.name}" added to cart`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to cart");
    } finally {
      setAddingCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate("/login"); return; }
    setBuyingNow(true);
    try {
      await addToCart(product.id, 1);
      navigate("/cart");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setBuyingNow(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setImgLoaded(false);
      try {
        const res1 = await authFetch(`http://localhost:8080/api/products/${id}`);
        if (!res1.ok) throw new Error("Product fetch failed");
        const data = await res1.json();
        setProduct({
          id:            data.id,
          name:          data.name,
          price:         data.finalPrice ?? data.price,
          originalPrice: data.price,
          description:   data.description || "Premium quality furniture designed for modern living spaces.",
          sku:           data.sku || "N/A",
          category:      data.category?.name || "Furniture",
          image:         getImage(data.image),
        });

        const res2 = await authFetch(`http://localhost:8080/api/products/${id}/related`);
        if (res2.ok) {
          const rel = await res2.json();
          setRelated(rel.map((item: any) => ({
            id:    item.id,
            name:  item.name,
            price: item.finalPrice ?? item.price,
            image: getImage(item.image),
          })));
        }
      } catch (err) {
        console.error("Product detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const discount = product && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading || !product) return <SkeletonDetail />;

  return (
    <>
      <style>{STYLES}</style>

      <div className="bg-stone-50 min-h-screen">

        {/* ── Back button ── */}
        <div
          className="max-w-6xl mx-auto px-4 pt-7 pb-2"
          style={{ animation: "fadeUp 0.4s ease both" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 text-sm font-semibold transition-colors duration-200 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
        </div>

        {/* ── Hero grid ── */}
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Image ── */}
          <div
            className="relative"
            style={{ animation: "fadeLeft 0.65s ease 0.05s both" }}
          >
            {/* Glow */}
            <div
              className="absolute -inset-3 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center,rgba(245,158,11,0.10) 0%,transparent 70%)",
                filter: "blur(16px)",
              }}
            />
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
              "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
              "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
              "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
            ].map((cls, i) => (
              <span key={i} className={`absolute w-7 h-7 border-amber-400/40 z-10 pointer-events-none ${cls}`} />
            ))}

            <div
              className="relative bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.09), 0 0 0 1px rgba(245,158,11,0.1)" }}
            >
              {!imgLoaded && <div className="skeleton absolute inset-0 h-[460px]" />}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className="w-full h-[460px] object-cover transition-opacity duration-500"
                style={{ opacity: imgLoaded ? 1 : 0 }}
              />
              {discount > 0 && (
                <div
                  className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl text-xs font-black text-white"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#f97316)",
                    boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
                  }}
                >
                  -{discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* ── Info ── */}
          <div
            className="bg-white rounded-2xl border border-stone-100 p-7 flex flex-col justify-between"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
              animation: "fadeRight 0.65s ease 0.1s both",
            }}
          >
            <div>
              {/* Category + SKU */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span
                  className="text-[10px] font-black uppercase tracking-[3px] px-2.5 py-1 rounded-lg"
                  style={{ background: "linear-gradient(135deg,#fef3c7,#fed7aa)", color: "#b45309" }}
                >
                  {product.category}
                </span>
                <span className="text-stone-400 text-xs flex items-center gap-1">
                  <Tag size={11} className="text-stone-400" />
                  SKU: <span className="text-stone-500 font-semibold ml-0.5">{product.sku}</span>
                </span>
              </div>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-2 my-5">
                <div className="h-px flex-1 bg-stone-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="h-px flex-1 bg-stone-100" />
              </div>

              {/* Description */}
              <p className="text-stone-500 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Price + actions */}
            <div className="mt-6 pt-6 border-t border-stone-100">
              {/* Price */}
              <div className="flex items-end gap-3 mb-6">
                <span
                  className="text-3xl font-black text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg,#92400e,#c2410c)" }}
                >
                  LKR {Number(product.price).toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-stone-400 line-through text-base pb-0.5">
                    LKR {Number(product.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingCart}
                  className="w-full py-3.5 rounded-2xl text-sm font-black border-2 border-stone-800 text-stone-800 bg-white hover:bg-stone-900 hover:text-white disabled:opacity-60 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  {addingCart ? (
                    <span className="inline-block w-4 h-4 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={buyingNow}
                  className="relative overflow-hidden group w-full py-3.5 rounded-2xl text-sm font-black text-white disabled:opacity-60 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#f97316)",
                    boxShadow: "0 6px 24px rgba(245,158,11,0.38)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {buyingNow ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={16} className="group-hover:scale-110 transition-transform duration-200" />
                        Buy Now
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info cards ── */}
        <div
          className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-5 mb-14"
          style={{ animation: "fadeUp 0.6s ease 0.25s both" }}
        >
          {INFO_CARDS.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-5 border border-stone-100 flex items-start gap-4 transition-all duration-300"
              style={{
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                animationDelay: `${i * 80}ms`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 10px 32px rgba(245,158,11,0.12)";
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
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#fef3c7,#fed7aa)" }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <h3 className="text-stone-800 font-black text-sm">{title}</h3>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div
            className="max-w-6xl mx-auto px-4 pb-16"
            style={{ animation: "fadeUp 0.6s ease 0.3s both" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div>
                <span className="text-amber-500 text-[11px] font-black uppercase tracking-[4px]">
                  You May Also Like
                </span>
                <h2 className="text-2xl font-black text-stone-900 mt-0.5">Related Products</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <Link to={`/product/details/${p.id}`} key={p.id}>
                  <div
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-100 transition-all duration-300"
                    style={{
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      animation: `cardIn 0.5s ease both`,
                      animationDelay: `${i * 60}ms`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "translateY(-5px)";
                      el.style.boxShadow = "0 16px 40px rgba(245,158,11,0.14)";
                      el.style.borderColor = "rgba(245,158,11,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "translateY(0)";
                      el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                      el.style.borderColor = "rgb(231,229,228)";
                    }}
                  >
                    <div className="overflow-hidden h-44 bg-stone-50 relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-stone-800 font-bold text-sm line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors duration-200">
                        {p.name}
                      </h3>
                      <p
                        className="font-black text-sm mt-2 text-transparent bg-clip-text"
                        style={{ backgroundImage: "linear-gradient(135deg,#92400e,#c2410c)" }}
                      >
                        LKR {Number(p.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;