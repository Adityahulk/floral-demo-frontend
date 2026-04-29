import { useState } from "react";
import {
   Award, Users, Star,
   ArrowRight
} from "lucide-react";
import { Facebook, Instagram, Twitter } from "react-feather";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TEAM = [
  { name:"Ananya Mehta",  role:"Founder & Head Florist",    img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", quote:"Every bloom tells a story worth sharing." },
  { name:"Rohan Kapoor",  role:"Creative Director",          img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", quote:"Design is how beauty speaks to the world." },
  { name:"Sneha Gupta",   role:"Lead Arrangement Artist",   img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", quote:"Nature is the finest artist of all." },
  { name:"Vikram Singh",  role:"Delivery & Operations Head", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", quote:"Freshness delivered, every single time." },
];

const MILESTONES = [
  { year:"2018", title:"Founded",        desc:"Started from a small flower market stall in Lucknow." },
  { year:"2019", title:"First Studio",   desc:"Opened our first brick-and-mortar studio in Gomti Nagar." },
  { year:"2021", title:"Online Launch",  desc:"Launched floralstudio.in with same-day delivery in Lucknow." },
  { year:"2023", title:"Pan-India",      desc:"Expanded to 12 cities across India with 2000+ happy customers." },
  { year:"2025", title:"Awards",         desc:"Won 'Best Floral Brand' at India Lifestyle Awards 2025." },
];

const VALUES = [
  { icon:"🌿", title:"Farm Fresh",       desc:"We source directly from farms, ensuring every flower is at peak freshness when it reaches you." },
  { icon:"🤝", title:"Handcrafted",      desc:"Every bouquet is hand-assembled by our skilled artisans with care and attention to detail." },
  { icon:"🌍", title:"Eco Conscious",    desc:"We use biodegradable packaging and support local flower farmers across India." },
  { icon:"💛", title:"Made With Love",   desc:"From selection to delivery, every step is done with love for flowers and people." },
];

const STATS = [
  { n:"2,000+", l:"Happy Customers" },
  { n:"500+",   l:"Flower Varieties" },
  { n:"12",     l:"Cities Covered" },
  { n:"4.9★",   l:"Average Rating" },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState("2025");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fdf8f3", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "#4a3728" }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "#c97d5b" }} />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
          style={{ background: "#f5e6d3" }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span style={{ background: "rgba(201,125,91,0.2)", color: "#f5c8a8" }}
              className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-5">
              Our Story
            </span>
            <h1 style={{ fontFamily: "Georgia, serif", color: "#f5e6d3" }}
              className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Blooming With<br />
              <span style={{ color: "#f5c8a8" }} className="italic">Passion</span><br />
              Since 2018
            </h1>
            <p style={{ color: "#c4a088" }} className="text-lg leading-relaxed mb-8 max-w-md">
              Floral Studio was born from a simple belief — that flowers have the power to turn ordinary
              moments into extraordinary memories. We've been doing exactly that for over 7 years.
            </p>
            <a href="/shop" style={{ background: "#c97d5b" }}
              className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Shop Our Collection <ArrowRight size={16} />
            </a>
          </div>

          {/* Image Collage */}
          <div className="relative h-80 lg:h-[420px]">
            <img src="https://images.unsplash.com/photo-1490750967868-88df5691cc3f?w=600&q=85"
              alt="Bouquet" className="absolute top-0 right-0 w-56 h-64 object-cover rounded-3xl"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
            <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=85"
              alt="Flowers" className="absolute bottom-0 left-0 w-48 h-52 object-cover rounded-3xl"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=85"
              alt="Dried" className="absolute bottom-10 right-32 w-36 h-40 object-cover rounded-2xl"
              style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "#c97d5b" }} className="py-8">
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
            <div className="absolute inset-6 rounded-full" style={{ background: "#f5ede5" }} />
            <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=85"
              alt="Studio" className="relative z-10 w-full aspect-square object-cover"
              style={{ borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%" }} />
          </div>
          <div>
            <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-3">Who We Are</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-4xl font-bold mb-6">
              More Than Just a Flower Shop
            </h2>
            <div className="space-y-4" style={{ color: "#7a5c4a" }}>
              <p className="leading-relaxed">
                Floral Studio started in 2018 when our founder Ananya Mehta left her corporate job to pursue her
                lifelong passion for floristry. Starting from a small stall in Lucknow's Aminabad flower market,
                she began creating bespoke arrangements that quickly won the hearts of locals.
              </p>
              <p className="leading-relaxed">
                Today, we are a team of 20+ passionate floral artists, delivery specialists, and creative minds
                working together to bring joy through flowers. We serve 12 cities across India and have
                delivered smiles to over 2,000 happy customers.
              </p>
              <p className="leading-relaxed">
                We believe every flower has a personality — and every person deserves an arrangement that
                speaks to their soul. That's why we never do cookie-cutter bouquets. Every piece is unique.
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#"
                  style={{ background: "#f5ede5", color: "#c97d5b" }}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20" style={{ background: "#f5ede5" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-3">What Drives Us</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-4xl font-bold">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-3xl border text-center hover:shadow-lg transition-shadow"
                style={{ borderColor: "#e8d5c4" }}>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-lg font-bold mb-3">{title}</h3>
                <p style={{ color: "#7a5c4a" }} className="text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-3">How We Grew</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-4xl font-bold">Our Journey</h2>
          </div>

          {/* Year Pills */}
          <div className="flex justify-center gap-2 flex-wrap mb-10">
            {MILESTONES.map(({ year }) => (
              <button key={year} onClick={() => setActiveYear(year)}
                className="px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all"
                style={activeYear === year
                  ? { background: "#c97d5b", borderColor: "#c97d5b", color: "white" }
                  : { borderColor: "#e8d5c4", color: "#9c7a62" }}>
                {year}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5"
              style={{ background: "#e8d5c4" }} />

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
                          borderColor: isActive ? "#c97d5b" : "#e8d5c4",
                          background: isActive ? "#fdf8f3" : "white",
                          boxShadow: isActive ? "0 8px 24px rgba(201,125,91,0.15)" : "none"
                        }}>
                        <p style={{ color: "#c97d5b" }} className="text-xs font-bold uppercase tracking-widest mb-1">{year}</p>
                        <h3 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="font-bold text-lg mb-1">{title}</h3>
                        <p style={{ color: "#7a5c4a" }} className="text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="relative z-10 w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0"
                      style={{
                        background: isActive ? "#c97d5b" : "white",
                        borderColor: isActive ? "#c97d5b" : "#e8d5c4"
                      }}>
                      <div className="w-2.5 h-2.5 rounded-full"
                        style={{ background: isActive ? "white" : "#e8d5c4" }} />
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

      {/* ── TEAM ── */}
      <section className="py-20" style={{ background: "#f5ede5" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-3">The People Behind</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-4xl font-bold">Meet Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, img, quote }) => (
              <div key={name} className="group text-center">
                <div className="relative mb-4 mx-auto w-40 h-40">
                  <div className="absolute inset-0 rounded-full" style={{ background: "#e8d5c4" }} />
                  <img src={img} alt={name}
                    className="relative z-10 w-full h-full object-cover rounded-full border-4 group-hover:scale-105 transition-transform duration-300"
                    style={{ borderColor: "white" }} />
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="font-bold text-lg">{name}</h3>
                <p style={{ color: "#c97d5b" }} className="text-xs font-semibold uppercase tracking-wide mt-1 mb-3">{role}</p>
                <p style={{ color: "#7a5c4a" }} className="text-sm italic leading-relaxed px-4">"{quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-3">Recognition</p>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-3xl font-bold">Awards & Press</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon:<Award size={28}/>, title:"Best Floral Brand", sub:"India Lifestyle Awards 2025" },
              { icon:<Star size={28}/>,  title:"4.9★ Rated",         sub:"Google Reviews — 2,000+ ratings" },
              { icon:<Users size={28}/>, title:"Top Florist",        sub:"Lucknow Times Choice Award 2024" },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 p-6 rounded-3xl border bg-white"
                style={{ borderColor: "#e8d5c4" }}>
                <div style={{ background: "#f5ede5", color: "#c97d5b" }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="font-bold">{title}</p>
                  <p style={{ color: "#9c7a62" }} className="text-sm mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#4a3728" }} className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-4xl block mb-4">🌸</span>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#f5e6d3" }} className="text-4xl font-bold mb-4">
            Let's Make Your Moment Special
          </h2>
          <p style={{ color: "#b89c8a" }} className="mb-8 leading-relaxed">
            Whether it's a birthday, anniversary, wedding, or just because — we'll find the perfect
            flowers to tell your story.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/shop" style={{ background: "#c97d5b" }}
              className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90">
              Shop Now <ArrowRight size={16} />
            </a>
            <a href="/contact" style={{ border: "2px solid #c97d5b", color: "#f5c8a8" }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold hover:opacity-70">
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}