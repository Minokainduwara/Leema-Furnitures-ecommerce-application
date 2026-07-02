import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  ShoppingCart,
  Heart,
  Wrench,
  PackageSearch,
  Tags,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/Authcontext";
import OverviewPanel from "../../components/User-Components/OverviewPanel";
import ProfilePanel from "../../components/User-Components/ProfilePanel";
import UserOrdersPanel from "../../components/User-Components/UserOrdersPanel";
import WishlistPanel from "../../components/User-Components/WishlistPanel";
import ServiceRequestsPanel from "../../components/User-Components/ServiceRequestsPanel";
import NotificationsPanel from "../../components/User-Components/NotificationsPanel";

type Panel =
  | "overview"
  | "profile"
  | "orders"
  | "wishlist"
  | "services"
  | "notifications";

const PANEL_TITLES: Record<Panel, string> = {
  overview: "Overview",
  profile: "My Profile",
  orders: "My Orders",
  wishlist: "Wishlist",
  services: "Service & Repair",
  notifications: "Notifications",
};

const VALID_PANELS = new Set<string>(Object.keys(PANEL_TITLES));

export default function UserDashboard() {
  const [panel, setPanel] = useState<Panel>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && VALID_PANELS.has(tab)) {
      setPanel(tab as Panel);
    }
  }, [searchParams]);

  const selectPanel = (p: Panel) => {
    setPanel(p);
    setSearchParams({ tab: p }, { replace: true });
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-stone-900 text-white flex flex-col transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <img src="/images/leemalogo.jpg" alt="Leema" className="h-8 w-auto rounded" />
            <div>
              <p className="font-bold text-sm">Leema Furniture</p>
              <p className="text-stone-400 text-xs truncate max-w-[160px]">
                {user?.email ?? "My Account"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          <Section title="ACCOUNT">
            <Item
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              active={panel === "overview"}
              onClick={() => selectPanel("overview")}
            />
            <Item
              icon={<User size={18} />}
              label="Profile"
              active={panel === "profile"}
              onClick={() => selectPanel("profile")}
            />
            <Item
              icon={<ShoppingCart size={18} />}
              label="Orders"
              active={panel === "orders"}
              onClick={() => selectPanel("orders")}
            />
            <Item
              icon={<Heart size={18} />}
              label="Wishlist"
              active={panel === "wishlist"}
              onClick={() => selectPanel("wishlist")}
            />
            <Item
              icon={<Wrench size={18} />}
              label="Services"
              active={panel === "services"}
              onClick={() => selectPanel("services")}
            />
            <Item
              icon={<Bell size={18} />}
              label="Notifications"
              active={panel === "notifications"}
              onClick={() => selectPanel("notifications")}
            />
          </Section>

          <Section title="SHOP">
            <Item
              icon={<PackageSearch size={18} />}
              label="Browse Products"
              active={false}
              onClick={() => navigate("/user/category")}
            />
            <Item
              icon={<Tags size={18} />}
              label="Cart"
              active={false}
              onClick={() => navigate("/cart")}
            />
          </Section>
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur border-b border-stone-200 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-stone-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} className="text-stone-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-stone-800">
              {PANEL_TITLES[panel]}
            </h1>
            <p className="text-stone-500 text-sm hidden sm:block">
              Manage your account and shopping experience
            </p>
          </div>
          {sidebarOpen && (
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-4 lg:p-8">
          {panel === "overview" && <OverviewPanel onNavigate={selectPanel} />}
          {panel === "profile" && <ProfilePanel />}
          {panel === "orders" && <UserOrdersPanel />}
          {panel === "wishlist" && <WishlistPanel />}
          {panel === "services" && <ServiceRequestsPanel />}
          {panel === "notifications" && <NotificationsPanel />}
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-stone-500 px-4 mb-2 tracking-wider">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Item({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition font-medium
        ${active ? "bg-amber-500 text-stone-900" : "hover:bg-amber-500/90 hover:text-stone-900 text-stone-200"}`}
    >
      {icon}
      {label}
    </button>
  );
}
