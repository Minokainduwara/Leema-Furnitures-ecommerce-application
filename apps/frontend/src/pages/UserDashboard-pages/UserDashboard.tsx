import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import DetailsPanel from "../components/DetailsPanel";
// import OrdersPanel from "../components/OrdersPanel";
// import ServicePanel from "../components/ServicePanel";

import Sidebar from "@/components/Admin-Components/Sidebar";
import DetailsPanel from "@/components/User_Dashboard-Component/DetailsPanel";
import OrdersPanel from "@/components/User_Dashboard-Component/OrdersPanel";
import ServicePanel from "@/components/User_Dashboard-Component/ServicePanel";
import type { UserProfile, ActivePanel, Order, WishlistItem, ServiceRequest } from "@/types/dashboard.types";

const mockUser: UserProfile = {
  id: "u-001",
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St",
  city: "Colombo",
  district: "Colombo",
  postalCode: "10000",
  email: "john@example.com",
  phone: "+94123456789",
  avatar: null,
};

const mockOrders: Order[] = [
  {
    id: "ord-001",
    orderDate: "2026-03-18",
    paymentMethod: "Card",
    deliveryCharge: "LKR 300",
    price: 12500,
    status: "delivered",
    productImage: "/public/sample.jpg",
    productName: "Sofa Model A",
  },
];

const mockWishlist: WishlistItem[] = [
  { id: 1, name: "Chair X", image: "/public/sample2.jpg" },
];

const mockServiceRequests: ServiceRequest[] = [
  { id: "srv-001", invoiceRef: "WRD24221100", date: "2026-02-25", status: "PENDING" },
];

export default function UserDashboard() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("details");
  const [user, setUser] = useState<UserProfile>(mockUser);

  const handleSave = (updated: UserProfile) => {
    // update local state so Sidebar and other components reflect changes
    setUser(updated);
    console.log("Saved user:", updated);
  };

  const handleLogout = () => {
    console.log("logout");
  };

  return (
    <div className="flex h-screen">
  <Sidebar user={user} activePanel={activePanel} onSelect={setActivePanel} onLogout={handleLogout} />

      <main className="flex-1 p-8 overflow-auto">
  {activePanel === "details" && <DetailsPanel user={user} onSave={handleSave} />}
        {activePanel === "orders" && <OrdersPanel orders={mockOrders} wishlist={mockWishlist} />}
        {activePanel === "service" && <ServicePanel serviceRequests={mockServiceRequests} onSubmit={(d) => console.log("service submit", d)} />}
      </main>
    </div>
  );
}
