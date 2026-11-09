"use client";

import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./card-carousel.css";

type CardCarouselProps = {
  children: ReactNode;
  className?: string;
  showDots?: boolean;
  autoplay?: boolean;
  intervalMs?: number;
  label?: string;
  onChange?: (index: number) => void;
};

export function CardCarousel({
  children,
  className = "",
  showDots = true,
  autoplay = true,
  intervalMs = 4000,
  label = "Carrousel",
  onChange,
}: CardCarouselProps) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const pointerRef = useRef<{
    id: number;
    startX: number;
    startScroll: number;
    dragging: boolean;
  } | null>(null);
  const [index, setIndex] = useState(0);
  const uid = useId();

  const scrollToIndex = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-carousel-slide]");
    const count = cards.length;
    if (!count) return;
    const targetIndex = ((next % count) + count) % count;
    const target = cards[targetIndex];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft - 4, behavior: "smooth" });
  }, []);

  const syncFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-carousel-slide]"),
    );
    if (!cards.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });

    indexRef.current = best;
    setIndex((prev) => {
      if (prev !== best) onChange?.(best);
      return best;
    });
  }, [onChange]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncFromScroll();
    track.addEventListener("scroll", syncFromScroll, { passive: true });
    const ro = new ResizeObserver(syncFromScroll);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", syncFromScroll);
      ro.disconnect();
    };
  }, [syncFromScroll, slides.length]);

  useEffect(() => {
    if (!autoplay || slides.length < 2) return undefined;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      const next = (indexRef.current + 1) % slides.length;
      scrollToIndex(next);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [autoplay, intervalMs, scrollToIndex, slides.length]);

  function step(direction: -1 | 1) {
    scrollToIndex(index + direction);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    pausedRef.current = true;
    pointerRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      dragging: false,
    };
    track.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const pointer = pointerRef.current;
    if (!track || !pointer || pointer.id !== e.pointerId) return;
    const dx = e.clientX - pointer.startX;
    if (!pointer.dragging && Math.abs(dx) > 6) {
      pointer.dragging = true;
      track.dataset.dragging = "true";
    }
    if (pointer.dragging) {
      track.scrollLeft = pointer.startScroll - dx;
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const pointer = pointerRef.current;
    if (!track || !pointer || pointer.id !== e.pointerId) return;
    track.releasePointerCapture(e.pointerId);
    delete track.dataset.dragging;
    pointerRef.current = null;
    requestAnimationFrame(syncFromScroll);
    if (pointer.dragging) {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-carousel-slide]"),
      );
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const mid = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      scrollToIndex(best);
    }
    window.setTimeout(() => {
      pausedRef.current = false;
    }, 2500);
  }

  return (
    <div
      className={`card-carousel ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="card-carousel__track"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={`${uid}-${i}`}
            data-carousel-slide
            className="card-carousel__slide"
            aria-hidden={i !== index}
          >
            {slide}
          </div>
        ))}
      </div>

      {showDots ? (
        <div className="card-carousel__dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={`${uid}-dot-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Aller au slide ${i + 1}`}
              className="card-carousel__dot"
              data-active={i === index}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
