// ============================================================
// src/components/Sidebar.tsx
// Left sidebar - always visible, never changes
// Props:
//   user        - UserProfile object (name, id, avatar)
//   activePanel - which panel is currently showing
//   onSelect    - callback when a nav button is clicked
//   onLogout    - callback for logout
// ============================================================
import React from "react";
import type { ActivePanel, UserProfile } from "../../types/dashboard.types";

interface SidebarProps {
  user: UserProfile;
  activePanel: ActivePanel;
  onSelect: (panel: ActivePanel) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { label: string; panel: ActivePanel }[] = [
  { label: "My Details", panel: "details" },
  { label: "Orders",     panel: "orders"  },
  { label: "SERVICE",    panel: "service" },
];

const Sidebar: React.FC<SidebarProps> = ({ user, activePanel, onSelect, onLogout }) => {
  return (
    <aside className="flex flex-col items-center w-64 min-h-screen py-8 px-4"
           style={{ background: "#2d5a4e" }}>

      {/* Title */}
      <h2 className="text-white font-black tracking-widest text-sm uppercase mb-8"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.18em" }}>
        User Dashboard
      </h2>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white/20 shadow-xl"
           style={{ background: "#4a8a7a" }}>
        {user.avatar ? (
          <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
              <circle cx="40" cy="30" r="18" fill="#6aada0" />
              <ellipse cx="40" cy="72" rx="28" ry="20" fill="#6aada0" />
            </svg>
          </div>
        )}
      </div>

      {/* Greeting */}
      <p className="text-white font-bold text-base mb-1">Hello {user.firstName}</p>
      <p className="text-white/50 text-xs mb-10 tracking-widest">USER ID:{user.id}</p>

      {/* Nav Buttons */}
      <nav className="flex flex-col gap-3 w-full mb-auto">
        {NAV_ITEMS.map(({ label, panel }) => {
          const isActive = activePanel === panel;
          return (
            <button
              key={panel}
              onClick={() => onSelect(panel)}
              className="w-full py-3 px-6 rounded-lg text-sm font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                background:  isActive ? "#1a3d35" : "rgba(255,255,255,0.12)",
                color:       isActive ? "#7dd4c4" : "rgba(255,255,255,0.85)",
                border:      isActive ? "1px solid rgba(125,212,196,0.4)" : "1px solid transparent",
                boxShadow:   isActive ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-10 text-white/50 hover:text-white text-xs tracking-widest uppercase transition-colors font-semibold"
      >
        LOGOUT
      </button>
    </aside>
  );
};

export default Sidebar;