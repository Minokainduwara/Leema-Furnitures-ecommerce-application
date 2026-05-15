import React, { useEffect, useState } from "react";
import { CreditCard, Truck, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/CartContext";
import toast from "react-hot-toast";

import api from "../api/client";

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface CartResponse {
  items: CartItem[];
  total: number;
  totalWeightKg: number;
  shippingCost: number;
  grandTotal: number;
}

const CheckoutPage: React.FC = () => {

  const navigate = useNavigate();
  const { fetchCart: refreshCart } = useCart();

  const [cart, setCart] = useState<CartResponse>({
    items: [],
    total: 0,
  });

  const [checkoutData, setCheckoutData] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    apartmentSuite: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "Sri Lanka",
    paymentMethod: "COD",
    customerNotes: "",
  });

  // ============================================
  // FETCH CART
  // ============================================

  const fetchCart = async () => {
    try {
      const response = await api.get("cart").json<CartResponse>();

      setCart(response);
    } catch {
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ============================================
  // HANDLE INPUT
  // ============================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ============================================
  // SUBMIT CHECKOUT
  // ============================================

  const handleCheckout = async () => {

    if (
      !form.fullName?.trim() ||
      !form.phoneNumber?.trim() ||
      !form.email?.trim() ||
      !form.streetAddress?.trim() ||
      !form.city?.trim() ||
      !form.postalCode?.trim() ||
      !form.country?.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // ============================================
      // CASH ON DELIVERY
      // ============================================

      if (form.paymentMethod === "COD") {

        const response = await api
          .post("checkout", {
            json: form,
          })
          .json<any>();

        setCheckoutData(response);

        await refreshCart();

        toast.success("Order placed successfully");

        navigate(
          `/user/order-success/${response.orderNumber}`,
          {
            state: {
              orderId: response.orderId,
            },
          }

        );

        return;
      }

      // ============================================
      // PAYHERE
      // ============================================

      if (form.paymentMethod === "PAYHERE") {

        const checkoutResponse = await api
          .post("checkout", {
            json: form,
          })
          .json<any>();

        const payhereResponse = await api
          .post("payment/payhere/init", {
            json: {
              orderId: checkoutResponse.orderId,
            },
          })
          .json<any>();

        console.log("PayHere Payload:", payhereResponse);

        await refreshCart();

        toast.success("Redirecting to PayHere...");

        // Temporary placeholder
        setTimeout(() => {

          alert("PayHere integration coming soon");

        }, 1000);

        return;
      }

    } catch (error: any) {

      if (error.response) {

        const data = await error.response.json();

        toast.error(
          data.message || "Checkout failed"
        );

    } else {
      toast.error("Checkout failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* SHIPPING */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-6">
              Shipping Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700"
              />

              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700 md:col-span-2"
              />

              <input
                type="text"
                name="streetAddress"
                placeholder="Street Address"
                value={form.streetAddress}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700 md:col-span-2"
              />

              <input
                type="text"
                name="apartmentSuite"
                placeholder="Apartment / Suite"
                value={form.apartmentSuite}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700"
              />

              <input
                type="text"
                name="stateProvince"
                placeholder="Province"
                value={form.stateProvince}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700"
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={handleChange}
                className="border border-stone-300 rounded-xl px-4 py-3 text-stone-700"
              />

            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">

              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    paymentMethod: "COD",
                  }))
                }
                className={`w-full border rounded-2xl p-4 flex items-center gap-4 transition ${
                  form.paymentMethod === "COD"
                    ? "border-amber-500 bg-amber-50"
                    : "border-stone-200"
                }`}
              >
                <Truck className="text-amber-600" />
                <div className="text-left">
                  <p className="font-semibold text-stone-800">
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-stone-500">
                    Pay when your order arrives
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    paymentMethod: "PAYHERE",
                  }))
                }
                className={`w-full border rounded-2xl p-4 flex items-center gap-4 transition ${
                  form.paymentMethod === "PAYHERE"
                    ? "border-amber-500 bg-amber-50"
                    : "border-stone-200"
                }`}
              >
                <CreditCard className="text-amber-600" />

                <div className="text-left">
                  <p className="font-semibold text-stone-800">
                    PayHere
                  </p>

                  <p className="text-sm text-stone-500">
                    Online payment gateway
                  </p>
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white text-black rounded-2xl shadow-sm p-6 sticky top-6">

            <h2 className="text-xl font-bold text-stone-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">

              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <div>
                    <p className="font-medium text-stone-700">
                      {item.productName}
                    </p>

                    <p className="text-stone-400">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-stone-700">
                    Rs. {item.lineTotal.toFixed(2)}
                  </p>
                </div>
              ))}

            </div>

            <div className="border-t pt-4 space-y-2">

              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>

                <span className="font-semibold">
                  Rs. {cart.total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-600">Shipping</span>

                <span className="font-semibold">
                  Rs. {(cart.shippingCost ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total</span>

                <span className="text-amber-600">
                  Rs. {(cart.grandTotal ?? cart.total).toFixed(2)}
                </span>
              </div>

            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-semibold transition"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
