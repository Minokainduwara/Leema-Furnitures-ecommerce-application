import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Authcontext";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
  
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
  
    try {
      await signup(form.email, form.password, form.name);
  
      // ✅ get saved user from context/localStorage (safe source)
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  
      switch (storedUser?.role) {
        case "ROLE_ADMIN":
          navigate("/admin/dashboard");
          break;
  
        case "ROLE_SELLER":
          navigate("/seller/dashboard");
          break;
  
        default:
          navigate("/");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50 p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">Create Account</h1>
          <p className="text-stone-500">Join Leema Furniture</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-stone-700">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-stone-400" size={18} />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 placeholder-stone-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-stone-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-stone-400" size={18} />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 placeholder-stone-400"
                  placeholder="john@leema.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-stone-700">Password</label>
              <div className="relative mt-1">
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

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-stone-700">Confirm Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-stone-400" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 placeholder-stone-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>

          </form>

          {/* Login link */}
          <p className="text-center text-sm mt-6 text-stone-600">
            Already have an account?{" "}
            <a href="/login" className="text-amber-600 font-semibold hover:text-amber-700">
              Sign in
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;