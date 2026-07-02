import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className="bg-white border rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <XCircle size={64} className="mx-auto text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">
          Payment Cancelled
        </h1>
        <p className="text-stone-500 mt-2">
          Your payment was cancelled. Your cart is still saved if you want to try again.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/addtocart"
            className="bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition"
          >
            Back to Cart
          </Link>
          <Link to="/" className="text-sm text-stone-500 hover:text-stone-700">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
