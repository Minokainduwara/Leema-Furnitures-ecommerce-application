import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu as MenuIcon, X } from "lucide-react";
import logo from "/images/leemalogo.jpg";
import Menu from "./Menu";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full px-6 lg:px-10 py-5 flex items-center justify-between relative z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="leemalogo" className="w-16 md:w-20 h-8 md:h-10 rounded-md shadow-lg" />
        <span className="hidden sm:block text-white font-bold text-lg tracking-wide">
          Leema
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-8 text-white">
        <Menu linkname="Home" url="/" />
        <Menu linkname="Products" url="/products" />
        <Menu linkname="About Us" url="/aboutus" />
        <Menu linkname="Contact Us" url="/contactus" />
      </div>

      {/* Desktop Auth */}
      <div className="hidden lg:flex items-center gap-4">
        <Link to="/login" className="text-white hover:text-orange-200">
          Login
        </Link>

        <Link
          to="/signup"
          className="bg-white text-green-700 px-5 py-2 rounded-full font-semibold hover:bg-orange-100 transition"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden text-white"
      >
        {open ? <X size={30} /> : <MenuIcon size={30} />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-20 left-0 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col gap-5 lg:hidden text-white shadow-2xl">

          <Menu linkname="Home" url="/" />
          <Menu linkname="Products" url="/products" />
          <Menu linkname="About" url="/about" />
          <Menu linkname="Contact" url="/contact" />

          <div className="border-t border-white/20 pt-4 flex flex-col gap-3">
            <Link to="/login" className="py-2 text-center border border-white/30 rounded-lg">
              Login
            </Link>

            <Link
              to="/signup"
              className="py-2 text-center bg-orange-500 rounded-lg font-semibold"
            >
              Sign Up
            </Link>
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;