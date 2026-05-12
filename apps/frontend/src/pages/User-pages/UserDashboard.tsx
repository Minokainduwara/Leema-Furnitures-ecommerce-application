import React, { useEffect, useState } from "react";

import Sidebar from "@/components/User-Components/User_Dashboard-Component/Sidebar";
import DetailsPanel from "@/components/User-Components/User_Dashboard-Component/DetailsPanel";
import OrdersPanel from "@/components/User-Components/User_Dashboard-Component/OrdersPanel";
import ServicePanel from "@/components/User-Components/User_Dashboard-Component/ServicePanel";

import type {
  UserProfile,
  ActivePanel,
  WishlistItem,
} from "@/types/dashboard.types";

const emptyUser: UserProfile = {
  id: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  district: "",
  postalCode: "",
  email: "",
  phone: "",
  avatar: null,
};

const mockWishlist: WishlistItem[] = [
  {
    id: 1,
    name: "Chair X",
    image: "/sample2.jpg",
  },
];

export default function UserDashboard() {
  const [activePanel, setActivePanel] =
    useState<ActivePanel>("details");

  const [user, setUser] =
    useState<UserProfile>(emptyUser);

  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH USER FROM BACKEND
  // =========================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8080/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load user");
        }

        const data = await response.json();

        // SPLIT NAME
        const nameParts = (data.name || "").split(" ");

        setUser({
          id: data.id?.toString() || "",
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          address: data.address || "",
          city: data.city || "",
          district: data.district || "",
          postalCode: data.postalCode || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
          avatar: data.profilePicture || null,
        });
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =========================================
  // SAVE UPDATED USER
  // =========================================
  const handleSave = (updated: UserProfile) => {
    setUser(updated);

    console.log("Updated user:", updated);
  };

  // =========================================
  // LOGOUT
  // =========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    window.location.href = "/login";
  };

  // =========================================
  // LOADING SCREEN
  // =========================================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user}
        activePanel={activePanel}
        onSelect={setActivePanel}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8 overflow-auto">
        {activePanel === "details" && (
          <DetailsPanel
            user={user}
            onSave={handleSave}
          />
        )}

        {activePanel === "orders" && (
          <OrdersPanel
            wishlist={mockWishlist}
          />
        )}

        {activePanel === "service" && (
          <ServicePanel />
        )}
      </main>
    </div>
  );
}