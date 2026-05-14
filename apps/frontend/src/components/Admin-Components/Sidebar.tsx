import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, Settings, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/Authcontext";
import React from "react";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-72 min-h-screen bg-linear-to-b from-stone-900 to-stone-800 text-white p-6 border-r border-stone-700">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          LEEMA
        </h1>
        <p className="text-xs text-stone-400 mt-1">Admin Dashboard</p>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-3 mb-8">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-amber-500 text-white"
                : "text-stone-300 hover:bg-stone-700"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-amber-500 text-white"
                : "text-stone-300 hover:bg-stone-700"
            }`
          }
        >
          <Package size={20} />
          Products
        </NavLink>

        <NavLink
          to="/admin/Categories"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-amber-500 text-white"
                : "text-stone-300 hover:bg-stone-700"
            }`
          }
        >
          <Package size={20} />
          Categories
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-amber-500 text-white"
                : "text-stone-300 hover:bg-stone-700"
            }`
          }
        >
          <Users size={20} />
          Users
        </NavLink>

        <NavLink
          to="/admin/services"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-amber-500 text-white"
                : "text-stone-300 hover:bg-stone-700"
            }`
          }
        >
          <Settings size={20} />
          Services
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-amber-500 text-white"
                : "text-stone-300 hover:bg-stone-700"
            }`
          }
        >
          <BarChart3 size={20} />
          Analytics
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-amber-500 text-white"
                : "text-stone-300 hover:bg-stone-700"
            }`
          }
        >
          <Settings size={20} />
          Profile
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="border-t border-stone-700 my-6" />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-stone-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}