import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BASE = "http://localhost:3001";

export default function PromoBanner() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${BASE}/api/banners`, { signal: controller.signal })
      .then(r => r.json())
      .then(res => setBanners(Array.isArray(res.data) ? res.data : []))
      .catch(err => { if (err.name !== "AbortError") setBanners([]); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section style={{ background: "#fdf8f3" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl animate-pulse bg-stone-200 h-64 sm:h-72" />
          <div className="rounded-3xl animate-pulse bg-stone-200 h-64 sm:h-72" />
        </div>
      </section>
    );
  }

  if (banners.length === 0) return null;

  return (
    <section style={{ background: "#fdf8f3" }} className="py-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        {banners.map(banner => (
          <div key={banner._id} className="group relative rounded-3xl overflow-hidden h-64 sm:h-72 cursor-pointer">
            <img
              src={banner.img}
              alt={banner.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0" style={{ background: "rgba(58,36,22,0.5)" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span style={{ color: "#f5c8a8" }} className="text-xs uppercase tracking-widest font-semibold mb-2 line-clamp-1">
                {banner.desc}
              </span>
              <h3 style={{ fontFamily: "Georgia,serif" }} className="text-white text-2xl font-bold mb-4">
                {banner.name}
              </h3>
              <button
                onClick={() => navigate(`/category/${banner._id}`)}
                className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full text-sm font-semibold w-fit hover:opacity-90 transition-opacity"
                style={{ color: "#4a3728" }}
              >
                Explore <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
