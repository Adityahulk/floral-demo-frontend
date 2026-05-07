import { useState, useEffect, useRef } from "react";
import { Star, Save } from "lucide-react";
import { BASE } from "./shared";
import { authFetch } from "../../../utils/auth";

export default function TodaysPickTab() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const successTimerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`${BASE}/api/products`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${BASE}/api/todayspick`, { signal: controller.signal }).then(r => r.json()),
    ]).then(([productsRes, pickRes]) => {
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      if (pickRes.data?._id) setSelected(pickRes.data._id);
    }).catch(err => {
      if (err.name !== "AbortError") setError("Failed to load data");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => clearTimeout(successTimerRef.current);
  }, []);

  async function handleSave() {
    if (!selected) {
      setError("Please select a product");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await authFetch(`${BASE}/api/todayspick`, {
        method: "PUT",
        body: JSON.stringify({ product: selected }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");
      setSuccess(true);
      clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--color-olive)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--color-beige)" }}>
            <Star size={18} style={{ color: "var(--color-olive)" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="font-bold">Today's Pick</h2>
            <p style={{ color: "var(--color-olive)" }} className="text-xs">Choose the featured product shown on the home page hero</p>
          </div>
        </div>

        <div>
          <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-medium mb-1.5">
            Featured Product
          </label>
          <select
            value={selected}
            onChange={e => { setSelected(e.target.value); setError(""); }}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "var(--color-border)", color: "var(--color-charcoal)", background: "var(--color-beige)" }}
          >
            <option value="">— Select a product —</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name} — ₹{p.price}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>
        )}

        {success && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#16a34a" }}>
            ✓ Today's Pick updated successfully
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !selected}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: "var(--color-olive)", opacity: (saving || !selected) ? 0.5 : 1 }}
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Pick"}
        </button>
      </div>
    </div>
  );
}
