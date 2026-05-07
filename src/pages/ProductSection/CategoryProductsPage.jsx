import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import {
  ArrowLeft, ShoppingCart, 
   ChevronDown, Check,
   SlidersHorizontal,
   Grid3x3,
   Stars
} from "lucide-react";
import { List, Search, X } from "react-feather";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CategoryPageSkeleton from "./ProductSkeletons/CategoryPageSkeleton";
import Breadcrumb from "../../components/Breadcrumb";
import { useCart } from "../../context/CartContext";
import { api } from "../../api/client";
import { API } from "../../api/endpoints";


const SORT_OPTIONS = [
  { value:"popular",    label:"Most Popular"    },
  { value:"price-low",  label:"Price: Low to High" },
  { value:"price-high", label:"Price: High to Low" },
  { value:"rating",     label:"Top Rated"       },
  { value:"newest",     label:"Newest First"    },
];

const PRICE_RANGES = [
  { label:"Under ₹500",      min:0,    max:500   },
  { label:"₹500 - ₹1,000",  min:500,  max:1000  },
  { label:"₹1,000 - ₹2,000",min:1000, max:2000  },
  { label:"Above ₹2,000",   min:2000, max:99999  },
];

export default function CategoryProductsPage() {
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState("popular");
  const [viewMode,  setViewMode]  = useState("grid");
  const [wished,    setWished]    = useState(new Set());
  const [added,     setAdded]     = useState(null);
  const { addToCart: addToCartGlobal, totalItems } = useCart();
  const [filterOpen,setFilterOpen]= useState(false);
  const [priceRange,setPriceRange]= useState(null);
  const [badgeFilter,setBadgeFilter]=useState([]);
  const [ratingFilter,setRatingFilter]=useState(null);
  const [tagFilter,  setTagFilter]  = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const onBack = () => navigate("/category");
  const { categoryId } = useParams();
  const [category, setCategory] = useState(location.state?.data || null);

  const toggleWish = id => setWished(p => { const s = new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });

  function addToCart(p) {
    addToCartGlobal(p, 1);
    setAdded(p._id);
    setTimeout(() => setAdded(null), 1500);
  }

  const [loading,       setLoading]       = useState(true);
  const [products,      setProducts]      = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input by 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const cartCount   = totalItems;
  const activeFilters = [priceRange, ...badgeFilter, ratingFilter, tagFilter].filter(Boolean).length;

  // Unique tags derived from actual products
  const allTags = [...new Set(products.flatMap(p => p.tags ?? []))].sort();

  // Filtering + sorting — never mutates `products` state
  const filtered = products
    .filter(p => !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .filter(p => !priceRange   || (p.price >= priceRange.min && p.price <= priceRange.max))
    .filter(p => badgeFilter.length === 0 || badgeFilter.includes(p.badge))
    .filter(p => !ratingFilter || (p.rating?.average ?? p.rating ?? 0) >= ratingFilter)
    .filter(p => !tagFilter    || (p.tags ?? []).includes(tagFilter))
    .sort((a, b) => {
      if (sort === "price-low")  return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating")     return (b.rating?.average ?? b.rating ?? 0) - (a.rating?.average ?? a.rating ?? 0);
      if (sort === "newest")     return new Date(b.createdAt) - new Date(a.createdAt);
      return (b.reviews ?? 0) - (a.reviews ?? 0);
    });

  const getProducts = (cat_id) => {
    api(API.products.byCategory(cat_id))
      .then(data => { setProducts(data?.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (location.state?.data) {
      setCategory(location.state.data);
      getProducts(categoryId);
    } else {
      api(API.categories.detail(categoryId))
        .then(data => {
          if (data?.data) { setCategory(data.data); getProducts(categoryId); }
          else setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [categoryId]);

  return (
    loading ? 
    <CategoryPageSkeleton/>
    :
    <div style={{ fontFamily:"system-ui,sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>

      {/* Cart Toast */}
      {added && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl"
          style={{ background:"#22c55e" }}>
          <Check size={16} className="text-white"/>
          <span className="text-white text-sm font-semibold">Added to cart!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <Breadcrumb paths={[
        { id: 1, name: 'Home',           path: '/'          },
        { id: 2, name: 'Category',       path: '/category'  },
        { id: 3, name: category?.name || '...', path: `/${categoryId}` },
      ]} />

      {/* Category Hero Banner */}
      <div className="relative h-40 sm:h-52 overflow-hidden">
        <img src={category.img} alt={category.name} className="w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right, rgba(46,46,46,0.85), rgba(46,46,46,0.3))" }}/>
        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <div>
            <button onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold mb-3 hover:opacity-70"
              style={{ color:"var(--color-sage)" }}>
              <ArrowLeft size={14}/> All Categories
            </button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{category.emoji}</span>
              <div>
                <h1 style={{ fontFamily:"Georgia,serif", color:"var(--color-beige)" }} className="text-3xl sm:text-4xl font-bold">{category.name}</h1>
                <p style={{ color:"var(--color-sage)" }} className="text-sm mt-1">{category.desc}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Cart bubble */}
        {cartCount > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background:"var(--color-olive)" }}>
            <ShoppingCart size={16} className="text-white"/>
            <span className="text-white text-sm font-bold">{cartCount}</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-olive)" }}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search in ${category.name}...`}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none"
              style={{ borderColor:"var(--color-border)", background:"white", color:"var(--color-charcoal)" }}/>
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-full border text-sm font-medium outline-none"
              style={{ borderColor:"var(--color-border)", background:"white", color:"var(--color-charcoal)" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--color-olive)" }}/>
          </div>

          {/* Filter */}
          <button onClick={() => setFilterOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border font-medium text-sm transition-all"
            style={activeFilters > 0
              ? { background:"var(--color-olive)", borderColor:"var(--color-olive)", color:"white" }
              : { borderColor:"var(--color-border)", color:"var(--color-charcoal)" }}>
            <SlidersHorizontal size={15}/>
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>

          {/* View Mode */}
          {/* <div className="flex rounded-full border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
            {[["grid",<Grid3x3 size={16}/>],["list",<List size={16}/>]].map(([m, ico]) => (
              <button key={m} onClick={() => setViewMode(m)}
                className="px-3 py-2 transition-all"
                style={{ background: viewMode===m ? "var(--color-olive)" : "white", color: viewMode===m ? "white" : "var(--color-olive)" }}>
                {ico}
              </button>
            ))}
          </div> */}
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="mb-6 p-5 rounded-2xl border bg-white" style={{ borderColor:"var(--color-border)" }}>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-bold mb-3">Price Range</p>
                <div className="space-y-2">
                  {PRICE_RANGES.map(r => (
                    <button key={r.label} onClick={() => setPriceRange(priceRange?.label===r.label ? null : r)}
                      className="flex items-center gap-2 text-sm w-full"
                      style={{ color: priceRange?.label===r.label ? "var(--color-olive)" : "var(--color-charcoal)" }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: priceRange?.label===r.label ? "var(--color-olive)" : "var(--color-border)", background: priceRange?.label===r.label ? "var(--color-olive)" : "white" }}>
                        {priceRange?.label===r.label && <Check size={10} className="text-white"/>}
                      </div>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge */}
              <div>
                <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-bold mb-3">Product Type</p>
                <div className="flex flex-wrap gap-2">
                  {["Sale","New","Popular","Premium"].map(b => (
                    <button key={b} onClick={() => setBadgeFilter(prev => prev.includes(b) ? prev.filter(x=>x!==b) : [...prev,b])}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                      style={badgeFilter.includes(b)
                        ? { background:"var(--color-olive)", borderColor:"var(--color-olive)", color:"white" }
                        : { borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-bold mb-3">Minimum Rating</p>
                <div className="space-y-2">
                  {[4.5,4.0,3.5].map(r => (
                    <button key={r} onClick={() => setRatingFilter(ratingFilter===r ? null : r)}
                      className="flex items-center gap-2 text-sm w-full"
                      style={{ color: ratingFilter===r ? "var(--color-olive)" : "var(--color-charcoal)" }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: ratingFilter===r ? "var(--color-olive)" : "var(--color-border)", background: ratingFilter===r ? "var(--color-olive)" : "white" }}>
                        {ratingFilter===r && <Check size={10} className="text-white"/>}
                      </div>
                      <Stars n={r} size={13}/> <span className="ml-1">{r}+ stars</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear */}
            {activeFilters > 0 && (
              <button onClick={() => { setPriceRange(null); setBadgeFilter([]); setRatingFilter(null); setTagFilter(null); }}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold hover:opacity-70"
                style={{ color:"#dc2626" }}>
                <X size={13}/> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Dynamic Tags */}
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => setTagFilter(null)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={!tagFilter
                ? { background:"var(--color-charcoal)", borderColor:"var(--color-charcoal)", color:"white" }
                : { borderColor:"var(--color-border)", color:"var(--color-olive)", background:"white" }}>
              All
            </button>
            {allTags.map(t => (
              <button key={t}
                onClick={() => setTagFilter(tagFilter === t ? null : t)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={tagFilter === t
                  ? { background:"var(--color-olive)", borderColor:"var(--color-olive)", color:"white" }
                  : { borderColor:"var(--color-border)", color:"var(--color-olive)", background:"white" }}>
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-5">
          <p style={{ color:"var(--color-olive)" }} className="text-sm">
            Showing <strong style={{ color:"var(--color-charcoal)" }}>{filtered.length}</strong> products
            {debouncedSearch && <span> for "<strong style={{ color:"var(--color-olive)" }}>{debouncedSearch}</strong>"</span>}
          </p>
          {activeFilters > 0 && (
            <button onClick={() => { setPriceRange(null); setBadgeFilter([]); setRatingFilter(null); setTagFilter(null); }}
              className="text-xs font-semibold flex items-center gap-1 hover:opacity-70"
              style={{ color:"#dc2626" }}>
              <X size={12}/> Clear filters
            </button>
          )}
        </div>

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🌸</span>
            <h3 style={{ fontFamily:"Georgia,serif", color:"var(--color-charcoal)" }} className="text-xl font-bold mb-2">No products found</h3>
            <p style={{ color:"var(--color-olive)" }} className="mb-6">Try adjusting your filters or search term</p>
            <button onClick={() => { setSearch(""); setPriceRange(null); setBadgeFilter([]); setRatingFilter(null); setTagFilter(null); }}
              style={{ background:"var(--color-olive)" }}
              className="text-white px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            : "flex flex-col gap-4"}>
            {filtered.map(p => (
              <ProductCard key={p._id} p={p} wished={wished.has(p._id)}
                onWish={toggleWish} onCart={addToCart} viewMode={viewMode}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}