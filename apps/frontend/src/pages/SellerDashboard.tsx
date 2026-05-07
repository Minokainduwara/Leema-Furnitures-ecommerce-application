import React, { useState } from "react";
import { Link } from "react-router-dom";


const SalesIcon = () => (
  <svg
    className="w-6 h-6 text-blue-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h1l2 9h13l2-9h1"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 10V6a4 4 0 00-8 0v4"
    />
  </svg>
);

const OrderIcon = () => (
  <svg
    className="w-6 h-6 text-green-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h10M7 7a2 2 0 012-2h6a2 2 0 012 2M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7"
    />
  </svg>
);

const ProductIcon = () => (
  <svg
    className="w-6 h-6 text-purple-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l10 7 10-7" />
  </svg>
);


type Order = {
  id: string;
  customer: string;
  amount: string;
  status: "Completed" | "Pending";
};

type SidebarItem = {
  name: string;
  icon: string;
  path?: string;
};

type Card = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
};

function SellerDashboard() {
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);

  
  const recentOrders: Order[] = [
    {
      id: "ORD123",
      customer: "Nimal Fernando",
      amount: "$120",
      status: "Completed",
    },
    {
      id: "ORD124",
      customer: "Sunil Perera",
      amount: "$80",
      status: "Pending",
    },
    {
      id: "ORD125",
      customer: "Amali Silva",
      amount: "$45",
      status: "Completed",
    },
  ];

  const pendingOrders = recentOrders.filter(
    (order) => order.status === "Pending",
  );

  
  const sideBarItems: SidebarItem[] = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Category", icon: "/images/orders.png", path: "/category" },
    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Repair", icon: "/images/orders.png", path: "/repairs" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png" ,path: "/profile"},

  ];

  // Dashboard cards
  const cards: Card[] = [
    {
      title: "Total Sales",
      value: "$12,300",
      icon: <SalesIcon />,
      description: "Up 12% from last month",
    },
    {
      title: "Orders",
      value: "320",
      icon: <OrderIcon />,
      description: `5 new orders today${
        pendingOrders.length ? ` | Pending: ${pendingOrders.length}` : ""
      }`,
    },
    {
      title: "Products",
      value: "58",
      icon: <ProductIcon />,
      description: "2 new products added",
    },
  ];

  return (
    <div
      className="min-h-screen flex bg-white"
    >
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 w-64 h-screen overflow-y-auto  fixed shadow-lg border-r border-gray-200  z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 ">
          <img src="/images/leemalogo.jpg" alt="Logo" className="h-6 w-18" />
          <span className="text-xl font-bold text-white ">
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
              to={item.path || "#"}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-yellow-500  transition font-medium mb-2"
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span className="font-medium text-white">{item.name}</span>
            </Link>
          ))}
        </nav>
        {/* Logout Button */}
        <div className="px-4 py-3 mt-2">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition">
            Logout
          </button>
        </div>
        
      </aside>
      
      <main className="bg-white w-full  min-h-screen ">
        
        <header className="flex items-center justify-between bg-white  border-b   px-6 py-4 shadow-sm sticky top-0 z-10">
          <button onClick={() => setsidebar(true)} className="lg:hidden">
            <img
              src="/images/menubar.png"
              alt="menubar"
              className="h-8 w-8 p-1 rounded-full bg-gray-200 "
            />
          </button>
          <span className="text-xl font-bold text-gray-800">
            Dashboard
          </span>
          <div className="flex items-center gap-3">
            <img
             src="/images/profile.png"
              alt="Profile"
              className="h-10 w-10 rounded-full border border-gray-300  object-cover"
            />
            <span className="text-sm font-medium text-gray-700 ">
              Kasun Perera
            </span>
          </div>
        </header>
        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white  rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col gap-4 border border-gray-100  group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-200  rounded-full p-3 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition">
                  {card.icon}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-800 ">
                    {card.title}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 ">
                    {card.value}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500  mt-2">
                {card.description}
              </div>

              {card.title === "Orders" && recentOrders && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-gray-700  mb-2">
                    Recent Orders
                  </div>
                  <ul className="space-y-1">
                    {recentOrders.map((order) => (
                      <li
                        key={order.id}
                        className={`flex justify-between text-xs ${
                          order.status === "Pending"
                            ? "text-yellow-500"
                            : "text-green-500"
                        } bg-gray-100  rounded px-2 py-1 text-gray-600 `}
                      >
                        <span>
                          {order.id} - {order.customer}
                        </span>
                        <span>{order.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default SellerDashboard;
