import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryBanner from "../../components/User-Components/Category-Componanent/CategoryBanner";
import ProductCard from "../../components/User-Components/Category-Componanent/ProductCard";
import FilterBar, { PRICE_RANGES } from "../../components/User-Components/Category-Componanent/FilterBar";

import type { Product } from "../../types/Product";

// Calculate discounted price
const getDiscountedPrice = (price: number, discount: number) =>
    Math.round(price * (1 - discount / 100));

export default function CategoryPage() {
    const [search, setSearch] = useState<string>("");
    const [category, setCategory] = useState<string>("All");
    const [priceIdx, setPriceIdx] = useState<number>(0);
    const [type, setType] = useState<string>("All");
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then((res) => res.json())
            .then((data) => {
                const formattedData: Product[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    sub: item.sku || "N/A",
                    price: item.price,
                    discount: 0, // Backend doesn't provide discount in ProductResponse, defaulting to 0
                    category: item.categoryName || "Uncategorized",
                    type: "All", // Type not explicitly provided in response, setting default
                    img: item.image ? `http://localhost:8080/uploads/${item.image}` : ""
                }));
                setProducts(formattedData);
            })
            .catch((err) => console.error("Failed to fetch products:", err));
    }, []);

    const filtered: Product[] = products.filter((p) => {
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
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <ProductCard product={product} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}