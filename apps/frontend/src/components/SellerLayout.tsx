import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Adds the site-wide orange Navbar above any seller page.
// Each seller page already brings its own sidebar/layout, so this just
// stacks the branded strip on top — same as admin / login / signup / customer pages.
const SellerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 flex-shrink-0">
        <Navbar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;
