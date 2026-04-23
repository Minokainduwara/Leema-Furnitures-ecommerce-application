import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function EditProduct() {
  const sideBarItems = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];
  const [form, setForm] = useState({
    name: "Chair",
    code: "C101",
    price: 5000,
    category: "Furniture",
    description: "Comfortable chair",
  });
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div
      className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}
    >
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
          <button
            className="ml-auto lg:hidden"
            onClick={() => setsidebar(false)}
          >
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
      <div className="flex-1 h-screen flex items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <form className="w-full max-w-xl bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Edit Product ID: {id}</h2>

          <input value={form.name} className="w-full border p-2 mb-3 rounded" />

          <input value={form.code} className="w-full border p-2 mb-3 rounded" />

          <input
            type="number"
            value={form.price}
            className="w-full border p-2 mb-3 rounded"
          />

          <select className="w-full border p-2 mb-3 rounded">
            <option>Furniture</option>
            <option>Electronics</option>
          </select>

          <textarea
            value={form.description}
            className="w-full border p-2 mb-3 rounded"
          />

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              Update Product
            </button>

            <button
              onClick={() => navigate("/products")}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
