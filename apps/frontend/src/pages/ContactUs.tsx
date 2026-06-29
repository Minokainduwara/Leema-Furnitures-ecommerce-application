import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes successPop {
    0%   { opacity: 0; transform: scale(0.9) translateY(-8px); }
    70%  { transform: scale(1.02) translateY(0); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes floatIcon {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }
`;

// ── Contact Info Items ─────────────────────────────────────────────────────────

const INFO = [
  {
    icon: Phone,
    label: "Phone",
    value: "+94 77 123 4567",
    sub: "Mon – Sat, 9am – 6pm",
    color: "from-amber-400 to-orange-400",
  },
  {
    icon: Mail,
    label: "Email",
    value: "leemakegalle@gmail.com",
    sub: "We reply within 24 hours",
    color: "from-orange-400 to-amber-500",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123/A Main Street, Kegalle",
    sub: "Sri Lanka",
    color: "from-amber-500 to-yellow-400",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const ContactUs: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-sm text-stone-900 placeholder-stone-400 bg-stone-50 transition-all duration-200 focus:outline-none focus:bg-white";

  return (
    <>
      <style>{STYLES}</style>

      <div className="min-h-screen bg-stone-50">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden py-20 px-6"
          style={{
            background: "linear-gradient(135deg, #1c1917 0%, #431407 50%, #1c1917 100%)",
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.10) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.11) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,146,60,0.09) 0%, transparent 70%)" }} />
          {/* Top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <div
            className="relative z-10 max-w-6xl mx-auto"
            style={{ animation: "fadeUp 0.6s ease both" }}
          >
            {/* Label */}
            <span className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-black uppercase tracking-[5px] mb-5">
              <span className="h-px w-6 bg-amber-400/60" />
              Reach Out
              <span className="h-px w-6 bg-amber-400/60" />
            </span>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Contact Us
            </h1>
            <p className="text-stone-400 mt-3 text-lg max-w-md">
              We'd love to hear from you. Send us a message and we'll respond shortly.
            </p>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3 mt-7">
              {[
                { icon: Clock, text: "Mon – Sat, 9am – 6pm" },
                { icon: MessageSquare, text: "Reply within 24 hours" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-white/8 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5"
                >
                  <Icon size={13} color="#f59e0b" />
                  <span className="text-stone-300 text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-start">

            {/* ── Left: Info ── */}
            <div style={{ animation: "fadeUp 0.6s ease 0.1s both" }}>
              <span className="text-amber-500 text-xs font-black uppercase tracking-[4px]">
                Our Details
              </span>
              <h2 className="text-3xl font-black text-stone-900 mt-2 mb-8">
                Get in Touch
              </h2>

              <div className="space-y-5">
                {INFO.map(({ icon: Icon, label, value, sub, color }, i) => (
                  <div
                    key={label}
                    className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-stone-100 transition-all duration-300"
                    style={{
                      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      animation: `fadeUp 0.5s ease ${0.15 + i * 0.08}s both`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 8px 32px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.06)";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(245,158,11,0.25)";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 2px 12px rgba(0,0,0,0.05)";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgb(231,229,228)";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Icon tile */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${color.replace("from-", "").replace(" to-", ", ").split(" ")[0] === "amber" ? "#f59e0b" : "#fb923c"}, ${color.includes("orange") ? "#f97316" : color.includes("yellow") ? "#facc15" : "#f97316"})`,
                        animation: `floatIcon 3.5s ease-in-out ${i * 0.6}s infinite`,
                      }}
                    >
                      <Icon size={19} color="#fff" />
                    </div>

                    <div>
                      <p className="text-stone-400 text-[11px] font-black uppercase tracking-[3px] mb-0.5">
                        {label}
                      </p>
                      <p className="text-stone-800 font-bold text-sm">{value}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div
                className="mt-6 rounded-2xl overflow-hidden border border-stone-100"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <iframe
                  title="Kegalle Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31680.17!2d80.3448!3d7.2513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3329150e7f5b5%3A0x1e4e2b7e3a4c1b0!2sKegalle!5e0!3m2!1sen!2slk!4v1"
                  width="100%"
                  height="180"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* ── Right: Form ── */}
            <div
              className="bg-white rounded-3xl p-8 border border-stone-100"
              style={{
                boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                animation: "fadeUp 0.6s ease 0.2s both",
              }}
            >
              {/* Form header */}
              <div className="mb-7">
                <h3 className="text-xl font-black text-stone-900">Send a Message</h3>
                <p className="text-stone-400 text-sm mt-1">
                  Fill in the form and we'll get back to you.
                </p>
              </div>

              {/* Success banner */}
              {submitted && (
                <div
                  className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5 mb-6"
                  style={{ animation: "successPop 0.4s ease both" }}
                >
                  <CheckCircle2 size={18} color="#059669" className="flex-shrink-0" />
                  <div>
                    <p className="text-emerald-700 font-bold text-sm">Message sent!</p>
                    <p className="text-emerald-600 text-xs mt-0.5">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-black text-stone-600 uppercase tracking-[2px] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    required
                    placeholder="John Silva"
                    className={inputBase}
                    style={{
                      border: focused === "name"
                        ? "1.5px solid #f59e0b"
                        : "1.5px solid #e7e5e4",
                      boxShadow: focused === "name"
                        ? "0 0 0 3px rgba(245,158,11,0.12)"
                        : "none",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-stone-600 uppercase tracking-[2px] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                    placeholder="you@example.com"
                    className={inputBase}
                    style={{
                      border: focused === "email"
                        ? "1.5px solid #f59e0b"
                        : "1.5px solid #e7e5e4",
                      boxShadow: focused === "email"
                        ? "0 0 0 3px rgba(245,158,11,0.12)"
                        : "none",
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-black text-stone-600 uppercase tracking-[2px] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    className={`${inputBase} resize-none`}
                    style={{
                      border: focused === "message"
                        ? "1.5px solid #f59e0b"
                        : "1.5px solid #e7e5e4",
                      boxShadow: focused === "message"
                        ? "0 0 0 3px rgba(245,158,11,0.12)"
                        : "none",
                    }}
                  />
                  <p className="text-stone-400 text-[11px] mt-1.5 text-right">
                    {form.message.length}/500
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="relative overflow-hidden group w-full py-3.5 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #f97316)",
                    boxShadow: "0 6px 24px rgba(245,158,11,0.38)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Send size={15} />
                    Send Message
                  </span>
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;