import React from "react";
import { ShoppingCart, Star } from "lucide-react";
import { PRODUCTS } from "../data/Product";

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Products
          </h1>
          <p className="text-lg md:text-xl">
            Discover our premium furniture collection
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => {
            const discountedPrice =
              product.price -
              (product.price * product.discount) / 100;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="h-64 overflow-hidden bg-stone-100">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-amber-600 font-medium">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-stone-500 mb-3">
                    {product.type} • {product.sub}
                  </p>

                  {/* Rating Mock */}
                  <div className="flex items-center gap-1 mb-4">
                    <Star
                      size={16}
                      className="text-amber-400 fill-amber-400"
                    />
                    <span className="text-sm text-stone-600">
                      4.8
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl font-bold text-amber-600">
                      Rs. {discountedPrice.toLocaleString()}
                    </span>

                    {product.discount > 0 && (
                      <>
                        <span className="text-sm line-through text-stone-400">
                          Rs. {product.price.toLocaleString()}
                        </span>

                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Button */}
                  <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;