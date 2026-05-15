import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Package,
  Users,
  Wrench,
  BarChart3,
  User,
} from "lucide-react";

import { useAuth } from "../../hooks/Authcontext";

// ================= ROUTE TYPE =================
export interface RouteMeta {
  path: string;
  label: string;
  icon: LucideIcon;
  requiredRole?: string[];
}

// ================= ROUTES =================
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
    path: "/users",
    label: "Users",
    icon: Users,
    requiredRole: ["admin", "superadmin"],
  },

  {
    path: "/services",
    label: "Services",
    icon: Wrench,
  },

  {
    path: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    requiredRole: ["admin", "superadmin"],
  },

  {
    path: "/profile",
    label: "My Profile",
    icon: User,
  },
];

// ================= PROPS =================
interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

// ================= COMPONENT =================
const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // ================= FILTER ROUTES =================
  const visibleRoutes = NAV_ROUTES.filter((route) => {
    if (!route.requiredRole) return true;

    if (!user) return false;

    return route.requiredRole.includes(user.role);
  });

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-40 w-60 h-full bg-stone-900 flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="px-5 py-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold">
              L
            </div>

            <div>
              <div className="text-white font-bold">LEEMA</div>

              <div className="text-stone-500 text-xs uppercase">
                Furniture Admin
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleRoutes.map((route) => {
            const Icon = route.icon;

            return (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                  ${
                    isActive
                      ? "bg-amber-500 text-white"
                      : "text-stone-400 hover:text-white hover:bg-stone-800"
                  }`
                }
              >
                <Icon size={18} />

                {route.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-stone-800 p-3 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="text-xs text-white truncate">
                  {user.name || user.email}
                </div>

                <div className="text-[10px] text-stone-400 capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-all"
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