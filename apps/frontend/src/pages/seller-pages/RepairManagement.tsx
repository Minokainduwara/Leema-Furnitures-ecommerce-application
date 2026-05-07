import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ================= TYPES ================= */

type Repair = {
  id: number;
  issueDescription: string;
  status: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt?: string;
  userId?: number;
  productId?: number;
  order?: {
    id: number;
    orderNumber: string;
  };

};

/* ================= COMPONENT ================= */

function RepairManagement() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [search, setSearch] = useState("");
  const [viewRepair, setViewRepair] = useState<Repair | null>(null);
  const [sidebaropen, setsidebar] = useState(false);

  /* ================= SIDEBAR ================= */

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

  /* ================= LOAD ================= */

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    const res = await fetch("http://localhost:8080/api/repairs");
    const data = await res.json();
    console.log("REPAIRS DATA:", data);
    setRepairs(Array.isArray(data) ? data : []);
  };

  /* ================= FILTER ================= */

  const filterByStatus = async (status: string) => {
    if (status === "ALL") return loadRepairs();

    const res = await fetch(
      `http://localhost:8080/api/repairs/status?status=${status}`,
    );
    const data = await res.json();
    setRepairs(Array.isArray(data) ? data : []);
  };

  /* ================= SEARCH ================= */

  const searchRepairs = (query: string) => {
    setSearch(query);

    const filtered = repairs.filter((r) =>
      r.issueDescription?.toLowerCase().includes(query.toLowerCase()),
    );

    setRepairs(filtered);
  };

  /* ================= STATUS STYLE ================= */

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id: number, status: string) => {
    await fetch(`http://localhost:8080/api/repairs/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadRepairs();
  };

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
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
      <main className=" w-full p-6 text-gray-900">
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Repair Management</h1>

          <input
            className="border px-3 py-2 rounded border-gray-300"
            placeholder="Search issue..."
            value={search}
            onChange={(e) => searchRepairs(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={loadRepairs}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            All
          </button>
          <button
            onClick={() => filterByStatus("REQUESTED")}
            className="px-3 py-1 bg-yellow-200 rounded"
          >
            Requested
          </button>
          <button
            onClick={() => filterByStatus("IN_PROGRESS")}
            className="px-3 py-1 bg-blue-200 rounded"
          >
            In Progress
          </button>
          <button
            onClick={() => filterByStatus("COMPLETED")}
            className="px-3 py-1 bg-green-200 rounded"
          >
            Completed
          </button>
          <button
            onClick={() => filterByStatus("REJECTED")}
            className="px-3 py-1 bg-red-200 rounded"
          >
            Rejected
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Status</th>
                <th className="p-3">Estimated cost</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {repairs.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.id}</td>

                  <td className="p-3">{r.issueDescription}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusStyle(r.status)}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3">Rs {r.estimatedCost}</td>

                  <td className="p-3">{r.order?.orderNumber|| "-"}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setViewRepair(r)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>

                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="border px-2 py-1"
                    >
                      <option>REQUESTED</option>
                      <option>IN_PROGRESS</option>
                      <option>COMPLETED</option>
                      <option>REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {viewRepair && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="font-bold mb-3">Repair Details</h2>

              <p>
                <b>ID:</b> {viewRepair.id}
              </p>
              <p>
                <b>Status:</b> {viewRepair.status}
              </p>
              <p>
                <b>Issue:</b> {viewRepair.issueDescription}
              </p>
              <p>
                <b>Estimated:</b> Rs {viewRepair.estimatedCost}
              </p>
              <p>
                <b>Actual:</b> Rs {viewRepair.actualCost}
              </p>
              <p>
                <b>Date:</b> {viewRepair.createdAt}
              </p>

              <button
                onClick={() => setViewRepair(null)}
                className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default RepairManagement;
