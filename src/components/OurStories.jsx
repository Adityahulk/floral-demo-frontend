import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import storyLogo from "../assets/stories/tech-story-01-logo.gif";
import storyLaptop from "../assets/stories/tech-story-02-laptop.gif";
import storyRepair from "../assets/stories/tech-story-03-repair.gif";
import storyAccessories from "../assets/stories/tech-story-04-accessories.gif";
import storyNetwork from "../assets/stories/tech-story-05-network.gif";
import storyCare from "../assets/stories/tech-story-06-security.gif";
import storyVisit from "../assets/stories/tech-story-07-visit.gif";

const STORIES = [
  { src: storyLogo, alt: "Tech Computer sales, repairs, and accessories story" },
  { src: storyLaptop, alt: "Laptop setup service story" },
  { src: storyRepair, alt: "Computer repair support story" },
  { src: storyAccessories, alt: "Computer accessories story" },
  { src: storyNetwork, alt: "Networking setup story" },
  { src: storyCare, alt: "Data care and backup support story" },
  { src: storyVisit, alt: "Visit Tech Computer store story" },
];

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
            Tech Computer Updates
          </p>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="text-3xl sm:text-4xl font-bold">
            Service Stories
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
            {STORIES.map(({ src, alt }, i) => (
              <div
                key={i}
                data-story-card
                className="snap-start shrink-0 relative overflow-hidden rounded-2xl border bg-black"
                style={{ width: "260px", height: "462px", borderColor: "var(--color-border)" }}
              >
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
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
