import React, { useEffect, useState, useRef, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";
const EditIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function SellerProductManagement() {
  const [sidebaropen, setsidebar] = useState(false);
  const [darkmode, setdarkmode] = useState(false);
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showDelete, setShowDelete] = useState({ show: false, id: null });

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
    const loadProducts = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/products");

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await authFetch(
        `http://localhost:8080/api/products/${showDelete.id}`,
        { method: "DELETE" },
      );

      if (!res.ok) throw new Error("Delete failed");

      setProducts((prev) => prev.filter((p) => p.id !== showDelete.id));

      setShowDelete({ show: false, id: null });
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`bg-gray-100 min-h-screen flex `}>
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
      <main className="w-full min-h-screen p-6 bg-gray-50">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Product Management
          </h2>

          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="border px-3 py-2 rounded"
            />

            <button
              onClick={() => navigate("/products/add")}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Image</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Final Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center p-5">
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-5">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map(
                  (p) => (
                    console.log(p),
                    (
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="p-3  font-medium text-gray-700">
                          {p.id}
                        </td>

                        <td className="p-3 font-medium text-gray-700">
                          {p.name}
                        </td>

                        <td className="p-3  font-medium text-gray-700">
                          {p.sku}
                        </td>

                        <td className="p-3 font-medium text-gray-700">
                          {p.category?.name || "N/A"}
                        </td>

                        <td className="p-3 text-green-600 font-semibold">
                          Rs {p.price}
                        </td>

                        <td className="p-3">
                          {p.image ? (
                            <img
                              src={`http://localhost:8080${p.image}`}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="p-3 text-orange-600 font-semibold">
                          {p.discountType
                            ? p.discountType === "PERCENTAGE"
                              ? `${p.discountValue}% OFF`
                              : `Rs ${p.discountValue} OFF`
                            : "No Discount"}
                        </td>

                        <td className="p-3 text-green-600 font-bold">
                          Rs {p.finalPrice ?? p.price}
                        </td>

                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => navigate(`/products/edit/${p.id}`)}
                            className="p-2 bg-blue-100 rounded"
                          >
                            <EditIcon />
                          </button>

                          <button
                            onClick={() =>
                              setShowDelete({ show: true, id: p.id })
                            }
                            className="p-2 bg-red-100 rounded"
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    )
                  ),
                )
              )}
            </tbody>
          </table>
        </div>

        {/* DELETE MODAL */}
        {showDelete.show && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-4">Delete this product?</p>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDelete({ show: false, id: null })}
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

export default SellerProductManagement;
