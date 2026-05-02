import { useEffect, useState } from "react";
import {
  ArrowLeft, Heart, ShoppingCart, Star, Truck, RefreshCw,
  ShieldCheck, Minus, Plus, ChevronDown, ChevronUp, Check
} from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetailSkeleton from "./ProductSkeletons/ProductDetailSkeleton";
import { useCart } from "../../context/CartContext";
import ReviewsSection from "./ReviewsSection";
import { api } from "../../api/client";
import { API } from "../../api/endpoints";


const PRODUCT = {
  id: 1,
  name: "Rose Bliss Bouquet",
  category: "Bouquets",
  price: 1299,
  original: 1599,
  rating: 4.8,
  reviews: 124,
  badge: "Bestseller",
  description: "A breathtaking arrangement of hand-picked premium roses, curated to express love, warmth, and elegance. Each bouquet is freshly assembled on the day of delivery to ensure maximum freshness and longevity.",
  highlights: [
    "20–25 premium long-stem roses",
    "Wrapped in luxury kraft paper",
    "Lasts 7–10 days with proper care",
    "Includes a handwritten gift card",
    "Available in red, pink, and mixed",
  ],
  images: [
    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=85",
    "https://images.unsplash.com/photo-1490750967868-88df5691cc3f?w=700&q=85",
    "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=700&q=85",
    "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=700&q=85",
  ],
  sizes: ["Small (10 stems)", "Medium (20 stems)", "Large (30 stems)"],
  colors: ["Red", "Pink", "White", "Mixed"],
};


const fmt = n => "₹" + n.toLocaleString("en-IN");

function Stars({ n, size = 14 }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} className={i <= Math.round(n) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
      ))}
    </span>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
   const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg]   = useState(0);
  const [qty, setQty]               = useState(1);
  const [wished, setWished]         = useState(false);
  const [selectedSize, setSize]     = useState('');
  const [selectedColor, setColor]   = useState('');
  const [added, setAdded]           = useState(false);
  const [faqOpen, setFaqOpen]       = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const { productId, id, categoryId } = useParams();
  const currentProductId = productId ?? id;

  const disc = product?.originalPrice ? Math.round((1 - product?.price / product?.originalPrice) * 100) : 0;

  const paths = [
    { id: 1, name: 'Home',      path: '/'         },
    { id: 2, name: 'Category',  path: '/category' },
    ...(categoryId
      ? [{ id: 3, name: categoryName || '...', path: `/${categoryId}` }]
      : []),
    ...(product
      ? [{ id: categoryId ? 4 : 3, name: product.name, path: `/${currentProductId}` }]
      : []),
  ];

  function handleAddToCart() {
    addToCart(product, qty, selectedSize, selectedColor ? [selectedColor] : []);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const faqs = [
    { q:"How long do the flowers last?",      a:"With proper care (fresh water daily, away from direct sunlight), our bouquets last 7–10 days." },
    { q:"Can I schedule a specific delivery time?", a:"Yes! You can choose a preferred delivery window at checkout — morning, afternoon, or evening." },
    { q:"Is gift wrapping included?",          a:"All bouquets come beautifully wrapped. You can also add a premium gift box at checkout." },
  ];

  const getProductData = () => {
    api(API.products.detail(currentProductId))
      .then(data => {
        const p = data?.data;
        setProduct(p);
        const firstColor = p?.colors?.[0];
        setColor(Array.isArray(firstColor) ? firstColor[0] : (firstColor || ""));
        setSize(p?.sizes?.[0] || "");
      });
  };
  useEffect(() => {
    getProductData();
    if (categoryId) {
      api(API.categories.detail(categoryId))
        .then(data => setCategoryName(data?.data?.name || ""));
    }
    api(API.recommendations.get)
      .then(res => setRecommendations(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRecommendations([]));
  }, [currentProductId]);

  return (
    !product || Object.keys(product).length === 0 ? <ProductDetailSkeleton /> :
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fdf8f3", minHeight: "100vh" }}>

      {/* Breadcrumb */}
      <Breadcrumb paths={paths} />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Back Button */}
        {/* <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-8 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: "#c97d5b" }}>
          <ArrowLeft size={16} /> Back to Shop
        </button> */}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* ── LEFT: Images ── */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-square" style={{ background: "#f5ede5" }}>
              <img src={product.images[activeImg]} alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300" />
              <span style={{ background: "#c97d5b" }}
                className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.badge}
              </span>
              <button onClick={() => setWished(w => !w)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Heart size={18} className={wished ? "fill-rose-500 text-rose-500" : "text-stone-400"} />
              </button>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="rounded-2xl overflow-hidden aspect-square border-2 transition-all"
                  style={{ borderColor: activeImg === i ? "#c97d5b" : "transparent" }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="flex flex-col">
            <p style={{ color: "#c97d5b" }} className="text-sm font-semibold uppercase tracking-widest mb-2">{categoryName || product.category?.name || ''}</p>
            <h1 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-4xl font-bold mb-4">{product.name}</h1>


            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <Stars n={product?.rating?.average} size={18} />
              <span style={{ color: "#4a3728" }} className="font-semibold">{product?.rating?.average}</span>
              <span style={{ color: "#9c7a62" }} className="text-sm">({product?.rating?.total} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span style={{ color: "#c97d5b", fontFamily: "Georgia, serif" }} className="text-4xl font-bold">{product.price && fmt(product.price)}</span>
              {product.originalPrice && <span className="text-lg text-stone-400 line-through">{ fmt(product.originalPrice)}</span>}
              {product.originalPrice && <span style={{ background: "#fde8e8", color: "#e53e3e" }} className="text-sm font-bold px-2 py-0.5 rounded-full">-{disc}%</span>}
            </div>

            <p style={{ color: "#7a5c4a" }} className="leading-relaxed mb-6">{product.description}</p>

            {/* Size */}
            {product?.sizes && <div className="mb-5">
              <p style={{ color: "#4a3728" }} className="text-sm font-bold mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
                    style={selectedSize === s
                      ? { background: "#4a3728", color: "white", borderColor: "#4a3728" }
                      : { borderColor: "#e8d5c4", color: "#7a5c4a" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p style={{ color: "#4a3728" }} className="text-sm font-bold mb-2">
                  Color — <span style={{ color: "#c97d5b" }}>{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => {
                    const name = Array.isArray(c) ? c[0] : c;
                    const hex  = Array.isArray(c) ? c[1] : "#c97d5b";
                    return (
                      <button key={name} onClick={() => setColor(name)} title={name}
                        className="w-9 h-9 rounded-full border-4 transition-all hover:scale-110"
                        style={{
                          background: hex,
                          borderColor: selectedColor === name ? "#4a3728" : "transparent",
                          boxShadow: selectedColor === name ? "0 0 0 2px #4a3728" : "none"
                        }} />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center rounded-full border-2" style={{ borderColor: "#e8d5c4" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:opacity-60" style={{ color: "#4a3728" }}>
                  <Minus size={16} />
                </button>
                <span style={{ color: "#4a3728" }} className="w-8 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:opacity-60" style={{ color: "#4a3728" }}>
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: added ? "#22c55e" : "#c97d5b" }}>
                {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart — {fmt(product.price * qty)}</>}
              </button>
            </div>

            <button
              onClick={() => { addToCart(product, qty, selectedSize, selectedColor ? [selectedColor] : []); navigate("/cart"); }}
              className="w-full py-3 rounded-full font-bold border-2 mb-6 transition-all hover:opacity-80"
              style={{ borderColor: "#4a3728", color: "#4a3728" }}>
              Buy Now
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl" style={{ background: "#f5ede5" }}>
              {[
                [<Truck size={18}/>, "Free Delivery", "Above ₹999"],
                [<RefreshCw size={18}/>, "Easy Returns", "7-day policy"],
                [<ShieldCheck size={18}/>, "100% Fresh", "Guaranteed"],
              ].map(([icon, title, sub]) => (
                <div key={title} className="flex flex-col items-center text-center gap-1">
                  <div style={{ color: "#c97d5b" }}>{icon}</div>
                  <p style={{ color: "#4a3728" }} className="text-xs font-bold">{title}</p>
                  <p style={{ color: "#9c7a62" }} className="text-xs">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 p-8 rounded-3xl" style={{ background: "#f5ede5" }}>
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-5">What's Included</h2>
            <ul className="space-y-3">
              {product.what_included.map(h => (
                <li key={h} className="flex items-start gap-3">
                  <div style={{ background: "#c97d5b" }} className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-white" />
                  </div>
                  <span style={{ color: "#5c4033" }} className="text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-5">Care Instructions</h2>
            <ul className="space-y-3 text-sm" style={{ color: "#5c4033" }}>
              {product?.care_instructions?.map(tip => (
                <li key={tip} className="flex items-start gap-3">
                  <span style={{ color: "#c97d5b" }}>🌸</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection productId={currentProductId} />

        {/* FAQ */}
        <div className="mb-16">
          <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-3xl font-bold mb-6">Frequently Asked</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e8d5c4" }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  style={{ background: faqOpen === i ? "#f5ede5" : "white" }}>
                  <span style={{ color: "#3a2416" }} className="font-semibold">{q}</span>
                  {faqOpen === i ? <ChevronUp size={18} style={{ color: "#c97d5b" }} /> : <ChevronDown size={18} style={{ color: "#9c7a62" }} />}
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5" style={{ background: "#f5ede5" }}>
                    <p style={{ color: "#5c4033" }} className="text-sm leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {recommendations.filter(p => p._id !== currentProductId).length > 0 && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {recommendations
                .filter(p => p._id !== currentProductId)
                .slice(0, 3)
                .map(p => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/category/${p.category}/${p._id}`)}
                    className="group bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow cursor-pointer"
                    style={{ borderColor: "#f0e4d8" }}
                  >
                    <div className="overflow-hidden aspect-square">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p style={{ color: "#3a2416", fontFamily: "Georgia, serif" }} className="font-semibold mb-1">{p.name}</p>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#c97d5b" }} className="font-bold">{fmt(p.price)}</span>
                        <Stars n={p.rating?.average ?? 0} size={12} />
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
}