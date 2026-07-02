import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// ── Keyframes ─────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes heroIn {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(48px) scale(0.97); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes badgePop {
    from { opacity: 0; transform: scale(0.85) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes pulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.6); opacity: 0.4; }
  }
  @keyframes imgFadeIn {
    from { opacity: 0; transform: scale(1.04); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes progressBar {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes floatBadge {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
`;

// ── Slide Data ────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    tag: "Living Room",
    title: "Luxury Sofas",
    desc: "Sink into comfort",
  },
  {
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
    tag: "Bedroom",
    title: "Serene Spaces",
    desc: "Rest in elegance",
  },
  {
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80",
    tag: "Accent",
    title: "Designer Chairs",
    desc: "Bold statement pieces",
  },
  {
    img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80",
    tag: "Dining",
    title: "Dining Sets",
    desc: "Gather in style",
  },
];

const INTERVAL = 4200;

// ── Image Slider ──────────────────────────────────────────────────────────────

function ImageSlider(): React.ReactElement {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next, paused]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image */}
      <img
        key={animKey}
        src={slide.img}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: "imgFadeIn 0.7s ease both" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Slide info */}
      <div
        key={`info-${animKey}`}
        className="absolute bottom-0 left-0 right-0 p-5"
        style={{ animation: "heroIn 0.5s ease 0.2s both" }}
      >
        <span className="text-[10px] font-black uppercase tracking-[4px] text-amber-300 mb-1 block">
          {slide.tag}
        </span>
        <div className="text-white font-black text-xl leading-tight">{slide.title}</div>
        <div className="text-white/60 text-xs mt-0.5">{slide.desc}</div>
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            key={`bar-${animKey}`}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
            style={{ animation: `progressBar ${INTERVAL}ms linear both` }}
          />
        </div>
      )}

      {/* Dot indicators */}
      <div className="absolute top-4 right-4 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current
                ? "linear-gradient(90deg,#fbbf24,#f97316)"
                : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L5 7l4 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 2l4 5-4 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <header
        className="relative min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #ea580c 0%, #f59e0b 45%, #fbbf24 80%, #fde68a 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 520, height: 520,
            top: 0, left: 0,
            transform: "translate(-30%,-30%)",
            background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600, height: 600,
            bottom: 0, right: 0,
            transform: "translate(28%,28%)",
            background: "radial-gradient(circle, rgba(194,65,12,0.28) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320, height: 320,
            top: "42%", left: "48%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Top shine line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent z-10" />

        {/* Navbar */}
        <Navbar />

        {/* Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-16 pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: Text ── */}
            <div className="flex flex-col gap-5 text-center lg:text-left">

              {/* Live badge */}
              <div
                className="inline-flex items-center gap-2.5 self-center lg:self-start bg-white/20 backdrop-blur-sm border border-white/35 rounded-full px-4 py-1.5"
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? "badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.05s both" : "none",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-white"
                    style={{ animation: "pulseDot 1.8s ease-in-out infinite" }}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="text-white text-[11px] font-black uppercase tracking-[4px]">
                  Premium Collection
                </span>
              </div>

              {/* Headline */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? "heroIn 0.7s ease 0.15s both" : "none",
                }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black leading-[0.92] tracking-tight text-white drop-shadow-sm">
                  Modern
                  <br />
                  <span className="relative inline-block">
                    Furniture
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      height="8"
                      viewBox="0 0 300 8"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 6 Q75 1 150 5 Q225 9 300 4"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p
                className="text-white/85 text-lg leading-relaxed max-w-sm mx-auto lg:mx-0"
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? "heroIn 0.7s ease 0.28s both" : "none",
                }}
              >
                Stylish, comfortable, and premium furniture for every
                corner of your home.
              </p>

              {/* Thin divider */}
              <div
                className="flex items-center gap-2 justify-center lg:justify-start"
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? "heroIn 0.6s ease 0.33s both" : "none",
                }}
              >
                <div className="h-px w-10 bg-white/35" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/55" />
                <div className="h-px w-16 bg-white/35" />
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? "heroIn 0.7s ease 0.42s both" : "none",
                }}
              >
                <Link
                  to="/user/category"
                  className="relative overflow-hidden group bg-white font-black text-orange-500 px-8 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                  style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>

                <Link
                  to="/aboutus"
                  className="font-semibold text-white border-2 border-white/40 hover:border-white/80 hover:bg-white/15 px-8 py-3.5 rounded-2xl text-sm backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>

              {/* Mini stats */}
              <div
                className="flex gap-7 justify-center lg:justify-start pt-2"
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? "heroIn 0.7s ease 0.55s both" : "none",
                }}
              >
                {[["500+", "Products"], ["3", "Brands"], ["10K+", "Customers"]].map(([val, lbl]) => (
                  <div key={lbl} className="flex flex-col items-center lg:items-start gap-0.5">
                    <span className="text-white font-black text-xl leading-none drop-shadow-sm">{val}</span>
                    <span className="text-white/60 text-[11px] font-medium tracking-wide">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Slider ── */}
            <div
              className="relative"
              style={{
                opacity: mounted ? 1 : 0,
                animation: mounted ? "slideIn 0.9s cubic-bezier(0.34,1.2,0.64,1) 0.3s both" : "none",
              }}
            >
              {/* Glow behind */}
              <div
                className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Corner brackets */}
              {[
                "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
                "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
              ].map((cls, i) => (
                <span
                  key={i}
                  className={`absolute w-7 h-7 border-white/60 z-10 pointer-events-none ${cls}`}
                />
              ))}

              {/* Slider frame */}
              <div
                className="h-[330px] md:h-[470px]"
                style={{
                  borderRadius: 20,
                  boxShadow:
                    "0 28px 80px rgba(0,0,0,0.28), 0 0 0 1.5px rgba(255,255,255,0.28), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <ImageSlider />
              </div>

              {/* Floating badge — bottom left */}
              <div
                className="absolute -bottom-5 -left-5 z-20 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted
                    ? "badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.85s both, floatBadge 3.5s ease-in-out 1.5s infinite"
                    : "none",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}
                >
                  🛋️
                </div>
                <div>
                  <div className="text-stone-800 text-xs font-black">New Arrivals</div>
                  <div className="text-stone-400 text-[10px]">Updated weekly</div>
                </div>
              </div>

              {/* Floating pill — top right */}
              <div
                className="absolute -top-4 -right-4 z-20 rounded-xl px-3.5 py-2 shadow-lg"
                style={{
                  background: "linear-gradient(135deg,#ea580c,#f59e0b)",
                  boxShadow: "0 6px 20px rgba(234,88,12,0.38)",
                  opacity: mounted ? 1 : 0,
                  animation: mounted
                    ? "badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 1s both, floatBadge 4s ease-in-out 2s infinite"
                    : "none",
                }}
              >
                <div className="text-white text-[11px] font-black tracking-wide">3 Brands</div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade — blends into the dark Home below */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(28,25,23,0.6))" }}
        />
      </header>
    </>
  );
};

export default Header;