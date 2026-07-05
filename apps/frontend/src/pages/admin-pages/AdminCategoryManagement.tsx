import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch, API_BASE } from "../../utils/api";

// ─────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

function AdminCategoryManagement() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteState, setDeleteState] = useState({
    show: false,
    id: null as any,
    name: "" as string,
  });

  // LOAD
  useEffect(() => {
    authFetch(`${API_BASE}/api/categories`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setCategories(data || []);
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
    await authFetch(`${API_BASE}/api/categories/${deleteState.id}`, {
      method: "DELETE",
    });
    setCategories((prev) => prev.filter((c) => c.id !== deleteState.id));
    setDeleteState({ show: false, id: null, name: "" });
  };

  const filtered = categories.filter((c) =>
    (c?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Category Management</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category..."
            className="border px-3 py-2 rounded bg-white text-black placeholder-gray-500 outline-none"
          />
          <button
            onClick={() => navigate("/admin/categories/add")}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Add Category
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
              <th className="p-3">Description</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-400">
                  No categories found
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-t text-gray-800 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-500">{c.id}</td>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-gray-500">{c.description || "—"}</td>
                  <td className="p-3 text-gray-500">{c.slug || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        c.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/categories/edit/${c.id}`)}
                      className="p-2 bg-blue-100 rounded"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteState({ show: true, id: c.id, name: c.name })
                      }
                      className="p-2 bg-red-100 rounded"
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

      {/* DELETE MODAL */}
      {deleteState.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p className="mb-4 text-gray-700">
              Delete category{" "}
              <span className="font-semibold">{deleteState.name}</span>?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteState({ show: false, id: null, name: "" })}
                className="px-3 py-1 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategoryManagement;