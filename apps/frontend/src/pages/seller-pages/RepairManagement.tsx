import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";

type User = {
  id: number;
  name: string;
  email: string;
};

type BillingAddress = {
  id: number;
  user?: User;
};

type Order = {
  id: number;
  billingAddress?: BillingAddress;
};
type Repair = {
  id: number;
  issueDescription: string;
  type: string;
  status: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt?: string;
  userId?: number;
  productId?: number;
  user?: {
    id: number;
    email?: string;
    name?: string;
  };
  order?: {
    id: number;
    orderNumber: string;
  };
};

function RepairManagement() {
  const [showCreate, setShowCreate] = useState(false);

  const [editRepair, setEditRepair] = useState<Repair | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);
  const [newRepair, setNewRepair] = useState({
    orderNumber: "",
    sku: "",
    issueDescription: "",
    type: "REPAIR" as "REPAIR" | "REFUND" | "REINSTALLMENT",
  });
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [search, setSearch] = useState("");
  const [viewRepair, setViewRepair] = useState<Repair | null>(null);
  const [sidebaropen, setsidebar] = useState(false);
  const navigate = useNavigate();

  const sideBarItems = [
    {
      name: "Dashboard",
      icon: "/images/dashboard.png",
      path: "/seller/dashboard",
    },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Category", icon: "/images/category.png", path: "/category" },

    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Inventory", icon: "/images/inventory.png", path: "/inventory" },
    { name: "Repair", icon: "/images/service.png", path: "/repairs" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },

    { name: "notification", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    const res = await authFetch("http://localhost:8080/api/repairs");
    const data = await res.json();
    console.log("REPAIRS DATA:", data);
    setRepairs(Array.isArray(data) ? data : []);
  };

  /* ================= FILTER ================= */

  const filterByStatus = async (status: string) => {
    if (status === "ALL") return loadRepairs();

    const res = await authFetch(
      `http://localhost:8080/api/repairs/status?status=${status}`,
    );
    const data = await res.json();
    setRepairs(Array.isArray(data) ? data : []);
  };

  /* ================= SEARCH ================= */

  const searchRepairs = (query: string) => {
    setSearch(query);

    const filtered = repairs.filter((r) => {
      return (
        r.issueDescription?.toLowerCase().includes(query.toLowerCase()) ||
        r.order?.orderNumber?.toLowerCase().includes(query.toLowerCase())
      );
    });

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
    await authFetch(`http://localhost:8080/api/repairs/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadRepairs();
  };
  const getUser = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/users/${id}`);
    const data = await res.json();
    setCustomer(data);
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
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className=" w-full p-6 text-gray-900 ">
        {/* HEADER */}
        <div className="flex justify-between mb-4 overflow-y-auto">
          <h1 className="text-xl font-bold">Repair Management</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowCreate(true)}
              className="bg-green-500 text-white px-3 py-2 rounded"
            >
              + Add Repair
            </button>
            <input
              className="border px-3 py-2 rounded border-gray-300"
              placeholder="Search by order ID"
              value={search}
              onChange={(e) => searchRepairs(e.target.value)}
            />
          </div>
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
        <div className="bg-white shadow rounded overflow-x-auto overflow-y-auto">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Issue</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Estimated cost</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {repairs.map(
                  (r) => (
                    console.log(r),
                    (
                      <tr key={r.id} className="border-t">
                        <td className="p-3">{r.id}</td>

                        <td className="p-3">{r.issueDescription}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded text-xs">
                            {r.type}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusStyle(r.status)}`}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="p-3">Rs {r.estimatedCost}</td>

                        <td className="p-3">{r.order?.orderNumber || "-"}</td>

                        <td className="p-3 flex gap-2">
                          <button
                            onClick={async () => {
                              setViewRepair(r);

                              console.log("USER ID:", r.user?.id);
                              console.log("ORDER ID:", r.order?.id);

                              // 1. Load customer
                              await getUser(r.user?.id!);

                              // 2. Load history
                              const historyRes = await authFetch(
                                `http://localhost:8080/api/repairs/order/${r.order?.id}`,
                              );

                              setServiceHistory(await historyRes.json());
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditRepair(r)}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Edit
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
                    )
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {/* MODAL */}
        {viewRepair && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-5 rounded w-[500px] max-h-[80vh] overflow-y-auto overflow-x-auto">
              <h2 className="text-lg font-bold mb-3">Repair Details</h2>

              <p>
                <b>Issue:</b> {viewRepair.issueDescription}
              </p>
              <p>
                <b>Status:</b> {viewRepair.status}
              </p>

              {/* ✅ CUSTOMER */}
              {customer && (
                <div className="border p-2 rounded bg-gray-50 mt-3">
                  <h3 className="font-bold">Customer</h3>
                  <p>Name: {customer.name}</p>
                  <p>Email: {customer.email}</p>
                  <p>Phone: {customer.phoneNumber}</p>
                </div>
              )}

              {/* ✅ HISTORY */}
              <div className="border p-2 rounded bg-gray-50 mt-3">
                <h3 className="font-bold">Service History</h3>

                {serviceHistory.length === 0 ? (
                  <p>No history</p>
                ) : (
                  serviceHistory.map((h) => (
                    <div key={h.id} className="border-b py-1">
                      <p>Status: {h.status}</p>
                      <p>Type: {h.type}</p>
                      <p>Issue: {h.issueDescription}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setViewRepair(null);
                  setCustomer(null);
                  setServiceHistory([]);
                }}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {editRepair && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96 space-y-3">
              <h2 className="font-bold">Update Repair</h2>

              <input
                type="number"
                placeholder="Estimated Cost"
                value={editRepair.estimatedCost || ""}
                onChange={(e) =>
                  setEditRepair({
                    ...editRepair,
                    estimatedCost: Number(e.target.value),
                  })
                }
                className="border p-2 w-full"
              />

              <select
                value={editRepair.status}
                onChange={(e) =>
                  setEditRepair({
                    ...editRepair,
                    status: e.target.value,
                  })
                }
                className="border p-2 w-full"
              >
                <option value="REQUESTED">REQUESTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="REJECTED">REJECTED</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await authFetch(
                      `http://localhost:8080/api/repairs/${editRepair.id}/update`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          status: editRepair.status,
                          estimatedCost: editRepair.estimatedCost,
                        }),
                      },
                    );

                    setEditRepair(null);
                    loadRepairs();
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditRepair(null)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96 space-y-3">
              <h2 className="font-bold text-lg">Create Repair Request</h2>

              {/* ORDER NUMBER */}
              <input
                type="text"
                placeholder="Order Number"
                value={newRepair.orderNumber}
                onChange={(e) =>
                  setNewRepair({ ...newRepair, orderNumber: e.target.value })
                }
                className="border p-2 w-full"
              />

              {/* SKU */}
              <input
                type="text"
                placeholder="Product SKU"
                value={newRepair.sku}
                onChange={(e) =>
                  setNewRepair({ ...newRepair, sku: e.target.value })
                }
                className="border p-2 w-full"
              />

              {/* ISSUE DESCRIPTION */}
              <textarea
                placeholder="Issue Description"
                value={newRepair.issueDescription}
                onChange={(e) =>
                  setNewRepair({
                    ...newRepair,
                    issueDescription: e.target.value,
                  })
                }
                className="border p-2 w-full"
              />

              {/* TYPE SELECT */}
              <select
                value={newRepair.type}
                onChange={(e) =>
                  setNewRepair({
                    ...newRepair,
                    type: e.target.value as
                      | "REPAIR"
                      | "REFUND"
                      | "REINSTALLMENT",
                  })
                }
                className="border p-2 w-full"
              >
                <option value="REPAIR">Repair</option>
                <option value="REFUND">Refund</option>
                <option value="REINSTALLMENT">Reinstallment</option>
              </select>

              {/* BUTTONS */}
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      await authFetch("http://localhost:8080/api/repairs", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newRepair),
                      });

                      // reset form
                      setNewRepair({
                        orderNumber: "",
                        sku: "",
                        issueDescription: "",
                        type: "REPAIR",
                      });

                      setShowCreate(false);
                      loadRepairs();
                    } catch (err) {
                      console.error("Create repair failed:", err);
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>

                <button
                  onClick={() => setShowCreate(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default RepairManagement;
