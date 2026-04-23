import React, { useState } from "react";
import Sidebar from "../../components/User_Dashboard-Component/Sidebar";
import DetailsPanel from "../../components/User_Dashboard-Component/DetailsPanel";
import OrdersPanel from "../../components/User_Dashboard-Component/OrdersPanel";
import ServicePanel from "../../components/User_Dashboard-Component/ServicePanel";
import type { UserProfile, ActivePanel } from "../../types/dashboard.types";
import { MOCK_USER, MOCK_ORDERS, MOCK_WISHLIST, MOCK_SERVICE_REQUESTS } from "../../data/mockData";

export default function UserDashboard() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("details");
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

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
  {activePanel === "orders" && <OrdersPanel orders={MOCK_ORDERS} wishlist={MOCK_WISHLIST} />}
  {activePanel === "service" && <ServicePanel serviceRequests={MOCK_SERVICE_REQUESTS} onSubmit={(d) => console.log("service submit", d)} />}
      </main>
    </div>
  );
}
