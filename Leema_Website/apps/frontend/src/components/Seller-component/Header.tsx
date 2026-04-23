import React from "react";
import Menu from "./Menu";
const leemalogo = "/images/leemalogo.jpg";
import WebGLSlider from "./WebGSlider";

const Header: React.FC = () => {
  return (
    <div className="min-h-[80vh] lg:min-h-[90vh] bg-gradient-to-r from-green-500 via-green-400 to-emerald-300 relative overflow-hidden px-5 md:px-10 py-10 md:py-4">
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-300/40 rounded-full blur-3xl animate-pulse -z-10"></div>

      <div className=" text-white flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10 px-5 md:px-10 py-4">
        <div>
          <a>
            <img src={leemalogo} alt="logo" className="w-[100px]" />
          </a>
        </div>

        <div className="flex flex-wrap justify-center mt-4 lg:mt-0 gap-4">
          <Menu linkname="Home" url="/" />
          <Menu linkname="Products" url="/products" />
          <Menu linkname="About us" url="/about" />
          <Menu linkname="Contact us" url="/contact" />
        </div>

        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 mt-4 lg:mt-0">
          <Menu linkname="Login" url="/login" />
          <Menu linkname="Sign Up" url="/sign" />
        </div>
      </div>

      <div className="flex justify-around items-center">
        <div className="flex flex-col">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-sans leading-tight">
            Mordern furniture
          </h3>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-sans leading-tight">
            Products
          </h3>
          <div className="ml-11">
            <h5 className="text-lg md:text-xl lg:text-2xl text-white font-light leading-relaxed mt-4 md:mt-6">
              Discover stylish furniture that brings comfort,
            </h5>
            <h5 className="text-xl lg:text-2xl text-white font-light leading-relaxed">
              elegance, and warmth to your home.
            </h5>
            <div className="flex">
              <a>
                <button className="bg-orange-500 hover:bg-orange-600 rounded-lg px-5 md:px-6 py-2 md:py-3 font-semibold font-sans mt-6 md:mt-8 text-white shadow-lg transform hover:-translate-y-1 transition duration-300">
                  About Us
                </button>
              </a>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-auto">
          <div className="relative overflow-hidden rounded-xl w-full md:w-[500px] lg:w-[650px] h-[350px] md:h-[450px] transform hover:scale-105 transition duration-500">
            <WebGLSlider />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;