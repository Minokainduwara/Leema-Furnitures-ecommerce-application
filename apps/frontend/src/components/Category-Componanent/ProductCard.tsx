import type { Product } from "../../types/Product";
import React from "react";
import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "../../utils/wishlistApi";
import { useState } from "react";
import toast from "react-hot-toast";
  

interface ProductCardProps {
  product: Product;
} 



export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const finalPrice = Math.round(
    product.price * (1 - product.discount / 100)
  );

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition hover:-translate-y-1 cursor-pointer">

      <div className="relative h-48 bg-gray-100 overflow-hidden z-0">
        <button
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        const res = await addToWishlist(product.id);

if (!res.ok) {
  throw new Error("Failed");
}

setIsWishlisted(true);
toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Wishlist failed");
    }
  }}
  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow z-20"
>
    <Heart
      size={16}
      className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"}
    />
  </button>
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