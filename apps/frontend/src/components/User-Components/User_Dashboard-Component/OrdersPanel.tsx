import React, { useState } from "react";
import type { Order, WishlistItem } from "../../../types/dashboard.types";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";

interface OrdersPanelProps {
  orders: Order[];
  wishlist: WishlistItem[];
}

const fmt = (n: number) => `LKR ${n.toLocaleString("en-LK")}.00`;

const StatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => {
  const map = {
    delivered: { label: "Delivered", color: "#22c55e" },
    "on-deliver": { label: "On Deliver", color: "#eab308" },
    pending: { label: "Pending", color: "#f97316" },
    cancelled: { label: "Cancelled", color: "#ef4444" },
  } as const;

  const s = map[status];

  return (
    <span className="text-xs font-bold" style={{ color: s.color }}>
      {s.label}
    </span>
  );
};

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

const OrderCard: React.FC<{ order: Order; onView: (order: any) => void; }> = ({ order, onView}) => (

  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition mb-4">

    <div className="flex flex-col md:flex-row gap-5">

      {/* Product Image */}

      <div className="shrink-0">

        <img
          src={order.productImage}
          alt={order.productName}
          className="w-28 h-28 object-cover rounded-xl border"
        />

      </div>

      {/* Content */}

      <div className="flex-1 flex flex-col justify-between">

        {/* Top Section */}

        <div className="flex flex-col md:flex-row md:justify-between gap-4">

          {/* Left Info */}

          <div>

            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {order.productName}
            </h3>

            <p className="text-sm text-gray-500">
              Order ID: {order.id}
            </p>

            <p className="text-sm text-gray-500">
              Order Date: {order.orderDate}
            </p>

            <p className="text-sm text-gray-500">
              Payment Method: {order.paymentMethod}
            </p>

            <p className="text-sm text-gray-500">
              Delivery Charge: LKR {order.deliveryCharge}
            </p>

          </div>

          {/* Right Info */}

          <div className="text-left md:text-right">

            <p className="text-sm text-gray-500 mb-1">
              Order Status
            </p>

            <StatusBadge status={order.status} />

            <p className="text-2xl font-bold text-gray-900 mt-4">
              {fmt(order.price)}
            </p>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex gap-3 mt-5">

          <button
            onClick={() => onView(order.rawOrder)}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 hover:border-gray-400 transition"
          >
            View
          </button>

          <Link
            to={`/user/tracking/${order.numericId}`}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition"
          >
            Track Order
          </Link>

        </div>

      </div>

    </div>

  </div>
);

const OrdersPanel: React.FC<OrdersPanelProps> = ({
  orders,
  wishlist,
}) => {
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showAllWishlist, setShowAllWishlist] = useState(false);

  const visibleWishlist = showAllWishlist
    ? wishlist
    : wishlist.slice(0, 4);

  return (
    <div className="flex flex-col h-full">

      {/* Orders Section */}
      <div
        className="rounded-xl p-4 mb-4 overflow-y-auto bg-white border border-gray-200 shadow-sm"
        style={{
          maxHeight: showAllOrders ? undefined : 340,
        }}
      >
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onView={setSelectedOrder } />
        ))}

        {orders.length > 5 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setShowAllOrders((s) => !s)}
              className="text-xs font-semibold py-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
            >
              {showAllOrders
                ? "Show Less"
                : `Show All (${orders.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Section */}
      <div className="rounded-xl p-5 bg-white border border-gray-200 shadow-sm">

        <h3 className="text-gray-700 text-sm font-semibold mb-4 tracking-wide">
          Wish List Items
        </h3>

        <div className="grid grid-cols-4 gap-4">
          {visibleWishlist.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm"
            >
              {/* Image */}
              <div className="h-24 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Button */}
              <div className="p-2">
                <button
                  className="w-full py-1.5 text-xs font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More */}
        {wishlist.length > 4 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAllWishlist((s) => !s)}
              className="text-xs font-semibold py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              {showAllWishlist
                ? "Show Less"
                : `Show More (${wishlist.length - 4} more)`}
            </button>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (

        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 relative">

            {/* Close Button */}

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-black text-xl transition"
            >
              <IoClose size={24} />
            </button>

            {/* Header */}

            <h2 className="text-4xl font-bold text-stone-900 mb-2">
              Order Details
            </h2>

            <p className="text-stone-500 text-base mb-8">
              Order #{selectedOrder.orderNumber}
            </p>

            {/* ORDER INFO */}

            <div className="grid md:grid-cols-2 gap-5 mb-10">

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <p className="text-sm font-medium text-stone-500 mb-2">
                  Order Status
                </p>

                <p className="text-lg font-semibold capitalize text-stone-800">
                  {selectedOrder.status}
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <p className="text-sm font-medium text-stone-500 mb-2">
                  Payment Status
                </p>

                <p className="text-lg font-semibold capitalize text-stone-800">
                  {selectedOrder.paymentStatus}
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <p className="text-sm font-medium text-stone-500 mb-2">
                  Total Amount
                </p>

                <p className="text-2xl font-bold text-stone-900">
                  LKR {selectedOrder.totalAmount}
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <p className="text-sm font-medium text-stone-500 mb-2">
                  Order Date
                </p>

                <p className="text-lg font-semibold text-stone-800">
                  {new Date(
                    selectedOrder.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

            {/* SHIPPING ADDRESS */}

            <div className="mb-8">

              <h3 className="text-2xl font-semibold text-stone-900 mb-4">
                Shipping Address
              </h3>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">

                <p className="text-lg font-semibold text-stone-800 mb-2">
                  {selectedOrder.shippingAddress?.fullName}
                </p>

                <p className="text-stone-600">
                  {selectedOrder.shippingAddress?.streetAddress}
                </p>

                <p className="text-stone-600">
                  {selectedOrder.shippingAddress?.city}
                </p>

                <p className="text-stone-600">
                  {selectedOrder.shippingAddress?.phoneNumber}
                </p>

              </div>

            </div>

            {/* ORDER ITEMS */}

            <div>

              <h3 className="text-2xl font-semibold text-stone-900 mb-4">
                Ordered Items
              </h3>

              <div className="space-y-4">

                {selectedOrder.orderItems?.map(
                  (item: any) => (

                    <div
                      key={item.id}
                      className="flex items-center gap-5 border rounded-2xl p-4 bg-white"
                    >

                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-24 h-24 rounded-2xl object-cover border bg-stone-100"
                      />

                      <div className="flex-1">

                        <h4 className="text-lg font-semibold text-stone-800 mb-1">
                          {item.product?.name}
                        </h4>

                        <p className="text-sm text-stone-500">
                          Quantity:
                          {" "}
                          {item.quantity}
                        </p>

                        <p className="text-sm text-stone-500">
                          Unit Price:
                          {" "}
                          LKR {item.unitPrice}
                        </p>

                      </div>

                      <div className="text-xl font-bold text-stone-900">
                        LKR {item.total}
                      </div>

                    </div>
                  )
                )}

              </div>

              {/* ============================================
              INVOICE DOWNLOAD
              ============================================ */}

              <div className="mt-8 flex justify-end">

                <button
                  onClick={() =>
                    handleDownloadInvoice(
                      selectedOrder.id
                    )
                  }
                  className="px-5 py-3 rounded-2xl bg-black text-white hover:bg-gray-800 transition font-medium"
                >
                  Download Invoice
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default OrdersPanel;