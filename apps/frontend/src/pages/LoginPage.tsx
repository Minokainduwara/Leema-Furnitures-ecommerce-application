import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Authcontext";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!form.email || !form.password) {
    setError("Please fill in all fields");
    return;
  }

  // TEMPORARY fake login without backend
  if (form.email === "admin@leema.com") {
    navigate("/admin/dashboard");
  } else if (form.email === "seller@leema.com") {
    navigate("/seller/dashboard");
  } else {
    navigate("/");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">Welcome Back</h1>
          <p className="text-stone-500">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-stone-700">
                Email Address
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 text-stone-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 placeholder-stone-400"
                  placeholder="admin@leema.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-stone-700">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 text-stone-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 placeholder-stone-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : <>
                <LogIn size={18} />
                Sign In
              </>}
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-sm mt-6 text-stone-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-amber-600 font-semibold hover:text-amber-700">
              Sign up
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;