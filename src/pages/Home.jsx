import { useState, useEffect } from "react";
import { Play, Truck, RefreshCw, ShieldCheck, Gift } from "lucide-react";
import Hero from "../components/Hero";
import CartDrawer from "../components/CartDrawer";
import Testimonials from "../components/Testimonials";
import Categories from "../components/Categories";
import PromoBanner from "../components/PromoBanner";
import { api } from "../api/client";
import { API } from "../api/endpoints";

const STORIES = [
  { id: 1, thumb: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80", url: "https://www.instagram.com/thefloralstudio_surat/" },
  { id: 2, thumb: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80", url: "https://www.instagram.com/thefloralstudio_surat/" },
  { id: 3, thumb: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600&q=80", url: "https://www.instagram.com/thefloralstudio_surat/" },
  { id: 4, thumb: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80", url: "https://www.instagram.com/thefloralstudio_surat/" },
  { id: 5, thumb: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80", url: "https://www.instagram.com/thefloralstudio_surat/" },
];

function FeaturesBar() {
  const items = [
    { icon: <Truck size={20} />, title: "Free Delivery", sub: "On orders above ₹999" },
    { icon: <RefreshCw size={20} />, title: "Easy Returns", sub: "7-day return policy" },
    { icon: <ShieldCheck size={20} />, title: "Healthy & Fresh", sub: "Nursery-grown plants" },
    { icon: <Gift size={20} />, title: "Gift Wrapping", sub: "Complimentary service" },
  ];
  return (
    <section style={{ background: "var(--color-charcoal)" }} className="py-5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3" style={{ color: "var(--color-beige)" }}>
            <div className="opacity-80 shrink-0">{icon}</div>
            <div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs opacity-60">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OurStories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-2">
            From Our Instagram
          </p>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="text-3xl sm:text-4xl font-bold">
            Our Stories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {STORIES.map(s => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-2xl overflow-hidden block"
              style={{ aspectRatio: "9/16" }}
            >
              <img
                src={s.thumb}
                alt="Instagram story"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 50%)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90 group-hover:scale-110 transition-transform"
                  style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
                >
                  <Play size={20} style={{ color: "var(--color-olive)", marginLeft: "2px" }} fill="var(--color-olive)" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section style={{ background: "var(--color-beige)" }} className="py-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        <span className="text-4xl block mb-4">🌿</span>
        <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="text-3xl font-bold mb-3">Stay Rooted With Us</h2>
        <p style={{ color: "var(--color-olive)" }} className="mb-8">
          Subscribe for seasonal offers, plant care tips & green-living inspiration. Get 10% off your first order.
        </p>
        {done ? (
          <p style={{ color: "var(--color-olive)" }} className="font-semibold">🌱 Thank you! Check your inbox for a special welcome gift.</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full border text-sm outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
            <button
              onClick={() => email && setDone(true)}
              style={{ background: "var(--color-olive)" }}
              className="text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [todaysPick, setTodaysPick] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      api(API.categories.list, { signal: controller.signal }),
      api(API.todaysPick.get,  { signal: controller.signal }),
    ])
      .then(([categoriesRes, pickRes]) => {
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setTodaysPick(pickRes.success && pickRes.data ? pickRes.data : null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "var(--color-beige)" }}>
      <Hero todaysPick={todaysPick} />
      <FeaturesBar />
      <Categories categories={categories} loading={loading} />
      <OurStories />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
