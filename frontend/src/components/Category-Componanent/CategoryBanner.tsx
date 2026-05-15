import { useState, useEffect } from "react";


const images = [
  "/product-1.png",
  "/product-4.png",
   "/product-6.png",
  "/product-4.png",
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
    <div className="relative h-64 w-full overflow-hidden">

      {/* Image Slider */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Category Banner"
          className={`absolute w-200 h-full object-cover transition-opacity duration-[2000ms] ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Text Content */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 text-center text-red max-w-md">
        <p className="uppercase tracking-[0.3em] text-[#ff0000] text-xs font-bold mb-2">
          New Collection
        </p>

        <h1 className="font-serif text-4xl font-black text-[#ff1500]  leading-tight px-10">
          Create a peaceful <br />
          retreat with <br />
          <span className="text-[#ff1500]">
            beautifully crafted
          </span>
          <br />
          bedroom furniture.
        </h1>
      </div>

    </div>
  );
}