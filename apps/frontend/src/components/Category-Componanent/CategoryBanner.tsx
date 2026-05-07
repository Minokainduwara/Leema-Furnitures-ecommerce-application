import { useState, useEffect } from "react";

const images = [
  "product-1.png",
  "product-4.png",
  "product-6.png",
  "product-4.png",
];

export default function CategoryBanner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl shadow-xl">

      {/* Images */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Category Banner"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
            index === currentImage
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100"
          }`}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

      {/* Text Content */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 text-white max-w-lg animate-fadeIn">

        <p className="uppercase tracking-[0.35em] text-red-400 text-xs font-bold mb-3">
          New Collection
        </p>

        <h1 className="font-serif text-2xl md:text-4xl font-bold leading-snug">
          Create a peaceful <br />
          retreat with <br />
          <span className="text-red-400">
            beautifully crafted
          </span>
          <br />
          bedroom furniture.
        </h1>

        <p className="mt-4 text-sm text-gray-200 max-w-sm">
          Discover elegant designs that bring comfort, style, and warmth to your home.
        </p>

        <button className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 transition rounded-full text-sm font-semibold shadow-lg">
          Shop Now
        </button>

      </div>

      {/* Optional CSS animation (add in global CSS) */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </div>
  );
}