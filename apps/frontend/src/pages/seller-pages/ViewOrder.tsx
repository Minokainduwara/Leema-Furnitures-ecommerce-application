import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
function ViewOrder({ orders }: any) {
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

  if (!order) return <p>Order not found</p>;

  return (
    <div
      className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}
    >
      <aside
        className={`bg-gray-900 w-70 h-screen fixed shadow-lg z-20 ${
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
      <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Page container */}
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Order Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Full information about the selected order
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-lg font-semibold">{order.id}</p>
              </div>

              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="text-lg font-semibold">{order.customer}</p>
              </div>

              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-semibold text-green-600">
                  Rs {order.total}
                </p>
              </div>

              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Items
              </h3>

              <div className="space-y-2">
                {order.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      Qty: {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigate("/orders")}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
              >
                ← Back to Orders
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewOrder;
