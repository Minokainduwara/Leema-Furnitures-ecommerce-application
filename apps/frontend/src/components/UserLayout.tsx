import { Outlet } from "react-router-dom";

/** Full-screen layout for user account pages (no site navbar). */
const UserLayout = () => (
  <div className="min-h-screen bg-stone-50">
    <Outlet />
  </div>
);

export default UserLayout;
