import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-72 min-h-screen bg-[#3e5f5a] text-white p-6">

      <h1 className="text-xl font-semibold mb-8">
        ADMIN DASHBOARD
      </h1>

      <div className="flex flex-col gap-4">

        <NavLink
          to="/admindashboard"
          end
          className="bg-gray-200 text-gray-700 py-3 rounded-xl text-center hover:bg-white transition"
        >
          My Details
        </NavLink>

        <NavLink
          to="/admindashboard/add-user"
          className="bg-gray-200 text-gray-700 py-3 rounded-xl text-center hover:bg-white transition"
        >
          Add User
        </NavLink>

        <NavLink
          to="/admindashboard/add-product"
          className="bg-gray-200 text-gray-700 py-3 rounded-xl text-center hover:bg-white transition"
        >
          Add Product
        </NavLink>

      </div>
    </div>
  );
}