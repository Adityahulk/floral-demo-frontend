import { useState, useEffect, useRef } from "react";
import { Truck, RefreshCw, ShieldCheck, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";
import CartDrawer from "../components/CartDrawer";
import Testimonials from "../components/Testimonials";
import Categories from "../components/Categories";
import PromoBanner from "../components/PromoBanner";
import { api } from "../api/client";
import { API } from "../api/endpoints";

import vid1 from "../assets/videos/Video-618.mp4";
import vid2 from "../assets/videos/Video-843.mp4";
import vid3 from "../assets/videos/Video-97.mp4";
import vid4 from "../assets/videos/Video-787.mp4";
import vid5 from "../assets/videos/Video-599.mp4";
import vid6 from "../assets/videos/Video-452.mp4";
import vid7 from "../assets/videos/Video-795.mp4";

// Instagram embed URLs (commented — using local videos from src/assets/videos/ instead)
// const STORIES = [
//   "https://www.instagram.com/reel/DYBviDMtzZc/embed/",
//   "https://www.instagram.com/reel/DX6CN7oI5bg/embed/",
//   "https://www.instagram.com/p/DXbCp3wiGje/embed/",
//   "https://www.instagram.com/p/DXV2QCuCJRJ/embed/",
//   "https://www.instagram.com/p/DW0Y1H7EWK0/embed/",
//   "https://www.instagram.com/p/DWao08WiMuy/embed/",
//   "https://www.instagram.com/p/DQV7dFfiK9o/embed/",
//   "https://www.instagram.com/p/DQlSC_vCNHt/embed/",
// ];

const STORIES = [vid1, vid2, vid3, vid4, vid5, vid6, vid7];

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
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-story-card]");
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

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

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:scale-105 transition-transform"
            style={{ color: "var(--color-charcoal)" }}
          >
            <ChevronLeft size={22} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-2 no-scrollbar"
          >
            {STORIES.map((src, i) => (
              <div
                key={i}
                data-story-card
                className="snap-start shrink-0 relative overflow-hidden rounded-2xl border bg-black"
                style={{ width: "260px", height: "462px", borderColor: "var(--color-border)" }}
              >
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onClick={(e) => {
                    const v = e.currentTarget;
                    if (v.paused) v.play();
                    else v.pause();
                  }}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:scale-105 transition-transform"
            style={{ color: "var(--color-charcoal)" }}
          >
            <ChevronRight size={22} />
          </button>
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
