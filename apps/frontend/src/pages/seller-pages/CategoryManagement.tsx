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

  // LOAD CATEGORIES
  useEffect(() => {
    Promise.all([
      authFetch("http://localhost:8080/api/categories").then((res) =>
        res.json(),
      ),
      authFetch("http://localhost:8080/api/seller/category-discounts").then(
        (res) => res.json(),
      ),
    ])
      .then(([categoriesData, discountsData]) => {
        // 🔥 merge discount into categories
        const merged = categoriesData.map((cat: any) => {
          const discount = discountsData.find(
            (d: any) => d.category?.id === cat.id,
          );

          return {
            ...cat,
            discountType: discount?.discountType || null,
            discountValue: discount?.value || null,
          };
        });

        setCategories(merged);
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
  const handleRemoveDiscount = async (categoryId: number) => {
    try {
      // 🔥 find discount for this category
      const res = await authFetch(
        "http://localhost:8080/api/seller/category-discounts",
      );
      const discounts = await res.json();

      const discount = discounts.find(
        (d: any) => d.category?.id === categoryId,
      );

      if (!discount) return;

      // 🔥 delete discount
      await authFetch(
        `http://localhost:8080/api/seller/category-discounts/${discount.id}`,
        { method: "DELETE" },
      );

      // ✅ update UI instantly
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, discountType: null, discountValue: null }
            : c,
        ),
      );
    } catch (err) {
      console.error(err);
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
      <main className="w-full p-8 h-screen bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 overflow-y-auto">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Category Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage product categories, discounts and visibility
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="w-full md:w-72 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />

            <button
              onClick={() => navigate("/category/add")}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-xl 
        shadow-md hover:scale-[1.02] transition font-medium"
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-5 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700">
              Category List
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Impact</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      Loading categories...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4 text-gray-500">{c.id}</td>

                      <td className="p-4 font-semibold text-gray-800">
                        {c.name}
                      </td>

                      <td className="p-4 text-gray-600">{c.description}</td>

                      <td className="p-4 text-gray-500">{c.slug}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                      c.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                        >
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-4">
                        {c.discountType ? (
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-semibold ${
                                c.discountType === "PERCENTAGE"
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {c.discountType === "PERCENTAGE"
                                ? `${c.discountValue}% OFF`
                                : `Rs ${c.discountValue} OFF`}
                            </span>

                            <span className="text-xs text-gray-400">
                              Active Discount
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Discount
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                          {c.discountedProductsCount || 0} products affected
                        </span>
                      </td>

                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => navigate(`/category/edit/${c.id}`)}
                          className="px-3 py-1.5 rounded-lg text-sm bg-blue-100 text-blue-700 
                    hover:bg-blue-200 transition"
                        >
                          Edit
                        </button>
                        {c.discountType && (
                          <button
                            onClick={() => handleRemoveDiscount(c.id)}
                            className="px-3 py-1.5 rounded-lg text-sm bg-yellow-100 text-yellow-700 
      hover:bg-yellow-200 transition"
                          >
                            Remove Discount
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setDeleteState({ show: true, id: c.id })
                          }
                          className="px-3 py-1.5 rounded-lg text-sm bg-red-100 text-red-700 
                    hover:bg-red-200 transition"
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
        </div>

        {/* DELETE MODAL */}
        {deleteState.show && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Category
              </h3>

              <p className="text-gray-500 text-sm">
                Are you sure you want to delete this category? This action
                cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setDeleteState({ show: false, id: null })}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
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
