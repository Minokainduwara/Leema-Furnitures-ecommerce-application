import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { clearCart } from "../utils/cart";

const PaymentSuccess = () => {
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className="bg-white border rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <CheckCircle2 size={64} className="mx-auto text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">
          Payment Successful
        </h1>
        <p className="text-stone-500 mt-2">
          Thanks for your purchase. We'll send you an email confirmation shortly.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/user/dashboard"
            className="bg-black text-white font-semibold py-3 rounded-xl hover:bg-stone-800 transition"
          >
            View My Orders
          </Link>
          <Link to="/" className="text-sm text-stone-500 hover:text-stone-700">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
