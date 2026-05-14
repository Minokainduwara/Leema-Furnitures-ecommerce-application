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
  Tags,
  ShoppingBag,
  Megaphone,
} from "lucide-react";
import { getCurrentUser, logout as doLogout } from "../../utils/api";

type NavRoute = {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export const NAV_ROUTES: NavRoute[] = [
  { path: "/admin/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { path: "/admin/users",         label: "Users",         icon: Users },
  { path: "/admin/products",      label: "Products",      icon: Package },
  { path: "/admin/categories",    label: "Categories",    icon: Tags },
  { path: "/admin/orders",        label: "Orders",        icon: ShoppingBag },
  { path: "/admin/services",      label: "Services",      icon: Wrench },
  { path: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { path: "/admin/analytics",     label: "Analytics",     icon: BarChart3 },
  { path: "/admin/profile",       label: "My Profile",    icon: User },
];

interface SidebarProps {
  open:    boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    doLogout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:relative z-40 w-60 h-full bg-stone-900 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-5 py-6 border-b border-stone-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-lg">L</div>
            <div>
              <div className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>LEEMA</div>
              <div className="text-stone-500 text-[10px] tracking-widest uppercase">Furniture Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ROUTES.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-900/30"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 pt-4 border-t border-stone-800 flex-shrink-0 space-y-2">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(user.email || "A").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-stone-300 truncate">{user.email || "Admin"}</div>
                <div className="text-[10px] text-stone-500 capitalize">{user.role.toLowerCase()}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-all"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
