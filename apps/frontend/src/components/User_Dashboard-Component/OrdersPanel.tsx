import React, { useState } from "react";
import type { Order, WishlistItem } from "../../types/dashboard.types";

interface OrdersPanelProps {
  orders: Order[];
  wishlist: WishlistItem[];
}

const fmt = (n: number) => `LKR ${n.toLocaleString("en-LK")}.00`;

const StatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => {
  const map = {
    delivered:   { label: "delivered",   color: "#4ade80" },
    "on-deliver":{ label: "On-deliver",  color: "#facc15" },
    pending:     { label: "Pending",     color: "#fb923c" },
    cancelled:   { label: "Cancelled",   color: "#f87171" },
  } as const;
  const s = map[status];
  return (
    <span className="text-xs font-bold" style={{ color: s.color }}>
      {s.label}
    </span>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <div className="flex items-center gap-4 p-4 rounded-lg mb-3"
       style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
    {/* Product image */}
    <img src={order.productImage} alt={order.productName}
         className="w-24 h-18 object-cover rounded-lg shrink-0"
         style={{ height: 72, width: 100 }} />

    {/* Order details */}
    <div className="flex-1 min-w-0">
      <p className="text-white/90 text-xs leading-relaxed">
        <span className="text-white/50">order ID:</span>{order.id}
      </p>
      <p className="text-white/90 text-xs">
        <span className="text-white/50">order date:</span>{order.orderDate}
      </p>
      <p className="text-white/90 text-xs">
        <span className="text-white/50">Payment method:</span>{order.paymentMethod}
      </p>
      <p className="text-white/90 text-xs">
        <span className="text-white/50">Delivery Charge:</span>{order.deliveryCharge}
      </p>
      <p className="text-white font-bold text-sm mt-2">Price:{fmt(order.price)}</p>
    </div>

    {/* Divider */}
    <div className="w-px self-stretch mx-2" style={{ background: "rgba(255,255,255,0.12)" }} />

    {/* Delivery status */}
    <div className="shrink-0 w-36 text-right">
      <p className="text-white/50 text-xs mb-1">Delivery Status:</p>
      <StatusBadge status={order.status} />
    </div>
  </div>
);

const OrdersPanel: React.FC<OrdersPanelProps> = ({ orders, wishlist }) => {
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllWishlist, setShowAllWishlist] = useState(false);

  const visibleWishlist = showAllWishlist ? wishlist : wishlist.slice(0, 4);

  return (
    <div className="flex flex-col h-full">

      {/* ── Orders List (scrollable) ── */}
      <div className="rounded-xl p-4 mb-4 overflow-y-auto"
           style={{ background: "rgba(255,255,255,0.05)", maxHeight: showAllOrders ? undefined : 340,
                    border: "1px solid rgba(255,255,255,0.08)" }}>
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
        {orders.length > 5 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setShowAllOrders(s => !s)}
              className="text-xs font-semibold py-1 px-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)", color: "#fff" }}
            >
              {showAllOrders ? "Show less" : `Show all (${orders.length})`}
            </button>
          </div>
        )}
      </div>

      {/* ── Wish List ── */}
      <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.05)",
                                               border: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="text-white/70 text-sm font-semibold mb-4 tracking-wide">Wish List Item</h3>
        <div className="grid grid-cols-4 gap-4">
          {visibleWishlist.map(item => (
            <div key={item.id} className="rounded-xl overflow-hidden"
                 style={{ background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="h-24 overflow-hidden">
                <img src={item.image} alt={item.name}
                     className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <button className="w-full py-1.5 text-xs font-semibold rounded-lg transition-colors"
                        style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                        onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                        onMouseOut={e  => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}> 
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
        {wishlist.length > 4 && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setShowAllWishlist(s => !s)}
              className="text-xs font-semibold py-1 px-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)", color: "#fff" }}
            >
              {showAllWishlist ? "Show less" : `Show more (${wishlist.length - 4} more)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPanel;
