import React, { useEffect, useState } from "react";
import { CreditCard, Truck } from "lucide-react";
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

// ============================================
// VALIDATION HELPERS
// ============================================

type FormFields = {
  fullName: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  apartmentSuite: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  customerNotes: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+94|0)\d{9}$/; // Sri Lankan: 0771234567 or +94771234567
const POSTAL_RE = /^\d{4,6}$/;

function validate(form: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!PHONE_RE.test(form.phoneNumber.replace(/[\s-]/g, ""))) {
    errors.phoneNumber = "Enter a valid Sri Lankan phone (e.g. 0771234567)";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!form.streetAddress.trim()) {
    errors.streetAddress = "Street address is required";
  }

  if (!form.city.trim()) {
    errors.city = "City is required";
  }

  if (!form.postalCode.trim()) {
    errors.postalCode = "Postal code is required";
  } else if (!POSTAL_RE.test(form.postalCode.trim())) {
    errors.postalCode = "Enter a valid postal code (4-6 digits)";
  }

  if (!form.country.trim()) {
    errors.country = "Country is required";
  }

  return errors;
}

// ============================================
// FIELD COMPONENT
// ============================================

interface FieldProps {
  type?: string;
  name: keyof FormFields;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  colSpan2?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FC<FieldProps> = ({
  type = "text",
  name,
  label,
  placeholder,
  value,
  error,
  required = false,
  colSpan2 = false,
  onChange,
}) => (
  <div className={colSpan2 ? "md:col-span-2" : ""}>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-stone-600 mb-1.5"
    >
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-xl px-4 py-3 text-stone-700 outline-none transition-colors focus:ring-2 focus:ring-amber-300 ${
        error
          ? "border-red-400 bg-red-50 focus:ring-red-300"
          : "border-stone-300 focus:border-amber-400"
      }`}
    />
    {error && (
      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ============================================
// CHECKOUT PAGE
// ============================================

const CheckoutPage: React.FC = () => {

  const navigate = useNavigate();
  const { fetchCart: refreshCart } = useCart();

const [cart, setCart] = useState<CartResponse>({
  items: [],
  total: 0,
  totalWeightKg: 0,
  shippingCost: 0,
  grandTotal: 0,
}); 

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormFields>({
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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Live-clear errors as the user types (only after first submit attempt)
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        const updated = { ...form, [name]: value };
        const fresh = validate(updated as FormFields);
        if (!fresh[name as keyof FormFields]) {
          delete next[name as keyof FormFields];
        } else {
          next[name as keyof FormFields] = fresh[name as keyof FormFields];
        }
        return next;
      });
    }
  };

  // ============================================
  // SUBMIT CHECKOUT
  // ============================================

  const handleCheckout = async () => {
    setSubmitted(true);

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted fields");

      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorField);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
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

        console.log("Checkout Response:", checkoutResponse);

        const payhereResponse = await api
          .post("payments/payhere/initiate", {
            json: {
              orderId: checkoutResponse.orderId,
            },
          })
          .json<any>();

        console.log("PayHere Payload:", payhereResponse);

        await refreshCart();

        // Stop the loading spinner before opening PayHere popup
        setLoading(false);

        toast.success("Redirecting to PayHere...");

        // @ts-ignore
        window.payhere.onCompleted = function onCompleted(orderId) {
          console.log("Payment completed. OrderID:" + orderId);
          navigate(`/user/order-success/${checkoutResponse.orderNumber}`, { state: { orderId: checkoutResponse.orderId } });
        };
        // @ts-ignore
        window.payhere.onDismissed = function onDismissed() {
          console.log("Payment dismissed");
          toast.error("Payment dismissed");
        };
        // @ts-ignore
        window.payhere.onError = function onError(error) {
          console.log("Error:"  + error);
          toast.error("Payment error");
        };
        
        const paymentData = {
            "sandbox": payhereResponse.sandbox,
            "merchant_id": payhereResponse.merchantId,
            "return_url": payhereResponse.returnUrl,
            "cancel_url": payhereResponse.cancelUrl,
            "notify_url": payhereResponse.notifyUrl,
            "order_id": payhereResponse.orderId,
            "items": "Order " + checkoutResponse.orderNumber,
            "amount": payhereResponse.amount,
            "currency": payhereResponse.currency,
            "hash": payhereResponse.hash,
            "first_name": form.fullName.split(" ")[0] || "Customer",
            "last_name": form.fullName.split(" ").slice(1).join(" ") || "",
            "email": form.email,
            "phone": form.phoneNumber,
            "address": form.streetAddress,
            "city": form.city,
            "country": form.country
        };
        
        // @ts-ignore
        window.payhere.startPayment(paymentData);

        return;
      }

    } catch (error: any) {

      let message = "Checkout failed";
      try {
        // ky v2 HTTPError may expose `.data` with the already-parsed body
        if (error.data && error.data.message) {
          message = error.data.message;
        } else if (error.response) {
          // Try to clone first, in case body was already consumed
          const cloned = error.response.clone?.() ?? error.response;
          const data = await cloned.json().catch(() => null);
          if (data?.message) {
            message = data.message;
          }
        } else if (error.message) {
          message = error.message;
        }
      } catch (_) {
        // ignore parse errors
      }

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ERROR COUNT for button hint
  // ============================================
  const errorCount = Object.keys(errors).length;

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

              <Field
                name="fullName"
                label="Full Name"
                placeholder="e.g. Kasun Perera"
                value={form.fullName}
                error={errors.fullName}
                required
                onChange={handleChange}
              />

              <Field
                name="phoneNumber"
                label="Phone Number"
                placeholder="e.g. 0771234567"
                value={form.phoneNumber}
                error={errors.phoneNumber}
                required
                onChange={handleChange}
              />

              <Field
                type="email"
                name="email"
                label="Email"
                placeholder="e.g. kasun@example.com"
                value={form.email}
                error={errors.email}
                required
                colSpan2
                onChange={handleChange}
              />

              <Field
                name="streetAddress"
                label="Street Address"
                placeholder="e.g. No. 42, Galle Road"
                value={form.streetAddress}
                error={errors.streetAddress}
                required
                colSpan2
                onChange={handleChange}
              />

              <Field
                name="apartmentSuite"
                label="Apartment / Suite"
                placeholder="(Optional)"
                value={form.apartmentSuite}
                onChange={handleChange}
              />

              <Field
                name="city"
                label="City"
                placeholder="e.g. Colombo"
                value={form.city}
                error={errors.city}
                required
                onChange={handleChange}
              />

              <Field
                name="stateProvince"
                label="Province"
                placeholder="e.g. Western"
                value={form.stateProvince}
                onChange={handleChange}
              />

              <Field
                name="postalCode"
                label="Postal Code"
                placeholder="e.g. 10100"
                value={form.postalCode}
                error={errors.postalCode}
                required
                onChange={handleChange}
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
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">

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

                <span className="font-semibold text-stone-600">
                  Rs. {cart.total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-600">Shipping</span>

                <span className="font-semibold text-stone-600">
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

            {/* Error summary */}
            {submitted && errorCount > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-medium">
                  Please fix {errorCount} {errorCount === 1 ? "error" : "errors"} above
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-semibold transition"
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
