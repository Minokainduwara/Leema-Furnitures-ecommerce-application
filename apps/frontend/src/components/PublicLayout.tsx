import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400">
        <Navbar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
