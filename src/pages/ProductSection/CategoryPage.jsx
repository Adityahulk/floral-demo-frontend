import { useEffect, useState } from "react";
import { ArrowRight,
  Truck, RefreshCw, ShieldCheck, TrendingUp
} from "lucide-react";
import {  useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { api } from "../../api/client";
import { API } from "../../api/endpoints";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id:"laptops",
    name:"Laptops",
    emoji:"💻",
    count:24,
    desc:"Reliable laptops for work, study, and everyday use",
    img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=85",
    color:"#e8a598",
    tags:["Work","Study","Home","Business"],
  },
  {
    id:"accessories",
    name:"Accessories",
    emoji:"⌨️",
    count:18,
    desc:"Keyboards, mice, cables, stands, and everyday essentials",
    img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=85",
    color:"#a8c4a2",
    tags:["Keyboard","Mouse","Cables","Desk"],
  },
  {
    id:"repairs",
    name:"Repairs",
    emoji:"⚙️",
    count:12,
    desc:"Repair and troubleshooting support for computer issues",
    img:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85",
    color:"#b8c9a8",
    tags:["Diagnosis","Upgrade","Backup","Support"],
  },
  {
    id:"networking",
    name:"Networking",
    emoji:"🌐",
    count:9,
    desc:"Routers, cables, and office network setup essentials",
    img:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=85",
    color:"var(--color-sage)",
    tags:["Router","Cable","Office","WiFi"],
  },
  {
    id:"displays",
    name:"Displays",
    emoji:"🖥️",
    count:15,
    desc:"Monitors and display accessories for better productivity",
    img:"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=85",
    color:"#9ab89a",
    tags:["Monitor","Office","Gaming","HDMI"],
  },
  {
    id:"bundles",
    name:"Setup Bundles",
    emoji:"🎁",
    count:8,
    desc:"Curated computer and accessory bundles for useful setups",
    img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=85",
    color:"#c9a8c4",
    tags:["Office","Student","Home","Value"],
  },
];

export default function CategoryPage() {
  const [hovered, setHovered] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const featured = CATEGORIES[0];
  // const rest  = CATEGORIES.slice(1);
  const getCategoryes = () => {
    api(API.categories.list)
    .then(data => {
      setCategories(data?.data);
      setLoading(false);
    })
    .catch(err => console.error("Error fetching categories:", err));
  }
  useEffect(() => {
    getCategoryes();
  }, []);
  return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>

      {/* Breadcrumb */}
      <Breadcrumb paths={[{id:1,name:'Home',path:'/'},{id:2,name:'Category',path:'/category'}]} />

      {/* Hero */}
      <section style={{ background:"var(--color-charcoal)" }} className="relative overflow-hidden py-14">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background:"var(--color-olive)" }}/>
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10" style={{ background:"var(--color-beige)" }}/>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span style={{ background:"rgba(95,111,82,0.2)", color:"var(--color-sage)" }}
            className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-4">
            Shop By Category
          </span>
          <h1 style={{ fontFamily:"Georgia,serif", color:"var(--color-beige)" }} className="text-4xl sm:text-5xl font-bold mb-4">
            Find Your Perfect<br/><span style={{ color:"var(--color-sage)" }} className="italic">Setup</span>
          </h1>
          <p style={{ color:"var(--color-sage)" }} className="max-w-xl mx-auto text-base leading-relaxed">
            From computers and accessories to repair support, explore useful products and services for your setup.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
      
        {/* Category Grid */}
        <p style={{ color:"var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-4">All Categories</p>
        {!loading && categories.length>0?<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {categories.map(cat => (
            <div key={cat.name}
              onClick={() => navigate(`/category/${cat._id}`, { state: { data: cat, } })}
              onMouseEnter={() => setHovered(cat._id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300"
              style={{
                borderColor: hovered === cat._id ? "var(--color-olive)" : "var(--color-border)",
                boxShadow: hovered === cat._id ? "0 12px 32px rgba(95,111,82,0.2)" : "none",
                transform: hovered === cat._id ? "translateY(-4px)" : "none",
              }}>
              <div className="aspect-[4/5] overflow-hidden">
                <img src={cat.img} alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                  style={{ transform: hovered === cat._id ? "scale(1.08)" : "scale(1)" }}/>
                <div className="absolute inset-0" 
                style={{ background:"linear-gradient(to top, rgba(46,46,46,0.85), rgba(46,46,46,0.1))" }}/>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <span className="text-2xl mb-1">{cat.emoji}</span>
                <h3 style={{ fontFamily:"Georgia,serif", color:"var(--color-beige)" }} className="font-bold text-base leading-tight">{cat.name}</h3>
                <p style={{ color:"var(--color-sage)" }} className="text-xs mt-1">{cat.count} products</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cat.tags.slice(0,2).map(t => (
                    <span key={t} style={{ background:"rgba(245,230,211,0.15)", color:"var(--color-beige)" }}
                      className="text-xs px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              {/* Arrow on hover */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: hovered === cat._id ? "var(--color-olive)" : "rgba(255,255,255,0.1)",
                  opacity: hovered === cat._id ? 1 : 0,
                }}>
                <ArrowRight size={14} className="text-white"/>
              </div>
            </div>
          ))}
        </div>:<div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">Loading categories...</p>
          </div>
        </div>
      }

        {/* Features Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl" style={{ background:"var(--color-charcoal)" }}>
          {[
            [<Truck size={20}/>,       "Quick Delivery",  "For available products"],
            [<RefreshCw size={20}/>,   "Service Support", "Repairs and assistance"],
            [<ShieldCheck size={20}/>, "Checked Quality", "Trusted products"],
            [<TrendingUp size={20}/>,  "Fair Prices",     "Practical recommendations"],
          ].map(([icon, title, sub]) => (
            <div key={title} className="flex items-center gap-3" style={{ color:"var(--color-beige)" }}>
              <div className="opacity-70 shrink-0">{icon}</div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs opacity-60">{sub}</p>
              </div>
            </div>
          ))}
        </div>

         {/* Featured Category */}
        {/* <div className="mb-10">
          <p style={{ color:"var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-4">⭐ Featured</p>
          <div
            onClick={() => onSelectCategory(featured)}
            className="group relative rounded-3xl overflow-hidden cursor-pointer h-64 sm:h-80"
            onMouseEnter={() => setHovered(featured.id)}
            onMouseLeave={() => setHovered(null)}>
            <img src={featured.img} alt={featured.name}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: hovered === featured.id ? "scale(1.05)" : "scale(1)" }}/>
            <div className="absolute inset-0" style={{ background:"linear-gradient(to right, rgba(46,46,46,0.85), rgba(46,46,46,0.3))" }}/>
            <div className="absolute inset-0 flex flex-col justify-center px-10">
              <span className="text-5xl mb-3">{featured.emoji}</span>
              <h2 style={{ fontFamily:"Georgia,serif", color:"var(--color-beige)" }} className="text-4xl font-bold mb-2">{featured.name}</h2>
              <p style={{ color:"var(--color-sage)" }} className="mb-4 max-w-sm">{featured.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {featured.tags.map(t => (
                  <span key={t} style={{ background:"rgba(245,230,211,0.15)", color:"var(--color-beige)" }}
                    className="text-xs px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <button style={{ background:"var(--color-olive)" }}
                className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full font-semibold text-sm w-fit hover:opacity-90">
                Explore {featured.count} Products <ArrowRight size={14}/>
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
