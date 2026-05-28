import { useState, useEffect } from "react";
import { Star, Trash2, Edit2, RefreshCw, Search } from "lucide-react";
import { authFetch } from "../../../utils/auth";
import { BASE } from "./shared";

function Stars({ n }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12}
          className={i <= Math.round(n) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
      ))}
    </span>
  );
}

async function loadAllReviews() {
  const r = await fetch(`${BASE}/api/products`);
  if (!r.ok) throw new Error("Failed to fetch products");
  const json = await r.json();
  const products = Array.isArray(json) ? json : (json.data ?? json.products ?? []);

  const withReviews = products.filter(p => (p.rating?.total ?? 0) > 0);
  if (withReviews.length === 0) return [];

  const results = await Promise.all(
    withReviews.map(p =>
      fetch(`${BASE}/api/products/${p._id}/reviews?limit=100`)
        .then(r => r.json())
        .then(d => (d.reviews ?? []).map(rv => ({ ...rv, productName: p.name, productId: p._id })))
        .catch(() => [])
    )
  );

  return results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export default function ReviewsTab() {
  const [reviews,      setReviews]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [inputVal,     setInputVal]     = useState("");
  const [deleteId,     setDeleteId]     = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [editReview,   setEditReview]   = useState(null); // { _id, rating, comment }
  const [editRating,   setEditRating]   = useState(5);
  const [editComment,  setEditComment]  = useState("");
  const [saving,       setSaving]       = useState(false);
  const [saveError,    setSaveError]    = useState("");
  const [filterRating, setFilterRating] = useState("all");

  function load() {
    setLoading(true);
    setError(null);
    loadAllReviews()
      .then(list => { setReviews(list); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await authFetch(`${BASE}/api/reviews/${deleteId}`, { method: "DELETE" });
      if (!res.ok) { const j = await res.json(); throw new Error(j.message || "Delete failed"); }
      setReviews(prev => prev.filter(r => (r._id || r.id) !== deleteId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  function openEdit(review) {
    setEditReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
    setSaveError("");
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editComment.trim()) { setSaveError("Comment cannot be empty."); return; }
    setSaving(true);
    setSaveError("");
    try {
      const rid = editReview._id || editReview.id;
      const res = await authFetch(`${BASE}/api/reviews/${rid}`, {
        method: "PUT",
        body: JSON.stringify({ rating: editRating, comment: editComment.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Update failed");
      setReviews(prev => prev.map(r => (r._id || r.id) === rid
        ? { ...r, rating: editRating, comment: editComment.trim() }
        : r
      ));
      setEditReview(null);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || (r.user?.name || "").toLowerCase().includes(q)
      || (r.comment || "").toLowerCase().includes(q)
      || (r.productName || "").toLowerCase().includes(q);
    const matchRating = filterRating === "all" || r.rating === Number(filterRating);
    return matchSearch && matchRating;
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ borderColor:"var(--color-border)", background:"white" }}
          onSubmit={e => { e.preventDefault(); setSearch(inputVal.trim()); }}>
          <Search size={15} style={{ color:"var(--color-olive)" }}/>
          <input
            value={inputVal}
            onChange={e => { setInputVal(e.target.value); if (!e.target.value) setSearch(""); }}
            placeholder="Search by reviewer, product, or comment…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color:"var(--color-charcoal)" }}
          />
        </form>

        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="px-3 py-2 rounded-xl border text-sm outline-none"
          style={{ borderColor:"var(--color-border)", background:"white", color:"var(--color-charcoal)" }}>
          <option value="all">All Ratings</option>
          {[5,4,3,2,1].map(n => (
            <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>
          ))}
        </select>

        <button onClick={load}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium hover:opacity-70"
          style={{ borderColor:"var(--color-border)", background:"white", color:"var(--color-olive)" }}>
          <RefreshCw size={14}/> Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-2 mb-4">
        <p style={{ color:"var(--color-olive)" }} className="text-sm">
          {loading ? "Loading…" : `${filtered.length} review${filtered.length !== 1 ? "s" : ""}${search || filterRating !== "all" ? " (filtered)" : ""}`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl mb-4 text-sm" style={{ background:"#fee2e2", color:"#dc2626" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }}/>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 rounded-3xl border" style={{ borderColor:"var(--color-border)", background:"white" }}>
          <p className="text-3xl mb-2">⌕</p>
          <p style={{ color:"var(--color-charcoal)" }} className="font-semibold">No reviews found</p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width:"160px" }}/>
              <col style={{ width:"150px" }}/>
              <col style={{ width:"120px" }}/>
              <col/>
              <col style={{ width:"110px" }}/>
              <col style={{ width:"90px" }}/>
              <col style={{ width:"90px" }}/>
            </colgroup>
            <thead>
              <tr style={{ background:"var(--color-beige)", borderBottom:"1px solid var(--color-border)" }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color:"var(--color-olive)" }}>Reviewer</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color:"var(--color-olive)" }}>Product</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color:"var(--color-olive)" }}>Rating</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color:"var(--color-olive)" }}>Comment</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color:"var(--color-olive)" }}>Date</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color:"var(--color-olive)" }}>Verified</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color:"var(--color-olive)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review, i) => {
                const rid     = review._id || review.id;
                const name    = review.user?.name || "Unknown";
                const initial = name[0].toUpperCase();
                const dateStr = review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
                  : "—";

                return (
                  <tr key={rid || i}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--color-beige)" : "none", background:"white" }}
                    className="hover:bg-stone-50 transition-colors">

                    {/* Reviewer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {review.user?.profileImage
                          ? <img src={review.user.profileImage} alt={name}
                              className="w-7 h-7 rounded-full object-cover shrink-0"/>
                          : <div style={{ background:"var(--color-olive)" }}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {initial}
                            </div>
                        }
                        <span style={{ color:"var(--color-charcoal)" }} className="text-xs font-medium truncate">{name}</span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3 overflow-hidden">
                      <span style={{ color:"var(--color-charcoal)" }} className="text-xs truncate block">{review.productName || "—"}</span>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Stars n={review.rating}/>
                        <span style={{ color:"var(--color-olive)" }} className="text-xs font-semibold">{review.rating}</span>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-4 py-3">
                      <p style={{ color:"var(--color-charcoal)" }} className="text-xs leading-relaxed line-clamp-2">
                        {review.comment || "—"}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <span style={{ color:"var(--color-olive)" }} className="text-xs whitespace-nowrap">{dateStr}</span>
                    </td>

                    {/* Verified */}
                    <td className="px-4 py-3">
                      {review.verifiedPurchase
                        ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background:"#dcfce7", color:"#16a34a" }}>✓ Yes</span>
                        : <span className="text-xs" style={{ color:"var(--color-olive)" }}>—</span>
                      }
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(review)}
                          className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                          style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}
                          title="Edit review">
                          <Edit2 size={13}/>
                        </button>
                        <button onClick={() => setDeleteId(rid)}
                          className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                          style={{ background:"#fee2e2", color:"#dc2626" }}
                          title="Delete review">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={saveEdit}
            className="bg-white rounded-3xl p-7 shadow-xl w-full max-w-md mx-4">
            <p style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg mb-5">
              Edit Review
            </p>

            <div className="mb-4">
              <label style={{ color:"var(--color-olive)" }} className="text-sm font-semibold block mb-2">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <button key={i} type="button" onClick={() => setEditRating(i)}>
                    <Star size={28}
                      className={i <= editRating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}/>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label style={{ color:"var(--color-olive)" }} className="text-sm font-semibold block mb-2">Comment</label>
              <textarea
                value={editComment}
                onChange={e => setEditComment(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none"
                style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)", background:"var(--color-beige)" }}
              />
            </div>

            {saveError && (
              <p className="text-xs mb-4 px-3 py-2 rounded-xl" style={{ background:"#fee2e2", color:"#dc2626" }}>
                {saveError}
              </p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setEditReview(null)}
                className="flex-1 px-4 py-2 rounded-full border text-sm font-semibold"
                style={{ borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 px-4 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                style={{ background:"var(--color-olive)" }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-7 shadow-xl max-w-sm w-full mx-4">
            <p style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg mb-2">
              Delete Review?
            </p>
            <p style={{ color:"var(--color-olive)" }} className="text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-full border text-sm font-semibold"
                style={{ borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 px-4 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                style={{ background:"#dc2626" }}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
