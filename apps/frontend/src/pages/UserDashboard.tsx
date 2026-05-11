import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/User-Components/Sidebar";

import type { UserProfile, ActivePanel } from "../types/dashboard.types";

import {
  MOCK_USER,
} from "../data/SellermockData";
import React from "react";

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user: UserProfile = MOCK_USER;

  // detect active panel from URL
  const activePanel = location.pathname.includes("/orders")
    ? "orders"
    : location.pathname.includes("/service")
    ? "service"
    : "details";

  const handleSelect = (panel: ActivePanel) => {
    navigate(`/user/${panel}`);
  };

  const handleLogout = () => {
    console.log("logout");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        user={user}
        activePanel={activePanel}
        onSelect={handleSelect}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}