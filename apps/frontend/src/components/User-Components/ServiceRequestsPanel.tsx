import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Wrench, Phone } from "lucide-react";
import { userApi, type ServiceRequest, type ServiceType } from "../../utils/userApi";

const STATUS_STYLE: Record<string, string> = {
  APPROVED: "text-green-600 bg-green-50",
  PENDING: "text-amber-600 bg-amber-50",
  REJECTED: "text-red-600 bg-red-50",
  PROCESSING: "text-blue-600 bg-blue-50",
  COMPLETED: "text-emerald-600 bg-emerald-50",
};

export default function ServiceRequestsPanel() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ FORM STATE (FIXED)
  const [type, setType] = useState<ServiceType>("REPAIR");
  const [orderNumber, setOrderNumber] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");

  // ================= LOAD =================
  const load = async () => {
    setLoading(true);
    try {
      const data = await userApi.getServiceRequests();
      setRequests(data);
    } catch {
      toast.error("Failed to load service requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!orderNumber || !sku || !description) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);

    const ok = await userApi.submitServiceRequest({
      type,
      orderNumber,
      sku,
      issueDescription: description,
    });

    setSubmitting(false);

    if (ok) {
      toast.success("Service request submitted!");

      // reset form
      setType("REPAIR");
      setOrderNumber("");
      setSku("");
      setDescription("");

      load();
    } else {
      toast.error("Failed to submit request");
    }
  };

  // ================= DATE =================
  const formatDate = (d?: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-LK");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LEFT PANEL */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Wrench className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-stone-600">After-Sales Service</h3>
            <p className="text-sm text-gray-500">Leema Furniture Support</p>
          </div>
        </div>

        {/* LOGO (BEFORE PHONE) */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <img src="/images/leemalogo.jpg" className="h-10 mb-2" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} />
            <span>071 883535</span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Submit repair, refund or reinstallment requests. Our team will respond within 2–3 days.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="space-y-4">

        {/* FORM */}
        <div className="bg-white rounded-xl border p-6 shadow-sm text-stone-600">

          <h3 className="font-semibold mb-4">New Service Request</h3>

          <div className="space-y-3">

            {/* TYPE DROPDOWN */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ServiceType)}
              className="w-full border  border-stone-200 p-2 rounded-lg"
            >
              <option value="REPAIR">Repair</option>
              <option value="REFUND">Refund</option>
              <option value="REINSTALLMENT">Reinstallment</option>
            </select>

            {/* ORDER NUMBER */}
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order Number (e.g. ORD-1001)"
              className="w-full border border-stone-200 p-2 rounded-lg"
            />

            {/* SKU */}
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Product SKU"
              className="w-full border border-stone-200 p-2 rounded-lg"
            />

            {/* ISSUE */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue"
              className="w-full border p-2 rounded-lg border-stone-200"
              rows={4}
            />

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

          </div>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">

          <h3 className="font-semibold mb-4 text-stone-600">My Requests</h3>

          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-400">No requests found</p>
          ) : (
            <div className="space-y-3">

              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border text-stone-500"
                >
                  <div>
                    <p className="font-medium">
                      #{r.referenceNumber || r.id}
                    </p>
                    <p className="text-xs text-gray-400">{r.details}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs">{formatDate(r.createdAt)}</p>

                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}