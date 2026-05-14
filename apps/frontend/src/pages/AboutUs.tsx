import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-linear-to-r from-amber-500 to-amber-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Leema</h1>
          <p className="text-lg md:text-xl">Premium furniture for your beautiful home</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-6">Our Story</h2>
            <p className="text-stone-600 mb-4 leading-relaxed">
              Leema is dedicated to providing high-quality, stylish, and durable furniture that transforms your living spaces into comfortable havens.
            </p>
            <p className="text-stone-600 mb-4 leading-relaxed">
              With years of experience in the furniture industry, we pride ourselves on offering exceptional customer service and reliable delivery.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Our mission is to make quality furniture accessible to everyone, ensuring every home is furnished with elegance and comfort.
            </p>
          </div>
          <img src="/images/about.jpg" alt="About Us" className="rounded-xl shadow-lg w-full h-96 object-cover" />
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition-all"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;