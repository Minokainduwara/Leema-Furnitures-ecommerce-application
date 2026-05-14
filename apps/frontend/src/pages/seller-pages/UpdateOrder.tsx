import React from "react";
import { div } from "three/src/nodes/math/OperatorNode.js";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
function UpdateOrder({orders, setOrders}: any) {
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

  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders?.find((o: any) => o.id === Number(id));
  const [status, setStatus] = useState("");
  const handleUpdate = () => {
  setOrders((prev: any) =>
    prev.map((o: any) =>
      o.id === order.id ? { ...o, status } : o
    )
  );

  navigate("/orders");
};
  return (
    <div className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}>
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
      <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">

  <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">

    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
      Update Order Status
    </h2>

    {/* Status Input */}
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
    >
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>

    {/* Button */}
    <button
      onClick={handleUpdate}
      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
    >
      Update Status
    </button>

  </div>

</main>
    </div>
  );
}

export default UpdateOrder;
