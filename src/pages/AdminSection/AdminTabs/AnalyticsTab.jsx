import { useState, useEffect } from "react";
import { authFetch } from "../../../utils/auth";
import { ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BASE, fmt, fmtK } from "./shared";

export default function AnalyticsTab() {
  const [sortBy,    setSortBy]    = useState("revenue");
  const [sortDir,   setSortDir]   = useState("desc");
  const [filter,    setFilter]    = useState("All");
  const [summary,   setSummary]   = useState(null);
  const [revByProd, setRevByProd] = useState([]);
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch(`${BASE}/api/admin/analytics/products`).then(r => r.json()).catch(() => null),
      fetch(`${BASE}/api/products`).then(r => r.json()).catch(() => null),
    ]).then(([analytics, prods]) => {
      if (analytics?.summary) {
        setSummary(analytics.summary);
        setRevByProd(analytics.revenueByProduct ?? []);
      }
      if (prods) {
        const list = Array.isArray(prods) ? prods : (prods.data ?? prods.products ?? []);
        setProducts(list);
        if (!analytics?.summary) {
          setSummary({
            totalProducts: list.length,
            totalRevenue:  list.reduce((s, p) => s + (p.revenue ?? 0), 0),
            unitsSold:     list.reduce((s, p) => s + (p.totalSold ?? 0), 0),
            avgRating:     null,
          });
        }
      }
      setLoading(false);
    });
  }, []);

  const getCat = p => (typeof p.category === "object" ? (p.category?.name ?? "") : (p.category ?? ""));
  const cats   = ["All", ...new Set(products.map(p => getCat(p)).filter(Boolean))];

  const sorted = [...products]
    .filter(p => filter === "All" || getCat(p) === filter)
    .sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });

  function toggleSort(k) {
    if (sortBy === k) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(k); setSortDir("desc"); }
  }

  const sortIcon = (k) => sortBy === k
    ? sortDir === "desc" ? <ChevronDown size={13}/> : <ChevronUp size={13}/>
    : <ChevronDown size={13} className="opacity-30"/>;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-xl font-bold">Product Analytics</h2>
        <p style={{ color:"var(--color-olive)" }} className="text-sm">Top selling products & performance metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Products", value: summary?.totalProducts ?? products.length,                         unit:"",  color:"var(--color-olive)" },
          { label:"Total Revenue",  value: fmtK(summary?.totalRevenue ?? 0),                                  unit:"",  color:"#8b5cf6" },
          { label:"Units Sold",     value: (summary?.unitsSold ?? 0).toLocaleString(),                        unit:"",  color:"#06b6d4" },
          { label:"Avg Rating",     value: summary?.avgRating != null ? Number(summary.avgRating).toFixed(1) : "—", unit:"★", color:"#f59e0b" },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border" style={{ borderColor:"var(--color-border)" }}>
            <p style={{ color, fontFamily:"Georgia, serif" }} className="text-3xl font-bold">{value}{unit}</p>
            <p style={{ color:"var(--color-olive)" }} className="text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Share */}
      {revByProd.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"var(--color-border)" }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold mb-5">Revenue Share by Product</h3>
          <div className="space-y-3">
            {revByProd.slice(0, 5).map((p, i) => {
              const colors = ["var(--color-olive)","#8b5cf6","#06b6d4","#f59e0b","#22c55e"];
              return (
                <div key={p.productId?.toString() || String(i)}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i] }} />
                      <span style={{ color:"var(--color-charcoal)" }} className="text-sm font-medium">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ color:"var(--color-olive)" }} className="text-xs">{p.percentage}%</span>
                      <span style={{ color:"var(--color-olive)" }} className="text-sm font-bold">{fmtK(p.revenue ?? 0)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background:"var(--color-beige)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${p.percentage ?? 0}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b"
          style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">All Products</h3>
          <div className="flex gap-2 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                style={filter === c
                  ? { background:"var(--color-olive)", borderColor:"var(--color-olive)", color:"white" }
                  : { borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b text-xs font-bold uppercase tracking-wide"
          style={{ borderColor:"var(--color-border)", background:"#fafaf9", color:"var(--color-olive)" }}>
          <span>Product</span>
          <span>Price</span>
          <button onClick={() => toggleSort("totalSold")} className="flex items-center gap-1 hover:opacity-70">
            Sold {sortIcon("totalSold")}
          </button>
          <button onClick={() => toggleSort("revenue")} className="flex items-center gap-1 hover:opacity-70">
            Revenue {sortIcon("revenue")}
          </button>
          <button onClick={() => toggleSort("quantity")} className="flex items-center gap-1 hover:opacity-70">
            Stock {sortIcon("quantity")}
          </button>
          <span>Trend</span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color:"var(--color-olive)" }} className="text-sm">No products found</p>
          </div>
        ) : sorted.map((p, i) => {
          const pid      = p._id || p.id || i;
          const imgSrc   = Array.isArray(p.images) ? p.images[0] : (p.image || p.img || null);
          const trendUp   = p.trend === "up";
          const trendDown = p.trend === "down";
          const qty = p.quantity ?? p.stock ?? null;
          return (
            <div key={pid}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b hover:bg-amber-50 transition-colors"
              style={{ borderColor:"var(--color-border)" }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  {imgSrc
                    ? <img src={imgSrc} alt={p.name} className="w-10 h-10 object-cover rounded-xl" />
                    : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background:"var(--color-beige)" }}>⌨</div>
                  }
                  <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background:"var(--color-charcoal)", fontSize:"10px" }}>#{i+1}</span>
                </div>
                <div className="min-w-0">
                  <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-semibold truncate">{p.name}</p>
                  {getCat(p) && <span style={{ color:"var(--color-sage)" }} className="text-xs">{getCat(p)}</span>}
                </div>
              </div>
              <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-medium">{fmt(p.price ?? 0)}</p>
              <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-medium">{(p.totalSold ?? 0).toLocaleString()}</p>
              <p style={{ color:"var(--color-olive)" }} className="text-sm font-bold">{fmtK(p.revenue ?? 0)}</p>
              <div>
                <p style={{ color: qty != null && qty < 10 ? "#dc2626" : "var(--color-charcoal)" }} className="text-sm font-medium">
                  {qty ?? "—"}
                </p>
                {qty != null && qty < 10 && <p style={{ color:"#dc2626" }} className="text-xs">Low stock!</p>}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold"
                style={{ color: trendUp ? "#16a34a" : trendDown ? "#dc2626" : "var(--color-olive)" }}>
                {trendUp ? <ArrowUpRight size={14}/> : trendDown ? <ArrowDownRight size={14}/> : <span>—</span>}
                {p.trend ?? "stable"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
