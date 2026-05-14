import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar  from "../../components/layout/Topbar";

// ─── AdminLayout ──────────────────────────────────────────────────────────────
// Shared shell used by every protected page via <Outlet />.
// The router renders the matched child page into the <Outlet />.

const UserLayout: React.FC = () => {
  const [sideOpen, setSideOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar open={sideOpen} onClose={() => setSideOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSideOpen(true)} />

        <main className="flex-1 overflow-y-auto px-5 py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;