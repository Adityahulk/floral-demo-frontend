import { useNavigate } from "react-router-dom";

export default function Categories({ categories = [], loading = false }) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <section style={{ background: "var(--color-beige)" }} className="py-16" id="collections">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-2">Shop By Category</p>
            <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="text-3xl sm:text-4xl font-bold mb-3">Bring Nature Home</h2>
            <p style={{ color: "var(--color-olive)" }} className="text-sm max-w-xl mx-auto">Discover indoor plants, designer planters, and green decor curated to refresh your home and workspace.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse bg-stone-200" style={{ aspectRatio: "3/4" }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section style={{ background: "var(--color-beige)" }} className="py-16" id="collections">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-2">Shop By Category</p>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="text-3xl sm:text-4xl font-bold mb-3">Bring Nature Home</h2>
          <p style={{ color: "var(--color-olive)" }} className="text-sm max-w-xl mx-auto">Discover indoor plants, designer planters, and green decor curated to refresh your home and workspace.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(({ _id, name, img }) => (
            <a key={_id} onClick={() => navigate(`/category/${_id}`)} className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ aspectRatio: "3/4" }}>
              <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(46,46,46,0.8), transparent)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p style={{ fontFamily: "Georgia,serif" }} className="text-white font-semibold text-sm">{name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
