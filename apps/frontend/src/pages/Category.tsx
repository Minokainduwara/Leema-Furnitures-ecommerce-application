import { useState } from "react";
import CategoryBanner from "../../components/Category-Componanent/CategoryBanner";
import ProductCard from "../../components/Category-Componanent/ProductCard";
import FilterBar, { PRICE_RANGES } from "../../components/Category-Componanent/FilterBar";
import { PRODUCTS } from "../../data/Product";
import type { Product } from "../../types/Product";

// Calculate discounted price
const getDiscountedPrice = (price: number, discount: number) =>
  Math.round(price * (1 - discount / 100));

export default function CategoryPage() {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [priceIdx, setPriceIdx] = useState<number>(0);
  const [type, setType] = useState<string>("All");

  const filtered: Product[] = PRODUCTS.filter((p) => {
    const finalPrice = getDiscountedPrice(p.price, p.discount);
    const matchesCategory = category === "All" || p.category === category;
    const matchesPrice =
      finalPrice >= (PRICE_RANGES[priceIdx]?.min ?? PRICE_RANGES[0].min) &&
      finalPrice <= (PRICE_RANGES[priceIdx]?.max ?? PRICE_RANGES[0].max);
    const matchesType = type === "All" || p.type === type;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sub.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesPrice && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
     
      <CategoryBanner />

      <FilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        priceIdx={priceIdx}
        setPriceIdx={setPriceIdx}
        type={type}
        setType={setType}
      />

      <div className="max-w-6xl mx-auto px-5 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-4">🛋️</p>
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}