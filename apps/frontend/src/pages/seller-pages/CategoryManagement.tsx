import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authFetch } from "../../utils/api";
function CategoryManagement() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sidebaropen, setsidebar] = useState(false);
  const [deleteState, setDeleteState] = useState({
    show: false,
    id: null as any,
  });

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

  // LOAD CATEGORIES
  useEffect(() => {
    authFetch("http://localhost:8080/api/categories")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setCategories(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  // DELETE
  const handleDelete = async () => {
    await authFetch(`http://localhost:8080/api/categories/${deleteState.id}`, {
      method: "DELETE",
    });

    setCategories((prev) => prev.filter((c) => c.id !== deleteState.id));

    setDeleteState({ show: false, id: null });
  };

  const filtered = categories.filter((c) =>
    (c?.name || "").toLowerCase().includes(search.toLowerCase()),
  );
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen font-sans flex text-gray-800">
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
      <main className="w-full p-6 ">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Category Management
          </h2>

          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="border px-3 py-2 rounded border-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <button
              onClick={() => navigate("/category/add")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Status</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Impact</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{c.id}</td>

                    <td className="p-3 font-semibold text-gray-900">
                      {c.name}
                    </td>

                    <td className="p-3 text-gray-600">{c.description}</td>

                    <td className="p-3 text-gray-500">{c.slug}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          c.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      {c.discountType
                        ? `${c.discountValue}${c.discountType === "PERCENTAGE" ? "%" : "Rs"}`
                        : "No Discount"}
                    </td>

                    <td className="p-3 text-blue-600">
                      {c.discountedProductsCount || 0} products affected
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/category/edit/${c.id}`)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteState({ show: true, id: c.id })}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DELETE MODAL */}
        {deleteState.show && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-5 rounded shadow-lg">
              <p className="text-gray-800 font-medium">
                Are you sure you want to delete this category?
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setDeleteState({ show: false, id: null })}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoryManagement;
