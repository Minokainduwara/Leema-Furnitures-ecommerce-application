import { useState, useEffect } from "react";
import CategoryBanner from "../../components/Category-Componanent/CategoryBanner";
import ProductCard from "../../components/Category-Componanent/ProductCard";
import FilterBar, {
  PRICE_RANGES,
} from "../../components/Category-Componanent/FilterBar";
import type { Product } from "../../types/Product";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/api";
export default function CategoryPage() {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [priceIdx, setPriceIdx] = useState<number>(0);
  const [type, setType] = useState<string>("All");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]); // ✅ NEW
  const [loading, setLoading] = useState<boolean>(true);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
  const loadProducts = async () => {
    setLoading(true);

    try {
      const res = await authFetch("http://localhost:8080/api/products");

      console.log("STATUS:", res.status);

      // ❗ handle 403 / 401 properly
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API ERROR RESPONSE:", errorText);
        throw new Error(`Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();

      console.log("PRODUCTS RAW:", data);

      const formattedData: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        sub: item.sku || "N/A",
        price: Number(item.finalPrice ?? item.price),
        originalPrice: Number(item.price),
        discount: Number(item.discountValue ?? 0),

        category: item.category?.name || "Uncategorized",
        type: "All",

        // ✅ FIXED IMAGE (no double /uploads issue)
        img: item.image
          ? `http://localhost:8080/${item.image.replace(/^\/+/, "")}`
          : "/placeholder.png",
      }));

      setProducts(formattedData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, []);

  // =========================
  // FETCH CATEGORIES (FROM BACKEND)
  // =========================
 useEffect(() => {
  authFetch("http://localhost:8080/api/categories")
    .then((res) => res.json())
    .then((data) => {
      console.log("CATEGORIES RAW:", data);

      // ✅ SAFE NORMALIZATION
      const names = Array.isArray(data)
        ? data.map((c: any) => String(c?.name ?? ""))
        : [];

      const clean = names.filter((n) => n !== "");

      setCategories(["All", ...clean]);
    })
    .catch((err) => console.error("Category fetch error:", err));
}, []);

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filtered: Product[] = products.filter((p) => {
    const finalPrice = p.price;

    const matchesCategory =
      category === "All" || p.category.toLowerCase() === category.toLowerCase();

    const matchesPrice =
      finalPrice >= (PRICE_RANGES[priceIdx]?.min ?? 0) &&
      finalPrice <= (PRICE_RANGES[priceIdx]?.max ?? Infinity);

    const matchesType = type === "All" || p.type === type;

    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sub.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesPrice && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-3xl font-bold">Explore Products</h1>
          <p className="text-gray-300 mt-1">
            Browse, filter and discover the best furniture for your space
          </p>
        </div>
      </div>

      {/* BANNER */}
      <div className="max-w-6xl mx-auto px-5 mt-6">
        <CategoryBanner />
      </div>

      {/* FILTER BAR (UNCHANGED UI) */}
      <div className="max-w-6xl mx-auto px-5 mt-6">
        <div className="bg-white shadow-md rounded-xl border p-4">
          <FilterBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            priceIdx={priceIdx}
            setPriceIdx={setPriceIdx}
            type={type}
            setType={setType}
            categories={categories} // ✅ ONLY ADDITION
          />
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow border">
            <p className="text-5xl mb-4">🛋️</p>
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <>
            {/* RESULT HEADER */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-700 font-medium">
                Showing <span className="text-gray-900">{filtered.length}</span>{" "}
                products
              </p>

              <div className="text-sm text-gray-500">Filtered results</div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <Link to={`/product/details/${product.id}`} key={product.id}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition border">
                    <ProductCard product={product} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
