import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { isAuthenticated, isAdmin, getTokenPayload } from "../../utils/auth";
import { api } from "../../api/client";
import { API } from "../../api/endpoints";

function Stars({ n, size = 14 }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          className={i <= Math.round(n) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}>
          <Star size={30}
            className={(hovered || value) >= i ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
        </button>
      ))}
    </span>
  );
}

function ReviewCard({ review, isOwn }) {
  const name    = review.user?.name || "User";
  const initial = name[0].toUpperCase();
  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
    : "";

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4 h-full"
      style={{ background:"var(--color-charcoal)", outline: isOwn ? "2px solid var(--color-olive)" : "none" }}>

      <Stars n={review.rating} size={16}/>

      <p style={{ color:"var(--color-beige)" }} className="text-sm leading-relaxed flex-1">
        "{review.comment}"
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {review.user?.profileImage
            ? <img src={review.user.profileImage} alt={name}
                className="w-9 h-9 rounded-full object-cover shrink-0"/>
            : <div style={{ background:"var(--color-olive)" }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initial}
              </div>
          }
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {name}
              {isOwn && <span style={{ color:"var(--color-sage)" }} className="ml-1 text-xs font-normal">(You)</span>}
            </p>
            {dateStr && <p style={{ color:"var(--color-olive)" }} className="text-xs">{dateStr}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {review.verifiedPurchase && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background:"#166534", color:"#86efac" }}>
              ✓ Verified
            </span>
          )}
          {/* {isOwn && (
            <button onClick={() => onEdit(review)} title="Edit"
              className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
              style={{ background:"rgba(255,255,255,0.1)", color:"var(--color-beige)" }}>
              <Edit2 size={13}/>
            </button>
          )} */}
          {/* {canDelete && (
            <button onClick={() => onDelete(rid)} disabled={deletingId === rid}
              title="Delete"
              className="p-1.5 rounded-lg hover:opacity-70 transition-opacity disabled:opacity-50"
              style={{ background:"rgba(220,38,38,0.2)", color:"#fca5a5" }}>
              {deletingId === rid
                ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                : <Trash2 size={13}/>
              }
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ productId }) {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [rating,     setRating]     = useState(5);
  const [comment,    setComment]    = useState("");
  const [editingId,  setEditingId]  = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loggedIn  = isAuthenticated();
  const adminUser = isAdmin();
  const me     = getTokenPayload();
  const myId   = me?._id || me?.id || me?.userId;

  function fetchReviews(showSpinner = false) {
    if (showSpinner) setLoading(true);
    api(API.reviews.list(productId))
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    if (!productId) return;
    const controller = new AbortController();
    api(API.reviews.list(productId), { signal: controller.signal })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { if (err.name !== "AbortError") setLoading(false); });
    return () => controller.abort();
  }, [productId]);

  const reviews   = data?.reviews ?? [];
  const avg       = data?.average ?? 0;
  const total     = data?.total ?? 0;
  const breakdown = data?.ratingBreakdown ?? {};

  const myReview = reviews.find(r => r.user?._id === myId || r.user?.id === myId);

  function openWrite() {
    if (myReview) {
      setEditingId(myReview._id || myReview.id);
      setRating(myReview.rating);
      setComment(myReview.comment);
    } else {
      setEditingId(null);
      setRating(5);
      setComment("");
    }
    setError("");
    setShowForm(true);
    setTimeout(() => document.getElementById("review-form")?.scrollIntoView({ behavior:"smooth", block:"center" }), 50);
  }

  function openEdit(review) {
    setEditingId(review._id || review.id);
    setRating(review.rating);
    setComment(review.comment);
    setError("");
    setShowForm(true);
    setTimeout(() => document.getElementById("review-form")?.scrollIntoView({ behavior:"smooth", block:"center" }), 50);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setSubmitting(true);
    setError("");
    try {
      const endpoint = editingId ? API.reviews.update(editingId) : API.reviews.create(productId);
      const json = await api(endpoint, {
        method: editingId ? "PUT" : "POST",
        body: { rating, comment },
      });
      if (!json.success) throw new Error(json.message || "Submission failed");
      fetchReviews(true);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(rid) {
    if (!window.confirm("Delete this review?")) return;
    setDeletingId(rid);
    try {
      const res = await api(API.reviews.delete(rid), { method: "DELETE" });
      if (!res.success) throw new Error(res.message || "Delete failed");
      fetchReviews(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-3xl font-bold">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <Stars n={avg} size={20} />
            <span style={{ color:"var(--color-charcoal)" }} className="font-bold text-lg">{Number(avg).toFixed(1)} / 5</span>
            <span style={{ color:"var(--color-olive)" }}>({total} review{total !== 1 ? "s" : ""})</span>
          </div>
        </div>

        {!loggedIn ? (
          <a href="/login"
            style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}
            className="px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity shrink-0">
            Login to Review
          </a>
        ) : !myReview ? (
          <button onClick={openWrite}
            style={{ background:"var(--color-olive)" }}
            className="text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shrink-0">
            Write a Review
          </button>
        ) : null}
      </div>

      {/* Rating breakdown */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 rounded-3xl border"
          style={{ borderColor:"var(--color-border)", background:"white" }}>
          <div className="flex flex-col items-center justify-center shrink-0 text-center" style={{ minWidth:"110px" }}>
            <p style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)", fontSize:"3.5rem", lineHeight:1 }} className="font-bold">
              {Number(avg).toFixed(1)}
            </p>
            <Stars n={avg} size={18} />
            <p style={{ color:"var(--color-olive)" }} className="text-xs mt-1">{total} reviews</p>
          </div>
          <div className="flex-1 space-y-2.5">
            {[5,4,3,2,1].map(star => {
              const count = breakdown[star] ?? breakdown[String(star)] ?? 0;
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span style={{ color:"var(--color-olive)" }} className="text-xs w-3 text-right shrink-0">{star}</span>
                  <Star size={12} className="fill-amber-400 text-amber-400 shrink-0"/>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:"var(--color-border)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${pct}%`, background:"var(--color-olive)" }}/>
                  </div>
                  <span style={{ color:"var(--color-olive)" }} className="text-xs w-8 shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write / Edit form */}
      {showForm && (
        <form id="review-form" onSubmit={handleSubmit}
          className="mb-8 rounded-3xl border overflow-hidden"
          style={{ borderColor:"var(--color-olive)" }}>

          {/* Previous review preview (edit mode only) */}
          {editingId && myReview && (
            <div className="px-6 pt-5 pb-4 border-b" style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
              <p style={{ color:"var(--color-olive)" }} className="text-xs font-bold uppercase tracking-wide mb-3">
                Your Previous Review
              </p>
              <div className="flex items-start gap-3">
                <div style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {(me?.name || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <Stars n={myReview.rating} size={14}/>
                  <p style={{ color:"var(--color-charcoal)" }} className="text-sm leading-relaxed mt-2">{myReview.comment}</p>
                  {myReview.verifiedPurchase && (
                    <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background:"#dcfce7", color:"#16a34a" }}>
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form fields */}
          <div className="p-6" style={{ background:"white" }}>
            <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg mb-5">
              {editingId ? "Update Your Review" : "Write a Review"}
            </h3>

            <div className="mb-5">
              <label style={{ color:"var(--color-olive)" }} className="text-sm font-semibold block mb-2">Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <div className="mb-5">
              <label style={{ color:"var(--color-olive)" }} className="text-sm font-semibold block mb-2">
                {editingId ? "Updated Review" : "Your Review"}
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product…"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none"
                style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)", background:"var(--color-beige)" }}
              />
            </div>

            {error && (
              <p className="text-xs mb-4 px-3 py-2 rounded-xl" style={{ background:"#fee2e2", color:"#dc2626" }}>
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-5 py-2 rounded-full border text-sm font-semibold"
                style={{ borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="px-6 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                style={{ background:"var(--color-olive)" }}>
                {submitting ? "Submitting…" : editingId ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }}/>
        </div>
      )}

      {/* Empty state */}
      {!loading && reviews.length === 0 && (
        <div className="text-center py-14 rounded-3xl border" style={{ borderColor:"var(--color-border)", background:"white" }}>
          <p className="text-4xl mb-3">🌸</p>
          <p style={{ color:"var(--color-charcoal)" }} className="font-semibold">No reviews yet</p>
          <p style={{ color:"var(--color-olive)" }} className="text-sm mt-1">Be the first to share your experience!</p>
        </div>
      )}

      {/* Horizontal scroll list — all reviews together */}
      {!loading && reviews.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-3"
          style={{ scrollbarWidth:"thin", scrollbarColor:"var(--color-border) transparent" }}>
          {reviews.map((review, i) => {
            const rid   = review._id || review.id || i;
            const isOwn = myId && (review.user?._id === myId || review.user?.id === myId);
            return (
              <div key={rid} className="shrink-0 w-72">
                <ReviewCard
                  review={review}
                  isOwn={isOwn}
                  canDelete={isOwn || adminUser}
                  deletingId={deletingId}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
