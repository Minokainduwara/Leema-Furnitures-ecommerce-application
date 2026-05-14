import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return; // Prevent negative quantity
    
    try {
      await fetch(`${API_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      fetchCart();
    } catch {
      toast.error("Failed to update cart");
    }
  };

  // Remove item
  const removeItem = async (productId: number) => {
    try {
      await fetch(`${API_URL}/cart/item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      toast.success("Item removed");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 pb-24 bg-stone-50 px-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-stone-200 w-full max-w-3xl">
        <h2 className="text-3xl font-black text-stone-900 mb-8 pb-5 border-b border-stone-100">
          Your Cart
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-4xl mb-4">
              🛒
            </div>
            <p className="text-stone-700 text-lg font-bold mb-2">Cart is empty</p>
            <p className="text-stone-500 mb-8">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => window.location.href = "/"}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-white hover:border-amber-200 hover:shadow-md transition-all duration-200 gap-4"
                >
                  <div className="flex-1">
                    <p className="font-bold text-stone-900 text-lg line-clamp-2">
                      {item.productName}
                    </p>
                    <p className="text-sm text-stone-500 font-medium mt-0.5">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-stone-50 text-stone-700 hover:bg-stone-200 rounded-md font-bold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="w-10 text-center font-bold text-stone-800">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-stone-50 text-stone-700 hover:bg-stone-200 rounded-md font-bold transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="w-24 text-right">
                      <p className="font-black text-amber-600 text-lg">
                        Rs. {item.lineTotal.toLocaleString()}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Area */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-stone-500 font-medium mb-1">Subtotal</p>
                <p className="text-3xl font-black text-stone-900">
                  Rs. {total.toLocaleString()}
                </p>
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.href = "/"}
                  className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition-colors text-center w-full sm:w-auto"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => window.location.href = "/checkout"}
                  className="px-8 py-3.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-center w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;