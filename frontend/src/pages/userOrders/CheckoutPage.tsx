import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    apartmentSuite: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "Sri Lanka",
    isDefault: true,
  });

  const [billingData, setBillingData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    apartmentSuite: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "Sri Lanka",
    isDefault: true,
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [customerNotes, setCustomerNotes] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await authFetch(
        "http://localhost:8080/api/cart"
      );

      const data = await response.json();

      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = useMemo(() => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (total: number, item: any) =>
        total + item.addedPrice * item.quantity,
      0
    );
  }, [cart]);

  const shippingCost = 0;

  const total = subtotal + shippingCost;

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBillingData({
      ...billingData,
      [e.target.name]: e.target.value,
    });
  };

  const createShippingAddress = async () => {
    const userId = localStorage.getItem("userId");

    const response = await authFetch(
      `http://localhost:8080/api/addresses/shipping?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shippingData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create shipping address");
    }

    const data = await response.json();

    return data.data.id;
  };

  const createBillingAddress = async () => {
    const userId = localStorage.getItem("userId");

    const payload = sameAsShipping
      ? shippingData
      : billingData;

    const response = await authFetch(
      `http://localhost:8080/api/addresses/billing?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create billing address");
    }

    const data = await response.json();

    return data.data.id;
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);

      const shippingAddressId =
        await createShippingAddress();

      const billingAddressId =
        await createBillingAddress();

      const response = await authFetch(
        "http://localhost:8080/api/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  fullName: shippingData.fullName,
  phoneNumber: shippingData.phoneNumber,
  email: shippingData.email,
  streetAddress: shippingData.streetAddress,
  apartmentSuite: shippingData.apartmentSuite,
  city: shippingData.city,
  stateProvince: shippingData.stateProvince,
  postalCode: shippingData.postalCode,
  country: shippingData.country,

  paymentMethod,
  customerNotes,
}),
        }
      );

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();

console.log(data);

alert("Order placed successfully");

navigate(`/ordersuccess/${data.orderId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const inputStyle =
    "w-full bg-white border border-gray-700 text-gray-700 rounded-2xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition placeholder:text-gray-500";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="text-white text-lg mt-5 font-medium">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="uppercase tracking-[5px] text-orange-500 text-sm font-semibold mb-4">
            Leema Furniture
          </p>

          <h1 className="text-5xl font-black mb-4">
            Secure Checkout
          </h1>

          <p className="text-gray-400 text-lg">
            Complete your order and enjoy premium furniture delivered to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* SHIPPING */}
            <div className="bg-white border rounded-[30px] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-bold">
                  1
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Shipping Address
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    Enter your delivery details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleShippingChange}
                    className={inputStyle}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phoneNumber"
                    value={shippingData.phoneNumber}
                    onChange={handleShippingChange}
                    className={inputStyle}
                    placeholder="0771234567"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={shippingData.email}
                  onChange={handleShippingChange}
                  className={inputStyle}
                  placeholder="example@gmail.com"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Street Address
                </label>

                <input
                  type="text"
                  name="streetAddress"
                  value={shippingData.streetAddress}
                  onChange={handleShippingChange}
                  className={inputStyle}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Apartment / Suite
                </label>

                <input
                  type="text"
                  name="apartmentSuite"
                  value={shippingData.apartmentSuite}
                  onChange={handleShippingChange}
                  className={inputStyle}
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={shippingData.city}
                    onChange={handleShippingChange}
                    className={inputStyle}
                    placeholder="Colombo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Province
                  </label>

                  <input
                    type="text"
                    name="stateProvince"
                    value={shippingData.stateProvince}
                    onChange={handleShippingChange}
                    className={inputStyle}
                    placeholder="Western"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={shippingData.postalCode}
                    onChange={handleShippingChange}
                    className={inputStyle}
                    placeholder="11500"
                  />
                </div>
              </div>
            </div>

            {/* BILLING */}
            <div className="bg-[#181818] border border-gray-800 rounded-[30px] p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-bold">
                    2
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Billing Address
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      Billing information for your payment
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-3 bg-[#232323] px-4 py-3 rounded-2xl border border-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) =>
                      setSameAsShipping(e.target.checked)
                    }
                    className="w-4 h-4 accent-orange-500"
                  />

                  <span className="text-sm font-medium text-gray-300">
                    Same as shipping
                  </span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={billingData.fullName}
                        onChange={handleBillingChange}
                        className={inputStyle}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phoneNumber"
                        value={billingData.phoneNumber}
                        onChange={handleBillingChange}
                        className={inputStyle}
                        placeholder="0771234567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={billingData.email}
                      onChange={handleBillingChange}
                      className={inputStyle}
                      placeholder="example@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Street Address
                    </label>

                    <input
                      type="text"
                      name="streetAddress"
                      value={billingData.streetAddress}
                      onChange={handleBillingChange}
                      className={inputStyle}
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-[#181818] border border-gray-800 rounded-[30px] p-8 h-fit sticky top-5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-white">
                  Order Summary
                </h2>

                <p className="text-gray-400 mt-1 text-sm">
                  Review your items before checkout
                </p>
              </div>

              <div className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-2xl text-sm font-semibold border border-orange-500/30">
                {cart?.items?.length || 0} Items
              </div>
            </div>

            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart?.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-[#222222] rounded-3xl p-4 border border-gray-800 flex gap-4"
                >
                  <img
                    src={`http://localhost:8080${item.image}`}
                    alt={item.productName}
                    className="w-24 h-24 rounded-2xl object-cover border border-gray-700"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white line-clamp-2">
                      {item.productName}
                    </h3>

                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">
                        Qty: {item.quantity}
                      </span>

                      <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                        Stock: {item.stock}
                      </span>
                    </div>

                    <div className="mt-4 text-2xl font-black text-orange-400">
                      Rs {(item.addedPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8 space-y-5">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>

                <span className="font-semibold text-white">
                  Rs {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Shipping Fee</span>

                <span className="font-semibold text-white">
                  Rs {shippingCost.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-5 flex justify-between items-center">
                <span className="text-xl font-bold">
                  Total Amount
                </span>

                <span className="text-3xl font-black text-orange-400">
                  Rs {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-white mb-5">
                Payment Method
              </h3>

              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-5 rounded-3xl border cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-700 bg-[#222222]"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-orange-500"
                  />

                  <div>
                    <p className="font-bold text-white text-lg">
                      Cash On Delivery
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Pay when your order arrives at your doorstep.
                    </p>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-5 rounded-3xl border cursor-pointer transition ${
                  paymentMethod === "KOKO"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-700 bg-[#222222]"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "KOKO"}
                    onChange={() => setPaymentMethod("KOKO")}
                    className="accent-orange-500"
                  />

                  <div>
                    <p className="font-bold text-white text-lg">
                      KOKO Pay
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Buy now and pay later. Coming soon.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Customer Notes
              </label>

              <textarea
                rows={4}
                placeholder="Add delivery notes or special instructions"
                value={customerNotes}
                onChange={(e) =>
                  setCustomerNotes(e.target.value)
                }
                className="w-full bg-[#1b1b1b] border border-gray-700 text-white rounded-2xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition resize-none placeholder:text-gray-500"
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full mt-10 bg-orange-500 hover:bg-orange-600 text-black font-black py-5 rounded-3xl text-xl transition-all duration-300 shadow-none hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placingOrder
                ? "Placing Order..."
                : `Place Order • Rs ${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
