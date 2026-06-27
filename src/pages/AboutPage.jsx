import { useState } from "react";
import {
   Award, Users, Star,
   ArrowRight
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import OurStories from "../components/OurStories";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MILESTONES = [
  { year:"2018", title:"Founded",        desc:"Started as a trusted computer sales and service shop in Surat." },
  { year:"2019", title:"First Store",    desc:"Expanded our in-store support for computers, accessories, and repairs." },
  { year:"2021", title:"Online Launch",  desc:"Launched online discovery for products, service requests, and customer support." },
  { year:"2023", title:"Growth",         desc:"Served 2000+ customers across home, student, and office technology needs." },
  { year:"2025", title:"Awards",         desc:"Recognised for dependable local computer sales and service." },
];

const VALUES = [
  { icon:"💻", title:"Quality First",    desc:"We recommend practical computers and accessories that match real customer needs." },
  { icon:"🤝", title:"Helpful Guidance", desc:"Every product and service request is handled with clear advice and careful checking." },
  { icon:"🛡️", title:"Reliable Support", desc:"We focus on dependable repair guidance, setup help, and after-sales support." },
  { icon:"⚙️", title:"Ready To Use",     desc:"From setup to service, we help customers keep their systems running smoothly." },
];

const STATS = [
  { n:"2,000+", l:"Happy Customers" },
  { n:"500+",   l:"Products & Services" },
  { n:"12",     l:"Cities Covered" },
  { n:"4.9★",   l:"Average Rating" },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState("2025");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "var(--color-beige)", minHeight: "100vh" }}>

      <Breadcrumb paths={[
        { id: 1, name: "Home",  path: "/" },
        { id: 2, name: "About", path: "/about" },
      ]} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "var(--color-charcoal)" }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "var(--color-olive)" }} />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
          style={{ background: "var(--color-beige)" }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span style={{ background: "rgba(217,119,6,0.12)", color: "var(--color-sage)" }}
              className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-5">
              Our Story
            </span>
            <h1 style={{ fontFamily: "Georgia, serif", color: "var(--color-beige)" }}
              className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Built On<br />
              <span style={{ color: "var(--color-sage)" }} className="italic">Trust</span><br />
              Since 2018
            </h1>
            <p style={{ color: "var(--color-sage)" }} className="text-lg leading-relaxed mb-8 max-w-md">
              Tech Computer was built around a simple idea: dependable technology should be easy to buy,
              maintain, and understand. For over 7 years we've helped customers with computers, accessories, and support.
            </p>
            <a href="/category" style={{ background: "var(--color-olive)" }}
              className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Explore Products <ArrowRight size={16} />
            </a>
          </div>

          {/* Image Collage */}
          <div className="relative h-80 lg:h-[420px]">
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=85"
              alt="Laptop workspace" className="absolute top-0 right-0 w-56 h-64 object-cover rounded-3xl"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=85"
              alt="Computer service" className="absolute bottom-0 left-0 w-48 h-52 object-cover rounded-3xl"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
            <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=85"
              alt="Computer accessories" className="absolute bottom-10 right-32 w-36 h-40 object-cover rounded-2xl"
              style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "var(--color-olive)" }} className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <p style={{ fontFamily: "Georgia, serif" }} className="text-3xl font-bold text-white">{n}</p>
                <p className="text-sm text-white opacity-80 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORIES (Instagram videos) ── */}
      <OurStories />

      {/* ── VALUES ── */}
      <section className="py-20" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-3">What Drives Us</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "var(--color-charcoal)" }} className="text-4xl font-bold">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-3xl border text-center hover:shadow-lg transition-shadow"
                style={{ borderColor: "var(--color-border)" }}>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 style={{ fontFamily: "Georgia, serif", color: "var(--color-charcoal)" }} className="text-lg font-bold mb-3">{title}</h3>
                <p style={{ color: "var(--color-olive)" }} className="text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-3">How We Grew</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "var(--color-charcoal)" }} className="text-4xl font-bold">Our Journey</h2>
          </div>

          {/* Year Pills */}
          <div className="flex justify-center gap-2 flex-wrap mb-10">
            {MILESTONES.map(({ year }) => (
              <button key={year} onClick={() => setActiveYear(year)}
                className="px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all"
                style={activeYear === year
                  ? { background: "var(--color-olive)", borderColor: "var(--color-olive)", color: "white" }
                  : { borderColor: "var(--color-border)", color: "var(--color-olive)" }}>
                {year}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5"
              style={{ background: "var(--color-border)" }} />

            <div className="space-y-8">
              {MILESTONES.map(({ year, title, desc }, i) => {
                const isLeft = i % 2 === 0;
                const isActive = year === activeYear;
                return (
                  <div key={year}
                    className={`relative flex items-center gap-6 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}>
                      <div className="inline-block p-5 rounded-2xl border transition-all"
                        style={{
                          borderColor: isActive ? "var(--color-olive)" : "var(--color-border)",
                          background: isActive ? "var(--color-beige)" : "white",
                          boxShadow: isActive ? "0 8px 24px rgba(217,119,6,0.14)" : "none"
                        }}>
                        <p style={{ color: "var(--color-olive)" }} className="text-xs font-bold uppercase tracking-widest mb-1">{year}</p>
                        <h3 style={{ fontFamily: "Georgia, serif", color: "var(--color-charcoal)" }} className="font-bold text-lg mb-1">{title}</h3>
                        <p style={{ color: "var(--color-olive)" }} className="text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="relative z-10 w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0"
                      style={{
                        background: isActive ? "var(--color-olive)" : "white",
                        borderColor: isActive ? "var(--color-olive)" : "var(--color-border)"
                      }}>
                      <div className="w-2.5 h-2.5 rounded-full"
                        style={{ background: isActive ? "white" : "var(--color-border)" }} />
                    </div>

                    {/* Empty side */}
                    <div className="flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-3">Recognition</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "var(--color-charcoal)" }} className="text-3xl font-bold">Awards & Press</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon:<Award size={28}/>, title:"Trusted Tech Service",     sub:"Local Customer Choice 2025" },
              { icon:<Star size={28}/>,  title:"4.9★ Rated",               sub:"Google Reviews — 2,000+ ratings" },
              { icon:<Users size={28}/>, title:"Customer Focused",         sub:"Surat Service Recognition 2024" },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 p-6 rounded-3xl border bg-white"
                style={{ borderColor: "var(--color-border)" }}>
                <div style={{ background: "var(--color-beige)", color: "var(--color-olive)" }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p style={{ fontFamily: "Georgia, serif", color: "var(--color-charcoal)" }} className="font-bold">{title}</p>
                  <p style={{ color: "var(--color-olive)" }} className="text-sm mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--color-charcoal)", opacity: "0.9" }} className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-4xl block mb-4">💻</span>
          <h2 style={{ fontFamily: "Georgia, serif", color: "var(--color-beige)" }} className="text-4xl font-bold mb-4">
            Let's Upgrade Your Setup
          </h2>
          <p style={{ color: "var(--color-sage)" }} className="mb-8 leading-relaxed">
            Whether it is a home computer, student laptop, office refresh, or repair need,
            we'll help you find the right product or service for your setup.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/category" style={{ background: "var(--color-olive)" }}
              className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90">
              Shop Now <ArrowRight size={16} />
            </a>
            <a href="/contact" style={{ border: "2px solid var(--color-olive)", color: "var(--color-sage)" }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold hover:opacity-70">
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
