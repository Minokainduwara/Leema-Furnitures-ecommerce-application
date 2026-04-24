import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
function SellerProfile() {
    const [sidebaropen, setsidebar] = useState<boolean>(false);
      const [darkmode, setdarkmode] = useState<boolean>(false);

    const sideBarItems = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Customer Details", icon: "/images/Details.png", path: "/customers" },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];
  return (
    <div className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}>
              <aside
                className={`bg-white w-64 h-screen dark:bg-gray-900 fixed shadow-lg border-r border-gray-200 dark:border-gray-800 z-20 ${
                  sidebaropen ? "translate-x-0" : "-translate-x-64"
                } lg:translate-x-0 lg:static transition-all duration-300 flex flex-col`}
              >
                <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
                  <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Seller Dashboard
                  </span>
                  <button className="ml-auto lg:hidden" onClick={() => setsidebar(false)}>
                    <img src="/images/close.png" alt="close" className="h-8 w-8 p-1" />
                  </button>
                </div>
                <nav className="flex-1 mt-6">
                  {sideBarItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path!}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition font-medium mb-2"
                    >
                      <img src={item.icon} alt={item.name} className="w-6 h-6" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
                <div className="px-4 py-3 mt-2">
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition">
                    Logout
                  </button>
                </div>
                <div className="mt-auto flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    onClick={() => setdarkmode(!darkmode)}
                    aria-label="Toggle dark mode"
                  >
                    {darkmode ? (
                      <img src="/images/moon.png" alt="moon" className="w-6 h-6" />
                    ) : (
                      <img src="/images/sun.png" alt="sun" className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </aside>
              <main
  className={`flex-1 min-h-screen p-6 flex items-center justify-center ${
    darkmode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
  }`}
>
  <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">


    <h2 className="text-2xl font-bold mb-6 text-center">
      My Seller Profile
    </h2>

    
    <div className="flex items-center gap-4 mb-6">
      <img
        src="/images/profile.png"
        alt="profile"
        className="w-16 h-16 rounded-full border"
      />

      <div>
        <p className="text-lg font-semibold">Kasun Perera</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Seller Account
        </p>
      </div>
    </div>

    {/* Form */}
    <div className="space-y-3">

      <input
        type="text"
        defaultValue="Kasun Perera"
        placeholder="Full Name"
        className="w-full border p-2 rounded dark:bg-gray-700"
      />

      <input
        type="email"
        defaultValue="kasun@gmail.com"
        placeholder="Email"
        className="w-full border p-2 rounded dark:bg-gray-700"
      />

      <input
        type="text"
        defaultValue="+94 77 123 4567"
        placeholder="Phone Number"
        className="w-full border p-2 rounded dark:bg-gray-700"
      />

      <input
        type="text"
        defaultValue="Furniture Seller"
        placeholder="Role"
        disabled
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
      />

      <input
        type="password"
        placeholder="New Password"
        className="w-full border p-2 rounded dark:bg-gray-700"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border p-2 rounded dark:bg-gray-700"
      />

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mt-2">
        Update Profile
      </button>
    </div>
  </div>
</main>
    </div>
  )
}

export default SellerProfile