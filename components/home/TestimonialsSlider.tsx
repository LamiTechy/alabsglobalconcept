"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

type T = {
  id: string;
  name: string;
  location: string | null;
  systemSize: string | null;
  quote: string;
  rating: number;
};

export function TestimonialsSlider({ items }: { items: T[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) return null;
  const current = items[index]!;

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
        <Quote className="h-8 w-8 text-sun-400/80" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.figure
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <blockquote className="mt-4 font-display text-lg leading-relaxed text-white md:text-xl">
              “{current.quote}”
            </blockquote>
            <figcaption className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex gap-0.5" aria-label={`${current.rating} out of 5 stars`}>
                {Array.from({ length: Math.min(current.rating, 5) }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sun-400 text-sun-400" aria-hidden />
                ))}
              </div>
              <span className="font-semibold text-white">{current.name}</span>
              <span className="flex items-center gap-1 text-sm text-white/60">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {current.location}
                {current.systemSize ? <span className="ml-1 text-sun-300/90">· {current.systemSize}</span> : null}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-sun-400 hover:text-sun-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={
                i === index
                  ? "h-2.5 w-8 rounded-full bg-sun-400"
                  : "h-2.5 w-2.5 rounded-full bg-white/25 hover:bg-white/50"
              }
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-sun-400 hover:text-sun-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
