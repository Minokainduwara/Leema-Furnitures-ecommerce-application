import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";


const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams();

  const location = useLocation();

  const orderId = location.state?.orderId;

  const handleDownloadInvoice = async (
  orderId: number
) => {

  try {

    const token =
      localStorage.getItem("accessToken");

    const response = await fetch(
      `http://localhost:8080/api/invoices/${orderId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to download invoice"
      );
    }

    const blob = await response.blob();

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `invoice-${orderId}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(error);

  }
};

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2
              size={60}
              className="text-green-600"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-stone-800 mb-4">
          Order Placed Successfully
        </h1>

        <p className="text-stone-500 mb-2">
          Thank you for shopping with Leema Furniture.
        </p>

        <p className="text-stone-600 mb-6">
          Your Order Number:
        </p>

        <div className="bg-stone-100 rounded-xl py-4 px-6 text-xl font-bold text-amber-600 mb-8">
          {orderNumber}
        </div>

      <div className="space-y-4">

        <button
          onClick={() =>
            handleDownloadInvoice(
              orderId
            )
          }
          className="w-full py-3 rounded-2xl bg-black text-white hover:bg-gray-800 transition font-semibold"
        >
          Download Invoice
        </button>



          <Link
            to="/user/orders"
            className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-semibold transition"
          >
            View Orders
          </Link>

          <Link
            to="/products"
            className="block w-full border border-stone-300 hover:bg-stone-100 text-stone-700 py-3 rounded-2xl font-semibold transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
