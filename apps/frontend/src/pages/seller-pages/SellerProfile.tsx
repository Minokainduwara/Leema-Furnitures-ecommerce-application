import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";

function SellerProfile() {
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);

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
      const res = await authFetch("http://localhost:8080/api/users/me");

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
      await authFetch("http://localhost:8080/api/users/me", {
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
      await authFetch("http://localhost:8080/api/users/change-password", {
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
    <div className={`flex min-h-screen ${darkmode ? "dark" : ""}`}>
      {/* SIDEBAR */}
      <aside className="bg-gray-900 w-64 h-screen fixed flex flex-col">
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

       <button
  onClick={handleLogout}
  className="w-full bg-red-500 text-white py-2 rounded"
>
  Logout
</button>
      </aside>

      {/* MAIN */}
      <main className="ml-64 w-full p-8 bg-gray-50  ">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">
          Seller Profile
        </h1>

        {/* PROFILE CARD */}
        <div className="bg-white bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold mb-4 text-gray-500">Profile Details</h2>
          <label className="text-gray-600">Name</label>
          <input
            className="w-full border p-2 mb-3 rounded border-gray-300 text-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <label className="text-gray-600">Email</label>
          <input
            className="w-full border p-2 mb-3 rounded border-gray-300 text-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <label className="text-gray-600">Phone</label>
          <input
            className="w-full border p-2 mb-3 rounded border-gray-300 text-gray-600"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
          />

          <button
            onClick={updateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>

        {/* PASSWORD CARD */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Change Password</h2>

          <input
            type="password"
            className="w-full border p-2 mb-3 rounded"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-2 mb-3 rounded"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-2 mb-3 rounded"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={changePassword}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Update Password
          </button>
        </div>
      </main>
    </div>
  );
}

export default SellerProfile;
