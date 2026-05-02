import { useState, useEffect, useRef } from "react";
import { Image, Save } from "lucide-react";
import { BASE } from "./shared";
import { authFetch } from "../../../utils/auth";

export default function BannersTab() {
  const [categories, setCategories] = useState([]);
  const [banner1, setBanner1] = useState("");
  const [banner2, setBanner2] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const successTimerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/categories`).then(r => r.json()),
      fetch(`${BASE}/api/banners`).then(r => r.json()),
    ]).then(([catsRes, bannersRes]) => {
      const cats = Array.isArray(catsRes.data) ? catsRes.data : [];
      const current = Array.isArray(bannersRes.data) ? bannersRes.data : [];
      setCategories(cats);
      if (current[0]) setBanner1(current[0]._id);
      if (current[1]) setBanner2(current[1]._id);
    }).catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => clearTimeout(successTimerRef.current);
  }, []);

  const isDuplicate = banner1 && banner2 && banner1 === banner2;

  async function handleSave() {
    if (isDuplicate) return;
    if (!banner1 || !banner2) {
      setError("Please select both banners");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await authFetch(`${BASE}/api/banners`, {
        method: "PUT",
        body: JSON.stringify({ banners: [banner1, banner2] }),
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
          style={{ borderColor: "#c97d5b", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e8d5c4" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#f5e6d3" }}>
            <Image size={18} style={{ color: "#c97d5b" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#3a2416" }} className="font-bold">Banner Collection</h2>
            <p style={{ color: "#9c7a62" }} className="text-xs">Choose 2 categories to feature on the home page</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Banner 1", value: banner1, onChange: setBanner1 },
            { label: "Banner 2", value: banner2, onChange: setBanner2 },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label style={{ color: "#5c4033" }} className="block text-sm font-medium mb-1.5">
                {label}
              </label>
              <select
                value={value}
                onChange={e => { onChange(e.target.value); setError(""); }}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#e8d5c4", color: "#3a2416", background: "#fdf8f3" }}
              >
                <option value="">— Select a category —</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {isDuplicate && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>
            Please select two different categories
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>
        )}

        {success && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#16a34a" }}>
            ✓ Banners updated successfully
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || isDuplicate || !banner1 || !banner2}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: "#c97d5b", opacity: (saving || isDuplicate || !banner1 || !banner2) ? 0.5 : 1 }}
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Banners"}
        </button>
      </div>
    </div>
  );
}
