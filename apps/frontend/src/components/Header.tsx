import React from "react";
import Navbar from "./Navbar";
import WebGLSlider from "./WebGSlider";

const Header: React.FC = () => {
  return (
    <header className="relative min-h-screen bg-linear-to-br from-emerald-600 via-green-500 to-lime-400 overflow-hidden">

      {/* Background */}
      <div className="absolute w-72 h-72 bg-white/10 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-orange-300/20 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Modern <span className="text-orange-200">Furniture</span>
            </h1>

            <p className="mt-6 text-lg text-white/90">
              Stylish, comfortable, and premium furniture for your home.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/products"
                className="bg-orange-500 px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition"
              >
                Shop Now
              </a>

              <a
                href="/about"
                className="bg-white/20 px-8 py-3 rounded-xl backdrop-blur border border-white/30"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 h-87.5 md:h-125">
              <WebGLSlider />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;