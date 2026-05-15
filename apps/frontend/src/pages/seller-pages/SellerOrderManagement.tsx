import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";
/* ================= TYPES ================= */

type Order = {
  id: number;
  userId?: number;
  orderNumber?: string;
  totalAmount?: number;
  status: string;
  customerName?: string;
  paymentStatus?: string;
  phone?: string;
  address?: string;
  estimatedCost?: number;
  items: any[];
};

/* ================= COMPONENT ================= */

function SellerOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>("");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [sidebaropen, setsidebar] = useState(false);
  const [showRepairForm, setShowRepairForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const [issue, setIssue] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
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
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/orders/all");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  const searchOrders = async (query: string) => {
    setSearch(query);

    if (!query) {
      loadOrders();
      return;
    }

    try {
      const res = await authFetch(
        `http://localhost:8080/api/orders/search?query=${query}`,
      );

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const filterByStatus = async (status: string) => {
    const res = await authFetch(
      `http://localhost:8080/api/orders/status?status=${status}`,
    );

    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const filterByDate = async (type: string) => {
    const res = await authFetch(
      `http://localhost:8080/api/orders/filter?type=${type}`,
    );

    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getPaymentStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "REFUNDED":
        return "bg-purple-100 text-purple-700";
      case "CANCELLED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await authFetch(`http://localhost:8080/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadOrders();
  };
  const updatePaymentStatus = async (id: number, status: string) => {
    await authFetch(`http://localhost:8080/api/orders/${id}/payment-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: status }),
    });

    loadOrders();
  };
  const submitRepair = async () => {
    try {
      await authFetch("http://localhost:8080/api/repairs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: orders.find((o) => o.id === selectedOrderId)?.userId,
          orderId: selectedOrderId,
          productId: selectedProductId,
          issueDescription: issue,
          estimatedCost: Number(estimatedCost),
        }),
      });

      alert("Repair Created ✅");

      setShowRepairForm(false);
      setIssue("");
      setEstimatedCost("");
    } catch (err) {
      console.error(err);
      alert("Error creating repair ❌");
    }
  };
  const openRepairForm = (orderId: number, productId: number) => {
    setSelectedOrderId(orderId);
    setSelectedProductId(productId);
    setShowRepairForm(true);
  };

  return (
    <div className="min-h-screen flex bg-white">
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
      <main className=" p-6 w-full text-gray-900">
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Order Management</h1>

          <input
            className="border px-3 py-2 rounded border-gray-200"
            placeholder="Search by Order ID "
            value={search}
            onChange={(e) => searchOrders(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* STATUS FILTER */}
          <button
            onClick={() => loadOrders()}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            All
          </button>

          <button
            onClick={() => filterByStatus("PENDING")}
            className="px-3 py-1 bg-yellow-200 rounded"
          >
            Pending
          </button>

          <button
            onClick={() => filterByStatus("DELIVERED")}
            className="px-3 py-1 bg-green-200 rounded"
          >
            Delivered
          </button>

          <button
            onClick={() => filterByStatus("CANCELLED")}
            className="px-3 py-1 bg-red-200 rounded"
          >
            Cancelled
          </button>

          {/* DATE FILTER */}
          <button
            onClick={() => filterByDate("TODAY")}
            className="px-3 py-1 bg-blue-100 rounded"
          >
            Today
          </button>

          <button
            onClick={() => filterByDate("WEEK")}
            className="px-3 py-1 bg-blue-100 rounded"
          >
            This Week
          </button>

          <button
            onClick={() => filterByDate("MONTH")}
            className="px-3 py-1 bg-blue-100 rounded"
          >
            This Month
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Status</th>
                <th className="p-3">Items</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Total</th>
                <th className="p-3">Change</th>
                <th className="p-3">Payment status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3 font-semibold">
                    {order.orderNumber || order.id}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {order.items?.map((i, idx) => (
                      <div key={idx}>
                        {i.productName} × {i.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="p-3">
                    {order.items?.map((i, idx) => (
                      <div key={idx}>Rs {i.unitPrice}</div>
                    ))}
                  </td>

                  <td className="p-3 font-bold">Rs {order.totalAmount}</td>

                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border px-2 py-1"
                    >
                      <option>PENDING</option>
                      <option>CONFIRMED</option>
                      <option>PROCESSING</option>
                      <option>SHIPPED</option>
                      <option>DELIVERED</option>
                      <option>CANCELLED</option>
                      <option>REFUNDED</option>
                      <option>RETURNED</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getPaymentStyle(order.paymentStatus || "PENDING")}`}
                    >
                      {order.paymentStatus || "PENDING"}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.paymentStatus || "PENDING"}
                      onChange={(e) =>
                        updatePaymentStatus(order.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option>PENDING</option>
                      <option>COMPLETED</option>
                      <option>FAILED</option>
                      <option>REFUNDED</option>
                      <option>CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setViewOrder(order)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {viewOrder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="font-bold mb-3">Order Details</h2>

              <p>
                <b>Order:</b> {viewOrder.orderNumber}
              </p>
              <p>
                <b>Status:</b> {viewOrder.status}
              </p>
              <p>
                <b>Total:</b> Rs {viewOrder.totalAmount}
              </p>

              <div className="mt-2">
                <b>Items:</b>
                {viewOrder.items?.map((i, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center mb-2"
                  >
                    <div>
                      {i.productName} × {i.quantity}
                    </div>

                    <button
                      onClick={() => openRepairForm(viewOrder.id, i.productId)}
                      className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Add Repair
                    </button>
                  </div>
                ))}
              </div>

              <p>
                <b>Name:</b> {viewOrder.customerName}
              </p>
              <p>
                <b>Phone:</b> {viewOrder.phone}
              </p>
              <p>
                <b>Address:</b> {viewOrder.address}
              </p>

              <button
                className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => setViewOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showRepairForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-80">
              <h3 className="font-bold mb-3">Add Repair</h3>

              <input
                className="border w-full mb-2 px-2 py-1"
                placeholder="Issue Description"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              />

              <input
                className="border w-full mb-2 px-2 py-1"
                type="number"
                placeholder="Estimated Cost"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />

              <div className="flex justify-between">
                <button
                  onClick={submitRepair}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Submit
                </button>

                <button
                  onClick={() => setShowRepairForm(false)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
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

export default SellerOrderManagement;