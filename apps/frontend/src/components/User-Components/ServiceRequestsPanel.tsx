import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Wrench, Phone } from "lucide-react";
import { userApi, type ServiceRequest } from "../../utils/userApi";

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

  const [invoice, setInvoice] = useState("");
  const [warrantyState, setWarrantyState] = useState(false);
  const [details, setDetails] = useState("");
  const fileRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);

  const load = async () => {
    setLoading(true);
    setRequests(await userApi.getServiceRequests());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!invoice.trim()) {
      toast.error("Invoice number is required");
      return;
    }
    setSubmitting(true);
    const ok = await userApi.submitServiceRequest({ invoice, warrantyState, details });
    setSubmitting(false);
    if (ok) {
      toast.success("Service request submitted!");
      setInvoice("");
      setWarrantyState(false);
      setDetails("");
      load();
    } else {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-LK");
    } catch {
      return d;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Wrench size={22} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-stone-800">After-Sales Repair</h3>
            <p className="text-stone-500 text-sm">Support for your Leema furniture</p>
          </div>
        </div>

        <div className="rounded-xl bg-stone-50 border border-stone-100 p-4 mb-4">
          <img src="/images/leemalogo.jpg" alt="Leema" className="h-10 object-contain mb-3" />
          <div className="flex items-center gap-2 text-stone-600 text-sm">
            <Phone size={14} />
            <span>071 883535</span>
          </div>
        </div>

        <p className="text-stone-500 text-sm leading-relaxed">
          Submit a repair claim with your invoice number. Our team will review your request
          and contact you within 2–3 business days.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-semibold text-stone-800 mb-4">Submit a Claim</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Invoice Number *
              </label>
              <input
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="e.g. ORD-2024-001"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-amber-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                Under Warranty?
              </label>
              <div className="flex gap-4">
                {[true, false].map((v) => (
                  <label key={String(v)} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="warranty"
                      checked={warrantyState === v}
                      onChange={() => setWarrantyState(v)}
                      className="accent-amber-500"
                    />
                    {v ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Issue Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Describe the issue with your furniture..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm resize-none focus:ring-2 focus:ring-amber-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                Attach Photos (optional)
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i}>
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileRefs.current[i] = el;
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRefs.current[i]?.click()}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"
                    >
                      Photo {i + 1}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setInvoice("");
                  setWarrantyState(false);
                  setDetails("");
                }}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 text-sm font-semibold"
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !invoice.trim()}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-semibold text-stone-800 mb-4">My Requests</h3>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-4">No service requests yet</p>
          ) : (
            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-lg bg-stone-50 border border-stone-100"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      #{req.referenceNumber ?? req.invoiceRef ?? req.id}
                    </p>
                    {req.details && (
                      <p className="text-xs text-stone-400 line-clamp-1">{req.details}</p>
                    )}
                  </div>
                  <span className="text-xs text-stone-400">{formatDate(req.date ?? req.createdAt)}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${
                      STATUS_STYLE[req.status] ?? "text-stone-600 bg-stone-100"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
