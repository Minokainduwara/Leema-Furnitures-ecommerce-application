import React from 'react';
import { authFetch } from '../../utils/api';
import { useParams, Link, useNavigate } from "react-router-dom";
export default function AddToCartPage() {
  const [cartItems, setCartItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCart();
  }, []);

  // =========================================
  // FETCH CART
  // =========================================

  const fetchCart = async () => {
    try {
      const response = await authFetch(
        'http://localhost:8080/api/cart'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();

      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UPDATE QUANTITY
  // =========================================

  const updateQuantity = async (
    itemId: number,
    productId: number,
    quantity: number
  ) => {
    if (quantity < 1) return;

    try {
      const item = cartItems.find(
        (i) => i.productId === productId
      );

      await authFetch(
        `http://localhost:8080/api/cart/update/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity,
            addedPrice: item?.addedPrice || 0,
          }),
        }
      );

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================
  // REMOVE ITEM
  // =========================================

  const removeItem = async (itemId: number) => {
    try {
      await authFetch(
        `http://localhost:8080/api/cart/remove/${itemId}`,
        {
          method: 'DELETE',
        }
      );

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================
  // TOTALS
  // =========================================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.addedPrice || 0) * item.quantity,
    0
  );

  const shipping = 0;

  const total = subtotal + shipping;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* HEADER */}

      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-3xl font-bold text-gray-900">
            Leema Furniture
          </h1>

          <div className="flex items-center gap-4">

            <button className="text-gray-700 hover:text-black transition">
              Home
            </button>

            <button className="text-gray-700 hover:text-black transition">
              Products
            </button>

            <button className="bg-black text-white px-5 py-2 rounded-lg">
              Cart
            </button>

          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="text-center mb-10">

          <h2 className="text-5xl font-bold text-gray-900 mb-3">
            Shopping Cart
          </h2>

          <p className="text-gray-500 text-lg">
            Review your items before checkout
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE */}

          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">

            <div className="hidden md:grid grid-cols-5 border-b pb-4 mb-6 text-gray-500 font-semibold uppercase text-sm tracking-wide">

              <p className="col-span-2">
                Product
              </p>

              <p>Price</p>

              <p>Quantity</p>

              <p>Subtotal</p>

            </div>

            {loading ? (

              <div className="text-center py-12 text-gray-500">
                Loading cart...
              </div>

            ) : cartItems.length === 0 ? (

              <div className="text-center py-12 text-gray-500">
                Your cart is empty
              </div>

            ) : (

              cartItems.map((item) => (

                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center border-b py-6"
                >

                  {/* PRODUCT */}

                  <div className="md:col-span-2 flex items-center gap-5">

                    <img
                      src={`http://localhost:8080${item.image}`}
                      alt={item.productName}
                      className="w-28 h-28 rounded-xl object-cover border"
                    />

                    <div>
<p className="text-sm text-green-600 mt-1">
  Available Stock: {item.stock}
</p>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.productName}
                      </h3>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-3 text-white  bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition text-sm"
                      >
                        Remove Item
                      </button>

                    </div>
                  </div>

                  {/* PRICE */}

                  <div>

                    <p className="text-lg font-semibold text-gray-800">
                      Rs {Number(item.addedPrice).toLocaleString()}
                    </p>

                  </div>

                  {/* QUANTITY */}

                  <div>

                    <div className="flex items-center border rounded-lg w-fit overflow-hidden">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-800"
                      >
                        -
                      </button>

                      <span className="px-5 py-2 font-medium text-gray-500">
                        {item.quantity}
                      </span>

                      <button
  disabled={item.quantity >= item.stock}
  onClick={() =>
    updateQuantity(
      item.id,
      item.productId,
      item.quantity + 1
    )
  }
  className={`px-4 py-2 ${
    item.quantity >= item.stock
      ? 'bg-gray-300 cursor-not-allowed'
      : 'bg-gray-600 hover:bg-gray-800'
  }`}
>
  +
</button>

                    </div>

                  </div>

                  {/* SUBTOTAL */}

                  <div>

                    <p className="text-xl font-bold text-black">
                      Rs{' '}
                      {(
                        Number(item.addedPrice) *
                        item.quantity
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              ))

            )}

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <button onClick={()=>navigate("/user/category")} className="border border-black text-black px-6 py-3 rounded-xl hover:bg-black hover:text-white transition font-medium">
                Continue Shopping
              </button>

              <button
                onClick={fetchCart}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Refresh Cart
              </button>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="bg-white rounded-2xl border shadow-sm p-8 h-fit sticky top-28">

            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Cart Totals
            </h3>

            <div className="space-y-5 border-b pb-6">

              <div className="flex items-center justify-between text-lg">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-700">
                  Rs {subtotal.toLocaleString()}
                </span>

              </div>

              <div className="flex items-center justify-between text-lg">

                <span className="text-gray-600">
                  Shipping
                </span>

                <span className="font-semibold text-gray-700">
                  Rs {shipping.toLocaleString()}
                </span>

              </div>

            </div>

            <div className="flex items-center justify-between mt-6 mb-8">

              <span className="text-2xl font-bold">
                Total
              </span>

              <span className="text-3xl font-bold text-black">
                Rs {total.toLocaleString()}
              </span>

            </div>

            <button  onClick={() => navigate("/checkout")} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4 rounded-xl transition">
              Proceed to Checkout
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}