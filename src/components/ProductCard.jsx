import { Stars } from "lucide-react";
import { useState } from "react";
import { Heart, ShoppingCart } from "react-feather";
import { BADGE_STYLES, fmt } from "../constants/StaticVariables";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ p, wished, onWish, onCart }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const disc = p.originalPrice ? Math.round((1-p.price/p.originalPrice)*100) : null;
  console.log("Rendering ProductCard for:", params.get("category"), p.category);
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} 
      className="relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer"
      style={{borderColor:"#f0e4d8", boxShadow: hovered?"0 20px 40px rgba(58,36,22,0.12)":"0 2px 8px rgba(58,36,22,0.06)", transform: hovered?"translateY(-4px)":"none"}}>
      <div className="relative overflow-hidden" style={{aspectRatio:"4/5"}}>
        <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover transition-transform duration-500" style={{transform:hovered?"scale(1.06)":"scale(1)"}}/>
        {p.badge&&<span className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[p.badge]}`}>{!isNaN(p.originalPrice)?`-${disc}%`:p.badge}</span>}
        <button onClick={()=>onWish(p.id)} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
          <Heart size={14} className={wished?"fill-rose-500 text-rose-500":"text-stone-400"}/>
        </button>
        <div className="absolute inset-x-0 bottom-0 transition-transform duration-300" style={{transform:hovered?"translateY(0)":"translateY(100%)"}}>
          <button onClick={()=>onCart(p)} style={{background:"#4a3728"}} className="w-full py-3 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90">
            <ShoppingCart size={14}/> Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4">
        <p style={{color:"#9c7a62"}} className="text-xs mb-1">{p.category}</p>
        <h3 style={{fontFamily:"Georgia,serif",color:"#3a2416"}} className="font-semibold text-sm mb-2 truncate">{p.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars n={p.rating} size={12}/>
          <span style={{color:"#9c7a62"}} className="text-xs">({p.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span style={{color:"#c97d5b"}} className="font-bold">{fmt(p.price)}</span>
            {p.originalPrice&&<span className="text-xs text-stone-400 line-through">{fmt(p.originalPrice)}</span>}
          </div>
          <button onClick={()=>onCart(p)} style={{background:"#f5e6d3"}} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity">
            <ShoppingCart size={14} style={{color:"#c97d5b"}}/>
          </button>
        </div>
        <button 
        onClick={()=>navigate(`/category/${p.category}/${p._id}`)} 
        style={{background:"#4a3728"}} className="w-full py-2 my-2 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90">
            View Details
          </button>
      </div>
    </div>
  );
}