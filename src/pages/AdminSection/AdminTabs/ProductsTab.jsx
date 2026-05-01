import { useState, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2,
  ToggleLeft, ToggleRight, RefreshCw, LayoutGrid, List,
} from "lucide-react";
import AddProductForm from "../AddProductForm";
import { BASE } from "./shared";

async function fetchAllProducts() {
  const r = await fetch(`${BASE}/api/products`);
  if (!r.ok) throw new Error("Failed to fetch products");
  const json = await r.json();
  return Array.isArray(json) ? json : (json.data ?? json.products ?? []);
}

export default function ProductsTab({ onEdit }) {
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [inputVal,      setInputVal]      = useState("");
  const [search,        setSearch]        = useState("");
  const [filterActive,  setFilterActive]  = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [toggling,      setToggling]      = useState(null);
  const [view,          setView]          = useState("table");

  useEffect(() => {
    fetchAllProducts()
      .then(list => { setProducts(list); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSearch(inputVal), 300);
    return () => clearTimeout(t);
  }, [inputVal]);

  function refresh() {
    setLoading(true);
    setError(null);
    fetchAllProducts()
      .then(list => { setProducts(list); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`${BASE}/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts(prev => prev.filter(p => p._id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleActive(p) {
    setToggling(p._id);
    try {
      const res = await fetch(`${BASE}/api/products/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      if (!res.ok) throw new Error("Update failed");
      setProducts(prev => prev.map(prod => prod._id === p._id ? { ...prod, active: !prod.active } : prod));
    } catch (e) {
      alert(e.message);
    } finally {
      setToggling(null);
    }
  }

  const filtered = products
    .filter(p => filterActive === "all" ? true : filterActive === "active" ? p.active : !p.active)
    .filter(p => (p.name ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Products</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm">{products.length} total products</p>
        </div>
        <button onClick={() => onEdit(null)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background:"#c97d5b" }}>
          <Plus size={15}/> Add Product
        </button>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }} />
            <input value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none w-48"
              style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }} />
          </div>
          {["all","active","inactive"].map(f => (
            <button key={f} onClick={() => setFilterActive(f)}
              className="px-3 py-2 rounded-full text-xs font-semibold border capitalize transition-all"
              style={filterActive === f
                ? { background:"#c97d5b", borderColor:"#c97d5b", color:"white" }
                : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              {f}
            </button>
          ))}
          <div className="flex rounded-full border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
            <button onClick={() => setView("grid")}
              className="px-3 py-2 transition-all"
              style={view === "grid" ? { background:"#c97d5b", color:"white" } : { background:"white", color:"#7a5c4a" }}>
              <LayoutGrid size={14}/>
            </button>
            <button onClick={() => setView("table")}
              className="px-3 py-2 transition-all"
              style={view === "table" ? { background:"#c97d5b", color:"white" } : { background:"white", color:"#7a5c4a" }}>
              <List size={14}/>
            </button>
          </div>
          <button onClick={refresh} className="p-2.5 rounded-full border hover:opacity-70"
            style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
            <RefreshCw size={14}/>
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor:"#e8d5c4", borderTopColor:"#c97d5b" }}/>
        </div>
      )}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p style={{ color:"#dc2626" }} className="font-semibold">{error}</p>
          <button onClick={refresh} className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background:"#f5ede5", color:"#c97d5b" }}>Retry</button>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-3">🌸</span>
          <p style={{ color:"#4a3728" }} className="font-semibold">No products found</p>
          <p style={{ color:"#9c7a62" }} className="text-sm mt-1">Try a different filter or add a new product</p>
        </div>
      )}

      {/* Grid View */}
      {!loading && !error && filtered.length > 0 && view === "grid" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => {
            const img = Array.isArray(p.images) ? p.images[0] : null;
            const isToggling = toggling === p._id;
            return (
              <div key={p._id} className="bg-white rounded-3xl border overflow-hidden flex flex-col"
                style={{ borderColor:"#e8d5c4" }}>
                <div className="relative h-44 bg-gray-100 overflow-hidden shrink-0">
                  {img
                    ? <img src={img} alt={p.name} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                  }
                  <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: p.active ? "#dcfce7" : "#fee2e2", color: p.active ? "#16a34a" : "#dc2626" }}>
                    {p.active ? "Active" : "Inactive"}
                  </span>
                  {p.badge && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background:"#fef9c3", color:"#92400e" }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <p style={{ color:"#3a2416", fontFamily:"Georgia, serif" }} className="font-bold text-base leading-tight">{p.name}</p>
                    <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5 truncate">{p.category?.name ?? p.category ?? "—"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }} className="font-bold text-lg">₹{p.price?.toLocaleString("en-IN")}</p>
                    <div className="text-right">
                      <p style={{ color: p.quantity < 10 ? "#dc2626" : "#4a3728" }} className="text-sm font-semibold">{p.quantity} in stock</p>
                      {p.quantity < 10 && <p style={{ color:"#dc2626" }} className="text-xs">Low stock</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto pt-1">
                    <button onClick={() => handleToggleActive(p)} disabled={isToggling}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80 disabled:opacity-50"
                      style={p.active
                        ? { borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }
                        : { borderColor:"#86efac", color:"#16a34a", background:"#f0fdf4" }}>
                      {isToggling
                        ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                        : p.active ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>
                      }
                      {p.active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => onEdit(p)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
                      style={{ borderColor:"#e8d5c4", color:"#5c4033", background:"#fdf8f3" }}>
                      <Edit2 size={13}/> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(p)}
                      className="ml-auto p-2 rounded-full border transition-all hover:opacity-80"
                      style={{ borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {!loading && !error && filtered.length > 0 && view === "table" && (
        <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
          <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b text-xs font-bold uppercase tracking-wide"
            style={{ borderColor:"#f0e4d8", background:"#fdf8f3", color:"#9c7a62" }}>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {filtered.map(p => {
            const img = Array.isArray(p.images) ? p.images[0] : null;
            const isToggling = toggling === p._id;
            return (
              <div key={p._id}
                className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center border-b"
                style={{ borderColor:"#f0e4d8" }}
                onMouseEnter={e => e.currentTarget.style.background="#fdf8f3"}
                onMouseLeave={e => e.currentTarget.style.background="white"}>
                <div className="flex items-center gap-3 min-w-0">
                  {img
                    ? <img src={img} alt={p.name} className="w-10 h-10 object-cover rounded-xl shrink-0"/>
                    : <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background:"#f5ede5" }}>🌸</div>
                  }
                  <div className="min-w-0">
                    <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{p.name}</p>
                    {p.badge && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background:"#fef9c3", color:"#92400e" }}>{p.badge}</span>}
                  </div>
                </div>
                <p style={{ color:"#9c7a62" }} className="text-xs truncate">{p.category?.name ?? p.category ?? "—"}</p>
                <p style={{ color:"#c97d5b" }} className="text-sm font-bold">₹{p.price?.toLocaleString("en-IN")}</p>
                <div>
                  <p style={{ color: p.quantity < 10 ? "#dc2626" : "#4a3728" }} className="text-sm font-semibold">{p.quantity}</p>
                  {p.quantity < 10 && <p style={{ color:"#dc2626" }} className="text-xs">Low</p>}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit"
                  style={{ background: p.active ? "#dcfce7" : "#fee2e2", color: p.active ? "#16a34a" : "#dc2626" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.active ? "#16a34a" : "#dc2626" }}/>
                  {p.active ? "Active" : "Inactive"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleToggleActive(p)} disabled={isToggling}
                    className="p-1.5 rounded-lg border transition-all hover:opacity-80 disabled:opacity-50"
                    title={p.active ? "Deactivate" : "Activate"}
                    style={p.active
                      ? { borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }
                      : { borderColor:"#86efac", color:"#16a34a", background:"#f0fdf4" }}>
                    {isToggling
                      ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                      : p.active ? <ToggleRight size={13}/> : <ToggleLeft size={13}/>
                    }
                  </button>
                  <button onClick={() => onEdit(p)}
                    className="p-1.5 rounded-lg border transition-all hover:opacity-80"
                    title="Edit"
                    style={{ borderColor:"#e8d5c4", color:"#5c4033", background:"#fdf8f3" }}>
                    <Edit2 size={13}/>
                  </button>
                  <button onClick={() => setDeleteConfirm(p)}
                    className="p-1.5 rounded-lg border transition-all hover:opacity-80"
                    title="Delete"
                    style={{ borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Delete Product?</p>
            <p style={{ color:"#9c7a62" }} className="text-sm">
              Are you sure you want to delete <strong style={{ color:"#3a2416" }}>{deleteConfirm.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-full border font-semibold text-sm"
                style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm._id)} disabled={deleting}
                className="flex-1 py-2.5 rounded-full font-semibold text-sm text-white disabled:opacity-60"
                style={{ background:"#dc2626" }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
