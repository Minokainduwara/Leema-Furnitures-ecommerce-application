import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch, API_BASE } from "../../utils/api";

function AdminEditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authFetch(`${API_BASE}/api/categories/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load category");
        return res.json();
      })
      .then((data) => setForm({
        name: data.name ?? "",
        slug: data.slug ?? "",
        description: data.description ?? "",
        isActive: data.isActive ?? true,
      }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await authFetch(`${API_BASE}/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text() || "Update failed");
      navigate("/admin/categories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-stone-500">Loading category…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Edit Category #{id}</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
          <select
            name="isActive"
            value={form.isActive ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.value === "true" })
            }
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
          >
            {saving ? "Saving…" : "Update"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-5 py-2.5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEditCategory;
