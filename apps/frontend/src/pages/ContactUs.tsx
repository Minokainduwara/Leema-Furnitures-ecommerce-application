import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl">We'd love to hear from you</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <Phone size={24} className="text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-stone-900">Phone</h3>
                  <p className="text-stone-600">+94 77 123 4567</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail size={24} className="text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-stone-900">Email</h3>
                  <p className="text-stone-600">leemakegalle@gmail.com </p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin size={24} className="text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-stone-900">Address</h3>
                  <p className="text-stone-600">123/A Main Street, Kegalle, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-600 font-semibold">Thank you! We'll get back to you soon.</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Your message..."
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;