import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminEditProduct() {
  const { id } = useParams();
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
    imageUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // LOAD PRODUCT + CATEGORIES
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();

        setForm({
          name: data.name ?? "",
          code: data.sku ?? "",
          price: data.price !== null ? String(data.price) : "",
          cost: data.cost !== null ? String(data.cost) : "",
          stock: data.stock !== null ? String(data.stock) : "",
          category: data.category?.id ? String(data.category.id) : "",
          description: data.description ?? "",
          longDescription: data.longDescription ?? "",
          status: data.status ?? "ACTIVE",
          imageUrl: data.image ?? "",
        });
      } catch (err) {
        console.error("Product load error:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories");
        if (!res.ok) throw new Error("Failed to load categories");

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  // SUBMIT (FULLY FIXED VALIDATION)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim();
    const sku = form.code.trim();

    const price = Number(form.price);
    const cost = Number(form.cost || 0);
    const stock = Number(form.stock || 0);
    const categoryId = Number(form.category);

    // ✅ STRICT VALIDATION FIXED
    if (
      !name ||
      !sku ||
      !form.category ||
      Number.isNaN(price) ||
      Number.isNaN(categoryId)
    ) {
      alert("Please fill required fields (Name, SKU, Price, Category)");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("sku", sku);
      formData.append("price", String(price));
      formData.append("cost", String(cost));
      formData.append("stock", String(stock));
      formData.append("categoryId", String(categoryId));

      formData.append("description", form.description || "");
      formData.append("longDescription", form.longDescription || "");
      formData.append("status", form.status.toUpperCase());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(
        `http://localhost:8080/api/products/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    return `http://localhost:8080${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Product #{id}</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="SKU"
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          type="number"
          name="cost"
          value={form.cost}
          onChange={handleChange}
          placeholder="Cost"
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
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
            <option>Loading...</option>
          ) : (
            categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
          onChange={(e: any) => setImageFile(e.target.files[0])}
          className="w-full border p-2 mb-3 rounded text-black"
        />

        {form.imageUrl && !imageFile && (
          <img
            src={getImageUrl(form.imageUrl)}
            className="w-32 h-32 object-cover mb-3 rounded border"
          />
        )}

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            className="w-32 h-32 object-cover mb-3 rounded border"
          />
        )}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short Description"
          className="w-full border p-2 mb-3 rounded text-black"
        />

        <textarea
          name="longDescription"
          value={form.longDescription}
          onChange={handleChange}
          placeholder="Long Description"
          className="w-full border p-2 mb-4 rounded text-black"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Update
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

export default AdminEditProduct;