import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function EditProduct() {
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

  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebaropen, setsidebar] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    name: "",
    code: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
    description: "",
    longDescription: "",
    status: "ACTIVE",
    imageUrl: "",
  });

  // ✅ handle input change
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ LOAD PRODUCT + CATEGORIES
  useEffect(() => {
    // product
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("FULL PRODUCT:", data);
        console.log("IMAGE VALUE:", data.image);

        setForm({
          name: data.name,
          code: data.sku,
          price: data.price,
          cost: data.cost,
          stock: data.stock,
          category: String(data.category?.id || ""),
          description: data.description,
          longDescription: data.longDescription,
          status: data.status,
          imageUrl:  data.image || "",
        });
      });

    // categories
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      });
  }, [id]);

  // ✅ UPDATE PRODUCT
const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    // ✅ basic validation (prevents 400 errors)
    if (!form.name || !form.code || !form.price || !form.category) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    // ✅ text fields
    formData.append("name", form.name);
    formData.append("sku", form.code);
    formData.append("description", form.description || "");
    formData.append("longDescription", form.longDescription || "");
    formData.append("status", form.status || "ACTIVE");

    // ✅ IMPORTANT: convert numbers properly (avoids 400 error)
    formData.append("price", String(Number(form.price)));
    formData.append("cost", String(Number(form.cost)));
    formData.append("stock", String(Number(form.stock)));
    formData.append("categoryId", String(Number(form.category)));

    // ✅ image (optional)
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // 🔍 DEBUG (remove later)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // ✅ API CALL
    const res = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    // ❌ backend error handling
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend Error:", errorText);
      throw new Error(errorText || "Update failed");
    }

    alert("✅ Product updated successfully");
    navigate("/products");

  } catch (err) {
    console.error("Update Error:", err);
    alert("❌ Update failed");
  }
};
const getImageUrl = (path: string) => {
  if (!path) return "";
  return `http://localhost:8080${path}`;
};
  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* SIDEBAR (UNCHANGED) */}
      <aside
              className={`bg-orange-400 w-70 h-screen fixed shadow-lg z-20 ${
                sidebaropen ? "translate-x-0" : "-translate-x-64"
              } lg:translate-x-0 lg:static transition-all flex flex-col`}
            >
              <div className="flex items-center gap-2 p-4 border-b border-white">
                <img src="/images/leemalogo.jpg" className="h-6 w-18" />
                <span className="font-bold text-gray-700 ">Seller Dashboard</span>
              </div>
      
              <nav className="flex-1 mt-6">
                {sideBarItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path!}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white hover:rounded-md"
                  >
                    <img src={item.icon} className="w-6 h-6" />
                    <span className="text-gray-900 font-medium">{item.name}</span>
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
      <main className="flex-1 h-screen pl-40 bg-gray-50 p-30 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Edit Product ID: {id}
          </h2>

          {/* NAME */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Product Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          />

          {/* SKU */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Product Code (SKU)
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          />

          {/* PRICE */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          />

          {/* COST */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Cost
          </label>
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          />

          {/* STOCK */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          />

          {/* CATEGORY */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          >
            <option value="">Select Category</option>
            {loadingCategories ? (
              <option>Loading...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>

          {/* STATUS */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DISCONTINUED">Discontinued</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* IMAGE */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: any) => setImageFile(e.target.files[0])}
            className="w-full border p-2 mb-3 rounded bg-white text-gray-700 border-gray-300"
          />

          {/* SHOW EXISTING IMAGE */}
          {form.imageUrl && !imageFile && (
            <img
              src={getImageUrl(form.imageUrl)}
              className="w-32 h-32 object-cover rounded mb-3 border"
            />
          )}

          {/* PREVIEW NEW IMAGE */}
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              className="w-32 h-32 object-cover rounded mb-3 border"
            />
          )}

          {/* DESCRIPTION */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Short Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          />

          {/* LONG DESCRIPTION */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Long Description
          </label>
          <textarea
            name="longDescription"
            value={form.longDescription}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded text-gray-700 border-gray-300"
          />

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              Update Product
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full"
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