import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { userApi, type WishlistItem } from "../../utils/userApi";
import { formatLkr } from "../../utils/currency";
import { useCart } from "../../hooks/CartContext";

export default function WishlistPanel() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setItems(await userApi.getWishlist());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (productId: number) => {
    const ok = await userApi.removeFromWishlist(productId);
    if (ok) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      toast.success("Removed from wishlist");
    } else {
      toast.error("Could not remove item");
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    setAddingId(item.productId);
    try {
      await addToCart(item.productId, 1);
      toast.success(`"${item.name}" added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
        <Heart size={40} className="mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 font-medium">Your wishlist is empty</p>
        <p className="text-stone-400 text-sm mt-1">Save products you love for later</p>
        <button
          onClick={() => navigate("/user/category")}
          className="mt-4 bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-amber-600"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-stone-100 overflow-hidden shadow-sm group hover:shadow-md transition"
        >
          <div
            className="h-44 overflow-hidden cursor-pointer bg-stone-50"
            onClick={() => navigate(`/product/details/${item.productId}`)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
          <div className="p-4">
            <h3
              className="font-semibold text-stone-800 text-sm line-clamp-2 cursor-pointer hover:text-amber-700"
              onClick={() => navigate(`/product/details/${item.productId}`)}
            >
              {item.name}
            </h3>
            {item.price != null && item.price > 0 && (
              <p className="font-bold text-amber-700 text-sm mt-1">{formatLkr(item.price)}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleAddToCart(item)}
                disabled={addingId === item.productId}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-60"
              >
                <ShoppingCart size={13} />
                {addingId === item.productId ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={() => handleRemove(item.productId)}
                className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
