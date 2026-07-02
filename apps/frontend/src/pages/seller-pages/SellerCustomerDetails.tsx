import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";

function SellerCustomerDetails() {
  type Order = {
    id: number;
    total: string;
    status: string;
  };

  type Customer = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };

  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("http://localhost:8080/api/users?role=CUSTOMER", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        return res.json();
      })
      .then((data) => {
        setCustomers(data.content);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  }, []);

  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

 
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
          <span className="font-bold text-white ">Seller Dashboard</span>
        </div>

        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500 hover:rounded-md"
            >
              <img src={item.icon} className="w-6 h-6" />
              <span className="text-white font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="w-full p-6 ml-0 bg-gray-50 h-screen overflow-y-auto">
        <div className="px-6 py-4 bg-white flex justify-between items-center rounded-lg shadow-md mb-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Customer Details
            </h2>
            <p className="text-gray-500 mt-1">
              Manage and view all registered customers
            </p>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 px-4 py-2 rounded-lg border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No customers found...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {customers
              .filter((customer) => {
                const searchValue = search.toLowerCase();

                return (
                  customer.name.toLowerCase().includes(searchValue) ||
                  customer.id.toString().includes(searchValue)
                );
              })
              .map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                      {customer.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 ">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: #{customer.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 ">
                      <span className="font-medium">Email:</span>{" "}
                      {customer.email}
                    </p>

                    <p className="text-gray-700 ">
                      <span className="font-medium">Phone:</span>{" "}
                      {customer.phoneNumber || "No phone"}
                    </p>

                    <p className="text-gray-700 ">
                      <span className="font-medium">Role:</span>{" "}
                      <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        {customer.role}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SellerCustomerDetails;