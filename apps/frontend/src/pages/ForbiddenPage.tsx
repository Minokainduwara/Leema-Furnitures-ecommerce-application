import React from "react";
import { Link } from "react-router-dom";
import { ShieldOff, Home } from "lucide-react";

const ForbiddenPage: React.FC = () => (
  <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <ShieldOff size={28} className="text-red-400" />
      </div>
      <div className="text-7xl font-black text-stone-100 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        403
      </div>
      <h1 className="text-xl font-bold text-stone-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Access denied
      </h1>
      <p className="text-sm text-stone-400 mb-8">
        You don't have permission to view this page.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
          text-white text-sm font-medium transition-all shadow-sm shadow-amber-200"
      >
        <Home size={15} /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default ForbiddenPage;