import React from "react";
import {
  LayoutDashboard, Package, Users, Wrench, BarChart3,
  User, LogOut,
} from "lucide-react";
import type { NavItem, NavPage } from "../../types";

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products",  label: "Products",  icon: Package },
  { id: "users",     label: "Users",     icon: Users },
  { id: "services",  label: "Services",  icon: Wrench },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "profile",   label: "My Profile",icon: User },
];

interface SidebarProps {
  page:    NavPage;
  setPage: (page: NavPage) => void;
  open:    boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ page, setPage, open, onClose }) => (
  <>
    {open && (
      <div
        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        onClick={onClose}
      />
    )}

    <aside
      className={`fixed lg:relative z-40 w-60 h-full bg-stone-900 flex flex-col
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-stone-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-lg">
            L
          </div>
          <div>
            <div
              className="text-white font-bold text-sm tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              LEEMA
            </div>
            <div className="text-stone-500 text-[10px] tracking-widest uppercase">
              Furniture Admin
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setPage(item.id); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${page === item.id
                ? "bg-amber-500 text-white shadow-lg shadow-amber-900/30"
                : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
          >
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 pt-4 border-t border-stone-800 flex-shrink-0">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
          text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-all">
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  </>
);

export default Sidebar;