import React, { useState, useRef } from "react";
import type { ServiceRequest } from "../../types/dashboard.types";

interface ServicePanelProps {
  serviceRequests: ServiceRequest[];
  onSubmit: (data: {
    invoice: string;
    warrantyState: boolean;
    details: string;
  }) => void;
}

const StatusBadge: React.FC<{
  status: ServiceRequest["status"];
}> = ({ status }) => {
  const map = {
    APPROVED: "#22c55e",
    PENDING: "#eab308",
    REJECTED: "#ef4444",
  } as const;

  return (
    <span className="font-bold text-sm" style={{ color: map[status] }}>
      {status}
    </span>
  );
};

const ServicePanel: React.FC<ServicePanelProps> = ({
  serviceRequests,
  onSubmit,
}) => {
  const [invoice, setInvoice] = useState("");
  const [warrantyState, setWarrantyState] = useState(false);
  const [details, setDetails] = useState("");
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [submitted, setSubmitted] = useState(false);

  const fileRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
  ]);

  const handleImageSelect = (
    i: number,
    file: File | null
  ) => {
    setImages((prev) => {
      const n = [...prev];
      n[i] = file;
      return n;
    });
  };

  const handleClear = () => {
    setInvoice("");
    setWarrantyState(false);
    setDetails("");
    setImages([null, null, null, null]);
  };

  const handleClaim = () => {
    if (!invoice.trim()) return;

    onSubmit({
      invoice,
      warrantyState,
      details,
    });

    setSubmitted(true);
    handleClear();

    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    color: "#111827",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    width: "100%",
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">

      {/* Left Branding Panel */}
      <div className="rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white border border-gray-200 shadow-sm">

        <h2
          className="text-gray-900 font-black text-3xl leading-tight mb-4"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          After Services
          <br />
          Repair
        </h2>

        <div className="w-40 h-20 rounded-xl flex items-center justify-center mb-5 text-4xl bg-black">
          Leema
        </div>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Support and repair for your furniture,
          <br />
          fast and easy.
        </p>

        {/* Logo Placeholder */}
        <div className="w-full rounded-lg mb-3 flex items-center justify-center py-4 border border-dashed border-gray-300 bg-gray-50">
          <span className="text-gray-400 text-sm">
            LEEMA LOGO.jpg
          </span>
        </div>

        {/* Contact */}
        <div className="w-full rounded-lg py-3 px-4 border border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-500 text-xs">
            contact details 071 883535
          </p>

          <p className="text-gray-500 text-xs">
            
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-4">

        {/* Claim Form */}
        <div className="rounded-xl p-6 flex-1 bg-white border border-gray-200 shadow-sm">

          <h3 className="text-gray-900 font-bold text-base mb-5">
            Claim Your Service Here
          </h3>

          {submitted && (
            <div
              className="mb-4 px-4 py-2 rounded-lg text-sm font-semibold text-center"
              style={{
                background: "rgba(34,197,94,0.12)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              ✓ Service claim submitted!
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Invoice */}
            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm w-32 text-right shrink-0">
                Invoice Number:
              </label>

              <input
                value={invoice}
                onChange={(e) =>
                  setInvoice(e.target.value)
                }
                style={inputStyle}
                placeholder="e.g. WRD24221100"
              />
            </div>

            {/* Warranty */}
            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm w-32 text-right shrink-0">
                Warranty:
              </label>

              <div className="flex gap-5">
                {[true, false].map((v) => (
                  <label
                    key={String(v)}
                    className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm"
                  >
                    <input
                      type="radio"
                      name="warranty"
                      checked={warrantyState === v}
                      onChange={() =>
                        setWarrantyState(v)
                      }
                      className="accent-green-500"
                    />

                    {v ? "YES" : "NO"}
                  </label>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex items-start gap-3">
              <label className="text-gray-600 text-sm w-32 text-right shrink-0 mt-2">
                Details:
              </label>

              <textarea
                value={details}
                onChange={(e) =>
                  setDetails(e.target.value)
                }
                rows={4}
                placeholder="Enter your product details..."
                style={{
                  ...inputStyle,
                  resize: "none",
                }}
              />
            </div>

            {/* Images */}
            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm w-32 text-right shrink-0">
                Add Images:
              </label>

              <div className="flex gap-2">
                {images.map((img, i) => (
                  <div key={i}>
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileRefs.current[i] = el;
                      }}
                      className="hidden"
                      onChange={(e) =>
                        handleImageSelect(
                          i,
                          e.target.files?.[0] ?? null
                        )
                      }
                    />

                    <button
                      onClick={() =>
                        fileRefs.current[i]?.click()
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                      style={{
                        background: img
                          ? "#dcfce7"
                          : "#f3f4f6",
                        color: img
                          ? "#16a34a"
                          : "#374151",
                        borderColor: img
                          ? "#86efac"
                          : "#d1d5db",
                      }}
                    >
                      {img
                        ? `✓ Img ${i + 1}`
                        : `Image ${i + 1}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-2">

              <button
                onClick={handleClear}
                className="px-6 py-2 rounded-lg text-sm font-bold transition-all bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              >
                Clear
              </button>

              <button
                onClick={handleClaim}
                disabled={!invoice.trim()}
                className="px-8 py-2 rounded-lg text-sm font-bold transition-all bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Claim
              </button>
            </div>
          </div>
        </div>

        {/* Request History */}
        <div className="rounded-xl p-5 bg-white border border-gray-200 shadow-sm">

          <h3 className="text-gray-700 text-sm font-semibold mb-3 tracking-wide">
            My Service Requests
          </h3>

          <div className="flex flex-col gap-2">
            {serviceRequests.map((req, i) => (
              <div
                key={req.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
              >
                <span className="text-gray-600 text-xs">
                  {String(i + 1).padStart(2, "0")}.{" "}
                  {req.invoiceRef}
                </span>

                <span className="text-gray-600 text-xs">
                  {req.date}
                </span>

                <span className="text-gray-600 text-xs">
                  Status:{" "}
                  <StatusBadge status={req.status} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePanel;