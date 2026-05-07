import React from 'react'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
function SellerProfile() {
    const [sidebaropen, setsidebar] = useState<boolean>(false);
      const [darkmode, setdarkmode] = useState<boolean>(false);
      useEffect(() => {
  if (darkmode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkmode]);

    const sideBarItems = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Category", icon: "/images/products.png", path: "/category" },

    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Repair", icon: "/images/products.png", path: "/repairs" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];

  return (
    <div className={`bg-gray-100 min-h-screen font-sans  flex`}>
              <aside
                      className={`bg-orange-400 w-70 h-screen fixed shadow-lg z-20 ${
                        sidebaropen ? "translate-x-0" : "-translate-x-64"
                      } lg:translate-x-0 lg:static transition-all flex flex-col`}
                    >
                      <div className="flex items-center gap-2 p-4 border-b border-white">
                        <img src="/images/leemalogo.jpg" className="h-6 w-18" />
                        <span className="font-bold text-gray-700 ">Seller Dashboard</span>
                      </div>
              
                      <nav className="flex-1 mt-6">
                        {sideBarItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path!}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white hover:rounded-md"
                          >
                            <img src={item.icon} className="w-6 h-6" />
                            <span className="text-gray-900 font-medium">{item.name}</span>
                          </Link>
                        ))}
                      </nav>
              
                      <div className="p-4 border-t border-white">
                        <button className="w-full bg-red-500 text-white py-2 rounded">
                          Logout
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