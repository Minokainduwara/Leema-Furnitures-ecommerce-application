import type { Product } from "../../../types/Product";
import React, { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const finalPrice = Math.round(
    product.price * (1 - product.discount / 100)
  );

  const [wishlisted, setWishlisted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("leema_wishlist");
      if (!raw) return;
      const list: string[] = JSON.parse(raw);
      setWishlisted(list.includes(String(product.id)));
    } catch (e) {}
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const raw = localStorage.getItem("leema_wishlist");
      const list: string[] = raw ? JSON.parse(raw) : [];
      const idStr = String(product.id);
      const exists = list.includes(idStr);
      const next = exists
        ? list.filter((x) => x !== idStr)
        : [...list, idStr];

      localStorage.setItem("leema_wishlist", JSON.stringify(next));
      setWishlisted(!exists);
    } catch (err) {
      console.error("wishlist toggle failed", err);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition hover:-translate-y-1 cursor-pointer">

      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white"
          style={{ backdropFilter: "blur(4px)" }}
        >
          {wishlisted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657 3.172 11.83a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4 4 0 015.656 0L12 8.343l2.026-2.025a4 4 0 115.656 5.657L12 21.657 4.318 13.975a4 4 0 010-5.657z" />
            </svg>
          )}
        </button>

        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-black text-xs px-2 py-1 rounded">
            {product.discount}%
          </div>
        )}

        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      <div className="p-4">
        {/* ✅ Product name changed to black */}
        <h3 className="font-semibold text-sm text-black truncate">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-2">
          {product.sub}
        </p>

        <p className="font-bold text-[#274910]">
          LKR {finalPrice.toLocaleString()}
        </p>

        <button className="mt-3 bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold">
          Add Cart
        </button>
      </div>
    </div>
  );
}