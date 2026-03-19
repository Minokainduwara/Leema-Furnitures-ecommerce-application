import Sidebar from "../components/Admin-Components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 p-10 bg-gray-100">
        <Outlet />
      </div>

    </div>
  );
}