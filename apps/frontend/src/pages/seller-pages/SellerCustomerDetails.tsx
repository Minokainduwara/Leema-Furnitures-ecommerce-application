import React, { useState } from "react";
import { Link } from "react-router-dom";
function SellerCustomerDetails() {
  type Order = {
    id: number;
    total: string;
    status: string;
  };

  type Customer = {
    id: number;
    name: string;
    address: string;
    phone: string;
    orders: Order[];
  };
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);

  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: "Kasun Perera",
      address: "Kegalle, Sri Lanka",
      phone: "0771234567",
      orders: [
        { id: 101, total: "5000", status: "Pending" },
        { id: 102, total: "8000", status: "Delivered" },
      ],
    },
    {
      id: 2,
      name: "Nimal Silva",
      address: "Colombo, Sri Lanka",
      phone: "0719876543",
      orders: [
        { id: 103, total: "12000", status: "Confirmed" },
      ],
    },
  ]);

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
      <main className="flex-1 p-6 ml-0  bg-gray-50 dark:bg-gray-900">

        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Customer Details
        </h2>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >

              
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                {customer.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">📍 {customer.address}</p>
              <p className="text-gray-600 dark:text-gray-300">📞 {customer.phone}</p>

              <div className="mt-4">
                <h4 className="font-semibold mb-2 dark:text-white">Order History</h4>

                {customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between bg-gray-100 dark:bg-white p-2 rounded mb-2"
                  >
                    <span>Order #{order.id}</span>
                    <span>Rs {order.total}</span>
                    <span className="text-sm text-blue-600">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default SellerCustomerDetails;
