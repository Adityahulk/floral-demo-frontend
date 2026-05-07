import { useState } from "react";
import {
   Award, Users, Star,
   ArrowRight
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { Facebook, Instagram, Twitter } from "react-feather";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MILESTONES = [
  { year:"2018", title:"Founded",        desc:"Started as a small plant nursery corner in Surat." },
  { year:"2019", title:"First Studio",   desc:"Opened our first brick-and-mortar plant studio with planters & decor." },
  { year:"2021", title:"Online Launch",  desc:"Launched our online store with same-day plant delivery in Surat." },
  { year:"2023", title:"Pan-India",      desc:"Expanded to 12 cities across India with 2000+ happy plant parents." },
  { year:"2025", title:"Awards",         desc:"Won 'Best Plant & Decor Brand' at India Lifestyle Awards 2025." },
];

const VALUES = [
  { icon:"🌿", title:"Nursery Fresh",    desc:"We source directly from trusted nurseries, so every plant arrives healthy, hydrated, and ready to thrive." },
  { icon:"🤝", title:"Handpicked",       desc:"Every plant, planter and decor piece is handpicked and quality-checked by our team before it reaches you." },
  { icon:"🌍", title:"Eco Conscious",    desc:"We use biodegradable packaging and support local growers and artisans across India." },
  { icon:"💛", title:"Made With Love",   desc:"From potting to delivery, every step is done with love for plants, planters and the people who grow with them." },
];

const STATS = [
  { n:"2,000+", l:"Happy Plant Parents" },
  { n:"500+",   l:"Plants & Planters" },
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
            <span style={{ background: "rgba(95,111,82,0.2)", color: "var(--color-sage)" }}
              className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-5">
              Our Story
            </span>
            <h1 style={{ fontFamily: "Georgia, serif", color: "var(--color-beige)" }}
              className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Growing With<br />
              <span style={{ color: "var(--color-sage)" }} className="italic">Passion</span><br />
              Since 2018
            </h1>
            <p style={{ color: "var(--color-sage)" }} className="text-lg leading-relaxed mb-8 max-w-md">
              The Floral Studio was born from a simple belief — that a touch of green can turn any house
              into a home. For over 7 years we've been bringing plants, planters and decor to homes across India.
            </p>
            <a href="/shop" style={{ background: "var(--color-olive)" }}
              className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Shop Our Collection <ArrowRight size={16} />
            </a>
          </div>

          {/* Image Collage */}
          <div className="relative h-80 lg:h-[420px]">
            <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=85"
              alt="Indoor plants" className="absolute top-0 right-0 w-56 h-64 object-cover rounded-3xl"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
            <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&q=85"
              alt="Designer planters" className="absolute bottom-0 left-0 w-48 h-52 object-cover rounded-3xl"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
            <img src="https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&q=85"
              alt="Succulents" className="absolute bottom-10 right-32 w-36 h-40 object-cover rounded-2xl"
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

      {/* ── OUR STORY ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="absolute inset-6 rounded-full" style={{ background: "var(--color-beige)" }} />
            <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=85"
              alt="Studio" className="relative z-10 w-full aspect-square object-cover"
              style={{ borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%" }} />
          </div>
          <div>
            <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-3">Who We Are</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "var(--color-charcoal)" }} className="text-4xl font-bold mb-6">
              More Than Just a Plant Store
            </h2>
            <div className="space-y-4" style={{ color: "var(--color-olive)" }}>
              <p className="leading-relaxed">
                The Floral Studio started in 2018 when our founder Ananya Mehta left her corporate job to pursue her
                lifelong passion for plants and home styling. Starting from a small nursery corner in Surat,
                she began curating indoor plants and handcrafted planters that quickly won the hearts of locals.
              </p>
              <p className="leading-relaxed">
                Today, we are a team of 20+ passionate plant curators, stylists, delivery specialists, and creative
                minds working together to bring nature indoors. We serve 12 cities across India and have made
                over 2,000 happy plant parents.
              </p>
              <p className="leading-relaxed">
                We believe every home has a personality — and every corner deserves a plant or planter that
                speaks to it. That's why we never do cookie-cutter selections. Every piece is hand-picked.
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#"
                  style={{ background: "var(--color-beige)", color: "var(--color-olive)" }}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                          boxShadow: isActive ? "0 8px 24px rgba(95,111,82,0.15)" : "none"
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
              { icon:<Award size={28}/>, title:"Best Plant & Decor Brand", sub:"India Lifestyle Awards 2025" },
              { icon:<Star size={28}/>,  title:"4.9★ Rated",               sub:"Google Reviews — 2,000+ ratings" },
              { icon:<Users size={28}/>, title:"Top Plant Studio",         sub:"Surat Times Choice Award 2024" },
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
      <section style={{ background: "var(--color-charcoal)" }} className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-4xl block mb-4">🌿</span>
          <h2 style={{ fontFamily: "Georgia, serif", color: "var(--color-beige)" }} className="text-4xl font-bold mb-4">
            Let's Bring Your Home To Life
          </h2>
          <p style={{ color: "var(--color-sage)" }} className="mb-8 leading-relaxed">
            Whether it's a housewarming, a fresh corner, an office refresh, or just because —
            we'll help you find the perfect plants and planters for your space.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/shop" style={{ background: "var(--color-olive)" }}
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