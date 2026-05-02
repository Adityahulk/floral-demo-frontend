import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import {
  ArrowLeft, ShoppingCart, 
   ChevronDown, Check,
   SlidersHorizontal,
   Grid3x3,
   Stars
} from "lucide-react";
import { ChevronRight, List, RefreshCw, Search, X } from "react-feather";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CategoryPageSkeleton from "./ProductSkeletons/CategoryPageSkeleton";
import Breadcrumb from "../../components/Breadcrumb";
const ALL_PRODUCTS = [
  { id:1,  cat:"bouquets",     
    name:"Rose Bliss Bouquet",         
    price:1299, 
    original:1599,
    rating:4.8, 
    reviews:124, 
    badge:"Sale",   
    img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80", 
    tags:["Romance","Birthday"], 
    isNew:false, 
    isBest:true,

   },
  { id:2,  cat:"arrangements", name:"Pastel Dream Arrangement",   price:1899, original:null, rating:4.9, reviews:87,  badge:"New",     img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&q=80", tags:["Wedding","Gift"],    isNew:true,  isBest:false },
  { id:3,  cat:"wreaths",      name:"Wildflower Wreath",          price:999,  original:1299, rating:4.7, reviews:56,  badge:"Sale",    img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=500&q=80", tags:["Door","Seasonal"],   isNew:false, isBest:false },
  { id:4,  cat:"bouquets",     name:"Sunflower Garden Bundle",    price:1499, original:null, rating:4.6, reviews:203, badge:"Popular", img:"https://images.unsplash.com/photo-1543218024-57a70143c369?w=500&q=80", tags:["Birthday","Cheer"],  isNew:false, isBest:true  },
  { id:5,  cat:"dried",        name:"Lavender & Eucalyptus",      price:849,  original:999,  rating:4.9, reviews:91,  badge:"New",     img:"https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=500&q=80", tags:["Boho","Gift"],       isNew:true,  isBest:false },
  { id:6,  cat:"arrangements", name:"Orchid Elegance Set",        price:2199, original:null, rating:5.0, reviews:44,  badge:"Premium", img:"https://images.unsplash.com/photo-1566873535350-96e04c74fb1a?w=500&q=80", tags:["Luxury","Wedding"],  isNew:false, isBest:false },
  { id:7,  cat:"bouquets",     name:"Dahlia Delight Box",         price:1699, original:1999, rating:4.8, reviews:78,  badge:"Sale",    img:"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&q=80", tags:["Romance","Gift"],    isNew:false, isBest:false },
  { id:8,  cat:"bouquets",     name:"Mixed Tulip Bunch",          price:749,  original:null, rating:4.5, reviews:162, badge:"Popular", img:"https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&q=80", tags:["Birthday","Spring"], isNew:false, isBest:true  },
  { id:9,  cat:"plants",       name:"Peace Lily Plant",           price:599,  original:699,  rating:4.7, reviews:88,  badge:"Sale",    img:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80", tags:["Indoor","Air"],      isNew:false, isBest:false },
  { id:10, cat:"plants",       name:"Monstera Deliciosa",         price:1199, original:null, rating:4.8, reviews:134, badge:"Popular", img:"https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&q=80", tags:["Indoor","Gift"],     isNew:false, isBest:true  },
  { id:11, cat:"gift-hampers", name:"Luxury Rose Hamper",         price:2999, original:3499, rating:4.9, reviews:39,  badge:"Sale",    img:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80", tags:["Luxury","Birthday"], isNew:false, isBest:false },
  { id:12, cat:"arrangements", name:"Sunflower Table Centrepiece",price:1349, original:null, rating:4.6, reviews:57,  badge:"New",     img:"https://images.unsplash.com/photo-1543218024-57a70143c369?w=500&q=80", tags:["Wedding","Table"],   isNew:true,  isBest:false },
  { id:13, cat:"wreaths",      name:"Eucalyptus Door Wreath",     price:1149, original:1399, rating:4.8, reviews:72,  badge:"Sale",    img:"https://images.unsplash.com/photo-1606041011872-596597976b25?w=500&q=80", tags:["Door","Fresh"],      isNew:false, isBest:false },
  { id:14, cat:"dried",        name:"Pampas Grass Bundle",        price:699,  original:null, rating:4.7, reviews:61,  badge:"New",     img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", tags:["Boho","Wall Art"],   isNew:true,  isBest:false },
  { id:15, cat:"bouquets",     name:"Peony Pink Bouquet",         price:1899, original:2199, rating:4.9, reviews:93,  badge:"Sale",    img:"https://images.unsplash.com/photo-1490750967868-88df5691cc3f?w=500&q=80", tags:["Romance","Luxury"],  isNew:false, isBest:true  },
  { id:16, cat:"gift-hampers", name:"Birthday Bloom Box",         price:1799, original:null, rating:4.8, reviews:48,  badge:"New",     img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&q=80", tags:["Birthday","Gift"],   isNew:true,  isBest:false },
];

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
  const [cart,      setCart]      = useState([]);
  const [added,     setAdded]     = useState(null);
  const [filterOpen,setFilterOpen]= useState(false);
  const [priceRange,setPriceRange]= useState(null);
  const [badgeFilter,setBadgeFilter]=useState([]);
  const [ratingFilter,setRatingFilter]=useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const onBack = () => navigate("/category");
  const { categoryId } = useParams();
  const [category, setCategory] = useState(location.state?.data || null);

  const toggleWish = id => setWished(p => { const s = new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });

  function addToCart(p) {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id===p.id ? {...i,qty:i.qty+1} : i) : [...prev,{...p,qty:1}];
    });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  }

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const activeFilters = [priceRange, ...badgeFilter, ratingFilter].filter(Boolean).length;

  const getProducts = (cat_id) => {
    fetch(`http://localhost:3001/api/products/category/${cat_id}`)
      .then(res => res.json())
      .then(data => { setProducts(data?.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (location.state?.data) {
      setCategory(location.state.data);
      getProducts(categoryId);
    } else {
      fetch(`http://localhost:3001/api/categories/${categoryId}`)
        .then(res => res.json())
        .then(data => {
          if (data?.data) { setCategory(data.data); getProducts(categoryId); }
          else setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [categoryId]);

  const debouncefunction = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  useEffect(() => {
      const tempProducts = products
    .filter(p => p.cat === category.id)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !priceRange || (p.price >= priceRange.min && p.price <= priceRange.max))
    .filter(p => badgeFilter.length === 0 || badgeFilter.includes(p.badge))
    .filter(p => !ratingFilter || p.rating >= ratingFilter)
    .sort((a, b) => {
      if (sort === "price-low")  return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating")     return b.rating - a.rating;
      if (sort === "newest")     return b.isNew - a.isNew;
      return b.reviews - a.reviews;
    });
    debouncefunction(()=>{
      setProducts(tempProducts);
    }, 300);
  },[search, sort, priceRange, badgeFilter, ratingFilter]);

  return (
    loading ? 
    <CategoryPageSkeleton/>
    :
    <div style={{ fontFamily:"system-ui,sans-serif", background:"#fdf8f3", minHeight:"100vh" }}>

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
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right, rgba(58,36,22,0.85), rgba(58,36,22,0.3))" }}/>
        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <div>
            <button onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold mb-3 hover:opacity-70"
              style={{ color:"#f5c8a8" }}>
              <ArrowLeft size={14}/> All Categories
            </button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{category.emoji}</span>
              <div>
                <h1 style={{ fontFamily:"Georgia,serif", color:"#f5e6d3" }} className="text-3xl sm:text-4xl font-bold">{category.name}</h1>
                <p style={{ color:"#c4a088" }} className="text-sm mt-1">{category.desc}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Cart bubble */}
        {cartCount > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background:"#c97d5b" }}>
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
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search in ${category.name}...`}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none"
              style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }}/>
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-full border text-sm font-medium outline-none"
              style={{ borderColor:"#e8d5c4", background:"white", color:"#4a3728" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"#9c7a62" }}/>
          </div>

          {/* Filter */}
          <button onClick={() => setFilterOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border font-medium text-sm transition-all"
            style={activeFilters > 0
              ? { background:"#c97d5b", borderColor:"#c97d5b", color:"white" }
              : { borderColor:"#e8d5c4", color:"#4a3728" }}>
            <SlidersHorizontal size={15}/>
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>

          {/* View Mode */}
          <div className="flex rounded-full border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
            {[["grid",<Grid3x3 size={16}/>],["list",<List size={16}/>]].map(([m, ico]) => (
              <button key={m} onClick={() => setViewMode(m)}
                className="px-3 py-2 transition-all"
                style={{ background: viewMode===m ? "#c97d5b" : "white", color: viewMode===m ? "white" : "#9c7a62" }}>
                {ico}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="mb-6 p-5 rounded-2xl border bg-white" style={{ borderColor:"#e8d5c4" }}>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <p style={{ color:"#4a3728" }} className="text-sm font-bold mb-3">Price Range</p>
                <div className="space-y-2">
                  {PRICE_RANGES.map(r => (
                    <button key={r.label} onClick={() => setPriceRange(priceRange?.label===r.label ? null : r)}
                      className="flex items-center gap-2 text-sm w-full"
                      style={{ color: priceRange?.label===r.label ? "#c97d5b" : "#5c4033" }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: priceRange?.label===r.label ? "#c97d5b" : "#e8d5c4", background: priceRange?.label===r.label ? "#c97d5b" : "white" }}>
                        {priceRange?.label===r.label && <Check size={10} className="text-white"/>}
                      </div>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge */}
              <div>
                <p style={{ color:"#4a3728" }} className="text-sm font-bold mb-3">Product Type</p>
                <div className="flex flex-wrap gap-2">
                  {["Sale","New","Popular","Premium"].map(b => (
                    <button key={b} onClick={() => setBadgeFilter(prev => prev.includes(b) ? prev.filter(x=>x!==b) : [...prev,b])}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                      style={badgeFilter.includes(b)
                        ? { background:"#c97d5b", borderColor:"#c97d5b", color:"white" }
                        : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p style={{ color:"#4a3728" }} className="text-sm font-bold mb-3">Minimum Rating</p>
                <div className="space-y-2">
                  {[4.5,4.0,3.5].map(r => (
                    <button key={r} onClick={() => setRatingFilter(ratingFilter===r ? null : r)}
                      className="flex items-center gap-2 text-sm w-full"
                      style={{ color: ratingFilter===r ? "#c97d5b" : "#5c4033" }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: ratingFilter===r ? "#c97d5b" : "#e8d5c4", background: ratingFilter===r ? "#c97d5b" : "white" }}>
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
              <button onClick={() => { setPriceRange(null); setBadgeFilter([]); setRatingFilter(null); }}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold hover:opacity-70"
                style={{ color:"#dc2626" }}>
                <X size={13}/> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-6">
          {category.tags.map(t => (
            <button key={t}
              className="px-3 py-1.5 rounded-full text-xs font-medium border hover:opacity-70 transition-opacity"
              style={{ borderColor:"#e8d5c4", color:"#7a5c4a", background:"white" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-5">
          <p style={{ color:"#9c7a62" }} className="text-sm">
            Showing <strong style={{ color:"#4a3728" }}>{products.length}</strong> products
            {search && <span> for "<strong style={{ color:"#c97d5b" }}>{search}</strong>"</span>}
          </p>
          {activeFilters > 0 && (
            <button onClick={() => { setPriceRange(null); setBadgeFilter([]); setRatingFilter(null); }}
              className="text-xs font-semibold flex items-center gap-1 hover:opacity-70"
              style={{ color:"#dc2626" }}>
              <X size={12}/> Clear filters
            </button>
          )}
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🌸</span>
            <h3 style={{ fontFamily:"Georgia,serif", color:"#3a2416" }} className="text-xl font-bold mb-2">No products found</h3>
            <p style={{ color:"#9c7a62" }} className="mb-6">Try adjusting your filters or search term</p>
            <button onClick={() => { setSearch(""); setPriceRange(null); setBadgeFilter([]); setRatingFilter(null); }}
              style={{ background:"#c97d5b" }}
              className="text-white px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            : "flex flex-col gap-4"}>
            {products.map(p => (
              <ProductCard key={p._id} p={p} wished={wished.has(p._id)}
                onWish={toggleWish} onCart={addToCart} viewMode={viewMode}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}