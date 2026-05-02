import { ArrowRight } from "lucide-react";
import { fmt } from "../constants/StaticVariables";

export default function Hero({ todaysPick = null }) {
  return (
    <section style={{ background: "#fdf8f3" }} className="overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 items-center min-h-screen py-12 gap-10">
          <div className="order-2 lg:order-1">
            <span
              style={{ background: "#f5e6d3", color: "#c97d5b" }}
              className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-5"
            >
              ✨ New Collection 2025
            </span>
            <h1
              style={{ fontFamily: "Georgia,serif", color: "#3a2416" }}
              className="text-5xl xl:text-6xl font-bold leading-tight mb-5"
            >
              Flowers That<br />
              <span style={{ color: "#c97d5b" }} className="italic">Tell Your</span><br />
              Story
            </h1>
            <p style={{ color: "#7a5c4a" }} className="text-lg leading-relaxed mb-8 max-w-md">
              Handcrafted bouquets & floral arrangements delivered fresh to your doorstep. Because every moment deserves beauty.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#shop"
                style={{ background: "#c97d5b" }}
                className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Shop Now <ArrowRight size={16} />
              </a>
              <a
                href="#collections"
                style={{ border: "2px solid #c97d5b", color: "#c97d5b" }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold hover:opacity-70 transition-opacity"
              >
                Our Collections
              </a>
            </div>
            <div className="flex gap-8 pt-8 border-t" style={{ borderColor: "#e8d5c4" }}>
              {[["2K+", "Happy Customers"], ["500+", "Flower Varieties"], ["4.9★", "Avg Rating"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: "Georgia,serif", color: "#4a3728" }} className="text-2xl font-bold">{n}</p>
                  <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-72 h-80 sm:w-96 sm:h-[28rem]">
              <div style={{ background: "#f5e6d3" }} className="absolute inset-6 rounded-full" />
              <img
                src="https://flowergiftkorea.com/wp-content/uploads/2016/05/ADB42A7F-D38F-4A75-80DE-6F10E4844B26.jpg"
                alt="Bouquet"
                className="relative z-10 w-full h-full object-cover"
                style={{ borderRadius: "40% 60% 60% 40% / 50% 40% 60% 50%" }}
              />
              <div className="absolute top-4 -right-2 z-20 bg-white rounded-2xl shadow-xl p-3 w-36">
                <p style={{ color: "#9c7a62" }} className="text-xs">Today's Pick</p>
                <p
                  style={{ fontFamily: "Georgia,serif", color: "#4a3728" }}
                  className="font-bold text-sm truncate"
                >
                  {todaysPick ? todaysPick.name : "—"}
                </p>
                <p style={{ color: "#c97d5b" }} className="font-semibold text-sm">
                  {todaysPick ? fmt(todaysPick.price) : ""}
                </p>
              </div>
              <div className="absolute -bottom-2 -left-2 z-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 w-40">
                <div
                  style={{ background: "#f5e6d3" }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                >
                  🚚
                </div>
                <div>
                  <p style={{ color: "#9c7a62" }} className="text-xs">Same Day</p>
                  <p style={{ color: "#4a3728" }} className="text-xs font-bold">Free Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
