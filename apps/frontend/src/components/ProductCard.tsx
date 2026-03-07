import type { Product } from "../types/Product";
import React from "react";

  

interface ProductCardProps {
  product: Product;
} 



export default function ProductCard({ product }: ProductCardProps) {
  const finalPrice = Math.round(
    product.price * (1 - product.discount / 100)
  );

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition hover:-translate-y-1 cursor-pointer">

      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
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
        <h3 className="font-semibold text-sm truncate">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-2">
          {product.sub}
        </p>

        <p className="font-bold text-[#2d5016]">
          LKR {finalPrice.toLocaleString()}
        </p>

        <button className="mt-3 bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold">
          Add Cart
        </button>
      </div>
    </div>
  );
}