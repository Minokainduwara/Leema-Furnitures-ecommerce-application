import React, { useEffect, useState } from "react";

interface Repair {
  id: number;
  user_id: number;
  product_id: number | null;
  order_id: number | null;
  handled_by: number | null;

  issue_description: string;
  status: "REQUESTED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

  created_at: string;
  updated_at: string;

  actual_cost: number | null;
  estimated_cost: number | null;
}

const StatusBadge: React.FC<{ status: Repair["status"] }> = ({ status }) => {
  const colorMap = {
    REQUESTED: "#eab308",
    IN_PROGRESS: "#3b82f6",
    COMPLETED: "#22c55e",
    REJECTED: "#ef4444",
  };

  return (
    <span className="font-bold text-xs" style={{ color: colorMap[status] }}>
      {status}
    </span>
  );
};

const ServicePanel: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/repairs");

        if (!res.ok) {
          throw new Error("Failed to fetch repairs");
        }

        const data = await res.json();
        setRepairs(data);
      } catch (err) {
        console.error("Error loading repairs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 h-full">

      {/* LEFT PANEL */}
      <div className="rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white border shadow-sm">
        <h2 className="text-3xl font-bold mb-4">Repair Service</h2>
        <p className="text-gray-500 text-sm">
          Manage all repair requests
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="rounded-xl p-5 bg-white border shadow-sm overflow-auto">

        <h3 className="text-sm font-semibold mb-4">
          Repair Database Details
        </h3>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="flex flex-col gap-3">

            {repairs.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-lg bg-gray-50 border"
              >

                {/* HEADER */}
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">
                    ID: {r.id}
                  </span>

                  <StatusBadge status={r.status} />
                </div>

                {/* ISSUE */}
                <p className="text-sm text-gray-800 mb-3">
                  {r.issue_description}
                </p>

                {/* FULL DATABASE TABLE DATA */}
                <div className="text-xs text-gray-600 space-y-1">

                  <p>👤 user_id: {r.user_id}</p>
                  <p>📦 product_id: {r.product_id ?? "NULL"}</p>
                  <p>🧾 order_id: {r.order_id ?? "NULL"}</p>
                  <p>🛠 handled_by: {r.handled_by ?? "NOT ASSIGNED"}</p>

                  <p>💰 estimated_cost: {r.estimated_cost ?? "NULL"}</p>
                  <p>💵 actual_cost: {r.actual_cost ?? "NULL"}</p>

                  <p>📅 created_at: {r.created_at?.split("T")[0]}</p>
                  <p>🔄 updated_at: {r.updated_at?.split("T")[0]}</p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default ServicePanel;