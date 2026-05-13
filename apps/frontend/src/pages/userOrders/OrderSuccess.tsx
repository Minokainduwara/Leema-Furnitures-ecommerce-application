import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { authFetch } from "../../utils/api";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  total: number;
}

interface OrderDetails {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderSuccess() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [order, setOrder] =
    useState<OrderDetails | null>(null);

  // =========================================================
  // FETCH ORDER
  // =========================================================

  useEffect(() => {

    fetchOrder();

  }, []);

  const fetchOrder = async () => {

    try {

      const response = await authFetch(
        `http://localhost:8080/api/orders/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();

      setOrder(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white text-2xl font-bold">
        Loading order...
      </div>
    );
  }

  // =========================================================
  // NO ORDER
  // =========================================================

  if (!order) {

    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-red-400 text-2xl font-bold">
        Order not found
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-10">

      <div className="max-w-4xl mx-auto">

        {/* SUCCESS CARD */}

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-[35px] p-10 text-center">

          {/* ICON */}

          <div className="flex justify-center">

            <div className="w-28 h-28 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">

              <CheckCircle
                size={70}
                className="text-green-400"
              />

            </div>

          </div>

          {/* TITLE */}

          <h1 className="text-5xl font-black text-white mt-8">
            Order Placed Successfully
          </h1>

          <p className="text-gray-400 text-lg mt-4">
            Thank you for shopping with Leema Furniture
          </p>

          {/* ORDER INFO */}

          <div className="mt-10 bg-[#222222] rounded-3xl p-8 border border-gray-700">

            <div className="flex items-center justify-center gap-3 mb-6">

              <ShoppingBag className="text-orange-400" />

              <h2 className="text-2xl font-bold text-white">
                Order Details
              </h2>

            </div>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Order Number
                </span>

                <span className="text-white font-bold">
                  {order.orderNumber}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Order Status
                </span>

                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold">
                  {order.status}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Payment Status
                </span>

                <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold">
                  {order.paymentStatus}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Total Amount
                </span>

                <span className="text-orange-400 text-xl font-black">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Delivery
                </span>

                <span className="text-white font-semibold">
                  3 - 5 Business Days
                </span>

              </div>

            </div>

          </div>

          {/* ORDER ITEMS */}

          <div className="mt-10 text-left">

            <h2 className="text-2xl font-bold text-white mb-6">
              Ordered Items
            </h2>

            <div className="space-y-4">

              {order.orderItems?.map((item) => (

                <div
                  key={item.id}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 flex items-center justify-between"
                >

                  <div>

                    <h3 className="text-white font-bold text-lg">
                      {item.productName}
                    </h3>

                    <p className="text-gray-400 mt-1">
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <div className="text-orange-400 font-black text-xl">

                    Rs. {item.total.toLocaleString()}

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* BUTTONS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">

            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-2xl text-lg transition"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/user/dashboard")}
              className="bg-[#2a2a2a] hover:bg-[#333333] border border-gray-700 text-white font-bold py-4 rounded-2xl text-lg transition"
            >
              View Orders
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}