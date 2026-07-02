import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch, API_BASE } from "../../utils/api";

function AdminAddCategory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await authFetch(`${API_BASE}/api/categories`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }
      alert("Category added successfully");
      navigate("/admin/categories");
    } catch (err: any) {
      alert(`Failed to add category: ${err.message || err}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-[420px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Add Category
        </h2>

        {/* NAME */}
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Category Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 mb-4 rounded text-gray-700"
          placeholder="Enter category name"
        />

        {/* SLUG */}
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Slug
        </label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded border-gray-300 text-gray-700"
          placeholder="category-slug"
        />

        {/* DESCRIPTION */}
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded border-gray-300 text-gray-700"
          placeholder="Enter description"
        />

        {/* STATUS */}
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Status
        </label>

        <select
          name="isActive"
          value={form.isActive ? "true" : "false"}
          onChange={(e) =>
            setForm({
              ...form,
              isActive: e.target.value === "true",
            })
          }
          className="w-full border p-2 mb-4 rounded border-gray-300 text-gray-700"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* BUTTONS */}
        <div className="flex gap-2">

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Save
          </button>

          {/* FIXED ROUTE */}
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="bg-gray-400 text-white px-4 py-2 rounded w-full"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminAddCategory;