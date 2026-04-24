import React, { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const categories = ["Furniture", "Electronics", "Clothing", "Books", "Toys"];

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

type Product = {
  id: number;
  name: string;
  code: string;
  description: string;
  price: string;
  category: string;
  images: { url: string; file?: File }[];
};

type DeleteState = { show: boolean; id: number | null };

function SellerProductManagement() {
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Modern Cupboard",
      code: "CP123",
      description: "A comfortable cupboard with racks.",
      price: "32000",
      category: "Aluminium",
      images: [
        {
          url: "/images/products.png",
        },
      ],
    },
    {
      id: 2,
      name: "Chair",
      code: "C456",
      description: "Quality Sri Lankan made chair",
      price: "4200",
      category: "Plastics",
      images: [
        {
          url: "/images/products.png",
        },
      ],
    },
    {
      id: 3,
      name: "wood table",
      code: "T789",
      description: "Newly arriaval teak table.",
      price: "25,000",
      category: "wood",
      images: [
        {
          url: "/images/products.png",
        },
      ],
    },
  ]);

  const [search, setSearch] = useState<string>("");
  const [form, setForm] = useState<Product>({
    id: 0,
    name: "",
    code: "",
    description: "",
    price: "",
    category: categories[0],
    images: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<DeleteState>({
    show: false,
    id: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm((prev) => ({
      ...prev,
      images: files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...form, id: editingId } : p)),
      );
    } else {
      setProducts((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setForm({
      id: 0,
      name: "",
      code: "",
      description: "",
      price: "",
      category: categories[0],
      images: [],
    });
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (product: Product) => {
    setForm({ ...product });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== showDelete.id));
    setShowDelete({ show: false, id: null });
  };

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

      <main className="bg-white flex-1 dark:bg-gray-900 min-h-screen p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 dark:text-gray-100">
            Product Management
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by Name or Code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition text-sm bg-white"
            />
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
              onClick={() => navigate("/products/add")}
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Code</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Price</th>
                <th className="px-3 py-2 text-left">Images</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{p.id}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.code}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2 text-green-600 font-semibold">
                      Rs{p.price}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        {p.images &&
                          p.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}
                              alt="Product"
                              className="w-8 h-8 rounded shadow"
                            />
                          ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 flex gap-1">
                      <button
                        className="bg-blue-100 hover:bg-blue-200 rounded p-1 transition"
                        onClick={() => navigate(`/products/edit/${p.id}`)}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="bg-red-100 hover:bg-red-200 rounded p-1 transition"
                        onClick={() => setShowDelete({ show: true, id: p.id })}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4">
                {editingId ? "Edit Product" : "Add Product"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Product Code"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  type="number"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
                <div className="flex gap-2 mt-2">
                  {form.images &&
                    form.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt="Preview"
                        className="w-10 h-10 rounded shadow"
                      />
                    ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow transition"
                >
                  {editingId ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {showDelete.show && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4 text-red-600">
                Confirm Delete
              </h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this product?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg transition"
                  onClick={() => setShowDelete({ show: false, id: null })}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                  onClick={handleDelete}
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
