import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Wrench,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../hooks/Authcontext";
import type { RouteMeta } from "../../types";

// ─── Role Types ────────────────────────────────────────────

type UserRole = "superadmin" | "admin" | "manager";

// ─── Navigation Routes ─────────────────────────────────────

export const NAV_ROUTES: RouteMeta[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    path: "/admin/products",
    label: "Products",
    icon: Package,
  },

  {
    path: "/admin/users",
    label: "Users",
    icon: Users,
    requiredRole: ["superadmin", "admin"],
  },

  {
    path: "/admin/services",
    label: "Services",
    icon: Wrench,
  },

  {
    path: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    requiredRole: ["superadmin", "admin"],
  },

  {
    path: "/admin/profile",
    label: "My Profile",
    icon: User,
  },
];

// ─── Props ─────────────────────────────────────────────────

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

// ─── Component ─────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ─── Logout Handler ─────────────────────────────────────

  const handleLogout = (): void => {
    logout();
    navigate("/login", { replace: true });
  };

  // ─── Role-based Route Filtering ─────────────────────────

  const visibleRoutes = NAV_ROUTES.filter(
    (route) =>
      !route.requiredRole ||
      (user &&
        route.requiredRole.includes(user.role as UserRole))
  );

  return (
    <>
      {/* ─── Mobile Overlay ─────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ─── Sidebar ───────────────────────────────────── */}
      <aside
        className={`
          fixed lg:relative z-40
          w-64 h-screen
          bg-gradient-to-b from-stone-900 to-stone-800
          border-r border-stone-700
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ─── Logo Section ───────────────────────────── */}
        <div className="px-6 py-6 border-b border-stone-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
              L
            </div>

            <div>
              <h1
                className="text-white text-lg font-bold tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                LEEMA
              </h1>

              <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em]">
                Furniture Admin
              </p>
            </div>
          </div>
        </div>

        {/* ─── Navigation ─────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleRoutes.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                text-sm font-medium
                transition-all duration-200

                ${
                  isActive
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-900/30"
                    : "text-stone-300 hover:bg-stone-700 hover:text-white"
                }
              `
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ─── Footer ─────────────────────────────────── */}
        <div className="border-t border-stone-700 p-4 space-y-3 flex-shrink-0">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-white truncate font-medium">
                  {user.name}
                </p>

                <p className="text-xs text-stone-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-sm font-medium
              text-stone-300
              hover:bg-red-500/10
              hover:text-red-400
              transition-all duration-200
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;