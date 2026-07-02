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
      const user = await signup(
      form.email,
      form.password,
      form.name
      );

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "SELLER") {
        navigate("/seller/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-amber-400 to-amber-600 rounded-2xl mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Create Account</h1>
          <p className="text-stone-500">Join With Leema Furinitures</p>
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
                  placeholder="John Doe"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-stone-200 text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                  placeholder="admin@leema.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-stone-200 text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-stone-200 text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-stone-400 disabled:to-stone-500 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
