// ============================================================
// src/components/ServicePanel.tsx
// After-service repair claim form + request history
// Props:
//   serviceRequests - ServiceRequest[]
//   onSubmit        - called when form is submitted
// ============================================================
import React, { useState, useRef } from "react";
import type { ServiceRequest } from "../../types/dashboard.types";

interface ServicePanelProps {
  serviceRequests: ServiceRequest[];
  onSubmit: (data: { invoice: string; warrantyState: boolean; details: string }) => void;
}

const StatusBadge: React.FC<{ status: ServiceRequest["status"] }> = ({ status }) => {
  const map = {
    APPROVED: "#4ade80",
    PENDING:  "#facc15",
    REJECTED: "#f87171",
  } as const;
  return (
    <span className="font-bold text-sm" style={{ color: map[status] }}>
      {status}
    </span>
  );
};

const ServicePanel: React.FC<ServicePanelProps> = ({ serviceRequests, onSubmit }) => {
  const [invoice,       setInvoice]       = useState("");
  const [warrantyState, setWarrantyState] = useState(false);
  const [details,       setDetails]       = useState("");
  const [images,        setImages]        = useState<(File | null)[]>([null, null, null, null]);
  const [submitted,     setSubmitted]     = useState(false);
  // Hold file input elements in a single ref array so they remain stable across renders
  const fileRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);

  const handleImageSelect = (i: number, file: File | null) => {
    setImages(prev => { const n = [...prev]; n[i] = file; return n; });
  };

  const handleClear = () => {
    setInvoice(""); setWarrantyState(false); setDetails("");
    setImages([null, null, null, null]);
  };

  const handleClaim = () => {
    if (!invoice.trim()) return;
    onSubmit({ invoice, warrantyState, details });
    setSubmitted(true);
    handleClear();
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13, outline: "none", width: "100%",
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">

      {/* ── Left: branding panel ── */}
      <div className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
           style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 className="text-white font-black text-3xl leading-tight mb-4"
            style={{ fontFamily: "'Georgia', serif" }}>
          After Services<br />Repair
        </h2>
        <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-5 text-4xl"
             style={{ background: "rgba(255,255,255,0.1)" }}>
          🤝
        </div>
        <p className="text-white/70 text-sm mb-8 leading-relaxed">
          Support and repair for your furniture,<br />fast and easy.
        </p>

        {/* Leema logo placeholder */}
        <div className="w-full rounded-lg mb-3 flex items-center justify-center py-4"
             style={{ background: "rgba(255,255,255,0.08)", border: "1px dashed rgba(255,255,255,0.2)" }}>
          <span className="text-white/40 text-sm">LEEMA LOGO.jpg</span>
        </div>

        {/* Contact */}
        <div className="w-full rounded-lg py-3 px-4"
             style={{ background: "rgba(255,255,255,0.08)", border: "1px dashed rgba(255,255,255,0.2)" }}>
          <p className="text-white/50 text-xs">contact details 071 883535</p>
          <p className="text-white/50 text-xs">contact details 071 883535</p>
        </div>
      </div>

      {/* ── Right: claim form + history ── */}
      <div className="flex flex-col gap-4">

        {/* Claim form */}
        <div className="rounded-xl p-6 flex-1"
             style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-white font-bold text-base mb-5">Claim Your Service here,</h3>

          {submitted && (
            <div className="mb-4 px-4 py-2 rounded-lg text-sm font-semibold text-center"
                 style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80",
                          border: "1px solid rgba(74,222,128,0.3)" }}>
              ✓ Service claim submitted!
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Invoice number */}
            <div className="flex items-center gap-3">
              <label className="text-white/70 text-sm w-32 text-right shrink-0">Invoice Number:</label>
              <input value={invoice} onChange={e => setInvoice(e.target.value)}
                     style={inputStyle} placeholder="e.g. WRD24221100" />
            </div>

            {/* Warranty state */}
            <div className="flex items-center gap-3">
              <label className="text-white/70 text-sm w-32 text-right shrink-0">Warranty State:</label>
              <div className="flex gap-5">
                {[true, false].map(v => (
                  <label key={String(v)} className="flex items-center gap-2 cursor-pointer text-white/80 text-sm">
                    <input type="radio" name="warranty" checked={warrantyState === v}
                           onChange={() => setWarrantyState(v)}
                           className="accent-green-400" />
                    {v ? "YES" : "NO"}
                  </label>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex items-start gap-3">
              <label className="text-white/70 text-sm w-32 text-right shrink-0 mt-2">Details:</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)}
                        rows={4} placeholder="Enter your product Details......"
                        style={{ ...inputStyle, resize: "none" }} />
            </div>

            {/* Images */}
            <div className="flex items-center gap-3">
              <label className="text-white/70 text-sm w-32 text-right shrink-0">Add Images:</label>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <div key={i}>
          <input type="file" accept="image/*" ref={el => { fileRefs.current[i] = el }} className="hidden"
            onChange={e => handleImageSelect(i, e.target.files?.[0] ?? null)} />
          <button onClick={() => fileRefs.current[i]?.click()}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: img ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.12)",
                               color: img ? "#4ade80" : "#fff",
                               border: img ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(255,255,255,0.15)" }}>
                      {img ? `✓ Img ${i+1}` : `Image ${i+1}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={handleClear}
                className="px-6 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                         border: "1px solid rgba(255,255,255,0.15)" }}>
                Clear
              </button>
              <button onClick={handleClaim}
                className="px-8 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: invoice.trim() ? "#22c55e" : "rgba(255,255,255,0.1)",
                         color: invoice.trim() ? "#fff" : "rgba(255,255,255,0.4)",
                         border: "none", cursor: invoice.trim() ? "pointer" : "not-allowed" }}>
                Claim
              </button>
            </div>
          </div>
        </div>

        {/* Service request history */}
        <div className="rounded-xl p-5"
             style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-white/70 text-sm font-semibold mb-3 tracking-wide">My Service Requests</h3>
          <div className="flex flex-col gap-2">
            {serviceRequests.map((req, i) => (
              <div key={req.id} className="flex items-center justify-between px-4 py-2 rounded-lg"
                   style={{ background: "rgba(255,255,255,0.06)" }}>
                <span className="text-white/60 text-xs">{String(i+1).padStart(2,"0")}. {req.invoiceRef}</span>
                <span className="text-white/60 text-xs">{req.date}</span>
                <span className="text-white/60 text-xs">Status: <StatusBadge status={req.status} /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePanel;
