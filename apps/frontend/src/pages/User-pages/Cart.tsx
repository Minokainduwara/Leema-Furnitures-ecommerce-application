import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  line_total: number;
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
  const updateQuantity = async (product_id: number, quantity: number) => {
    try {
      await fetch(`${API_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, quantity }),
      });

      fetchCart();
    } catch {
      toast.error("Failed to update cart");
    }
  };

  // Remove item
  const removeItem = async (product_id: number) => {
    try {
      await fetch(`${API_URL}/cart/item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id }),
      });

      toast.success("Item removed");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-center mb-6">Your Cart</h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">Cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">
                    Product #{item.product_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rs. {item.price}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Line total */}
                <p className="font-semibold">
                  Rs. {item.line_total}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total */}
            <div className="border-t pt-4 text-right">
              <p className="text-lg font-bold">
                Total: Rs. {total}
              </p>
            </div>
            
          </div>
        )}
        <button
              onClick={() => window.location.href = "/checkout"}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg">
              Proceed to Checkout
            </button>
      </div>
    </div>
  );
}

export default Cart;