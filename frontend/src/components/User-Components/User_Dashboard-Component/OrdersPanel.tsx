import React, { useEffect, useState } from "react";
import type { WishlistItem } from "../../../types/dashboard.types";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

interface OrdersPanelProps {
  wishlist: WishlistItem[];
}

const fmt = (n: number) => `LKR ${n.toLocaleString("en-LK")}.00`;

const normalizeStatus = (status: string) => status.toLowerCase();

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; color: string }> = {
    delivered: { label: "Delivered", color: "#22c55e" },
    shipped: { label: "Shipped", color: "#3b82f6" },
    processing: { label: "Processing", color: "#eab308" },
    pending: { label: "Pending", color: "#f97316" },
    cancelled: { label: "Cancelled", color: "#ef4444" },
    confirmed: { label: "Confirmed", color: "#8b5cf6" },
  };

  const s = map[status] ?? {
    label: status,
    color: "#6b7280",
  };

  return (
    <span className="text-xs font-bold" style={{ color: s.color }}>
      {s.label}
    </span>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const firstItem = order.orderItems?.[0];

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl mb-3 bg-white border border-gray-200 shadow-sm">

      {/* Product Image */}
      <img
        src="https://via.placeholder.com/100"
        alt={firstItem?.productName || "Product"}
        className="object-cover rounded-lg shrink-0"
        style={{ width: 100, height: 72 }}
      />

      {/* Order Details */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 text-xs leading-relaxed">
          <span className="text-gray-500 font-medium">
            Order ID:
          </span>{" "}
          {order.orderNumber}
        </p>

        <p className="text-gray-800 text-xs">
          <span className="text-gray-500 font-medium">
            Order Date:
          </span>{" "}
          {order.orderDate?.split("T")[0]}
        </p>

        <p className="text-gray-800 text-xs">
          <span className="text-gray-500 font-medium">
            Payment Status:
          </span>{" "}
          {order.paymentStatus}
        </p>

        {firstItem && (
          <p className="text-gray-800 text-xs">
            <span className="text-gray-500 font-medium">
              Product:
            </span>{" "}
            {firstItem.productName}
          </p>
        )}

        <p className="text-gray-900 font-bold text-sm mt-2">
          Price: {fmt(order.totalAmount)}
        </p>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-gray-200 mx-2" />

      {/* Status */}
      <div className="shrink-0 w-36 text-right">
        <p className="text-gray-500 text-xs mb-1">
          Delivery Status:
        </p>

        <StatusBadge status={normalizeStatus(order.status)} />
      </div>
    </div>
  );
};

const OrdersPanel: React.FC<OrdersPanelProps> = ({
  wishlist,
}) => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAllOrders, setShowAllOrders] =
    useState(false);

  const [showAllWishlist, setShowAllWishlist] =
    useState(false);

  // FETCH ORDERS
  useEffect(() => {

    const fetchOrders = async () => {
      try {

        const userId =
          localStorage.getItem("userId") || "1";

        const response = await fetch(
          `http://localhost:8080/api/orders?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        setOrders(data);

      } catch (error) {

        console.error("Error loading orders:", error);

      } finally {

        setLoading(false);
      }
    };

    fetchOrders();

  }, []);

  const visibleOrders = showAllOrders
    ? orders
    : orders.slice(0, 5);

  const visibleWishlist = showAllWishlist
    ? wishlist
    : wishlist.slice(0, 4);

  return (
    <div className="flex flex-col h-full">

      {/* Orders Section */}
      <div
        className="rounded-xl p-4 mb-4 overflow-y-auto bg-white border border-gray-200 shadow-sm"
        style={{
          maxHeight: showAllOrders
            ? undefined
            : 340,
        }}
      >

        {loading ? (

          <p className="text-sm text-gray-500">
            Loading orders...
          </p>

        ) : visibleOrders.length === 0 ? (

          <p className="text-sm text-gray-500">
            No orders found
          </p>

        ) : (

          visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))
        )}

        {orders.length > 5 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() =>
                setShowAllOrders((s) => !s)
              }
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
              onClick={() =>
                setShowAllWishlist((s) => !s)
              }
              className="text-xs font-semibold py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              {showAllWishlist
                ? "Show Less"
                : `Show More (${wishlist.length - 4} more)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPanel;