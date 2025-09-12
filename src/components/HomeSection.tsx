import React, { useEffect, useMemo, useRef, useState } from "react";
import "./home-section.css";
import BrandWordmark from "./BrandWordmark";

export type HomeSectionProps = {
  images: string[];
  /**
   * Total time (ms) for a full rotation cycle. Defaults to 7000ms.
   */
  rotationDurationMs?: number;
  /**
   * Radius of the circular track in px. Component is responsive; this is a base that adapts.
   */
  baseRadiusPx?: number;
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  images = DEFAULT_IMAGES,
  rotationDurationMs = 7000,
  baseRadiusPx = 260,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [angle, setAngle] = useState(0); // Current rotation angle in radians

  // Responsive radius based on container width
  const radius = useMemo(() => {
    const width = containerRef.current?.clientWidth ?? 800;
    const clamped = Math.max(140, Math.min(width * 0.28, baseRadiusPx));
    return clamped;
  }, [baseRadiusPx, containerRef.current?.clientWidth]);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Do not animate if user prefers reduced motion
      return;
    }

    const step = (ts: number) => {
      if (startTimeRef.current == null) {
        startTimeRef.current = ts;
      }
      const elapsed = ts - startTimeRef.current;
      const progress = (elapsed % rotationDurationMs) / rotationDurationMs;
      const nextAngle = progress * Math.PI * 2; // 0 → 2π
      setAngle(nextAngle);
      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
    };
  }, [rotationDurationMs, prefersReducedMotion]);

  const items = images.slice(0, 4); // ensure max 4 as requested
  const count = Math.max(1, Math.min(4, items.length));

  // Single-image hero mode (non-animated)
  if (items.length === 1) {
    return (
      <section className="scico-home">
        <div className="scico-home__inner">
          <BrandWordmark />
          <div className="hero" aria-label="Featured image">
            <div className="hero-figure" role="img" aria-label="SciCo home hero image">
              <img
                src={items[0]}
                alt="SciCo home hero image centered on the page"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (prefersReducedMotion) {
    // 2x2 grid fallback; highlight the first image
    return (
      <section className="scico-home">
        <div className="scico-home__inner">
          <BrandWordmark />
          <div className="grid-fallback" aria-label="Featured topics">
            {items.map((src, i) => (
              <div key={i} className={"grid-item" + (i === 0 ? " front" : "")}> 
                <img src={src} alt="SciCo feature" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 3D Carousel rendering
  return (
    <section className="scico-home">
      <div className="scico-home__inner">
        <BrandWordmark />

        <div className="carousel" ref={containerRef} aria-label="Rotating featured topics">
          {items.map((src, index) => {
            const itemAngle = (index / count) * Math.PI * 2 + angle;
            const x = Math.sin(itemAngle) * radius;
            const z = Math.cos(itemAngle) * radius; // positive z is farther away

            // Depth normalization for styling (front when z is minimal/most negative)
            const zNormalized = (z + radius) / (2 * radius); // 0 (front) → 1 (back)
            const isFront = z < 0 && Math.abs(z) > radius * 0.6; // heuristic

            const scale = isFront ? 1.1 : 0.85 + 0.15 * (1 - (z + radius) / (2 * radius));
            const opacity = isFront ? 1 : 0.45 + 0.25 * (1 - zNormalized);
            const blur = isFront ? 0 : 1.5 * zNormalized; // px

            const style: React.CSSProperties = {
              transform: `translate3d(${x}px, 0px, ${-z}px)`,
              opacity,
              filter: `blur(${blur}px)`,
              zIndex: Math.round(1000 - z),
            };

            return (
              <div key={index} className={"carousel-item" + (isFront ? " front" : "") } style={style}>
                <img src={src} alt="SciCo feature" style={{ transform: `scale(${scale})` }} loading="eager" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeSection;



