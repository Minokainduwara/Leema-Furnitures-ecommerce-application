import React, { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type ServiceType =
  | "Warranty"
  | "Support"
  | "Installation"
  | "Consultation"
  | "Maintenance";

export interface Service {
  id: number;
  name: string;
  type: ServiceType;
  price: number;
  description?: string;
  icon: string;
  active: boolean;
}

interface ServiceFormData {
  name: string;
  type: ServiceType;
  price: number;
  description: string;
  icon: string;
  active: boolean;
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

const BASE = "http://localhost:8080/api/services";

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
  return res.json() as Promise<T>;
}

const api = {
  getAll: () => apiFetch<Service[]>(BASE),
  getById: (id: number) => apiFetch<Service>(`${BASE}/${id}`),
  create: (body: Omit<Service, "id">) =>
    apiFetch<Service>(BASE, { method: "POST", body: JSON.stringify(body) }),
  update: (id: number, body: Omit<Service, "id">) =>
    apiFetch<Service>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: async (id: number) => {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
};

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<ServiceType, string> = {
  Warranty:     "bg-blue-100 text-blue-700",
  Support:      "bg-green-100 text-green-700",
  Installation: "bg-purple-100 text-purple-700",
  Consultation: "bg-orange-100 text-orange-700",
  Maintenance:  "bg-red-100 text-red-700",
};

const SERVICE_TYPES: ServiceType[] = [
  "Warranty", "Support", "Installation", "Consultation", "Maintenance",
];

const ICON_OPTIONS = ["🛡️", "🔧", "💼", "📞", "✅", "⚙️", "🚀", "💡"];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Format a number as Sri Lankan Rupees — e.g. Rs. 12,500.00 */
const formatPrice = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Badge: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold ${className}`}>{children}</span>
);

const StatusBadge: React.FC<{ active: boolean }> = ({ active }) => (
  <Badge className={active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
    {active ? "Active" : "Inactive"}
  </Badge>
);

const Spinner = () => (
  <tr>
    <td colSpan={7} className="text-center p-8 text-gray-500">Loading...</td>
  </tr>
);

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

const ServicesPage: React.FC = () => {
  const [services, setServices]             = useState<Service[]>([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [search, setSearch]                 = useState("");
  const [typeFilter, setTypeFilter]         = useState("");
  const [statusFilter, setStatusFilter]     = useState("");
  const [page, setPage]                     = useState(0);
  const pageSize = 10;

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewOpen, setViewOpen]     = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const emptyForm: ServiceFormData = {
    name: "", type: "Warranty", price: 0, description: "", icon: "🛡️", active: true,
  };
  const [form, setForm]                       = useState<ServiceFormData>(emptyForm);
  const [formLoading, setFormLoading]         = useState(false);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  // ── FETCH ──
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getAll();
      setServices(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);
  useEffect(() => { setPage(0); }, [search, typeFilter, statusFilter]);

  // ── CLIENT-SIDE FILTER + PAGINATE ──
  const filtered = services.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchType   = !typeFilter   || s.type === typeFilter;
    const matchStatus = !statusFilter || (statusFilter === "active" ? s.active : !s.active);
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated  = filtered.slice(page * pageSize, (page + 1) * pageSize);

  // ── CREATE ──
  const handleCreate = async () => {
    if (!form.name.trim()) { alert("Service name is required"); return; }
    if (form.price < 0)    { alert("Price cannot be negative"); return; }
    setFormLoading(true);
    try {
      await api.create(form);
      setCreateOpen(false);
      setForm(emptyForm);
      fetchServices();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to create service");
    } finally {
      setFormLoading(false);
    }
  };

  // ── EDIT ──
  const openEdit = (service: Service) => {
    setSelectedService(service);
    setForm({
      name:        service.name,
      type:        service.type,
      price:       service.price,
      description: service.description ?? "",
      icon:        service.icon,
      active:      service.active,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedService) return;
    if (!form.name.trim()) { alert("Service name is required"); return; }
    if (form.price < 0)    { alert("Price cannot be negative"); return; }
    setFormLoading(true);
    try {
      await api.update(selectedService.id, form);
      setEditOpen(false);
      fetchServices();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update service");
    } finally {
      setFormLoading(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    if (!selectedService) return;
    setDeleteLoading(true);
    try {
      await api.delete(selectedService.id);
      setServices((prev) => prev.filter((s) => s.id !== selectedService.id));
      setDeleteOpen(false);
      setSelectedService(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete service");
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeForm = () => { setCreateOpen(false); setEditOpen(false); };

  const inputCls =
    "border px-3 py-2 rounded bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-orange-300 w-full";
  const selectCls =
    "border px-3 py-2 rounded bg-white text-gray-700 outline-none w-full";

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Service Management</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="border px-3 py-2 rounded bg-white text-black placeholder-gray-500 outline-none"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border px-3 py-2 rounded bg-white text-gray-700 outline-none"
          >
            <option value="">All types</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded bg-white text-gray-700 outline-none"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => { setForm(emptyForm); setCreateOpen(true); }}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Add Service
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Service</th>
              <th className="p-3">Type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Spinner />
            ) : error ? (
              <tr><td colSpan={7} className="text-center p-5 text-red-500">{error}</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={7} className="text-center p-8 text-gray-400">No services found</td></tr>
            ) : (
              paginated.map((service) => (
                <tr key={service.id} className="border-t text-gray-800 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-500">{service.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-lg shrink-0">
                        {service.icon}
                      </div>
                      <p className="font-medium">{service.name}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={TYPE_STYLES[service.type]}>{service.type}</Badge>
                  </td>
                  <td className="p-3 text-gray-700 font-semibold whitespace-nowrap">
                    {formatPrice(service.price)}
                  </td>
                  <td className="p-3">
                    <StatusBadge active={service.active} />
                  </td>
                  <td className="p-3 text-gray-500 max-w-xs truncate">
                    {service.description || "—"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => { setSelectedService(service); setViewOpen(true); }}
                      className="p-2 bg-green-100 rounded"
                      title="View"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      onClick={() => openEdit(service)}
                      className="p-2 bg-blue-100 rounded"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => { setSelectedService(service); setDeleteOpen(true); }}
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

      {/* ── CREATE / EDIT MODAL ── */}
      {(createOpen || editOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              {createOpen ? "Add New Service" : `Edit Service — ${selectedService?.name}`}
            </h3>

            <div className="space-y-3">

              {/* Icon Picker */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, icon }))}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                        form.icon === icon
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. 5-Year Structural Warranty"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {/* Type + Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ServiceType }))}
                    className={selectCls}
                  >
                    {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Price (Rs.)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Service description..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Status</label>
                <select
                  value={form.active ? "active" : "inactive"}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "active" }))}
                  className={selectCls}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={closeForm} className="px-4 py-2 bg-gray-200 rounded text-sm">
                Cancel
              </button>
              <button
                onClick={createOpen ? handleCreate : handleEdit}
                disabled={formLoading}
                className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
              >
                {formLoading
                  ? (createOpen ? "Creating..." : "Saving...")
                  : (createOpen ? "Create Service" : "Save Changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Service Details</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl shrink-0">
                {selectedService.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selectedService.name}</p>
                <Badge className={TYPE_STYLES[selectedService.type]}>{selectedService.type}</Badge>
              </div>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t">
                  <td className="py-2 text-gray-400">Price</td>
                  <td className="py-2 text-right font-semibold text-gray-700">
                    {formatPrice(selectedService.price)}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 text-gray-400">Status</td>
                  <td className="py-2 text-right">
                    <StatusBadge active={selectedService.active} />
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 text-gray-400">Description</td>
                  <td className="py-2 text-right text-gray-700 text-xs">
                    {selectedService.description || "—"}
                  </td>
                </tr>
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

      {/* ── DELETE MODAL ── */}
      {deleteOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p className="mb-4 text-gray-700">
              Delete service <span className="font-semibold">{selectedService.name}</span>?
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

export default ServicesPage;