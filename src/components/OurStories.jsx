import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import vid1 from "../assets/videos/Video-618.mp4";
import vid2 from "../assets/videos/Video-843.mp4";
import vid3 from "../assets/videos/Video-97.mp4";
import vid4 from "../assets/videos/Video-787.mp4";
import vid5 from "../assets/videos/Video-599.mp4";
import vid6 from "../assets/videos/Video-452.mp4";
import vid7 from "../assets/videos/Video-795.mp4";

const STORIES = [vid1, vid2, vid3, vid4, vid5, vid6, vid7];

export default function OurStories() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-story-card]");
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-4">
        <div className="text-center mb-10">
          <p style={{ color: "var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-2">
            From Our Instagram
          </p>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="text-3xl sm:text-4xl font-bold">
            Our Stories
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:scale-105 transition-transform"
            style={{ color: "var(--color-charcoal)" }}
          >
            <ChevronLeft size={22} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-2 no-scrollbar"
          >
            {STORIES.map((src, i) => (
              <div
                key={i}
                data-story-card
                className="snap-start shrink-0 relative overflow-hidden rounded-2xl border bg-black"
                style={{ width: "260px", height: "462px", borderColor: "var(--color-border)" }}
              >
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onClick={(e) => {
                    const v = e.currentTarget;
                    if (v.paused) v.play();
                    else v.pause();
                  }}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:scale-105 transition-transform"
            style={{ color: "var(--color-charcoal)" }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
