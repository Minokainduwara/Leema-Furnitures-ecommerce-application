import React, { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type UserRole = "admin" | "user" | "seller";
export type UserStatus = "active" | "inactive" | "suspended" | "deleted";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface UpdateStatusRequest {
  status: UserStatus;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
}

// ─────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────

const BASE = "http://localhost:8080/api/admin/users";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: authHeaders() });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  const json: ApiResponse<T> = await res.json();
  return json.data;
}

const api = {
  getUsers: (params: {
    role?: string;
    status?: string;
    search?: string;
    page: number;
    size: number;
  }) => {
    const q = new URLSearchParams();
    if (params.role && params.role !== "All") q.set("role", params.role);
    if (params.status && params.status !== "All") q.set("status", params.status);
    if (params.search) q.set("search", params.search);
    q.set("page", String(params.page));
    q.set("size", String(params.size));
    return apiFetch<SpringPage<AdminUser>>(`${BASE}?${q.toString()}`);
  },

  getUserById: (id: number) => apiFetch<AdminUser>(`${BASE}/${id}`),

  createUser: (body: CreateUserRequest) =>
    apiFetch<AdminUser>(BASE, { method: "POST", body: JSON.stringify(body) }),

  updateUserStatus: (id: number, body: UpdateStatusRequest) =>
    apiFetch<AdminUser>(`${BASE}/${id}/status`, { method: "PATCH", body: JSON.stringify(body) }),

  updateUserRole: (id: number, role: UserRole) =>
    apiFetch<AdminUser>(`${BASE}/${id}/role?role=${role}`, { method: "PATCH" }),

  deleteUser: async (id: number) => {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
};

// ─────────────────────────────────────────────────────────────
// BADGE STYLES
// ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  suspended: "bg-red-100 text-red-600",
  deleted: "bg-black text-white",
};

const ROLE_STYLES: Record<UserRole, string> = {
  admin: "bg-blue-100 text-blue-700",
  seller: "bg-orange-100 text-orange-700",
  user: "bg-gray-100 text-gray-500",
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold ${className}`}>{children}</span>
);

const Spinner = () => (
  <tr>
    <td colSpan={6} className="text-center p-8 text-gray-500">Loading...</td>
  </tr>
);

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [editStatus, setEditStatus] = useState<UserStatus>("active");
  const [editRole, setEditRole] = useState<UserRole>("user");
  const [editLoading, setEditLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user" as UserRole,
    status: "active" as UserStatus,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPage(0), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.getUsers({ search, role: roleFilter, status: statusFilter, page, size: pageSize });
      setUsers(result.content);
      setTotalPages(result.totalPages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── CREATE ──
  const handleCreate = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      alert("Name, email and password are required");
      return;
    }
    if (createForm.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    setCreateLoading(true);
    try {
      await api.createUser({
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        phoneNumber: createForm.phoneNumber || undefined,
        role: createForm.role,
        status: createForm.status,
      });
      setCreateOpen(false);
      setCreateForm({ name: "", email: "", password: "", phoneNumber: "", role: "user", status: "active" });
      setPage(0);
      fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  // ── EDIT ──
  const openEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setEditStatus(user.status);
    setEditRole(user.role);
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    setEditLoading(true);
    try {
      const promises: Promise<AdminUser>[] = [];
      if (selectedUser.status !== editStatus)
        promises.push(api.updateUserStatus(selectedUser.id, { status: editStatus }));
      if (selectedUser.role !== editRole)
        promises.push(api.updateUserRole(selectedUser.id, editRole));
      if (promises.length > 0) await Promise.all(promises);
      setEditOpen(false);
      fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      await api.deleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const inputCls = "border px-3 py-2 rounded bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-orange-300 w-full";

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">User Management</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="border px-3 py-2 rounded bg-white text-black placeholder-gray-500 outline-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
            className="border px-3 py-2 rounded bg-white text-gray-700 outline-none"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="user">User</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="border px-3 py-2 rounded bg-white text-gray-700 outline-none"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="deleted">Deleted</option>
          </select>
          
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Spinner />
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center p-5 text-red-500">{error}</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-400">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t text-gray-800 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-500">{user.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-500">{user.phoneNumber || "—"}</td>
                  <td className="p-3">
                    <Badge className={ROLE_STYLES[user.role]}>{user.role}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={STATUS_STYLES[user.status]}>{user.status}</Badge>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => { setSelectedUser(user); setViewOpen(true); }}
                      className="p-2 bg-green-100 rounded"
                      title="View"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      onClick={() => openEdit(user)}
                      className="p-2 bg-blue-100 rounded"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => { setSelectedUser(user); setDeleteOpen(true); }}
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-xs text-gray-400">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40 text-sm"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CREATE MODAL ── */}
      {createOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Add New User</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Phone (optional)</label>
                <input
                  type="text"
                  placeholder="+94 77 000 0000"
                  value={createForm.phoneNumber}
                  onChange={(e) => setCreateForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                    className="border px-3 py-2 rounded bg-white text-gray-700 outline-none w-full"
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value as UserStatus }))}
                    className="border px-3 py-2 rounded bg-white text-gray-700 outline-none w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createLoading}
                className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
              >
                {createLoading ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-4">User Details</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={selectedUser.name} />
              <div>
                <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                <p className="text-xs text-gray-400">{selectedUser.email}</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t">
                  <td className="py-2 text-gray-400">Phone</td>
                  <td className="py-2 text-right text-gray-700">{selectedUser.phoneNumber || "—"}</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 text-gray-400">Role</td>
                  <td className="py-2 text-right">
                    <Badge className={ROLE_STYLES[selectedUser.role]}>{selectedUser.role}</Badge>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 text-gray-400">Status</td>
                  <td className="py-2 text-right">
                    <Badge className={STATUS_STYLES[selectedUser.status]}>{selectedUser.status}</Badge>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 text-gray-400">Created</td>
                  <td className="py-2 text-right text-gray-700 text-xs">{new Date(selectedUser.createdAt).toLocaleString()}</td>
                </tr>
                {selectedUser.updatedAt && (
                  <tr className="border-t">
                    <td className="py-2 text-gray-400">Updated</td>
                    <td className="py-2 text-right text-gray-700 text-xs">{new Date(selectedUser.updatedAt).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button onClick={() => setViewOpen(false)} className="px-4 py-2 bg-gray-200 rounded text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-1">Edit User</h3>
            <p className="text-sm text-gray-400 mb-4">{selectedUser.name}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as UserStatus)}
                  className="border px-3 py-2 rounded bg-white text-gray-700 outline-none w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="border px-3 py-2 rounded bg-white text-gray-700 outline-none w-full"
                >
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 bg-gray-200 rounded text-sm">
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p className="mb-4 text-gray-700">
              Delete user <span className="font-semibold">{selectedUser.name}</span>?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;