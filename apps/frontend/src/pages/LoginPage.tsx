import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/Authcontext";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";

interface LocationState {
  from?: { pathname: string };
}

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate              = useNavigate();
  const location              = useLocation();
  const from                  = (location.state as LocationState)?.from?.pathname ?? "/dashboard";

  const [email,    setEmail]    = useState("admin@leema.lk");
  const [password, setPassword] = useState("admin123");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-200">
            L
          </div>
          <div>
            <div className="font-bold text-stone-800 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              LEEMA
            </div>
            <div className="text-stone-400 text-[10px] tracking-widest uppercase">Furniture Admin</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h1 className="text-xl font-bold text-stone-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back
          </h1>
          <p className="text-sm text-stone-400 mb-6">Sign in to your admin account</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@leema.lk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm
                  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all
                  placeholder:text-stone-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all
                    placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600
                disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl
                transition-all shadow-sm shadow-amber-200 text-sm mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={15} /> Sign in</>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <p className="text-xs text-stone-400 font-medium mb-2">Demo credentials</p>
            <div className="space-y-1.5">
              {[
                { label: "Super Admin", email: "admin@leema.lk",   pw: "admin123" },
                { label: "Manager",    email: "manager@leema.lk",  pw: "manager123" },
              ].map((c) => (
                <button
                  key={c.email}
                  type="button"
                  onClick={() => { setEmail(c.email); setPassword(c.pw); setError(""); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 border border-stone-100
                    transition-colors group"
                >
                  <span className="text-xs font-medium text-stone-700">{c.label}</span>
                  <span className="text-xs text-stone-400 ml-2">{c.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          © {new Date().getFullYear()} Leema Furniture. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;