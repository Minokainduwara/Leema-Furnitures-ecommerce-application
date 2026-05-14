import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import {
  getCart,
  removeFromCart,
  updateQty,
  subscribeCart,
  type CartItem,
} from "../../utils/cart";
import { isLoggedIn } from "../../utils/api";

const AddToCart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(getCart());

  useEffect(() => {
    const unsub = subscribeCart(() => setItems(getCart()));
    return () => unsub();
  }, []);

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!isLoggedIn()) {
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-stone-300" />
            <p className="text-stone-500 mt-4 mb-6">Your cart is empty.</p>
            <Link
              to="/user/category"
              className="inline-block bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-2xl p-4 flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl bg-amber-50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 truncate">{item.name}</p>
                    <p className="text-sm text-stone-500">
                      LKR {item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800 text-white hover:bg-black transition shadow-sm"
                        aria-label="Decrease"
                      >
                        <Minus size={16} strokeWidth={2.5} />
                      </button>
                      <span className="w-10 text-center font-bold text-stone-900 text-lg">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800 text-white hover:bg-black transition shadow-sm"
                        aria-label="Increase"
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-3">
                    <p className="font-bold text-green-600">
                      LKR {(item.price * item.qty).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white border rounded-2xl p-6 h-fit lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm text-stone-600 mb-2">
                <span>Subtotal</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600 mb-2">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t my-4" />
              <div className="flex justify-between font-bold text-stone-900 text-lg">
                <span>Total</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-black text-white font-semibold py-3 rounded-xl hover:bg-stone-800 transition"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/user/category"
                className="block text-center text-sm text-stone-500 hover:text-stone-700 mt-4"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
