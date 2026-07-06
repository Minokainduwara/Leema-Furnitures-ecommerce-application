import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch, API_BASE } from "../../utils/api";

function SellerProfile() {
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const sideBarItems = [
    {
      name: "Dashboard",
      icon: "/images/dashboard.png",
      path: "/seller/dashboard",
    },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Category", icon: "/images/category.png", path: "/category" },

    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Inventory", icon: "/images/inventory.png", path: "/inventory" },
    { name: "Repair", icon: "/images/service.png", path: "/repairs" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },

    { name: "notification", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/users/me`);

      if (!res.ok) {
        console.error("API failed:", res.status);
        return;
      }

      const data = await res.json();
      console.log("PROFILE RESPONSE:", data);
      setName(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
    } catch (err) {
      console.error("Profile load error", err);
    }
  };

  const updateProfile = async () => {
    try {
      await authFetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
        }),
      });

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Profile update failed ❌");
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await authFetch(`${API_BASE}/api/users/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      alert("Password updated successfully ✅");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Password update failed ❌");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`bg-gray-900 w-70 h-screen fixed shadow-lg z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-white">
          <img src="/images/leemalogo.jpg" className="h-6 w-18" />
          <span className="font-bold text-white">Seller Dashboard</span>
        </div>

        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500"
            >
              <img src={item.icon} className="w-6 h-6" />
              <span className="text-white">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className=" w-full p-14 bg-gray-50  overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">
          Seller Profile
        </h1>

        {/* PROFILE CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-md w-full mb-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Full Name
              </label>
              <input
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg outline-none transition text-gray-700 bg-gray-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <input
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg outline-none transition text-gray-700 bg-gray-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg outline-none transition text-gray-700 bg-gray-50"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={updateProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* PASSWORD CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-md w-full border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Change Password
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Password */}
            <div className="relative md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Current Password
              </label>
              <input
                type={showCurrent ? "text" : "password"}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg pr-12 outline-none transition text-gray-700 bg-gray-50"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? "🙈" : "👁️"}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                New Password
              </label>
              <input
                type={showNew ? "text" : "password"}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg pr-12 outline-none transition text-gray-700 bg-gray-50"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showNew ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg pr-12 outline-none transition text-gray-700 bg-gray-50"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={changePassword}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition"
            >
              Update Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SellerProfile;