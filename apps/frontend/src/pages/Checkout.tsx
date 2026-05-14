import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  API_BASE,
  authFetch,
  getCurrentUser,
  isLoggedIn,
} from "../utils/api";
import { getCart } from "../utils/cart";

type PayHerePayload = {
  sandbox: boolean;
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  hash: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
};

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  notes: string;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [items] = useState(getCart());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = getCurrentUser();

  const [form, setForm] = useState<Form>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "Sri Lanka",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login?redirect=/checkout");
      return;
    }
    if (getCart().length === 0) {
      navigate("/addtocart");
    }
  }, [navigate]);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!form.firstName || !form.email || !form.phone || !form.address || !form.city) {
      setError("Please fill in all required shipping fields.");
      return;
    }
    if (!user?.userId) {
      setError("You must be signed in to checkout.");
      navigate("/login?redirect=/checkout");
      return;
    }

    setSubmitting(true);

    try {
      // 1) Create the order on the backend
      const orderBody = {
        user: { id: user.userId },
        subtotal,
        tax: 0,
        shippingCost: shipping,
        discountAmount: 0,
        totalAmount: total,
        status: "PENDING",
        paymentStatus: "PENDING",
        customerNotes: form.notes,
        orderItems: items.map((it) => ({
          product: { id: it.id },
          quantity: it.qty,
          unitPrice: it.price,
          subtotal: it.price * it.qty,
          tax: 0,
          total: it.price * it.qty,
        })),
      };

      const orderRes = await authFetch(`${API_BASE}/api/orders`, {
        method: "POST",
        body: JSON.stringify(orderBody),
      });

      if (!orderRes.ok) {
        const errText = await orderRes.text();
        throw new Error(`Could not create order: ${errText || orderRes.status}`);
      }

      const order = await orderRes.json();
      const orderId = order.id || order.orderNumber;

      // 2) Ask backend to build the PayHere hash
      const initRes = await authFetch(`${API_BASE}/api/payments/payhere/initiate`, {
        method: "POST",
        body: JSON.stringify({
          orderId,
          amount: total.toFixed(2),
          currency: "LKR",
        }),
      });

      if (!initRes.ok) {
        const errText = await initRes.text();
        throw new Error(`Payment init failed: ${errText || initRes.status}`);
      }

      const payload: PayHerePayload = await initRes.json();

      // 3) Build & submit a hidden form to PayHere
      const payForm = document.createElement("form");
      payForm.method = "POST";
      payForm.action = payload.sandbox
        ? "https://sandbox.payhere.lk/pay/checkout"
        : "https://www.payhere.lk/pay/checkout";
      payForm.style.display = "none";

      const fields: Record<string, string> = {
        merchant_id: payload.merchantId,
        return_url: payload.returnUrl,
        cancel_url: payload.cancelUrl,
        notify_url: payload.notifyUrl,
        order_id: String(payload.orderId),
        items: items.map((i) => i.name).join(", ").slice(0, 100) || "Leema Order",
        currency: payload.currency,
        amount: payload.amount,
        hash: payload.hash,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        country: form.country,
      };

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        payForm.appendChild(input);
      });

      document.body.appendChild(payForm);
      payForm.submit();
    } catch (err: any) {
      setError(err?.message || "Checkout failed. Please try again.");
      setSubmitting(false);
    }
    // keep submitting=true on success — page is leaving for PayHere
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <form
            onSubmit={handlePay}
            className="lg:col-span-2 bg-white border rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-stone-800">Shipping Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <Field label="First name *" name="firstName" value={form.firstName} onChange={onChange} />
              <Field label="Last name" name="lastName" value={form.lastName} onChange={onChange} />
            </div>

            <Field label="Email *" name="email" type="email" value={form.email} onChange={onChange} />
            <Field label="Phone *" name="phone" value={form.phone} onChange={onChange} />
            <Field label="Address *" name="address" value={form.address} onChange={onChange} />

            <div className="grid grid-cols-3 gap-4">
              <Field label="City *" name="city" value={form.city} onChange={onChange} />
              <Field label="Postal Code" name="postalCode" value={form.postalCode} onChange={onChange} />
              <Field label="Country" name="country" value={form.country} onChange={onChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={3}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-stone-800 transition disabled:opacity-60"
            >
              {submitting ? "Redirecting to PayHere…" : `Pay LKR ${total.toLocaleString()}`}
            </button>

            <p className="text-xs text-stone-400 text-center">
              You'll be redirected to the PayHere sandbox to complete payment.
            </p>
          </form>

          {/* Order Summary */}
          <div className="bg-white border rounded-2xl p-6 h-fit lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">
                    {it.name} × {it.qty}
                  </span>
                  <span className="font-medium">
                    LKR {(it.price * it.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t my-4" />

            <div className="flex justify-between text-sm text-stone-600 mb-1">
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600 mb-1">
              <span>Shipping</span>
              <span>LKR {shipping.toLocaleString()}</span>
            </div>

            <div className="border-t my-3" />

            <div className="flex justify-between font-bold text-stone-900 text-lg">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  name: keyof Form;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({ label, name, value, type = "text", onChange }: FieldProps) => (
  <div>
    <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
  </div>
);

export default Checkout;
