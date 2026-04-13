import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-8xl font-black text-stone-100 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          404
        </div>
        <h1 className="text-xl font-bold text-stone-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Page not found
        </h1>
        <p className="text-sm text-stone-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200
              text-stone-700 text-sm font-medium transition-all"
          >
            <ArrowLeft size={15} /> Go back
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
              text-white text-sm font-medium transition-all shadow-sm shadow-amber-200"
          >
            <Home size={15} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;