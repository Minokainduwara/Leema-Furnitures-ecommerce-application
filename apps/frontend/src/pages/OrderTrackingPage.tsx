import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const OrderTrackingPage: React.FC = () => {

  const { id } = useParams();

  const [order, setOrder] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH ORDER
  // ============================================

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const response = await api
          .get(`orders/${id}/tracking`)
          .json<any>();

        setOrder(response);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    fetchOrder();

  }, [id]);

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading tracking...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-red-500">
        Order not found
      </div>
    );
  }

  const currentStep =
    STATUS_STEPS.indexOf(
      order.orderStatus.toLowerCase()
    );

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        {/* Header */}

        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Order Tracking
        </h1>

        <p className="text-stone-500 mb-8">
          Order #{order.orderNumber}
        </p>

        {/* Order Info */}

        <div className="grid md:grid-cols-2 gap-4 mb-10">

          <div className="bg-stone-100 rounded-2xl p-4">
            <p className="text-sm text-stone-500">
              Order Status
            </p>

            <p className="font-bold text-amber-600 capitalize">
              {order.orderStatus}
            </p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-4">
            <p className="text-sm text-stone-500">
              Payment Status
            </p>

            <p className="font-bold text-green-600 capitalize">
              {order.paymentStatus}
            </p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-4">
            <p className="text-sm text-stone-500">
              Total Amount
            </p>

            <p className="font-bold text-stone-800">
              Rs. {order.totalAmount}
            </p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-4">
            <p className="text-sm text-stone-500">
              Created Date
            </p>

            <p className="font-bold text-stone-800">
              {new Date(order.createdAt)
                .toLocaleDateString()}
            </p>
          </div>

        </div>

        {/* Tracking Timeline */}

        <div className="mt-10">

        <h2 className="text-2xl font-bold text-stone-900 mb-8">
            Tracking Progress
        </h2>

        <div>

            {STATUS_STEPS.map((step, index) => {

            const completed = index <= currentStep;

            const active = index === currentStep;

            return (

                <div
                key={step}
                className="relative pl-12 pb-10"
                >

                {/* Vertical Line */}

                {index !== STATUS_STEPS.length - 1 && (

                    <div className={` absolute left-2.75 top-6 w-0.5 h-full ${ completed ? "bg-green-500" : "bg-stone-300" } `} />
                )}

                {/* Circle */}

                <div
                    className={`
                    absolute left-0 top-0
                    w-6 h-6 rounded-full
                    flex items-center justify-center
                    border-2 transition

                    ${
                        completed
                        ? "bg-green-500 border-green-500"
                        : "bg-white border-stone-300"
                    }

                    ${
                        active
                        ? "ring-4 ring-green-100"
                        : ""
                    }
                    `}
                >

                    {completed && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                    )}

                </div>

                {/* Content */}

                <div>

                    <p
                    className={`
                        text-lg font-semibold capitalize

                        ${
                        completed
                            ? "text-stone-900"
                            : "text-stone-400"
                        }
                    `}
                    >
                    {step}
                    </p>

                    <p className="text-sm text-stone-500 mt-1">

                    {step === "pending" &&
                        "Your order has been placed."}

                    {step === "confirmed" &&
                        "Seller confirmed your order."}

                    {step === "processing" &&
                        "Your items are being prepared."}

                    {step === "shipped" &&
                        "Order is on the way."}

                    {step === "delivered" &&
                        "Package delivered successfully."}

                    </p>

                </div>

                </div>
            );
            })}

        </div>

        </div>

      </div>
    </div>
  );
};

export default OrderTrackingPage;
