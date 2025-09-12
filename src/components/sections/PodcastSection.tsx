import React, { useEffect, useMemo, useRef, useState } from "react";
import "./podcast.css";

export type PodcastItem = { id: string; hook: string };
export type PodcastSectionProps = {
  items?: PodcastItem[];
  title?: string;
};

const PODCASTS: PodcastItem[] = [
  { id: "<YOUTUBE_ID_1>", hook: "Obsession is a system, not a mood." },
  { id: "<YOUTUBE_ID_2>", hook: "Curiosity beats talent—every day." },
  { id: "<YOUTUBE_ID_3>", hook: "Science turns chaos into progress." },
  { id: "<YOUTUBE_ID_4>", hook: "Better is built, not found." },
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
            // Mark card visible and trigger portal sweep on its anchor
            el.classList.add("inview");
            const portal = el.querySelector<HTMLElement>(".pod-portal");
            if (portal) {
              portal.classList.add("inview");
            }
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.2 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section id="podcasts" className="podcasts" aria-label="Podcasts">
      <div className="podcasts__inner">
        <header className="podcasts__header">
          <p className="podcasts__eyebrow">Signals from the lab.</p>
          <h2 className="podcasts__title">{title}</h2>
        </header>

        <div className="podcasts__grid">
          {data.map((p, i) => {
            const href = `https://www.youtube.com/watch?v=${p.id}`;
            const thumb = `https://img.youtube.com/vi/${p.id}/hqdefault.jpg`;
            return (
              <article
                key={p.id || i}
                className="pod-card"
                ref={(el) => (cardsRef.current[i] = el)}
              >
                <a
                  className="pod-portal"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Play podcast: ${p.hook}`}
                >
                  <img src={thumb} alt="Podcast thumbnail" loading="lazy" />
                  <span className="pod-portal__play" aria-hidden="true">
                    <span className="pod-portal__play-ring" />
                    <span className="pod-portal__play-triangle" />
                  </span>
                </a>
                <p className="pod-card__hook">{p.hook}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
