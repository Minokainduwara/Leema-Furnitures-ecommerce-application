import React from "react";
import { Bell, ChevronRight, Menu } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { NAV_ROUTES } from "../layout/Sidebar";
import { Avatar } from "../ui/admin-ui/index";
import { getCurrentUser } from "../../utils/api";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const user = getCurrentUser();
  const location = useLocation();

  const current = NAV_ROUTES.find((r) => location.pathname.startsWith(r.path));
  const label = current?.label ?? "Dashboard";

  const initials = (user?.email || "A").charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-stone-100 px-5 py-3.5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100 text-stone-500">
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-1.5 text-sm text-stone-400">
          <span>Admin</span>
          <ChevronRight size={13} />
          <span className="text-stone-700 font-medium">{label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
        </button>
        <Link
          to="/admin/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
        >
          <Avatar initials={initials} size="sm" className="rounded-lg" />
          <span className="text-sm font-medium text-stone-700 hidden sm:block">
            {user?.email ?? "Admin"}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;