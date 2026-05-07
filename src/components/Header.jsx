import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Menu, X, User, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloralLogo from "../assets/floral-logo.png";
import { isAuthenticated, isAdmin } from "../utils/auth";
import { api } from "../api/client";
import { API } from "../api/endpoints";

const fmt  = n => "₹" + n.toLocaleString("en-IN");

function Stars({ n }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10}
          className={i <= Math.round(n) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
      ))}
    </span>
  );
}

function SearchBar({ onClose }) {
  const [query,     setQuery]     = useState("");
  const [debounced, setDebounced] = useState("");
  const [results,   setResults]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [focused,   setFocused]   = useState(true);
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debounced.trim()) return;
    let cancelled = false;
    Promise.resolve()
      .then(() => { if (!cancelled) setLoading(true); })
      .then(() => api(API.search.query, { params: { q: debounced, limit: 8 } }))
      .then(d => { if (!cancelled) setResults(d.data ?? []); })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debounced]);

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function handler(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function goToProduct(p) {
    const catId = p.category?._id ?? p.category;
    navigate(`/category/${catId}/${p._id}`);
    onClose();
  }

  const showDropdown = focused && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="pb-3 relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-olive)" }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setFocused(true); }}
          onFocus={() => setFocused(true)}
          type="text"
          placeholder="Search flowers, bouquets, categories..."
          className="w-full pl-9 pr-10 py-2.5 rounded-full border text-sm outline-none"
          style={{ borderColor:"var(--color-border)", background:"white", color:"var(--color-charcoal)" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60"
            style={{ color:"var(--color-olive)" }}>
            <X size={15} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 rounded-2xl border shadow-xl z-50 bg-white overflow-hidden"
          style={{ borderColor:"var(--color-border)", maxHeight:"420px", overflowY:"auto" }}>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8" style={{ color:"var(--color-olive)" }}>
              <div className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor:"var(--color-border)", borderTopColor:"var(--color-olive)" }} />
              <span className="text-sm">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🌸</p>
              <p className="text-sm" style={{ color:"var(--color-olive)" }}>
                No results for "<strong style={{ color:"var(--color-charcoal)" }}>{query}</strong>"
              </p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b text-xs font-semibold"
                style={{ borderColor:"var(--color-border)", color:"var(--color-olive)", background:"var(--color-beige)" }}>
                {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
              </div>
              {results.map(p => (
                <button key={p._id} onClick={() => goToProduct(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b text-left transition-colors hover:bg-stone-50 last:border-0"
                  style={{ borderColor:"var(--color-border)" }}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background:"var(--color-beige)" }}>
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">🌸</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color:"var(--color-charcoal)" }}>{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {p.category?.name && (
                        <span className="text-xs" style={{ color:"var(--color-olive)" }}>{p.category.name}</span>
                      )}
                      {(p.tags ?? []).slice(0, 2).map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}>{t}</span>
                      ))}
                    </div>
                    <Stars n={p.rating?.average ?? 0} />
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold" style={{ color:"var(--color-olive)" }}>{fmt(p.price)}</p>
                    {p.originalPrice && (
                      <p className="text-xs line-through" style={{ color:"var(--color-sage)" }}>{fmt(p.originalPrice)}</p>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header({ cartCount, onCartOpen }) {
  const [open,       setOpen]       = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate  = useNavigate();
  const showAdmin = isAuthenticated() && isAdmin();

  const links = [
    { title:"Home",     path:"/"         },
    { title:"Category", path:"/category" },
    ...(showAdmin ? [{ title:"Admin", path:"/admin" }] : []),
    { title:"About",   path:"/about"   },
    { title:"Contact", path:"/contact" },
  ];

  return (
    <header style={{ background:"var(--color-beige)" }} className="sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={FloralLogo} alt="The Floral Studio"
              style={{ width:"3rem", borderRadius:"50%", border:"2px solid var(--color-charcoal)" }} />
            <div>
              <p style={{ fontFamily:"Georgia,serif", color:"var(--color-charcoal)" }} className="font-bold text-lg leading-none">The Floral</p>
              <p style={{ color:"var(--color-olive)" }} className="text-xs uppercase tracking-widest">Studio</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {links.map(l => (
              <p key={l.path} onClick={() => navigate(l.path)}
                style={{ color:"var(--color-charcoal)" }}
                className="text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer">
                {l.title}
              </p>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(s => !s)} style={{ color:"var(--color-charcoal)" }}
              className="p-2 rounded-full hover:opacity-70">
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <button onClick={onCartOpen} style={{ color:"var(--color-charcoal)" }}
              className="relative p-2 rounded-full hover:opacity-70">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{ background:"var(--color-olive)" }}
                  className="absolute top-0 right-0 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate("/profile")} style={{ color:"var(--color-charcoal)" }}
              className="relative p-2 rounded-full hover:opacity-70">
              <User size={20} />
            </button>
            <button onClick={() => setOpen(o => !o)} className="lg:hidden p-2" style={{ color:"var(--color-charcoal)" }}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

        {open && (
          <div className="lg:hidden pb-3 border-t" style={{ borderColor:"var(--color-border)" }}>
            {links.map(l => (
              <p key={l.path} onClick={() => { navigate(l.path); setOpen(false); }}
                className="block py-2 px-2 text-sm font-medium border-b cursor-pointer"
                style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }}>
                {l.title}
              </p>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
