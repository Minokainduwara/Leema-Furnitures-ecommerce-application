import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";
function EditProduct() {
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebaropen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    name: "",
    code: "",
    price: "",
    cost: "",
    stock: "",
    categoryId: 0,
    description: "",
    longDescription: "",
    status: "ACTIVE",
    imageUrl: "",
    discountType: "",
    discountValue: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getImageUrl = (path: string) =>
    path ? `http://localhost:8080${path}` : "";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  // LOAD
  useEffect(() => {
    authFetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          name: data.name,
          code: data.sku,
          price: data.price,
          cost: data.cost,
          stock: data.stock,
          categoryId: data.category?.id ?? "",
          description: data.description,
          longDescription: data.longDescription,
          status: data.status,
          imageUrl: data.image || "",
        }));
      });

    authFetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      });
  }, [id]);

  // UPDATE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("sku", form.code);
    formData.append("price", form.price ? String(Number(form.price)) : "0");
    formData.append("cost", form.cost ? String(Number(form.cost)) : "0");
    formData.append("stock", form.stock ? String(Number(form.stock)) : "0");
    formData.append("description", form.description);
    formData.append("longDescription", form.longDescription);
    formData.append("status", (form.status || "ACTIVE").toUpperCase().trim());
    formData.append(
      "categoryId",
      form.categoryId ? String(Number(form.categoryId)) : "0",
    );
    if (imageFile) formData.append("image", imageFile);

    const res = await authFetch(`http://localhost:8080/api/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    if (form.discountType && form.discountValue) {
      await authFetch("http://localhost:8080/api/product-discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(id),
          discountType: form.discountType,
          value: Number(form.discountValue),
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      });
    }

    alert("Updated successfully");
    navigate("/products");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex overflow-hidden">
      {/* SIDEBAR (UNCHANGED) */}
      <aside
        className={`bg-gray-900 w-70 h-screen fixed shadow-lg z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-white">
          <img src="/images/leemalogo.jpg" className="h-6 w-18" />
          <span className="font-bold text-white">Seller Dashboard</span>
        </div>

        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path!}
              className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500"
            >
              <img src={item.icon} className="w-6 h-6" />
              <span className="text-white">{item.name}</span>
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

      {/* MAIN FIXED AREA */}
      <main className="w-full  p-6 overflow-y-auto h-screen">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Edit Product
          </h2>

          {/* NAME */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          {/* SKU */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Code (SKU)
          </label>
          <input
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            name="code"
            value={form.code}
            onChange={handleChange}
          />

          {/* PRICE */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            name="price"
            value={form.price}
            onChange={handleChange}
          />

          {/* COST */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost
          </label>
          <input
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            name="cost"
            value={form.cost}
            onChange={handleChange}
          />

          {/* STOCK */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />

          {/* CATEGORY */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            value={form.categoryId || ""}
            onChange={(e) =>
              setForm({ ...form, categoryId: Number(e.target.value) })
            }
          >
            <option className="text-gray-700" value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option className="text-gray-700" key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* IMAGE */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            className="mb-3 text-gray-700"
            onChange={(e: any) => setImageFile(e.target.files[0])}
          />

          {form.imageUrl && !imageFile && (
            <img src={getImageUrl(form.imageUrl)} className="w-28 h-28 mb-3" />
          )}

          {/* DESCRIPTION */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <textarea
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          {/* LONG DESCRIPTION */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Long Description
          </label>
          <textarea
            className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
            name="longDescription"
            value={form.longDescription}
            onChange={handleChange}
          />

          {/* DISCOUNT SECTION */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Discount (Optional)
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
            >
              <option value="">No Discount</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <input
              className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              className="w-full border p-2 mb-3 border-gray-300 text-gray-700"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-600 text-white w-full py-2 rounded">
              Update
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-gray-400 text-white w-full py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProduct;
