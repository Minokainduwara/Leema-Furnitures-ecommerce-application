import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function EditPromotions() {
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
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div
      className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}
    >
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
        className={`flex-1 h-screen overflow-y-auto p-6    ${
          darkmode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Promotion ✏️
        </h2>
        <div className="flex justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Promotion Updated!");
            }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-full  max-w-xl  "
          >
            <input
              type="text"
              placeholder="Product Name"
              className="w-full border p-2 rounded mb-3"
            />

            <select className="w-full border p-2 rounded mb-3">
              <option>Sofa</option>
              <option>Chair</option>
              <option>Table</option>
              <option>Bed</option>
              <option>Cupboard</option>
            </select>

            <select className="w-full border p-2 rounded mb-3">
              <option>Discount</option>
              <option>Special Offer</option>
              <option>Buy 1 Get 1</option>
            </select>

            <input
              type="number"
              placeholder="Discount (%)"
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              placeholder="Promotion description..."
              className="w-full border p-2 rounded mb-3"
            />

            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" />
              Feature on Homepage
            </label>

            <div className="flex justify-between">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Update Promotion
              </button>

              <button
                onClick={() => navigate("/promotions")}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditPromotions;
