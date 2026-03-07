import React from 'react';
export default function Navbar() {
  return (
    <nav className="bg-[#ffffff] px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-[#E84545] px-6 py-2 rounded">
            <span className="text-white font-bold text-2xl italic">Leema</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <a href="#home" className="text-red hover:text-red-700 transition-colors">
            Home
          </a>
          <a href="#product" className="text-red hover:text-red-700 transition-colors">
            Product
          </a>
          <a href="#contact" className="text-red hover:text-red-700 transition-colors">
            Contact us
          </a>
          <a href="#service" className="text-red hover:text-red-700 transition-colors">
            service
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <button 
            // variant="ghost" 
            className="text-red hover:bg-red/700 hover:text-red"
          >
            login
          </button>
          <button 
            // variant="ghost" 
            className="text-red hover:bg-red/700 hover:text-red"
          >
            sign in
          </button>
        </div>
      </div>
    </nav>
  );
}