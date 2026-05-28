import { ArrowRight } from "lucide-react";
import { fmt } from "../constants/StaticVariables";
import { useNavigate } from "react-router-dom";
import TechComputerLogo from "../assets/tech-computer-logo.jpeg";

export default function Hero({ todaysPick = null }) {
  const navigate = useNavigate();
  return (
    <section style={{ background: "var(--color-beige)" }} className="overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 items-center min-h-screen py-12 gap-10">
          <div className="order-2 lg:order-1">
            <span
              style={{ background: "var(--color-beige)", color: "var(--color-olive)" }}
              className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-5"
            >
              Tech Computer 2026
            </span>
            <h1
              style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }}
              className="text-5xl xl:text-6xl font-bold leading-tight mb-5"
            >
              Smarter Tech<br />
              <span style={{ color: "var(--color-olive)" }} className="italic">for Work</span><br />
              and Home
            </h1>
            <p style={{ color: "var(--color-olive)" }} className="text-lg leading-relaxed mb-8 max-w-md">
              Reliable computers, accessories, repairs, and support to keep your day running smoothly.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => todaysPick?.category
                  ? navigate(`/category/${todaysPick.category}/${todaysPick._id}`)
                  : navigate("/category")
                }
                style={{ background: "var(--color-olive)" }}
                className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Shop Now <ArrowRight size={16} />
              </button>
              <a
                href="#collections"
                style={{ border: "2px solid var(--color-olive)", color: "var(--color-olive)" }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold hover:opacity-70 transition-opacity"
              >
                Our Collections
              </a>
            </div>
            <div className="flex gap-8 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
              {[["2K+", "Happy Customers"], ["500+", "Products & Services"], ["4.9★", "Avg Rating"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="text-2xl font-bold">{n}</p>
                  <p style={{ color: "var(--color-olive)" }} className="text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-72 sm:w-96 max-w-full">
              <div className="rounded-3xl bg-white shadow-2xl border p-8 sm:p-10" style={{ borderColor: "var(--color-border)" }}>
              <img
                src={TechComputerLogo}
                alt="Tech Computer"
                className="relative z-10 w-full aspect-square object-contain"
              />
              </div>
              <div className="absolute top-4 -right-2 z-20 bg-white rounded-2xl shadow-xl p-3 w-36">
                <p style={{ color: "var(--color-olive)" }} className="text-xs">Featured</p>
                <p
                  style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }}
                  className="font-bold text-sm truncate"
                >
                  {todaysPick ? todaysPick.name : "Tech Computer"}
                </p>
                <p style={{ color: "var(--color-olive)" }} className="font-semibold text-sm">
                  {todaysPick ? fmt(todaysPick.price) : ""}
                </p>
              </div>
              <div className="absolute -bottom-2 -left-2 z-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 w-40">
                <div
                  style={{ background: "var(--color-beige)" }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                >
                  ⚙
                </div>
                <div>
                  <p style={{ color: "var(--color-olive)" }} className="text-xs">Fast Help</p>
                  <p style={{ color: "var(--color-charcoal)" }} className="text-xs font-bold">Sales & Repairs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
