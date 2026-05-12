import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";
function AddCategory() {
  const navigate = useNavigate();
  const [sidebaropen, setsidebar] = useState<boolean>(false);
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

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await authFetch("http://localhost:8080/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Category added successfully");
    navigate("/category");
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex">
      {/* SIDEBAR (UNCHANGED STYLE) */}
      <aside
        className={`bg-gray-900 w-70 h-screen fixed shadow-lg z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-white">
          <img src="/images/leemalogo.jpg" className="h-6 w-18" />
          <span className="font-bold text-white ">Seller Dashboard</span>
        </div>

        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path!}
              className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500 hover:rounded-md"
            >
              <img src={item.icon} className="w-6 h-6" />
              <span className="text-white font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white">
          <button className="w-full bg-red-500 text-white py-2 rounded">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="w-full  flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-[420px]"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-700">
            Add Category
          </h2>

          {/* NAME */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Category Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 mb-4 rounded text-gray-700"
            placeholder="Enter category name"
          />

          {/* SLUG */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Slug
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded border-gray-300 text-gray-700"
            placeholder="category-slug"
          />

          {/* DESCRIPTION */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded border-gray-300 text-gray-700"
            placeholder="Enter description"
          />
          {/* STATUS */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Status
          </label>

          <select
            name="isActive"
            value={form.isActive ? "true" : "false"}
            onChange={(e) =>
              setForm({
                ...form,
                isActive: e.target.value === "true",
              })
            }
            className="w-full border p-2 mb-4 rounded border-gray-300 text-gray-700"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => navigate("/category")}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddCategory;
