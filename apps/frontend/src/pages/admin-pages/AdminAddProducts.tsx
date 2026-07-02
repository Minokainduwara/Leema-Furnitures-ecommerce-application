import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminAddProduct() {
  const navigate = useNavigate();

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
  });

  // handle input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!form.name || !form.code || !form.price || !form.category) {
        alert("Please fill all required fields");
        return;
      }

      if (!imageFile) {
        alert("Please select an image");
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("sku", form.code);
      formData.append("description", form.description || "");
      formData.append("longDescription", form.longDescription || "");

      formData.append("price", form.price);
      formData.append("cost", form.cost || "0");
      formData.append("stock", form.stock || "0");
      formData.append("categoryId", form.category);
      formData.append("status", form.status);

      // IMPORTANT
      formData.append("image", imageFile);

      // DEBUG
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();

      console.log(text);

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

  // load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories");

        if (!res.ok) throw new Error("Failed to load categories");

        const data = await res.json();

        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 text-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold mb-6">Add Product</h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          name="code"
          placeholder="Product Code"
          value={form.code}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        >
          <option value="">Select Category</option>

          {loadingCategories ? (
            <option value="">Loading...</option>
          ) : (
            categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DISCONTINUED">Discontinued</option>
          <option value="DRAFT">Draft</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            console.log("SELECTED FILE:", file);

            if (file) {
              setImageFile(file);
            }
          }}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <textarea
          name="description"
          placeholder="Short Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <textarea
          name="longDescription"
          placeholder="Long Description"
          value={form.longDescription}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded text-black"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Save Product
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAddProduct;