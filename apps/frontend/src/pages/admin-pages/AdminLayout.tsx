import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import Navbar from "../../components/Navbar";

const AdminLayout: React.FC = () => {
  const [sideOpen, setSideOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-screen bg-stone-50 overflow-hidden">
      {/* Site-wide branded navbar — same as customer / login / signup pages */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sideOpen} onClose={() => setSideOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSideOpen(true)} />

          <main className="flex-1 overflow-y-auto px-5 py-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
