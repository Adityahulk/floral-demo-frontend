import { useState, useEffect, useRef } from "react";
import { Sparkles, Save } from "lucide-react";
import { BASE } from "./shared";
import { authFetch } from "../../../utils/auth";

const EMPTY = "";
const SLOTS = ["Slot 1", "Slot 2", "Slot 3", "Slot 4"];

export default function RecommendationsTab() {
  const [products, setProducts] = useState([]);
  const [slots, setSlots] = useState([EMPTY, EMPTY, EMPTY, EMPTY]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const successTimerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`${BASE}/api/products`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${BASE}/api/recommendations`, { signal: controller.signal }).then(r => r.json()),
    ]).then(([productsRes, recsRes]) => {
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      const current = Array.isArray(recsRes.data) ? recsRes.data : [];
      setSlots([
        current[0]?._id ?? EMPTY,
        current[1]?._id ?? EMPTY,
        current[2]?._id ?? EMPTY,
        current[3]?._id ?? EMPTY,
      ]);
    }).catch(err => {
      if (err.name !== "AbortError") setError("Failed to load data");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => clearTimeout(successTimerRef.current);
  }, []);

  const filled = slots.filter(Boolean);
  const hasDuplicate = filled.length !== new Set(filled).size;
  const hasNone = filled.length === 0;

  function updateSlot(index, value) {
    setSlots(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setError("");
  }

  async function handleSave() {
    if (hasDuplicate || hasNone) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await authFetch(`${BASE}/api/recommendations`, {
        method: "PUT",
        body: JSON.stringify({ products: filled }),
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
            <Sparkles size={18} style={{ color: "var(--color-olive)" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="font-bold">Recommendations</h2>
            <p style={{ color: "var(--color-olive)" }} className="text-xs">Choose up to 4 products shown in "You May Also Like"</p>
          </div>
        </div>

        <div className="space-y-4">
          {SLOTS.map((label, i) => (
            <div key={label}>
              <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-medium mb-1.5">
                {label}
              </label>
              <select
                value={slots[i]}
                onChange={e => updateSlot(i, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: "var(--color-border)", color: "var(--color-charcoal)", background: "var(--color-beige)" }}
              >
                <option value="">— Empty —</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} — ₹{p.price}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {hasDuplicate && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>
            Please select different products in each slot
          </p>
        )}

        {hasNone && !hasDuplicate && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>
            Please select at least 1 product
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>
        )}

        {success && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#16a34a" }}>
            ✓ Recommendations updated successfully
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || hasDuplicate || hasNone}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: "var(--color-olive)", opacity: (saving || hasDuplicate || hasNone) ? 0.5 : 1 }}
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Recommendations"}
        </button>
      </div>
    </div>
  );
}
