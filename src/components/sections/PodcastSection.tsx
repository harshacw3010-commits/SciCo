import React, { useEffect, useMemo, useRef, useState } from "react";
import "./podcast.css";

export type PodcastItem = { id: string; hook: string; url?: string };
export type PodcastSectionProps = {
  items?: PodcastItem[];
  title?: string;
};

const PODCASTS: PodcastItem[] = [
  { id: "XaRM0id4v7I", url: "https://www.youtube.com/watch?v=XaRM0id4v7I&t=10s", hook: "Obsession is a system, not a mood." },
  { id: "GQZFGUrYnK4", url: "https://www.youtube.com/watch?v=GQZFGUrYnK4", hook: "Curiosity beats talent—every day." },
  { id: "FmF2i3ZtXIw", url: "https://www.youtube.com/watch?v=FmF2i3ZtXIw", hook: "Science turns chaos into progress." },
  { id: "1pczzFcse7E", url: "https://www.youtube.com/watch?v=1pczzFcse7E&pp=0gcJCckJAYcqIYzv", hook: "Better is built, not found." },
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

const PodcastSection: React.FC<PodcastSectionProps> = ({
  items,
  title = "Podcasts",
}) => {
  const data = useMemo(() => (items && items.length === 4 ? items : PODCASTS), [items]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            // Mark card visible for entrance animation
            el.classList.add("inview");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.2 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  const MAX_TILT = 10; // degrees
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const el = e.currentTarget as HTMLElement; // anchor
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (x / rect.width) * 2 - 1; // -1 .. 1
    const dy = (y / rect.height) * 2 - 1;
    const rx = (-dy * MAX_TILT).toFixed(2);
    const ry = (dx * MAX_TILT).toFixed(2);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };
  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <section id="podcasts" className="podcasts" aria-label="Podcasts">
      <div className="podcasts__inner">
        <header className="podcasts__header">
          <p className="podcasts__eyebrow">Signals from the lab.</p>
          <h2 className="podcasts__title">{title}</h2>
        </header>

        <div className="podcasts__grid">
          {data.map((p, i) => {
            const href = p.url ?? `https://www.youtube.com/watch?v=${p.id}`;
            const thumb = `https://img.youtube.com/vi/${p.id}/hqdefault.jpg`;
            return (
              <article
                key={p.id || i}
                className="holo-card"
                ref={(el) => { cardsRef.current[i] = el; }}
              >
                <a
                  className="holo-card__media"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Play podcast: ${p.hook}`}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                >
                  <img src={thumb} alt="Podcast thumbnail" loading="lazy" />
                </a>
                <p className="holo-card__hook">{p.hook}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
