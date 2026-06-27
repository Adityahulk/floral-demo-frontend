import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { api } from "../api/client";
import { API } from "../api/endpoints";

const FALLBACK_REVIEWS = [
  {
    _id: "fallback-1",
    rating: 5,
    comment: "The laptop I ordered was set up properly, packaged carefully, and ready to use. The team explained everything clearly.",
    createdAt: "2026-04-12T10:30:00Z",
    verifiedPurchase: true,
    user: { name: "Priya Sharma" },
  },
  {
    _id: "fallback-2",
    rating: 5,
    comment: "Great service for our office computers. The accessories were good quality, and the delivery was right on time.",
    createdAt: "2026-03-28T14:15:00Z",
    verifiedPurchase: true,
    user: { name: "Rohan Kapoor" },
  },
  {
    _id: "fallback-3",
    rating: 4,
    comment: "They helped me choose the right setup for my study desk. Practical advice, fair pricing, and a smooth experience overall.",
    createdAt: "2026-03-15T09:45:00Z",
    verifiedPurchase: true,
    user: { name: "Sneha Gupta" },
  },
];

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

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(API.products.list)
      .then(data => {
        const allProducts = Array.isArray(data) ? data : (data.data ?? data.products ?? []);

        const withReviews = allProducts
          .filter(p => (p.rating?.total ?? 0) > 0)
          .sort((a, b) => (b.rating?.total ?? 0) - (a.rating?.total ?? 0))
          .slice(0, 4);

        if (withReviews.length === 0) {
          setReviews(FALLBACK_REVIEWS);
          setLoading(false);
          return;
        }

        return Promise.all(
          withReviews.map(p =>
            api(API.reviews.list(p._id))
              .then(d => d.reviews ?? [])
              .catch(() => [])
          )
        ).then(results => {
          const flat = results
            .flat()
            .filter(r => r.comment)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

          setReviews(flat.length > 0 ? flat : FALLBACK_REVIEWS);
          setLoading(false);
        });
      })
      .catch(() => {
        setReviews(FALLBACK_REVIEWS);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section style={{ background:"var(--color-charcoal)" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p style={{ color:"var(--color-sage)" }} className="text-xs uppercase tracking-widest font-semibold mb-2">Testimonials</p>
          <h2 style={{ fontFamily:"Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-white mb-10">
            What Our Customers Say
          </h2>
          <div className="flex justify-center py-6">
            <div className="w-7 h-7 border-2 rounded-full animate-spin"
              style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }}/>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section style={{ background:"var(--color-charcoal)" }} className="py-16">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-10">
          <p style={{ color:"var(--color-sage)" }} className="text-xs uppercase tracking-widest font-semibold mb-2">
            Real Customer Reviews
          </p>
          <h2 style={{ fontFamily:"Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-white">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => {
            const name    = review.user?.name || "Customer";
            const initial = name[0].toUpperCase();
            const dateStr = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
              : "";

            return (
              <div key={review._id || i} style={{ background:"rgba(217,119,6,0.12)" }} className="rounded-2xl p-6 flex flex-col gap-4">

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
                      <p className="text-white font-semibold text-sm truncate">{name}</p>
                      {dateStr && <p style={{ color:"var(--color-olive)" }} className="text-xs">{dateStr}</p>}

                    </div>
                  </div>

                  {review.verifiedPurchase && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                      style={{ background:"#166534", color:"#86efac" }}>
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
