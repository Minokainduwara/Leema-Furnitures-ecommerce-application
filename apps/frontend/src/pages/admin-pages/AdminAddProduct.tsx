import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch, API_BASE } from "../../utils/api";

function AdminAddProduct() {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    name: "",
    skuDigits: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
    description: "",
    longDescription: "",
    status: "ACTIVE",
    type: "TEKA",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!form.name || !form.skuDigits || !form.price || !form.category) {
        alert("Please fill required fields");
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("skuDigits", form.skuDigits);
      formData.append("price", form.price);
      formData.append("cost", form.cost || "0");
      formData.append("stock", form.stock || "0");
      formData.append("description", form.description);
      formData.append("longDescription", form.longDescription);
      formData.append("status", form.status);
      formData.append("type", form.type); // ✅ REQUIRED
      formData.append("categoryId", form.category);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await authFetch(`${API_BASE}/api/products/add`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text);
      }

      alert("Product added successfully");
      navigate("/admin/products");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 rounded shadow text-stone-600"
      >
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <input
          name="skuDigits"
          placeholder="SKU"
          value={form.skuDigits}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        >
          <option value="TEKA">TEKA</option>
          <option value="OTHER">OTHER</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="DISCONTINUED">DISCONTINUED</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <textarea
          name="longDescription"
          placeholder="Long Description"
          value={form.longDescription}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full mb-3"
        />

        <button className="bg-green-600 text-white px-4 py-2 w-full">
          Save Product
        </button>
      </form>
    </div>
  );
}

export default AdminAddProduct;