import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu as MenuIcon, X, ShoppingCart } from "lucide-react";

import logo from "/images/logo.png";

import Menu from "./Menu";
import CartDrawer from "./CartDrawer";

import { useCart } from "../hooks/CartContext";
import { useAuth } from "../hooks/Authcontext";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { itemCount } = useCart();
  const { user } = useAuth();

  return (
    <>
      <nav className="w-full px-6 lg:px-10 py-5 flex items-center justify-between relative z-50">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-16 md:w-20" />
          <span className="hidden sm:block text-white font-bold text-lg tracking-wide">
            Leema
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-white">
          <Menu linkname="Home" url="/" />
          <Menu linkname="Products" url="/products" />
          <Menu linkname="About" url="/about" />
          <Menu linkname="Contact" url="/contact" />
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-5">

          {/* Cart */}
          {user && (
            <button onClick={() => setCartOpen(true)} className="relative text-white hover:text-orange-200 transition" >
              <ShoppingCart size={26} />
              {itemCount > 0 && (

                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          )}

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link to="/login" className="text-white hover:text-orange-200" >
                Login
              </Link>

              <Link
                to="/signup" className="bg-white text-green-700 px-5 py-2 rounded-full font-semibold hover:bg-orange-100 transition" >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              to={
                user.role === "ADMIN"
                  ? "/admin/dashboard"
                  : user.role === "SELLER"
                  ? "/seller/dashboard"
                  : "/user/dashboard"
              }
              className="bg-white text-green-700 px-5 py-2 rounded-full font-semibold hover:bg-orange-100 transition"
            >
              Dashboard
            </Link>
          )}
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

            {/* Mobile Cart */}
            {user && (
              <button
                onClick={() => {
                  setCartOpen(true);
                  setOpen(false);
                }}
                className="flex items-center justify-between border border-white/20 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                </div>

                {itemCount > 0 && (
                  <span className="bg-orange-500 px-2 py-1 rounded-full text-xs font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth */}
            <div className="border-t border-white/20 pt-4 flex flex-col gap-3">

              {!user ? (
                <>
                  <Link to="/login" className="py-2 text-center border border-white/30 rounded-lg" >
                    Login
                  </Link>

                  <Link to="/signup" className="py-2 text-center bg-orange-500 rounded-lg font-semibold" >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to={
                    user.role === "ADMIN"
                      ? "/admin/dashboard"
                      : user.role === "SELLER"
                      ? "/seller/dashboard"
                      : "/user/dashboard"
                  }
                  className="py-2 text-center bg-orange-500 rounded-lg font-semibold" >
                  Dashboard
                </Link>
              )}

            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
};

export default Navbar;