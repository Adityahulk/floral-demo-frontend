import { useState } from "react";
import { ShoppingCart, Heart, Search, Menu, X,User  } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ cartCount, wishCount, onCartOpen }) {
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState(false);
  const navigate = useNavigate();
  const links=[{title:"Home",path:"/",public:true},
    {title:"Category",path:"/category",public:true},
    {title:"About",path:"/about",public:true},
    {title:"Contact",path:"/contact",public:true}];
  return (
    <header style={{background:"#fdf8f3"}} className="sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div style={{background:"#c97d5b"}} className="w-9 h-9 rounded-full flex items-center justify-center text-lg">🌸</div>
            <div><p style={{fontFamily:"Georgia,serif",color:"#4a3728"}} className="font-bold text-lg leading-none">Floral</p><p style={{color:"#9c7a62"}} className="text-xs uppercase tracking-widest">Studio</p></div>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            {links.map(l=><p key={l.path} onClick={()=>navigate(l.path)} style={{color:"#5c4033"}} className="text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer">{l.title}</p>)}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={()=>setSearch(s=>!s)} style={{color:"#5c4033"}} className="p-2 rounded-full hover:opacity-70"><Search size={20}/></button>
            <button style={{color:"#5c4033"}} className="relative p-2 rounded-full hover:opacity-70">
              <Heart size={20}/>
              {wishCount>0&&<span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">{wishCount}</span>}
            </button>
            <button onClick={onCartOpen} style={{color:"#5c4033"}} className="relative p-2 rounded-full hover:opacity-70">
              <ShoppingCart size={20}/>
              {cartCount>0&&<span style={{background:"#c97d5b"}} className="absolute top-0 right-0 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
             <button onClick={()=>{navigate("/profile")}} style={{color:"#5c4033"}} className="relative p-2 rounded-full hover:opacity-70">
              <User size={20}/>
            </button>
            <button onClick={()=>setOpen(o=>!o)} className="lg:hidden p-2" style={{color:"#5c4033"}}>{open?<X size={20}/>:<Menu size={20}/>}</button>
          </div>
        </div>
        {search&&<div className="pb-3"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/><input autoFocus type="text" placeholder="Search flowers, bouquets..." className="w-full pl-9 pr-4 py-2 rounded-full border text-sm outline-none" style={{borderColor:"#e8d5c4"}}/></div></div>}
        {open&&<div className="lg:hidden pb-3 border-t" style={{borderColor:"#e8d5c4"}}>{links.map(l=><a key={l} href="#" style={{color:"#5c4033"}} className="block py-2 px-2 text-sm font-medium border-b" >{l}</a>)}</div>}
      </div>
    </header>
  );
}